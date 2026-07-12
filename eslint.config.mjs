import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";
import unusedImports from "eslint-plugin-unused-imports";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";

export default tseslint.config(
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
      "unused-imports": unusedImports,
      "react-hooks": reactHooksPlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.vitest,
      },
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      ...reactHooksPlugin.configs.recommended.rules,
      "@next/next/no-html-link-for-pages": "off",
      "@typescript-eslint/ban-ts-comment": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "no-console": ["error", { allow: ["warn", "error"] }],
      "@typescript-eslint/explicit-function-return-type": "error",
      curly: ["error", "all"],
      "react-hooks/exhaustive-deps": "error",
    },
  },
  prettierConfig,
  {
    ignores: [
      ".next/*",
      "node_modules/*",
      "vitest.config.ts",
      "eslint.config.mjs",
    ],
  }
);
