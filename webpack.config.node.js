require('babel-register');
const devConfigs = require('./webpack.config.development');

module.exports = {
  output: {
    libraryTarget: 'commonjs2'
  }
};
