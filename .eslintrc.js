module.exports = {
  // use standard configuration and disable rules handled by prettier
  extends: [
    // standard configuration
    "standard",

    // disable rules handled by prettier
    "prettier",
    "prettier/standard",
  ],

  parserOptions: {
    ecmaVersion: 5,
    sourceType: "script",
  },

  rules: {
    // https://github.com/eslint/eslint/issues/12437
    "no-obj-calls": "off",
  },
};
