module.exports = {
  // use standard configuration and disable rules handled by prettier
  extends: [
    // standard configuration
    "standard",

    // https://github.com/mysticatea/eslint-plugin-node#-rules
    "plugin:node/recommended",

    // disable rules handled by prettier
    "prettier",
    "prettier/standard",
  ],

  parserOptions: {
    ecmaVersion: 5,
    sourceType: "script",
  },

  rules: {
    "no-var": "off",
  },
};
