var path = require('path')
var fs = require('fs')
var glob = require('glob')
var _ = require('lodash')

var rFilename = /(\d+-\d+-\d+)-(.+)/i

var defaultPostsPattern = 'src/posts/**/*.md'
var defaultDest = 'posts/'
var defaultDefaultData = {
      layout: 'src/posts/_layout.jade'
    }

module.exports = function(opts) {
  var postsPattern = opts.postsPattern || defaultPostsPattern
    , defaultData = opts.defaultData || defaultDefaultData
    , dest = opts.dest || defaultDest
  var files = glob.sync(postsPattern)
  return files.map(function(filepath) {
    var filename = path.basename(filepath, '.md')
      , ret = filename.match(rFilename)
      , date = ret[1]
      , title = ret[2]

    return _.defaults({
      title: title
    , date: date
    , file: filepath
    , dest: path.join(dest, date.replace('-', '/'), title)
    }, defaultData)
  })
}
