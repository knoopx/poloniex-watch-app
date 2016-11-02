const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')

module.exports = merge(baseConfig, {
  debug: true,
  devtool: 'source-map',

  entry: [
    'babel-polyfill',
    'webpack-dev-server/client?http://localhost:8080',
    './src'
  ],

  output: {
    publicPath: 'http://localhost:8080/dist/'
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ]
})
