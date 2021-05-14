const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

const SRC_PATH = path.resolve(__dirname, './src');
const PUBLIC_PATH = path.resolve(__dirname, '../public');
const UPLOAD_PATH = path.resolve(__dirname, '../upload');
const DIST_PATH = path.resolve(__dirname, '../dist');

const TerserPlugin = require("terser-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;

/** @type {import('webpack').Configuration} */
const config = {
  devServer: {
    contentBase: [PUBLIC_PATH, UPLOAD_PATH],
    historyApiFallback: true,
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  devtool: process.env.NODE_ENV === 'production' ? false : 'inline-source-map',
  entry: {
    main: [
      'core-js',
      'regenerator-runtime/runtime',
      path.resolve(SRC_PATH, './index.css'),
      path.resolve(SRC_PATH, './buildinfo.js'),
      path.resolve(SRC_PATH, './index.jsx'),
    ],
  },
  mode: process.env.NODE_ENV,
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.jsx?$/,
        use: [{ loader: 'babel-loader' }],
      },
      {
        test: /\.css$/i,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader', options: { url: false } },
          { loader: 'postcss-loader' },
        ],
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        extractComments: false,
        terserOptions: {
          warnings: false,
          output: {
            comments: false,
            beautify: false,
          },
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
  },
  output: {
    filename: 'scripts/[name].js',
    path: DIST_PATH,
  },
  plugins: [
    new webpack.ProvidePlugin({
      AudioContext: ['standardized-audio-context', 'AudioContext'],
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.EnvironmentPlugin({
      BUILD_DATE: new Date().toISOString(),
      // Heroku では SOURCE_VERSION 環境変数から commit hash を参照できます
      COMMIT_HASH: process.env.SOURCE_VERSION || '',
      NODE_ENV: 'development',
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css',
    }),
    new HtmlWebpackPlugin({
      inject: 'head',
      template: path.resolve(SRC_PATH, './index.html'),
    }),
    new HTMLInlineCSSWebpackPlugin(),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ja/),
    // new BundleAnalyzerPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      fs: false,
      path: false,
    },
  },
};

module.exports = config;
