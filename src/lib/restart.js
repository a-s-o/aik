/**
 * Restarts dev server.
 *
 * @param {String[]} input
 * @param {Flags} flags
 * @param {Object} imports
 */
export default function reload(input, flags, imports) {
  const { prc, server, chalk } = imports;

  prc.stdin.setEncoding('utf8');
  prc.stdin.on('readable', () => {
    const chunk = prc.stdin.read();

    if (chunk !== null && chunk.indexOf('rs') !== -1) {
      prc.stdout.write(chalk.yellow('Restarting'));
      prc.stdout.write('\n');
      server.invalidate();
      prc.stdout.write(chalk.green('Done'));
      prc.stdout.write('\n');
    }
  });
}