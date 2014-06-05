var $ = require('jquery')
var _ = require('lodash')

;(function(){


var mainHeader = $('.main-header')
if (!mainHeader.length) { return }
var hasTouch = 'ontouchstart' in document.documentElement
if (hasTouch) { return }

var scrollBody = $('html, body')
  , win = $(window)
  , hoverEl = mainHeader.find('.header-wrapper')

hoverEl.on('mouseenter', jumpDown)
win.on('scroll', _.throttle(fadeAndHide, 100))

function jumpDown() {
  if (win.scrollTop() > 10) { return }

  scrollBody
    .animate({
      scrollTop: 91
    }, 600)
}

function fadeAndHide() {
  var scrollTop = win.scrollTop()
    , hideTop = win.height() / 2 - 100
    , opacity = (hideTop - scrollTop) / hideTop

  hoverEl.css({
    opacity: opacity
  })
}


}())
