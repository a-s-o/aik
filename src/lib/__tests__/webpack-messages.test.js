import { devServerBanner, builderBanner } from '../webpack-messages';
import chalk from 'chalk';

test('devServerBanner -> should containt server and entry point', () => {
  const result = devServerBanner({ chalk }, { host: 'localhost', port: 4444 }, 'index.js', '').join('\n');
  expect(result).toContain('Entry point');
  expect(result).toContain('index.js');
  expect(result).toContain('Server');
  expect(result).toContain('http://localhost:4444');
});

test('devServerBanner -> should containt ngrok url', () => {
  const result = devServerBanner({ chalk }, { ngrok: true }, 'index.js', 'http://hash.ngrok.io').join('\n');
  expect(result).toContain('Ngrok');
  expect(result).toContain('http://hash.ngrok.io');
});

test('devServerBanner -> should containt css modules', () => {
  const result = devServerBanner({ chalk }, { cssmodules: true }, 'index.js', 'http://hash.ngrok.io').join('\n');
  expect(result).toContain('CSS Modules');
});

test('devServerBanner -> should containt react hot loader', () => {
  const result = devServerBanner({ chalk }, { react: true }, 'index.js', 'http://hash.ngrok.io').join('\n');
  expect(result).toContain('React Hot Loader');
});

test('builderBanner -> should containt entry point', () => {
  const result = builderBanner({ chalk, log(msg) { return msg; } }, {}, 'index.js');
  expect(result).toContain('Entry point');
  expect(result).toContain('index.js');
});

test('builderBanner -> should containt base path', () => {
  const result = builderBanner({ chalk, log(msg) { return msg; } }, { base: 'base/' }, 'index.js');
  expect(result).toContain('Base path');
  expect(result).toContain('base/');
});

test('builderBanner -> should containt css modules', () => {
  const result = builderBanner({ chalk, log(msg) { return msg; } }, { cssmodules: true }, 'index.js');
  expect(result).toContain('CSS Modules');
  expect(result).toContain('enabled');
});
