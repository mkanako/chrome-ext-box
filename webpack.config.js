const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')

module.exports = function(env, argv) {
  let plugins = [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css?v=[contenthash]',
      chunkFilename: '[name].css',
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'main.html'),
      filename: 'options.html',
      chunks: ['options', 'common'],
      hash: true,
      templateParameters: { githubCorners: true },
      minify: {
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
        removeAttributeQuotes: true,
        collapseWhitespace: true,
      },
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'main.html'),
      filename: 'popup.html',
      chunks: ['popup', 'common'],
      hash: true,
      minify: {
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
        removeAttributeQuotes: true,
        collapseWhitespace: true,
      },
    }),
  ]
  if (env && env.prod) {
    plugins.push(
      new CleanWebpackPlugin(['dist'], {
        verbose: true,
        exclude: ['_locales', 'images', 'manifest.json'],
      }),
      new CopyWebpackPlugin([
        {
          from: '**/*.{json,png}',
          fromArgs: { cwd: 'src/' },
          context: 'src/',
        },
      ]),
    )
  } else {
    // plugins.push(
    //   new webpack.DllReferencePlugin({
    //     manifest: path.resolve(__dirname, 'dist/dll.json'),
    //   }),
    // )
  }
  return {
    entry: {
      options: './src/options.js',
      popup: './src/popup.js',
    },
    mode: env && env.prod ? 'production' : 'development',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
    },
    resolve: {
      // 导入的时候不用写拓展名
      extensions: [' ', '.js', '.json', '.vue', '.scss', '.css'],
    },
    // devtool: 'inline-source-map',
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 500, // 防止重复保存频繁重新编译,300ms内重复保存不打包
      poll: 1000, // 每秒询问的文件变更的次数
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            chunks: 'initial',
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
            name: 'common',
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: [
            env && env.prod ? MiniCssExtractPlugin.loader : 'vue-style-loader',
            'css-loader',
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000,
                name: '[name].[ext]',
              },
            },
          ],
        },
      ],
    },
    plugins: plugins,
    // performance: {
    //   hints: false,
    // },
    devServer: {
      contentBase: path.resolve(__dirname, 'dist'),
      host: 'localhost',
      port: 8080,
      compress: true,
    },
  }
}
