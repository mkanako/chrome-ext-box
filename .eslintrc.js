module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
  },
  globals: {
    chrome: true,
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: [
    'standard',
    'plugin:vue/essential',
  ],
  plugins: [
    'vue',
  ],
  rules: {
    'comma-dangle': 'off',
  },
}
