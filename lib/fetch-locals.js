var path = require('path')
var fs = require('fs')
var glob = require('glob')
var { readYaml, writeYaml } = require('./yaml')

function addByPath(target, path, value) {
  path = path.split('.').slice(0, -1)
  console.log(path)
  var currNode = target
  for( var i = 0, ilen = path.length; i < ilen ; ++i) {
    var name = path[i]

    if (i === ilen - 1) {
      currNode[name] = value
      return
    }

    if (path[i+1] === 'data' || path[i+1] === 'index') {
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
      var jsonObj = readYaml(path.join(cwd, jsonFilePath))
      var jsonPath = jsonFilePath.replace(/\//g, '.')
      addByPath(data, jsonPath, jsonObj)
    })
  })
  console.log(data)
  return data
}

module.exports = fetchLocals
