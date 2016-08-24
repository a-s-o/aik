'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aikPanelWrapper = aikPanelWrapper;
exports.aikPanel = aikPanel;
exports.layoutLog = layoutLog;
exports.layoutAssets = layoutAssets;
exports.layoutModules = layoutModules;
exports.createSetData = createSetData;
exports.default = createDashboard;

var _webpackDashboard = require('webpack-dashboard');

var _webpackDashboard2 = _interopRequireDefault(_webpackDashboard);

var _plugin = require('webpack-dashboard/plugin');

var _plugin2 = _interopRequireDefault(_plugin);

var _blessed = require('blessed');

var _blessed2 = _interopRequireDefault(_blessed);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-invalid-this */

function aikPanelWrapper() {
  return _blessed2.default.layout({
    width: '75%',
    height: '14%',
    left: '0%',
    top: '0%',
    layout: 'grid'
  });
}

function aikPanel(flags, ngrokUrl, self) {
  var wrapper = aikPanelWrapper();
  var bigPanels = flags.ngrok ? 2 : 1;
  var bigPanelWidth = 68 / bigPanels;

  self.server = _blessed2.default.box({
    parent: wrapper,
    label: 'Local Server',
    tags: true,
    padding: { left: 1 },
    width: bigPanelWidth + '%',
    height: '100%',
    valign: 'middle',
    border: { type: 'line' },
    style: {
      fg: -1,
      border: { fg: self.color }
    }
  });

  if (flags.ngrok) {
    self.ngrok = _blessed2.default.box({
      parent: wrapper,
      label: 'Ngrok',
      tags: true,
      padding: { left: 1 },
      width: bigPanelWidth + '%',
      height: '100%',
      valign: 'middle',
      border: { type: 'line' },
      style: {
        fg: -1,
        border: { fg: self.color }
      }
    });
  }

  self.mods = _blessed2.default.box({
    parent: wrapper,
    label: 'Mods',
    padding: { left: 1 },
    width: '32%',
    height: '100%',
    valign: 'middle',
    tags: true,
    scrollable: true,
    alwaysScroll: true,
    scrollbar: { ch: ' ', inverse: true },
    mouse: true,
    border: { type: 'line' },
    style: {
      fg: -1,
      border: { fg: self.color }
    }
  });

  self.screen.append(wrapper);
}

function layoutLog() {
  aikPanel(this);

  // Copy-pasted from https://github.com/FormidableLabs/webpack-dashboard/blob/master/dashboard/index.js#L104
  // Keep in sync
  this.log = _blessed2.default.box({
    label: 'Log',
    padding: 1,
    width: this.minimal ? '100%' : '75%',
    height: this.minimal ? '70%' : '48%',
    left: '0%',
    top: '14%',
    border: { type: 'line' },
    style: {
      fg: -1,
      border: { fg: this.color }
    }
  });

  this.logText = _blessed2.default.log({
    parent: this.log,
    tags: true,
    width: '100%-5',
    scrollable: true,
    input: true,
    alwaysScroll: true,
    scrollbar: { ch: ' ', inverse: true },
    keys: true,
    vi: true,
    mouse: true
  });

  this.screen.append(this.log);
}

function layoutAssets() {
  this.assets = _blessed2.default.box({
    label: "Assets",
    tags: true,
    padding: 1,
    width: "25%",
    height: "58%",
    left: "75%",
    top: "42%",
    border: {
      type: "line"
    },
    style: {
      fg: -1,
      border: {
        fg: this.color
      }
    }
  });

  this.assetTable = _blessed2.default.table({
    parent: this.assets,
    height: "100%",
    width: "100%-5",
    align: "left",
    pad: 1,
    scrollable: true,
    alwaysScroll: true,
    scrollbar: {
      ch: " ",
      inverse: true
    },
    keys: true,
    vi: true,
    mouse: true,
    data: [["Name", "Size"]]
  });

  this.screen.append(this.assets);
}

function layoutModules() {
  this.modules = _blessed2.default.box({
    label: "Modules",
    tags: true,
    padding: 1,
    width: "75%",
    height: "38%",
    left: "0%",
    top: "62%",
    border: {
      type: "line"
    },
    style: {
      fg: -1,
      border: {
        fg: this.color
      }
    }
  });

  this.moduleTable = _blessed2.default.table({
    parent: this.modules,
    height: "100%",
    width: "100%-5",
    align: "left",
    pad: 1,
    shrink: true,
    scrollable: true,
    alwaysScroll: true,
    scrollbar: {
      ch: " ",
      inverse: true
    },
    keys: true,
    vi: true,
    mouse: true,
    data: [["Name", "Size", "Percentage"]]
  });

  this.screen.append(this.modules);
}

function createSetData(setData, flags, ngrokUrl) {
  return function _setData(dataArr) {
    this.server.setContent('http://' + flags.host + ':' + flags.port);

    if (flags.ngrok) {
      this.ngrok.setContent(ngrokUrl[0]);
    }

    var mods = [];

    if (flags.cssmodules) {
      mods.push('CSS Modules');
    }

    if (flags.react) {
      mods.push('React Hot Loader');
    }

    this.mods.setContent(mods.join('\n'));

    setData.call(this, dataArr);
  };
}

/* eslint-disable no-func-assign */
function createDashboard(flags, ngrokUrl) {
  var oldSetData = _webpackDashboard2.default.prototype.setData;
  exports.aikPanel = aikPanel = aikPanel.bind(null, flags, ngrokUrl);
  _webpackDashboard2.default.prototype.layoutLog = layoutLog;
  _webpackDashboard2.default.prototype.layoutAssets = layoutAssets;
  _webpackDashboard2.default.prototype.layoutModules = layoutModules;
  _webpackDashboard2.default.prototype.setData = createSetData(oldSetData, flags, ngrokUrl);

  var dashboard = new _webpackDashboard2.default();
  return new _plugin2.default(dashboard.setData);
}