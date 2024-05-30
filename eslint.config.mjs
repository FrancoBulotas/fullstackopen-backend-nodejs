
import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
  {ignores: ["**/dist"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
];