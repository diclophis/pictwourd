const path = require('path');
const webpack = require('webpack');
const glob = require("glob");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

//const InlineChunkManifestHtmlWebpackPlugin = require('inline-chunk-manifest-html-webpack-plugin');


//const mergeJsonWebpackPlugin = require("merge-jsons-webpack-plugin");

/*
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
*/

const theEntries = {}

const foo = glob.sync("./build/index.manifest/*json");

//theEntries['cheeze'] = []
//foo.map(jsonName => {
//  theEntries['cheeze'].push(jsonName);
//});

//theEntries['data'] = ['./empty.js'];

theEntries['ui'] = ['./browser.js'];

//    'data': './build/index.manifest/manifest.json',
//  },

module.exports = {
  module: {
    rules: [
      //{
      //  //test: /\.\/build\/index\.manifest\/\.json$/,
      //  include: [
      //    path.resolve(__dirname, 'build/index.manifest')
      //  ]
      //},
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ],
  },

  entry: theEntries,

  plugins: [
    new HtmlWebpackPlugin({
      template: './build/index.template.html'
    }),

    //new InlineChunkManifestHtmlWebpackPlugin(),
    new ScriptExtHtmlWebpackPlugin(),

    //new webpack.DefinePlugin({
    //  "process.env.NODE_ENV": JSON.stringify("production")
    //}),

/*
		new mergeJsonWebpackPlugin({
				"encoding": "ascii",
				"debug": true,
				"output": {
					"groupBy": [
						{
							"pattern": "./build/index.manifest/{1,2,3,4,5,6,7,8,9,10}.json", 
							"fileName": "0-10.json" 
						},
						{
							"pattern": "./build/index.manifest/{11,12,13,14,15,16,17,18,19}.json", 
							"fileName": "10-20.json" 
						},
						{
							"pattern": "./build/index.manifest/manifest.json", 
							"fileName":"manifest.json"
						}
					]
				}
		}),
*/

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

    */

    // new webpack.optimize.AggressiveSplittingPlugin({
    //   minSize: 20000,
    //   maxSize: 30000
    // }),

    /*
    new webpack.optimize.CommonsChunkPlugin({
        name: "ui",
        chunks: ["ui"]
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "data",
      chunks: ["cheeze"]
    })
    */

    /*
    new webpack.optimize.CommonsChunkPlugin({
        name: "data",
        chunks: ["main"]
    }),
    */

  ],

  cache: false,

  //mode: 'development',

  resolve: {
    modules: [
      'node_modules'
      //,
      //path.resolve('./build'),
      //path.resolve('./build/index.manifest'),
    ]
  },

  output: {
    filename: '[name].static.js',
    chunkFilename: '[name].static.js',
    path: path.resolve(__dirname, 'build')
  },

/*
	optimization: {
		splitChunks: {
			cacheGroups: {
				uiStuff: {
					name: "uiCache",
					test: "ui",
          chunks: "initial",
					enforce: true
				},
				dataStuff: {
					name: "dataCache",
					//test: "data",
          test: /.*json$/,
          chunks: "async",
					enforce: true
				}
			}
		}
	}
*/

  //recordsPath: path.join(__dirname, "records.json")
};
