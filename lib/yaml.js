yaml = require('js-yaml')
fs   = require('fs')

function readYaml(file) {
  return yaml.safeLoad(fs.readFileSync(file, 'utf8'))
}
function writeYaml(file, object) {
  return fs.writeFileSync(file, yaml.safeDump(object), 'utf-8')
}

module.exports = {
  readYaml, writeYaml
}