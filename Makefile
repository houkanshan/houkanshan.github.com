GRUNT=./node_modules/.bin/grunt

init: node_install css html
build: css html

node_install:
	npm install

css:
	$(GRUNT) default

html: 
	jekyll build

server: 
	jekyll server -w

