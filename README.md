### Hexlet tests and linter status:
[![Actions Status](https://github.com/konata7/qa-auto-engineer-javascript-project-67/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/konata7/qa-auto-engineer-javascript-project-67/actions)

# Page-loader
Page-loader is a CLI utility for web-page downloading

## Requirements
Project require latest version of [Node.js](https://nodejs.org/en) to be installed.

## Installation

Clone project using [Git](https://git-scm.com/downloads) or download and unzip

```bash
git clone https://github.com/konata7/qa-auto-engineer-javascript-project-67.git gendiff
```
Go to the project folder and run installation script:

```bash
cd page-loader
make install
```

## Usage

```bash
page-loaderUsage: page-loader [options] <url>

CLI web page downloader

Options:
  -V, --version       output the version number
  -o, --output [dir]  Output directory
  -h, --help          display help for command
```

Package also can be used as a library:
```js
import pageLoader from 'page-loader';

/* 
 * url - URL of web-page to download
 * outputDirectory - optional, if ommited current process running dir selected
 */
const { filepath } = await pageLoader(url, outputDirectory);
```
## Demos
### Normal start
[![asciicast](https://asciinema.org/a/8aUZW5ruJk8iJmvhUhlXZmRKU.svg)](https://asciinema.org/a/8aUZW5ruJk8iJmvhUhlXZmRKU)
### With debug logging enabled
[![asciicast](https://asciinema.org/a/SDnZKGwcu97zyZ5ExuPxPT0T9.svg)](https://asciinema.org/a/SDnZKGwcu97zyZ5ExuPxPT0T9)
### Error occurred
[![asciicast](https://asciinema.org/a/bZLSjr6SofasQdmR1Df3U8GQW.svg)](https://asciinema.org/a/bZLSjr6SofasQdmR1Df3U8GQW)

