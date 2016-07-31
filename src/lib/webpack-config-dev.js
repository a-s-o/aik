import path from 'path';
import last from 'lodash/last';

import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import NpmInstallPlugin from 'npm-install-webpack-plugin';

import autoprefixer from 'autoprefixer';
import precss from 'precss';
import postcssImport from 'postcss-import';

/**
 * Makes absolute path to node_modules for webpack plugins and loaders.
 *
 * @param {String} relativePath
 *
 * @return {String}
 */
export function makeAbsolutePathToNodeModules(relativePath) {
  return path.join(__dirname, '..', 'node_modules', relativePath);
}

/**
 * Setups entry part of webpack config.
 *
 * @param {String} filename
 * @param {String} host
 * @param {String} port
 *
 * @return {Object}
 */
export function setupEntry(filename, host, port) {
  host = host === '::' ? 'localhost' : host;

  return {
    app: [
      `${makeAbsolutePathToNodeModules('webpack-dev-server/client')}?http://${host}:${port}/`,
      makeAbsolutePathToNodeModules('webpack/hot/dev-server'),
      path.join(process.cwd(), filename)
    ]
  };
}

/**
 * Setups output section of webpack config.
 *
 * @param {String} filename
 *
 * @return {Object}
 */
export function setupOutput(filename) {
  return {
    path: path.join(process.cwd(), path.dirname(filename)),
    filename: 'index.js',
    hash: true
  };
}

/**
 * Setups plugins section for webpack config.
 *
 * @return {Array}
 */
export function setupPlugins() {
  return [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: last(process.cwd().split(path.sep))
    }),
    new NpmInstallPlugin({
      dev: true,
      peerDependencies: true
    }),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"development"' })
  ];
}

/**
 * Setups loaders for webpack.
 *
 * @param {Boolean} cssmodules
 * @param {Boolean} react
 *
 * @return {Object[]}
 */
export function setupLoaders(cssmodules, react) {
  const jsLoaders = [
    `${makeAbsolutePathToNodeModules('babel-loader')}?presets[]=${makeAbsolutePathToNodeModules('babel-preset-react')},presets[]=${makeAbsolutePathToNodeModules('babel-preset-es2015')}&cacheDirectory` // eslint-disable-line
  ];

  if (react) {
    jsLoaders.unshift(makeAbsolutePathToNodeModules('react-hot-loader'));
  }

  return [
    {
      test: /\.css$/,
      loaders: [
        makeAbsolutePathToNodeModules('style-loader'),
        makeAbsolutePathToNodeModules('css-loader') + (cssmodules ? '?modules&importLoaders=1' : ''),
        makeAbsolutePathToNodeModules('postcss-loader')
      ]
    },
    {
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loaders: jsLoaders
    },
    {
      test: /\.json$/,
      loader: makeAbsolutePathToNodeModules('json-loader')
    },
    {
      test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
      loader: makeAbsolutePathToNodeModules('file-loader')
    },
    {
      test: /\.(mp4|webm)$/,
      loader: `${makeAbsolutePathToNodeModules('url-loader')}?limit=10000`
    }
  ];
}

/**
 * Setups pre loaders for webpack.
 *
 * @return {Object[]}
 */
export function setupPreloaders() {
  return [
    {
      test: /\.js$/,
      loader: makeAbsolutePathToNodeModules('eslint-loader'),
      exclude: /node_modules/
    }
  ];
}

/**
 * Generates config for webpack.
 *
 * @param {String} filename
 * @param {Flags} flags
 *
 * @return {Object}
 */
export default function webpackConfigBuilder(filename, flags) {
  return {
    entry: setupEntry(filename, flags.host, flags.port),
    output: setupOutput(filename),
    debug: true,
    devtool: 'eval',
    plugins: setupPlugins(),
    module: {
      preLoaders: setupPreloaders(),
      loaders: setupLoaders(flags.cssmodules, flags.react)
    },
    eslint: {
      configFile: path.join(__dirname, 'eslint-config.js'),
      useEslintrc: false
    },
    postcss: function (wp) {
      return [
        postcssImport({ addDependencyTo: wp }),
        autoprefixer(),
        precss()
      ];
    }
  };
}