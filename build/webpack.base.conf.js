var path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

let lessLoader = [
  MiniCssExtractPlugin.loader,
  `css-loader?minimize`,
  {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: [require('autoprefixer')()]
    }
  },
  'less-loader'
];

let babelrc = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: {},
        useBuiltIns: 'usage'
      }
    ]
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    '@babel/plugin-transform-modules-commonjs',
    '@babel/plugin-syntax-dynamic-import'
  ]
};

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    index: ['./src/index']
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: process.env.NODE_ENV === 'development' ? '/' : './dist',
    filename: '[name].js',
    chunkFilename: '[name].js'
  },

  resolve: {
    extensions: ['.js', '.json', '.vue'],
    alias: {
      vue: 'vue/dist/vue.esm.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: 'vue-loader',
        include: resolve('src'),
        query: {
          presets: ['vue']
        }
      },
      {
        test: /\.(less|css)$/,
        use: lessLoader
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: 'babel-loader',
        include: resolve('src'),
        query: babelrc
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        exclude: /node_modules/,
        include: resolve('src'),
        loaders: [
          {
            loader: 'url-loader',
            options: {
              name: `/image/[name].[hash:8].[ext]`
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '/fonts/[name].[hash:8].[ext]'
        }
      }
    ]
  },
  plugins: [new VueLoaderPlugin()].concat(
    new HtmlWebpackPlugin({
      env: process.env.NODE_ENV,
      filename:
        process.env.NODE_ENV === 'development' ? 'index.html' : '../index.html',
      template: './src/index.html'
    })
  )
};
