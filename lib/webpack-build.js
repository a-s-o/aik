'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeDist = removeDist;
exports.default = runWebpackBuilder;

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _chalk2 = require('chalk');

var _chalk3 = _interopRequireDefault(_chalk2);

var _webpackConfigProd = require('./webpack-config-prod');

var _webpackConfigProd2 = _interopRequireDefault(_webpackConfigProd);

var _webpackMessages = require('./webpack-messages');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Removes distribute folder to prevent duplicates.
 *
 * @param {String} distPath
 *
 * @return {Promise}
 */
function removeDist(distPath) {
  return new Promise(function (resolve) {
    return (0, _rimraf2.default)(distPath, resolve);
  });
}

/**
 * Builds project using webpack.
 *
 * @param {String} filename
 * @param {Flags} flags
 * @param {Function} console
 *
 * @return {Promise}
 */
function runWebpackBuilder(filename, flags, console) {
  var distShortName = (0, _lodash.isString)(flags.build) ? flags.build : 'dist';
  var config = (0, _webpackConfigProd2.default)(filename, flags, distShortName);
  var compiler = (0, _webpack2.default)(config);
  var dist = _path2.default.join(process.cwd(), distShortName);
  var msgImports = { log: console.log.bind(console), chalk: _chalk3.default }; // eslint-disable-line

  (0, _webpackMessages.builderBanner)(msgImports, filename, flags.cssmodules);
  (0, _webpackMessages.builderRemovingDistMsg)(msgImports, dist);

  return removeDist(dist).then(function () {
    (0, _webpackMessages.builderRunningBuildMsg)(msgImports);
    compiler.run(function (err) {
      if (err) {
        (0, _webpackMessages.builderErrorMsg)(msgImports, err);
        process.exit(1); // eslint-disable-line
      }
      (0, _webpackMessages.builderSuccessMsg)(msgImports, distShortName);
    });
  });
}