// TODO: chunk splitting and webpack 4x

const path = require('path');
const webpack = require('webpack');
const glob = require("glob");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const InlineChunkManifestHtmlWebpackPlugin = require('inline-chunk-manifest-html-webpack-plugin');
const WebpackManifestPlugin = require('webpack-manifest-plugin');

const theEntries = {}

theEntries['ui'] = ['./browser.js'];

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
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

  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),

    new WebpackManifestPlugin(),

    new ScriptExtHtmlWebpackPlugin(),

    new HtmlWebpackPlugin({
      template: './build/index.template.html',
    }),
  ],

//  cache: true,

//  resolve: {
//    modules: [
//      'node_modules'
//    ]
//  },

  entry: theEntries,

  output: {
    filename: '[hash]-[name].compiled.js',
    path: path.resolve(__dirname, 'build')
  },
};
