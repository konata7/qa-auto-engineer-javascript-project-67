// @ts-check

import {
  beforeAll,
  describe, expect, test,
} from '@jest/globals';
import path from 'path';
import * as fsp from 'node:fs/promises';
import * as fs from 'fs';
import * as os from 'node:os';
import nock from 'nock';
import * as cheerio from 'cheerio';
import { fileURLToPath } from 'url';
import pageLoader from '../index.js';

nock.disableNetConnect();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.resolve(__dirname, '../__fixtures__/', filename);

let tmpdir;
let pathToHtml;
const filesFolder = path.join(getFixturePath('courses'), 'ru-hexlet-io-courses_files');

beforeAll(async () => {
  nock('https://ru.hexlet.io')
    .persist()
    .get('/courses')
    .replyWithFile(200, path.join(getFixturePath('courses'), 'raw.html'))
    .get('/assets/professions/nodejs.png')
    .replyWithFile(200, path.join(getFixturePath('courses'), 'ru-hexlet-io-courses_files', 'ru-hexlet-io-assets-professions-nodejs.png'))
    .get('/assets/application.css')
    .replyWithFile(200, path.join(getFixturePath('courses'), 'ru-hexlet-io-courses_files', 'ru-hexlet-io-assets-application.css'))
    .get('/packs/js/runtime.js')
    .replyWithFile(200, path.join(getFixturePath('courses'), 'ru-hexlet-io-courses_files', 'ru-hexlet-io-packs-js-runtime.js'));
  tmpdir = await fsp.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  pathToHtml = (await pageLoader('https://ru.hexlet.io/courses', tmpdir)).filepath;
});

describe('Page loader tests', () => {
  const expectedFiles = fs.readdirSync(filesFolder);
  test('html loaded', async () => {
    const actualFilename = path.basename(pathToHtml);
    const expectedFilename = 'ru-hexlet-io-courses.html';
    expect(actualFilename).toEqual(expectedFilename);

    const $ = cheerio.load(await fsp.readFile(pathToHtml, 'utf-8'));
    const actual = $.html();
    const $1 = cheerio.load(await fsp.readFile(path.join(getFixturePath('courses'), 'with_local_resources.html'), 'utf-8'));
    const expected = $1.html();
    expect(actual.replace('\n', '').trim()).toEqual(expected.replace('\n', '').trim());
  });
  expectedFiles.forEach((filename) => test(`resource loaded: ${filename}`, async () => {
    await expect(fsp.access(path.join(tmpdir, 'ru-hexlet-io-courses_files', filename))).resolves.toEqual(undefined);
  }));
});
