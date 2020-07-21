module.exports = {
  extends: ["prettier", "eslint:recommended", "plugin:node/recommended"],
  plugins: ["prettier"],
  env: {
    es6: true,
    mocha: true
  },
  rules: {
    "prettier/prettier": "error",
    "no-unused-vars": "warn",
    "no-console": "off",
    "func-names": "off",
    "no-process-exit": "off",
    "object-shorthand": "off",
    "class-methods-use-this": "off",
    "no-param-reassign": "off",
    "no-undef": "error",
    "node/no-unpublished-require": "off",
    "node/no-missing-require": "off"
  }
}
