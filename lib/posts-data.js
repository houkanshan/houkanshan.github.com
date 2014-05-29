var path = require('path')
var fs = require('fs')
var glob = require('glob')
var _ = require('lodash')

var defaultPostsPattern = 'src/posts/**/*.md'

var rFilename = /(\d+-\d+-\d+)-(.+)/i

var defaultData = {
      layout: 'src/posts/_layout.jade'
    }

module.exports = function(postsPattern) {
  postsPattern = postsPattern || defaultPostsPattern
  var files = glob.sync(postsPattern)
  return files.map(function(filepath) {
    var filename = path.basename(filepath, '.md')
      , ret = filename.match(rFilename)
      , date = ret[1]
      , title = ret[2]

    return _.defaults({
      title: title
    , date: date
    }, defaultData)
  })
}
