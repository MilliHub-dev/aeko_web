import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

// Next 16 dropped `next lint`; this is the equivalent flat config.
export default defineConfig([
  globalIgnores([".next/**", "node_modules/**", "public/**"]),
  ...nextVitals,
  {
    rules: {
      // The React-compiler lint rules landed with eslint-config-next 16.4 and
      // flag ~70 long-standing effect/ref patterns in this codebase. They are
      // worth fixing file by file, not as a gate, so they warn for now.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/static-components": "warn",
      "react-hooks/purity": "warn",
      "react/no-unescaped-entities": "warn",
    },
  },
]);
