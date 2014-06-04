// find Im doing sth similar to https://github.com/markdalgleish/stellar.js
// so give up it
// ~~~

(function($, exports){

exports._ = exports._ || {}

_.defaults = _.defaults || function(obj) {
  var defaultObjs = [].slice.call(arguments, 1)
  for(var i = 0, ilen = defaultObjs.length; i < ilen; i++){
    var source = defaultObjs[i]
    if (source) {
      for (var prop in source) {
        if (obj[prop] == null) obj[prop] = source[prop]
      }
    }
  }
  return obj
}

_.throttle = _.throttle || function(func, wait) {
  var context, args, timeout, result
  var previous = 0
  var later = function() {
    previous = new Date
    timeout = null
    result = func.apply(context, args)
  }
  return function() {
    var now = new Date
    var remaining = wait - (now - previous)
    context = this
    args = arguments
    if (remaining <= 0) {
      clearTimeout(timeout)
      timeout = null
      previous = now
      result = func.apply(context, args)
    } else if (!timeout) {
      timeout = setTimeout(later, remaining)
    }
    return result
  }
}

var win = $(window)
  , body = $('body')

// module body
var defaultOptions = {
  scrollTarget: win,
  elems: $()
}


function Parallax(options) {
  options = _.defaults(options, defaultOptions)
  this.options = options

  if (options.elem) {
    this.setElem(elem)
  }
  if (options.scrollHandler) {
    this.setScrollHandler(options.scrollHandler)
  }
  if (options.animateScript) {
  }

  win.onScroll(
    _.throttle($.proxy(this.onScroll, this)))
  this.onScroll()
}

Parallax.prototype = {
  constructor: Parallax.prototype.constructor,
  setElem: function(elem) {
    if(!this.moveTarget) {
      this.moveTarget = elem
    }
    // TODO
    this.elem = elem
  },
  direct: function(script) {
  },
  statusChange: function(curStatus) {
    var lastStatus = this.status
      , lastScrollTop = lastStatus.scrollTop
      , lastArea = lastStatus.area
      , lastStage = lastStatus.stage
      , curScrollTop = curStatus.scrollTop
      , clientHeight = win.height()
      , elemOffset = curStatus.elemOffset
      , elemTop = elemOffset.top
      , elemBottom = elemTop + this.elem.height()
      , curArea, curStage

    if (curScrollTop > elemBottom) {
      curArea = 'above'
    }
    else if (curScrollTop > elemTop) {
    }
    else {
      curArea = 'below'
    }
  },
  setScrollHandler: function(callback) {
    var self = this

    if (this.scrollHandler) {
      win.off(this.scrollHandler)
    }
    this.scrollHandler = callback

    this.onScroll = function(e) {
      var status
        , eventNamePrefix = 'scroll'
        , eventNameSpace = 'parallax'
        , elemOffset = self.elem.offset()
        , elemHeight = elem.outerHeight()
        , elemBottom = elemTop + elemHeight

      status = {
        scrollTop: e.scrollTop
      , elemOffset: elemOffset
      }
      console.log(e.scrollTop, 'should be scrolltop')

      status = self.statusChange(status)

      callback(status, e)
      self.status = status
    }
  },
  clean: function() {
  }
}

return exports.Parallax = Parallax

}($, window))
