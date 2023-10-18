module.exports = {
  root: true,
  extends: ["eslint:recommended", "prettier"],
  parserOptions: {
    sourceType: "module",
    allowImportExportEverywhere: true,
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
    webextensions: true,
  },
  rules: {
    "no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^main$",
      },
    ],
  },
  ignorePatterns: ["dist", "build", ".eslintrc.js"],
};
