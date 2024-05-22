import { baseEslintConfig, prettierConfig } from "@spear-ai/eslint-config";

/** @type {import("eslint").Linter.FlatConfig} */
const eslintConfig = [
  {
    ignores: ["**/.next", "dist", "node_modules"],
  },
  ...baseEslintConfig,
  prettierConfig,
];

export default eslintConfig;
