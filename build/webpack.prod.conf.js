let webpack = require('webpack');
let merge = require('webpack-merge');
let baseWebpackConfig = require('./webpack.base.conf');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
let UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const os = require('os');

const prodConfig = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: false, // 生产环境生成sourcemap
  output: {
    filename: `[name].[chunkhash:8].js`,
    chunkFilename: `[name].[chunkhash:8].js`
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),

    new UglifyJSPlugin({
      uglifyOptions: {
        compress: {
          drop_console: true,
          reduce_funcs: false
        }
      },
      cache: true,
      parallel: os.cpus().length,
      sourceMap: false
    }),

    new MiniCssExtractPlugin({
      filename: `[name].[contenthash:8].css`
    })
  ]
});

module.exports = prodConfig;
