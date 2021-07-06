const path = require('path');
const outputDirectory = 'dist';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');


module.exports = {
  entry: './src/client/index.js',
  output: {
      path: path.resolve(outputDirectory),
      filename: 'bundle.js'
  },
  module: {
      rules: [
          {
              test: /\.js$/,
              exclude: /node_modules/,
              use: {
                  loader: 'babel-loader'
              }
          },
          {
              test: /\.css$/,
              use: ["style-loader", "css-loader"]
          }
      ]
  },
  plugins: [
    new CleanWebpackPlugin([outputDirectory]),
    new HtmlWebpackPlugin({
      template: './src/client/index.html',
    })
  ],
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
};
