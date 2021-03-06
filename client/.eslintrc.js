module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "airbnb-base",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
  ],
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".json", ".ts", ".html", ".scss"],
      },
    },
  },
  rules: {
    "no-use-before-define": ["error", { functions: false }],
    quotes: ["error", "double"],
    "import/prefer-default-export": "off",
    "no-param-reassign": ["error", { props: false }],
    radix: ["error", "as-needed"],
    "no-console": "error",
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        ts: "never",
      },
    ],
  },
};
