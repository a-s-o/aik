/* @flow */

import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import rimraf from 'rimraf';
import gzipSize from 'gzip-size';
import webpackConfigBuilder from './webpack/config-builder';
import {
  builderBanner,
  builderRemovingDistMsg,
  builderRunningBuildMsg,
  builderErrorMsg,
  builderSuccessMsg,
  fileDoesNotExistMsg
} from './utils/messages';

/**
 * Removes distribute folder to prevent duplicates.
 */
export function removeDist(distPath: string): Promise<*> {
  return new Promise(resolve => rimraf(distPath, resolve));
}

/**
 * Builds project using webpack.
 */
export default function runWebpackBuilder(filename: string, flags: CLIFlags, params: AikParams): Promise<*> {
  try {
    fs.statSync(filename);
  } catch (error) {
    fileDoesNotExistMsg(filename);
    return Promise.resolve();
  }

  const config = webpackConfigBuilder(filename, flags, params);
  const compiler = webpack(config);

  builderBanner(filename, flags, params);
  builderRemovingDistMsg(params.dist.path);

  return removeDist(params.dist.path)
    .then(() => {
      builderRunningBuildMsg();
      compiler.run((err, stats) => {
        if (err) {
          builderErrorMsg(err);
          process.exit(1); // eslint-disable-line
        }

        const json = stats.toJson({}, true);
        const buildDuration: number = stats.endTime - stats.startTime;
        const assets:BuildStatAsset[] = json.assets.map(item => {
          const content: string = fs.readFileSync(path.join(params.dist.path, item.name), 'utf-8');
          return {
            name: item.name,
            size: item.size / 1024,
            sizeGz: gzipSize.sync(content) / 1024
          };
        });
        builderSuccessMsg(params.dist.short, { buildDuration, assets });
      });
    });
}
