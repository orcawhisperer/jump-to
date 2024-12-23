// .eslintrc.js
module.exports = {
   root: true,
   parser: "@typescript-eslint/parser",
   plugins: ["@typescript-eslint", "react", "react-hooks"],
   extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
      "prettier",
   ],
   env: {
      browser: true,
      es2021: true,
      node: true,
   },
   settings: {
      react: {
         version: "detect",
      },
   },
   rules: {
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
   },
   overrides: [
      {
         files: ["*.ts", "*.tsx"],
         rules: {
            "@typescript-eslint/explicit-function-return-type": ["warn"],
         },
      },
   ],
}
