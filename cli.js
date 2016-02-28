#! /usr/bin/env node
'use strict';

var _meow = require('meow');

var _meow2 = _interopRequireDefault(_meow);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _lib = require('./lib/');

var _lib2 = _interopRequireDefault(_lib);

var _isEmpty = require('lodash/lang/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cli = (0, _meow2.default)({
  help: [_chalk2.default.green('Usage'), '  $ aik filename.js', '', _chalk2.default.green('Options'), '  ' + _chalk2.default.yellow('-p, --port') + '        Web server port. ' + _chalk2.default.dim('[Default: 8080]'), '  ' + _chalk2.default.yellow('-h, --host') + '        Web server host. ' + _chalk2.default.dim('[Default: localhost]'), '  ' + _chalk2.default.yellow('-n, --ngrok') + '       Exposes server to real world by ngrok.', '  ' + _chalk2.default.yellow('-c, --cssmodules') + '  Enables css modules.', '  ' + _chalk2.default.yellow('--help') + '            Shows help.', '', _chalk2.default.green('Examples'), '  $ aik filename.js --port 3000 -n -cm', _chalk2.default.dim('  Runs aik web server on 3000 port with ngrok and css modules support')]
}, {
  alias: {
    p: 'port',
    h: 'host',
    n: 'ngrok',
    c: 'cssmodules'
  },
  default: {
    port: 8080,
    host: 'localhost'
  }
});

var input = cli.input || [];
var flags = cli.flags || {};

if ((0, _isEmpty2.default)(input) || flags.help) {
  console.log(cli.help); // eslint-disable-line
} else {
    (0, _lib2.default)(input, flags);
  }