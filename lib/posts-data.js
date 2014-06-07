var path = require('path')
var fs = require('fs')
var glob = require('glob')
var _ = require('lodash')

var rFilename = /(\d+-\d+-\d+)-(.+)/i

var defaultPostsPattern = 'src/posts/**/*.md'
var defaultDest = 'posts/'
var defaultDefaultData = {
      title: null
    , date: null
    , file: null
    , dest: null
    , cover: null

    , layout: 'src/posts/_layout.jade'
    , abstract: ''
    }

var coverExts = ['png', 'jpg', 'gif']
  , coverDir = '/img/cover'
function getCoverFilePath(filename) {
  for(var i = 0, ilen = coverExts.length; i < ilen; i++) {
    var coverExt = coverExts[i]
      , coverfilename = filename + '.' + coverExt
      , coverpath = path.join(coverDir, coverfilename)

    if (fs.existsSync(coverpath)) {
      return coverpath
    }
  }
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

    // normal data
    var data = {
      title: title
    , date: date
    , file: filepath
    , dest: path.join(dest, date.replace(/-/g, '/'), title)
    }

    // Test if has cover
    var cover = getCoverFilePath(filename)
    if (cover) {
      data.cover = cover
    }

    return _.defaults(data, defaultData)
  })
}
