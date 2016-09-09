import { isLikelyASyntaxError, formatMessage } from '../webpack-error-helpers';

test('isLikelyASyntaxError -> should be true for syntax errors', () => {
  expect(isLikelyASyntaxError('SyntaxError: some error message')).toBe(true);
  expect(isLikelyASyntaxError('Syntax Error: some error message')).toBe(true);
});

test('formatMessage -> should replace "Module build failed"', () => {
  const message = formatMessage('Module build failed: SyntaxError:');
  expect(message).not.toContain('Module build failed:');
  expect(message).toContain('Syntax Error:');
});

test('formatMessage -> should replace Module not found: Error: Cannot resolve \'file\' or \'directory\'"', () => {
  const message = formatMessage('Module not found: Error: Cannot resolve \'file\' or \'directory\'');
  expect(message).not.toContain('Error: Cannot resolve ');
  expect(message).toContain('Module not found:');
});
