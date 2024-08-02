// @ts-check

// import _ from 'lodash';

import * as fs from 'node:fs/promises';
import path from 'path';
import * as cheerio from 'cheerio';
import _ from 'lodash';
import { createRequire } from 'module';
import debug from 'debug';
import errorHandler from './errorHandler.js';

const require = createRequire(import.meta.url);
require('axios-debug-log');
const axios = require('axios');

const logInfo = debug('page-loader:info');

const makeFilename = (url, ext) => {
  const newExt = ext || path.extname(url);
  const newUrl = !ext ? `${path.parse(url).dir}/${path.parse(url).name}` : url;
  return `${newUrl.split('://')[1].replaceAll(/[^a-zA-Z0-9]+/g, '-')}${newExt}`;
};

async function loadResources(loadedCheerio, url, outputDir, resourcesDirpath) {
  const { hostname } = new URL(url);

  async function loadByTag(tag, linkAttr, filterByHostname) {
    const $tagLinks = loadedCheerio(tag).map(function fn() {
      return loadedCheerio(this).attr(linkAttr);
    });

    const tagLinks = $tagLinks.toArray()
      .filter((link) => !filterByHostname || !link.startsWith('http') || new URL(link).hostname === hostname)
      .map((link) => ({ url: new URL(link, url).href, link }));
    // eslint-disable-next-line no-unused-vars

    const promises1 = tagLinks.map((link) => axios.get(link.url).catch(errorHandler));
    const response = await Promise.allSettled(promises1);

    return response.filter((el) => el.status === 'fulfilled')
      .map((el) => ({
        data: el.value.data.trim(),
        url: el.value.config.url,
        type: tag,
        linkAttr,
        src: tagLinks.find((link) => link.url === el.value.config.url).link,
        filename: makeFilename(el.value.config.url, el.value.config.url.split('/').at(-1).split('.').length === 1 ? '.html' : undefined),
        relativePath: path.relative(
          outputDir,
          path.join(resourcesDirpath, makeFilename(el.value.config.url, el.value.config.url.split('/').at(-1).split('.').length === 1 ? '.html' : undefined)),
        ),
        absolutePath: path.join(resourcesDirpath, makeFilename(el.value.config.url, el.value.config.url.split('/').at(-1).split('.').length === 1 ? '.html' : undefined)),
      }));
  }
  const img = await loadByTag('img', 'src', false);
  const link = await loadByTag('link', 'href', true);
  const script = await loadByTag('script', 'src', true);

  return [...img, ...link, ...script];
}

/**
 * @param {String} url
 * @param {String} outputDir
 */
export default async (url, outputDir = process.cwd()) => {
  const response = await axios.get(url).catch(errorHandler);
  logInfo(`Got html from ${url}`);

  const filename = makeFilename(url, '.html');
  const filepath = path.join(outputDir, filename);

  const $ = cheerio.load(response.data);

  const resourcesDirpath = path.join(outputDir, makeFilename(url, '_files'));

  const resources = await loadResources($, url, outputDir, resourcesDirpath);

  logInfo(`Got page files: ${resources.map((resource) => resource.filename).join('\n')}`);
  await fs.mkdir(resourcesDirpath).catch(errorHandler);
  const promises = resources
    .map((res) => fs.writeFile(res.absolutePath, res.data).catch(errorHandler));
  await Promise.allSettled(promises);
  logInfo(`Finished writing files to ${resourcesDirpath}`);

  const uniqTags = _.uniq(resources.map((el) => el.type));
  uniqTags.forEach((tag) => {
    resources.filter((res) => res.type === tag).forEach((res) => {
      $(`${res.type}[${res.linkAttr}=${res.src}]`).each(function fn() {
        $(this).attr(res.linkAttr, res.relativePath);
      });
    });
  });

  const newHtml = $.html();
  await fs.writeFile(filepath, newHtml).catch(errorHandler);
  logInfo(`Saved modified .html to ${filepath}`);
  console.log(`Page was successfully downloaded into ${outputDir}`);
  return { filepath };
};
