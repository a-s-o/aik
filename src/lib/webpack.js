import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import webpackConfigBuilder from './webpack-config-builder';
import _chalk from 'chalk';

import {
  compiling, compiledSuccessfully,
  compiledWithWarnings, eslintExtraWarning,
  failedToCompile
} from './webpack-messages';

const SYNTAX_ERROR_LABEL = 'Syntax error:';

/**
 * Moves current line to the most top of console.
 */
export function clearConsole() {
  process.stdout.write(_chalk.dim('----------------------------------'));
  process.stdout.write('\x1B[2J\x1B[0f');
}

/**
 * Checks whether error is syntax error.
 *
 * @param {String} message
 *
 * @return {Boolean}
 */
export function isLikelyASyntaxError(message) {
  return message.indexOf(SYNTAX_ERROR_LABEL) !== -1;
}

/**
 * Makes some common errors shorter.
 *
 * @param {String} message
 *
 * @return {String}
 */
export function formatMessage(message) {
  return message
    // Babel syntax error
    .replace(
      'Module build failed: SyntaxError:',
      SYNTAX_ERROR_LABEL
    )
    // Webpack file not found error
    .replace(
      /Module not found: Error: Cannot resolve 'file' or 'directory'/,
      'Module not found:'
    )
    // Internal stacks are generally useless so we strip them
    .replace(/^\s*at\s.*:\d+:\d+[\s\)]*\n/gm, '') // at ... ...:x:y
    // Webpack loader names obscure CSS filenames
    .replace('./~/css-loader!./~/postcss-loader!', '');
}

/**
 * On invalid handler for webpack compiler.
 */
export function onInvalidBuild() {
  clearConsole();
  console.log(compiling(_chalk)); // eslint-disable-line
}

/**
 * On done handler for webpack compiler.
 *
 * @param {Object} imports
 * @param {Function} imports.log
 * @param {Object} imports.chalk
 * @param {Flags} flags
 * @param {String} ngrokUrl
 * @param {Object} stats - webpack build stats
 *
 * @return {void}
 */
export function onDone(imports, flags, ngrokUrl, stats) {
  const hasErrors = stats.hasErrors();
  const hasWarnings = stats.hasWarnings();
  const { log, chalk } = imports;

  clearConsole();

  if (!hasErrors && !hasWarnings) {
    return log(compiledSuccessfully(chalk, flags, ngrokUrl));
  }

  const json = stats.toJson();
  const formattedWarnings = json.warnings.map(message => 'Warning in ' + formatMessage(message));
  let formattedErrors = json.errors.map(message => 'Error in ' + formatMessage(message));

  if (hasErrors) {
    log(failedToCompile(chalk));

    // If there are any syntax errors, show just them.
    // This prevents a confusing ESLint parsing error
    // preceding a much more useful Babel syntax error.
    if (formattedErrors.some(isLikelyASyntaxError)) {
      formattedErrors = formattedErrors.filter(isLikelyASyntaxError);
    }

    // If errors exist, ignore warnings.
    return formattedErrors.forEach(message => log('\n', message));
  }

  if (hasWarnings) {
    log(compiledWithWarnings(chalk));
    formattedWarnings.forEach(message => log('\n', message));
    log(eslintExtraWarning(chalk));
  }
}

/**
 * Creates webpack compiler.
 *
 * @param {Object} config - webpack config
 * @param {Flags} flags
 * @param {String} ngrokUrl
 *
 * @return {Object}
 */
export function createWebpackCompiler(config, flags, ngrokUrl) {
  const compiler = webpack(config);
  const imports = { log: console.log.bind(console), chalk: _chalk }; // eslint-disable-line
  compiler.plugin('invalid', onInvalidBuild);
  compiler.plugin('done', onDone.bind(null, imports, flags, ngrokUrl));
  return compiler;
}

/**
 * Creates webpack dev server.
 *
 * @param {String} filename
 * @param {Flags} flags
 * @param {String} ngrokUrl
 *
 * @return {Promise}
 */
export default function createWebpackDevServer(filename, flags, ngrokUrl) {
  const config = webpackConfigBuilder(filename, flags);
  const compiler = createWebpackCompiler(config, flags, ngrokUrl);
  const server = new WebpackDevServer(compiler, {
    historyApiFallback: true,
    hot: true,
    colors: true,
    quiet: true,
    stats: { colors: true }
  });

  return new Promise((resolve, reject) => {
    server.listen(flags.port, flags.host, (err) => {
      if (err) return reject(err);
      resolve(server);
    });
  });
}
