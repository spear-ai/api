import { makeProcessSchemaPlugin } from "graphile-utils";
import { lexicographicSortSchema } from "graphql";

export const sortSchemaPlugin = makeProcessSchemaPlugin(lexicographicSortSchema);
