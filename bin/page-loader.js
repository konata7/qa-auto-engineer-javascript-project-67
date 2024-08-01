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
  .option('-o, --output [dir]', 'Output directory')
  .action(async (url, options) => {
    try {
      await pageLoader(url, options.output).catch();
    } catch (e) { /* empty */ }
  });

program.parse();
