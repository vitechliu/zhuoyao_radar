var path = require('path');
var webpack = require('webpack');
var webpackConfig = require('./webpack.dev.conf');
const WebpackDevServer = require('webpack-dev-server');

// 遍历每个entry，加入dev-server client
Object.keys(webpackConfig.entry).forEach(function(name) {
  let _devServer = `webpack-dev-server/client?http://localhost:3000`;
  webpackConfig.entry[name] = [_devServer].concat(webpackConfig.entry[name]);
});

var compiler = webpack(webpackConfig);

const devServerOptions = {
  disableHostCheck: true,
  host: '0.0.0.0',
  after(app) {
    // 自动打开浏览器
    // if (opts.BUILD_SKIN) {
    //   opn(
    //     `http://localhost:3000/index.html`
    //   );
    // }
  }
};

WebpackDevServer.addDevServerEntrypoints(webpackConfig, devServerOptions);
const devServer = new WebpackDevServer(compiler, devServerOptions);
devServer.listen(3000, '0.0.0.0', () => {
  console.log(`Starting server ...`);
});
