// @ts-check

import {
  beforeEach, expect, test,
} from '@jest/globals';
import path from 'path';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import nock from 'nock';
import pageLoader from '../index.js';

nock.disableNetConnect();

const getFixturePath = (filename) => path.resolve(__dirname, '../__fixtures__/', filename);

let tmpdir;

beforeEach(async () => {
  tmpdir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

test('courses', async () => {
  nock('https://ru.hexlet.io')
    .get('/courses')
    .replyWithFile(200, path.join(getFixturePath('courses'), 'Курсы программирования, обучение онлайн.htm'));
  const { filepath: pathToHtml } = await pageLoader('https://ru.hexlet.io/courses', tmpdir);

  const actualFilename = path.basename(pathToHtml);
  const expectedFilename = 'ru-hexlet-io-courses.html';
  expect(actualFilename).toEqual(expectedFilename);

  const actual = await fs.readFile(pathToHtml);
  const expected = await fs.readFile(path.join(getFixturePath('courses'), 'Курсы программирования, обучение онлайн.htm'));
  expect(actual).toEqual(expected);
});
