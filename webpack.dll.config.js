const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    // vendor: [
    //   'vue',
    //   'lodash',
    //   'element-ui',
    //   'vuedraggable',
    //   'vue-plugin-webextension-i18n',
    // ],
    vendor: Object.keys(require('./package.json').dependencies).filter(item => {
      return item.indexOf('normalize') < 0
    }),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].dll.js',
    library: '_dll_[name]', // 全局变量名，其他模块会从此变量上获取里面模块
  },
  // manifest是描述文件
  plugins: [
    new webpack.DllPlugin({
      name: '_dll_[name]',
      path: path.resolve(__dirname, 'dist/dll.json'),
    }),
  ],
}
