GRUNT=./node_modules/.bin/grunt

init: node_install css html

node_install:
	npm install

css:
	$(GRUNT) default

html: 
	jekyll

server: 
	jekyll server -w

