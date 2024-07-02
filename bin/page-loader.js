#!/usr/bin/env node
import { Command } from 'commander';
import pageLoader from '../index.js';

const program = new Command();

program
  .name('page-loader')
  .description('CLI web page downloader')
  .version('0.0.1');

program
  .arguments('<url>')
  .option('-o, --output [dir]', 'Output directory (default: "~/page-loader")')
  .action(async (url, options) => {
    await pageLoader(url, options.output);
    console.log(`Page was successfully downloaded into ${options.output}`);
  });

program.parse();
