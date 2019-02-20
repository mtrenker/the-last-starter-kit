import * as path from 'path';

import * as CompressionPlugin from 'compression-webpack-plugin';
import { mergeWith } from 'lodash';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as webpack from 'webpack';

import common, { defaultMerger, files } from './common';
import css, { rules } from './css';

const isProduction = process.env.NODE_ENV === 'production';

const base: webpack.Configuration = {
  entry: [path.resolve(__dirname, '..', 'entry', 'client.tsx')],
  name: 'client',
  module: {
    rules: [
      ...css(),
      // Images
      {
        test: files.images,
        use: [
          {
            loader: 'file-loader',
            query: {
              name: `assets/img/[name]${isProduction ? '.[hash]' : ''}.[ext]`,
            },
          },
        ],
      },

      // Fonts
      {
        test: files.fonts,
        use: [
          {
            loader: 'file-loader',
            query: {
              name: `assets/fonts/[name]${isProduction ? '.[hash]' : ''}.[ext]`,
            },
          },
        ],
      },

      // ym-components
      {
        test: files.components,
        use: [
          {
            loader: 'file-loader',
            query: {
              name: `assets/components/[name]${isProduction ? '.[hash]' : ''}.[ext]`,
            },
          },
        ],
      },
    ],
  },

  // Set-up some common mocks/polyfills for features available in node, so
  // the browser doesn't balk when it sees this stuff
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },

  // Output
  output: {
    path: path.resolve(__dirname, '..', '..', 'dist', 'public'),
    // publicPath: "/",
  },

  // The client bundle will be responsible for building the resulting
  // CSS file; ensure compilation is dumped into a single chunk
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          chunks: 'all',
          enforce: true,
          name: 'main',
          test: new RegExp(
            `\\.${rules.map(rule => `(${rule.ext})`).join('|')}$`,
          ),
        },
      },
    },
  },

  // Add `MiniCssExtractPlugin`
  plugins: [
    new MiniCssExtractPlugin({
      chunkFilename: 'assets/css/[id].css',
      filename: `assets/css/[name]${isProduction ? '.[contenthash]' : ''}.css`,
    }),

    new webpack.DefinePlugin({
      GRAPHQL: JSON.stringify(process.env.GRAPHQL),
      SERVER: false,
    }),
  ],
};

// Development client config
const dev: webpack.Configuration = {
  devtool: 'inline-source-map',

  // Output
  output: {
    chunkFilename: '[name].js',
    filename: '[name].js',
  },
};

// Production client config
const prod: webpack.Configuration = {
  // Output
  output: {
    chunkFilename: 'assets/js/[name].[chunkhash].js',
    filename: 'assets/js/[name].[chunkhash].js',
  },

  plugins: [
    new CompressionPlugin({
      cache: true,
      minRatio: 0.99,
    }),
    // new BrotliCompression({
    //   minRatio: 0.99,
    // }),
  ],
};

export default mergeWith({},
  common(false),
  base,
  process.env.NODE_ENV === 'production' ? prod : dev,
  defaultMerger,
);
