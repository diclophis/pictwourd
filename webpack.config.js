const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.json$/,
        use: {
          loader: 'json-loader'
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ],
  },

  entry: './browser.js',
  output: {
    filename: 'static.js',
    path: path.resolve(__dirname, 'build')
  }
};

