import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    files: ["src/shared/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [{
          group: ["@/server/**", "**/server/**", "server-only", "node:*", "pg"],
          message: "Shared contracts must remain safe to import in the browser.",
        }],
      }],
    },
  },
  globalIgnores([".next/**", "out/**", "output/**", "next-env.d.ts"]),
]);
