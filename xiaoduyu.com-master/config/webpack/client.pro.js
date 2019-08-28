const baseConfig = require('./client.base');
const webpack = require('webpack');
const OfflinePlugin = require('offline-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = {
  ...baseConfig,
  plugins: [
    // 打包分析，查看模块大小 端口默认为 8888
    // new BundleAnalyzerPlugin(),
    ...baseConfig.plugins,
    new OfflinePlugin({
      autoUpdate: 1000 * 60 * 5,
      ServiceWorker: {
        publicPath: '/sw.js'
      }
    })
  ],
  mode: 'production'
}

module.exports = config;
