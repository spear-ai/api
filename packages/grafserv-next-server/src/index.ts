import {
  convertHandlerResultToResult,
  getBodyFromFrameworkBody,
  GrafservBase,
  normalizeRequest,
  processHeaders,
  RequestDigest,
  Result,
} from "grafserv";
import { NextRequest, NextResponse } from "next/server";

const getDigest = (request: NextRequest): RequestDigest => ({
  async getBody() {
    return getBodyFromFrameworkBody(await request.text());
  },
  getQueryParams() {
    return request.nextUrl.searchParams as unknown as Record<string, string>;
  },
  headers: processHeaders(Object.fromEntries(request.headers.entries())),
  // There doesn’t seem to be a way to get the HTTP version from Next.js’ route handler.
  // Grafserv uses this information to determine whether to set `keep-alive`.
  httpVersionMajor: 2,
  httpVersionMinor: 0,
  isSecure: request.nextUrl.protocol === "https",
  method: request.method,
  path: request.url,
  preferJSON: true,
  requestContext: {},
});

type HandleResponse = (
  response: NextResponse,
  result: Result | null,
) => NextResponse | Promise<NextResponse>;

const send = async (result: Result | null, onResponse?: HandleResponse | undefined) => {
  let response: NextResponse | undefined;

  if (result == null) {
    response = new NextResponse(String.raw`¯\_(ツ)_/¯`, { status: 404 });
  } else {
    const { headers, statusCode: status, type } = result;

    switch (type) {
      case "buffer": {
        response = new NextResponse(result.buffer, { headers, status });
        break;
      }
      case "bufferStream": {
        response = new NextResponse("Next.js Grafserv doesn’t handle `bufferStream`.", {
          headers,
          status,
        });
        break;
      }
      case "error": {
        response = new NextResponse("Error", { headers, status });
        break;
      }
      case "json": {
        response = NextResponse.json(result.json, { headers, status });
        break;
      }
      case "noContent": {
        response = new NextResponse(null, { headers, status });
        break;
      }
      default: {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        response = new NextResponse(`Next.js Grafserv doesn’t handle \`${type}\`.`, {
          headers,
          status: 503,
        });
        break;
      }
    }
  }

  if (onResponse) {
    response = await onResponse(response, result);
  }

  return response;
};

export class NextGrafserv extends GrafservBase {
  /** Handle and modify the NextResponse. */
  onResponse: HandleResponse | undefined;

  constructor(
    config: ConstructorParameters<typeof GrafservBase>[0] & {
      onResponse?: HandleResponse | undefined;
    },
  ) {
    super(config);
    this.onResponse = config.onResponse;
  }

  createGraphQLHandler() {
    return (request: NextRequest) => this.handleRequest(request);
  }

  async handleRequest(request: NextRequest) {
    const digest = getDigest(request);
    const handler = await this.graphqlHandler(normalizeRequest(digest), this.graphiqlHandler);
    const result = await convertHandlerResultToResult(handler);
    return send(result, this.onResponse);
  }
}

export const grafserv = (config: ConstructorParameters<typeof NextGrafserv>[0]) => new NextGrafserv(config);
