import {
  convertHandlerResultToResult,
  getBodyFromFrameworkBody,
  GrafservBase,
  GrafservConfig,
  normalizeRequest,
  processHeaders,
  RequestDigest,
  Result,
} from "grafserv";
import { NextRequest, NextResponse } from "next/server";

const getDigest = (request: NextRequest): RequestDigest => {
  console.log(request);

  return {
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
  };
};

const send = (result: Result | null) => {
  if (result == null) {
    return new NextResponse("¯\\_(ツ)_/¯", { status: 404 });
  }

  switch (result.type) {
    case "buffer": {
      return new NextResponse(result.buffer, { headers: result.headers, status: result.statusCode });
    }
    case "bufferStream": {
      return new NextResponse("BufferStream currently unimplemented", {
        headers: result.headers,
        status: result.statusCode,
      });
    }
    case "error": {
      return new NextResponse("Error", { headers: result.headers, status: result.statusCode });
    }
    case "json": {
      return NextResponse.json(result.json, { headers: result.headers, status: result.statusCode });
    }
    case "noContent": {
      return new NextResponse(null, { headers: result.headers, status: result.statusCode });
    }
    default: {
      return new NextResponse("Server hasn't implemented this yet", {
        headers: { type: "text/plain" },
        status: 503,
      });
    }
  }
};

export class NextGrafserv extends GrafservBase {
  createGraphQLHandler() {
    return (request: NextRequest) => this.handleRequest(request);
  }

  async handleRequest(request: NextRequest) {
    const digest = getDigest(request);
    const handler = await this.graphqlHandler(normalizeRequest(digest), this.graphiqlHandler);
    const result = await convertHandlerResultToResult(handler);
    return send(result);
  }
}

export const grafserv = (config: GrafservConfig) => new NextGrafserv(config);
