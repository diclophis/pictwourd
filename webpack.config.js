const path = require('path');
const webpack = require('webpack');

module.exports = {
  module: {
    rules: [
    /*
      {
        test: /\.json$/,
        use: {
          loader: 'json-loader'
        }
      },
    */
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ],
  },

  entry: {
    'ui': './browser.js',
    'data': './build/index.manifest/manifest.json',
  },

  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: "data",
      chunks: ["data"],
      minChunks: Infinity
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: "ui",
      minChunks: Infinity
    }),

    new webpack.optimize.AggressiveSplittingPlugin({
      minSize: 300000,
      maxSize: 400000
    }),

    /*


    new webpack.optimize.CommonsChunkPlugin({
        name: "main",
        chunks: ["main"]
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "manifest",
      chunks: ["manifest"]
    })
    */
  ],

  cache: true,

  resolve: {
    modules: [
      'node_modules',
      path.resolve('./build')
    ]
  },

  output: {
    filename: '[name].static.js',
    chunkFilename: '[name].static.js',
    path: path.resolve(__dirname, 'build')
  },

  recordsPath: path.join(__dirname, "records.json")
};
