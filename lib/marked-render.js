const marked = require('marked')
const renderer = new marked.Renderer()
renderer.image = function(src, title, alt) {
  return `<img src="${src}" alt="${alt}" title="${title}"/>` +
    (alt ? `<figcaption>${alt}</figcaption>` : '')
}
module.exports = renderer