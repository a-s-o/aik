import Dashboard from 'webpack-dashboard';
import DashboardPlugin from 'webpack-dashboard/plugin';
import blessed from 'blessed';

/* eslint-disable no-invalid-this */

export function aikPanelWrapper() {
  return blessed.layout({
    width: '75%',
    height: '14%',
    left: '0%',
    top: '0%',
    layout: 'grid'
  });
}

export function aikPanel(flags, ngrokUrl, self) {
  const wrapper = aikPanelWrapper();
  const bigPanels = flags.ngrok ? 2 : 1;
  const bigPanelWidth = 68 / bigPanels;

  self.server = blessed.box({
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
    self.ngrok = blessed.box({
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

  self.mods = blessed.box({
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

export function layoutLog() {
  aikPanel(this);

  // Copy-pasted from https://github.com/FormidableLabs/webpack-dashboard/blob/master/dashboard/index.js#L104
  // Keep in sync
  this.log = blessed.box({
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

  this.logText = blessed.log({
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

export function layoutAssets() {
  this.assets = blessed.box({
    label: "Assets",
    tags: true,
    padding: 1,
    width: "25%",
    height: "58%",
    left: "75%",
    top: "42%",
    border: {
      type: "line",
    },
    style: {
      fg: -1,
      border: {
        fg: this.color,
      },
    },
  });

  this.assetTable = blessed.table({
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

export function layoutModules() {
  this.modules = blessed.box({
    label: "Modules",
    tags: true,
    padding: 1,
    width: "75%",
    height: "38%",
    left: "0%",
    top: "62%",
    border: {
      type: "line",
    },
    style: {
      fg: -1,
      border: {
        fg: this.color,
      },
    },
  });

  this.moduleTable = blessed.table({
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

export function createSetData(setData, flags, ngrokUrl) {
  return function _setData(dataArr) {
    this.server.setContent(`http://${flags.host}:${flags.port}`);

    if (flags.ngrok) {
      this.ngrok.setContent(ngrokUrl[0]);
    }

    const mods = [];

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
export default function createDashboard(flags, ngrokUrl) {
  const oldSetData = Dashboard.prototype.setData;
  aikPanel = aikPanel.bind(null, flags, ngrokUrl);
  Dashboard.prototype.layoutLog = layoutLog;
  Dashboard.prototype.layoutAssets = layoutAssets;
  Dashboard.prototype.layoutModules = layoutModules;
  Dashboard.prototype.setData = createSetData(oldSetData, flags, ngrokUrl);

  const dashboard = new Dashboard();
  return new DashboardPlugin(dashboard.setData);
}
