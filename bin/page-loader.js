#!/usr/bin/env node
import { Command } from 'commander';
import pageLoader from '../index.js';
import errorHandler from '../src/errorHandler.js';

const program = new Command();

program
  .name('page-loader')
  .description('CLI web page downloader')
  .version('0.0.1');

program
  .arguments('<url>')
  .option('-o, --output [dir]', 'Output directory')
  .action((url, options) => {
    pageLoader(url, options.output)
      .then(() => console.log(`Page was successfully downloaded into ${options.output || process.cwd()}`))
      .catch(errorHandler);
  });

program.parse();
