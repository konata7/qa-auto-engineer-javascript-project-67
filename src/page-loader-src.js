// @ts-check

// import _ from 'lodash';

import axios from 'axios';
import * as fs from 'node:fs/promises';
import path from 'path';
import * as cheerio from 'cheerio';

const makeFilename = (url, ext) => {
  const newExt = ext || path.extname(url);
  const newUrl = !ext ? `${path.parse(url).dir}/${path.parse(url).name}` : url;
  return `${newUrl.split('://')[1].replaceAll(/[^a-zA-Z0-9]+/g, '-')}${newExt}`;
};

async function loadResources(loadedCheerio, url, outputDir, resourcesDirpath) {
  const { hostname } = new URL(url);
  const $imgSrc = loadedCheerio('img').map(function fn() {
    return loadedCheerio(this).attr('src');
  });
  const $linkHref = loadedCheerio('link').map(function fn() {
    return loadedCheerio(this).attr('href');
  });

  const imgLinks = $imgSrc.toArray()
    .map((src) => ({ url: new URL(src, url).href, src }));
  const linkLinks = $linkHref.toArray()
    .filter((link) => new URL(link).hostname === hostname)
    .map((link) => ({ url: new URL(link, url).href, link }));

  const promisesImgs = imgLinks.map((link) => axios.get(link.url));
  const responseImgs = await Promise.allSettled(promisesImgs);
  const imgs = responseImgs
    .filter((el) => el.status === 'fulfilled')
    .map((el) => ({
      data: el.value.data,
      url: el.value.config.url,
      src: imgLinks.find((imgLink) => imgLink.url === el.value.config.url).src,
      filename: makeFilename(el.value.config.url),
      relativePath: path.relative(
        outputDir,
        path.join(resourcesDirpath, makeFilename(el.value.config.url)),
      ),
      absolutePath: path.join(resourcesDirpath, makeFilename(el.value.config.url)),
    }));
  return imgs;
}

/**
 * @param {String} url
 * @param {String} outputDir
 */
export default async (url, outputDir = process.cwd()) => {
  const response = await axios.get(url);
  const filename = makeFilename(url, '.html');
  const filepath = path.join(outputDir, filename);

  const $ = cheerio.load(response.data);

  const resourcesDirpath = path.join(outputDir, makeFilename(url, '_files'));

  const imgs = await loadResources($, url, outputDir, resourcesDirpath);

  await fs.mkdir(resourcesDirpath);
  const promisesWriteImgs = imgs
    .map((img) => fs.writeFile(img.absolutePath, img.data));
  await Promise.allSettled(promisesWriteImgs);

  $('img').each(function fn() {
    $(this).attr('src', imgs.find((img) => img.src === $(this).attr('src')).relativePath);
  });
  const newHtml = $.html();
  await fs.writeFile(filepath, newHtml);
  return { filepath };
};
