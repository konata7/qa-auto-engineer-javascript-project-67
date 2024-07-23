install: install-deps
	npx simple-git-hooks

debug:
	DEBUG=* node bin/page-loader.js

install-deps:
	npm ci --legacy-peer-deps

test:
	DEBUG=axios,nock*,page-loader* npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8

lint:
	npx eslint . --ignore-pattern __fixtures__/**

publish:
	npm publish

.PHONY: test

