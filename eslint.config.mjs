import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    name: "project/style-rules",
    files: ["**/*.{js,jsx,mjs,ts,tsx,mts,cts}"],
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // Inline styles are forbidden: styling must go through Tailwind utilities.
      "react/forbid-dom-props": ["error", { forbid: ["style"] }],
      "react/forbid-component-props": ["error", { forbid: ["style"] }],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
  ]),
]);

export default eslintConfig;
