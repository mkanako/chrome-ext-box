const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssnanoPlugin = require('@intervolga/optimize-cssnano-plugin')

module.exports = function (env) {
  const isProd = (env && env.production) === true
  const assetsName = `[name]${isProd ? '.[hash:8]' : ''}.[ext]`

  return {
    entry: {
      options: './src/options.js',
      popup: './src/popup.js'
    },
    mode: isProd ? 'production' : 'development',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: `[name]${isProd ? '.[chunkhash:8]' : ''}.js`,
      chunkFilename: `[name]${isProd ? '.[chunkhash:8]' : ''}.js`
    },
    resolve: {
      extensions: ['.js', '.json', '.vue'],
    },
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 500,
      poll: 1000
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.js$/,
          loader: 'babel-loader'
        },
        {
          test: /\.css$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader',
            { loader: 'css-loader', options: { importLoaders: 1 } },
            'postcss-loader'
          ]
        },
        {
          test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 4096,
                fallback: {
                  loader: 'file-loader',
                  options: {
                    name: assetsName
                  }
                }
              }
            }
          ]
        },
        {
          test: /\.(svg)(\?.*)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: assetsName
              }
            }
          ]
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 4096,
                fallback: {
                  loader: 'file-loader',
                  options: {
                    name: assetsName
                  }
                }
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: `[name]${isProd ? '.[contenthash:8]' : ''}.css`,
        chunkFilename: `[name]${isProd ? '.[contenthash:8]' : ''}.css`
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src', 'main.html'),
        filename: 'options.html',
        chunks: ['options'],
        templateParameters: { githubCorners: true }
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src', 'main.html'),
        filename: 'popup.html',
        chunks: ['popup']
      }),
      ...(isProd
        ? [
          new CleanWebpackPlugin(['dist'], {
            verbose: true,
            exclude: ['_locales', 'images', 'manifest.json']
          }),
          new CopyWebpackPlugin([
            {
              from: '**/*.{json,png}',
              fromArgs: { cwd: 'src/' },
              context: 'src/'
            }
          ]),
          new OptimizeCssnanoPlugin({
            sourceMap: false,
            cssnanoOptions: {
              preset: ['default', {
              }],
            },
          }),
        ]
        : [])
    ]
  }
}
