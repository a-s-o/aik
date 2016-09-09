import { aikDevServer } from '../index';

test('aikDevServer -> should work with all flags', () => {
  return aikDevServer(['test/index.js'], { port: 4444, host: 'localhost' }, console);
});
