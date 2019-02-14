module.exports = {
  presets: [
    [
      '@babel/env',
      {
        modules: false,
      },
    ],
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk',
      },
    ],
  ],
}
