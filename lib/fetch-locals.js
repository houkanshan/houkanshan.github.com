var path = require('path')
var fs = require('fs')
var glob = require('glob')

function addByPath(target, path, value) {
  path = path.split('.')
  var currNode = target
  for( var i = 0, ilen = path.length; i < ilen ; ++i) {
    var name = path[i]
    if (i === ilen - 1) {
      currNode[name] = value
      return
    }

    if(!currNode[name]) {
      currNode[name] = {}
    }
    currNode = currNode[name]
  }
}

function fetchLocals(opts) {
  var dirs = opts.blob
    , cwd = opts.cwd || ''
    , data = {}

  dirs.forEach(function(dir) {
    var jsonFilePaths = glob.sync(dir, opts)
    jsonFilePaths.forEach(function(jsonFilePath) {
      var jsonPath = path.dirname(jsonFilePath).replace('/', '.')
        , jsonObj
      try {
        jsonObj = JSON.parse(fs.readFileSync(path.join(cwd, jsonFilePath)))
      } catch(e) {
        console.error('[JSON invalid]', e, 'File:', jsonFilePath)
      }
      addByPath(data, jsonPath, jsonObj)
    })
  })
  console.log(data)
  return data
}

module.exports = fetchLocals
