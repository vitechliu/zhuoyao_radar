var webpack = require('webpack');
var merge = require('webpack-merge');
var baseConfig = require('./webpack.base.conf');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const devWebpackConfig = merge(baseConfig, {
  mode: 'development',
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  optimization: {
    noEmitOnErrors: true
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsPlugin()
  ]
});
module.exports = devWebpackConfig;
