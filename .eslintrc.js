module.exports = {
  // parser: 'babel-eslint',
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  globals: {
    chrome: true,
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  // prettier-ignore
  extends: [
    'standard',
    'plugin:vue/essential',
    'plugin:prettier/recommended'
  ],
  root: true,
  plugins: [
    'vue',
    // 'html',
  ],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        bracketSpacing: true,
        trailingComma: 'all',
        semi: false,
      },
    ],
  },
}
