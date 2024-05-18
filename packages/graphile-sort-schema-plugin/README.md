# @spear-ai/graphile-sort-schema-plugin

A [Graphile](https://www.graphile.org) plugin to lexicographically sort your schema.

## Installation

```shell
yarn add -D @spear-ai/graphile-sort-schema-plugin
```

## Usage

Add the plugin to your graphile preset:

```ts
import { sortSchemaPlugin } from "@spear-ai/graphile-sort-schema-plugin";

const createPreset: GraphileConfig.Preset = {
  // …
  plugins: [
    // …
    sortSchemaPlugin,
  ],
};
```
