import type { Config } from "prettier";

const config: Config = {
  printWidth: 120,
  tabWidth: 2,
  plugins: ["prettier-plugin-organize-imports", "prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./app/globals.css",
  tailwindFunctions: ["clsx"],
  trailingComma: "all",
  experimentalTernaries: true,
  quoteProps: "consistent",
  objectWrap: "collapse",
};

export default config;
