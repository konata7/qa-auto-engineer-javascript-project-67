// @ts-check

import {
  beforeAll, beforeEach,
  describe, expect, jest, test,
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

describe('Page loader positive tests', () => {
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
describe('Page loader negative tests', () => {
  beforeEach(async () => {
    nock.restore();
    nock.cleanAll();
    nock.activate();
    tmpdir = await fsp.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  });
  const errors = {
    noInternet: new Error('Error: getaddrinfo EAI_AGAIN ru.hexlet.io'),
    status404: new Error('Request failed with status code 404'),
    status501: new Error('Request failed with status code 501'),
    directoryNotFound: { code: 'ENOENT', errno: -2, syscall: 'mkdir' },
    directoryReadOnly: { code: 'EACCES', errno: -13, syscall: 'mkdir' },
  };
  errors.noInternet.code = 'EAI_AGAIN';
  test('no internet connection', async () => {
    nock('https://ru.hexlet.io')
      .get('/courses')
      .replyWithError(errors.noInternet);
    const spy = jest.spyOn(console, 'error');

    await expect(pageLoader('https://ru.hexlet.io/courses', tmpdir)).rejects.toMatchObject(errors.noInternet);
    expect(spy).lastCalledWith('No network connection!');
  });
  test('status 404', async () => {
    nock('https://ru.hexlet.io')
      .get('/courses')
      .reply(404, {});
    const spy = jest.spyOn(console, 'error');

    await expect(pageLoader('https://ru.hexlet.io/courses', tmpdir)).rejects.toMatchObject(errors.status404);
    expect(spy).lastCalledWith('Request to https://ru.hexlet.io/courses failed with status code: 404');
  });
  test('status 501', async () => {
    nock('https://ru.hexlet.io')
      .get('/courses')
      .reply(501, {});
    const spy = jest.spyOn(console, 'error');

    await expect(pageLoader('https://ru.hexlet.io/courses', tmpdir)).rejects.toMatchObject(errors.status501);
    expect(spy).lastCalledWith('Request to https://ru.hexlet.io/courses failed with status code: 501');
  });
  test('output directory does not exist', async () => {
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
    await fsp.rmdir(tmpdir);
    const spy = jest.spyOn(console, 'error');
    await expect(pageLoader('https://ru.hexlet.io/courses', tmpdir)).rejects.toMatchObject(errors.directoryNotFound);
    expect(spy).lastCalledWith(`Output directory doesn't exist (${tmpdir})`);
  });
  test('directory read only', async () => {
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
    await fsp.chmod(tmpdir, 444);
    const spy = jest.spyOn(console, 'error');
    await expect(pageLoader('https://ru.hexlet.io/courses', tmpdir)).rejects.toMatchObject(errors.directoryReadOnly);
    expect(spy).lastCalledWith(`Write access to file system denied: mkdir ${tmpdir}/ru-hexlet-io-courses_files`);
  });
});
