module.exports = {
  extends: ["@spear-ai/npm-package-json-lint-config/spear-application"],
  rules: {
    "prefer-absolute-version-dependencies": [
      "error",
      {
        exceptions: ["@spear-ai/grafserv-next-server", "@spear-ai/graphile-sort-schema-plugin"],
      },
    ],
  },
};
