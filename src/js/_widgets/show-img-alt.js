var $ = require('jquery')
var _ = require('lodash')

var defaults = {
  container: $('body')
}

module.exports = function(configs) {
  configs = _.defaults(configs, defaults)

  var imgs = configs.container.find('img[alt]')
  imgs.each(function(i, el) {
    el = $(el)
    var alt = el.attr('alt')
    $('<figcaption>').text(alt).insertAfter(el)
  })
}
