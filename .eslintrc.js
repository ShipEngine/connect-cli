module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "oclif",
    "oclif-typescript",
    "eslint:recommended",
    "prettier",
    "prettier/@typescript-eslint",
  ],
  globals: {
    app: "readOnly",
    expect: "readOnly",
    before: "readOnly"
  },
  rules: {
    "no-console": 0,
    "@typescript-eslint/no-use-before-define": 0
  }
};
