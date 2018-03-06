const path = require('path');
const webpack = require('webpack');


function SuppressEntryChunksPlugin(options) {
  if (typeof options === 'string') {
    this.options = {skip: [options]};
  } else if (Array.isArray(options)) {
    this.options = {skip: options};
  } else {
    throw new Error("SuppressEntryChunksPlugin requires an array of entry names to strip");
  }
}

SuppressEntryChunksPlugin.prototype.apply = function(compiler) {
  var options = this.options;

  // just before webpack is about to emit the chunks,
  // strip out primary file assets (but not additional assets)
  // for entry chunks we've been asked to suppress
  compiler.plugin('emit', function(compilation, callback) {
    compilation.chunks.forEach(function(chunk) {
      if (options.skip.indexOf(chunk.name) >= 0) {
        chunk.files.forEach(function(file) {
          // delete only js files.
          //if (file.match(/.*\.js$/)) {
            delete compilation.assets[file];
          //}
        });
      }
    });
    callback();
  });
};

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

    //new SuppressEntryChunksPlugin(['data']),

    /*
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

    */

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

    new webpack.optimize.CommonsChunkPlugin({
        name: "data",
        chunks: ["main"]
    }),
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
