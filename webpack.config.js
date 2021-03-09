const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';


module.exports = {
  devServer: {
    historyApiFallback: true
  },
  mode: 'production',
  entry: './src/pages/index/index.ts',
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css', '.scss', '.html'],
  },
  output: {
    filename: 'main.[chunkhash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
        exclude: /node_modules/,
      },{
        test: /\.(scss|css)$/,
        use: [MiniCssExtractPlugin.loader,'css-loader', 'sass-loader'],
      },

      {
        test: /\.(png|jpe?g|svg|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'images',
              esModule: false,
            },
          },
        ],
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          outputPath: 'vendor',
          name: '[name].[ext]',
          esModule: false,
        },
      }
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style.[contenthash].css'
    }),
    new HtmlWebpackPlugin({
      inject: false,
      template: './static/index.html',
      filename: 'index.html'
    }),
  ]
};
