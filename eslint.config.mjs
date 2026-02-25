import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = [...nextCoreWebVitals, ...nextTypescript, {
  rules: {
    // TypeScript rules - Enable important ones for code quality
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { 
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_"
    }],
    "@typescript-eslint/no-non-null-assertion": "warn", // Changed to warn for existing code
    "@typescript-eslint/ban-ts-comment": "warn",
    "@typescript-eslint/prefer-as-const": "off",
    "@typescript-eslint/no-empty-object-type": "warn",

    // React rules - Enable important ones
    "react-hooks/exhaustive-deps": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/purity": "warn", // Changed to warn for existing code
    "react/no-unescaped-entities": "off",
    "react/display-name": "warn",
    "react/prop-types": "off",
    "react-compiler/react-compiler": "off",
    "react/jsx-no-target-blank": "warn",
    "react/self-closing-comp": "warn",

    // Next.js rules
    "@next/next/no-img-element": "off",
    "@next/next/no-html-link-for-pages": "error",
    "@next/next/no-sync-scripts": "error",

    // General JavaScript rules - Enable important ones
    "prefer-const": "warn",
    "no-unused-vars": "off",
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "no-debugger": "warn",
    "no-empty": "warn",
    "no-irregular-whitespace": "error",
    "no-case-declarations": "off",
    "no-fallthrough": "warn",
    "no-mixed-spaces-and-tabs": "warn", // Changed to warn for existing code
    "no-redeclare": "error",
    "no-undef": "warn", // Changed to warn for existing code
    "no-unreachable": "error",
    "no-useless-escape": "warn",
    "no-duplicate-imports": "warn",
    "no-shadow": "warn",
  },
}, {
  ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts", "examples/**", "skills"]
}];

export default eslintConfig;
