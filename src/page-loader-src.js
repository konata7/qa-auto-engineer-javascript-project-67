// @ts-check

// import _ from 'lodash';

import axios from 'axios';
import * as fs from 'node:fs/promises';
import * as cheerio from 'cheerio';
import path from 'path';

/**
 * @param {String} url
 * @param {String} outputDir
 */
export default async (url, outputDir) => {
  const response = await axios.get(url).catch((error) => {
    console.error(error);
    throw error;
  });
  const filename = `${url.split('://')[1].replaceAll(/[^a-zA-Z0-9]+/g, '-')}.html`;
  const filepath = path.join(outputDir, filename);
  await fs.writeFile(filepath, response.data);
  return { filepath };
};
