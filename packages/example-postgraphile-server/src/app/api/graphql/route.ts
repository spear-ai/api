import path from "node:path";
import { PgSimplifyInflectionPreset } from "@graphile/simplify-inflection";
import { grafserv } from "@spear-ai/grafserv-next-server";
import { sortSchemaPlugin } from "@spear-ai/graphile-sort-schema-plugin";
import { dirname } from "dirfilename";
import { NextRequest } from "next/server";
import { makeSchema } from "postgraphile";
import { makePgService } from "postgraphile/adaptors/pg";
import { PostGraphileAmberPreset } from "postgraphile/presets/amber";
import { PostGraphileRelayPreset } from "postgraphile/presets/relay";

const preset: GraphileConfig.Preset = {
  extends: [PostGraphileAmberPreset, PostGraphileRelayPreset, PgSimplifyInflectionPreset],
  gather: {
    pgStrictFunctions: true,
  },
  pgServices: [
    makePgService({
      connectionString: process.env.POSTGRES_URL ?? "postgresql://postgres:postgres@localhost:5432/postgres",
      schemas: ["public"],
    }),
  ],
  plugins: [sortSchemaPlugin],
  schema: {
    dontSwallowErrors: process.env.NODE_ENV === "production",
    exportSchemaSDLPath: path.join(dirname(import.meta.url), "./schema.graphql"),
    pgSimplifyPatch: false,
    retryOnInitFail: process.env.NODE_ENV === "development",
    sortExport: true,
  },
};

export const POST = async (request: NextRequest) => {
  const { schema } = await makeSchema(preset);
  const server = grafserv({ preset, schema });
  const handle = server.createGraphQLHandler();
  return handle(request);
};
