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

_.keys = _.keys || function(obj){
  var keys = [];
  for (var key in obj) {
     keys[keys.length] = key
  }
  return keys
}

_.sortedIndex = _.sortedIndex || function(array, value) {
  var low = 0, high = array.length
  while (low < high) {
    var mid = (low + high) >>> 1
    array[mid] < value ? low = mid + 1 : high = mid
  }
  return low
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


var defaultOptions = {
  scrollTarget: $(window),
  moveTarget: $('body'),
  points: [] // [{offset, velocityRadio}]
}

function Parallax(options) {
  options = _.defaults(options, defaultOptions)

  this.scrollTarget = options.scrollTarget
  this.moveTarget = options.moveTarget
  this.points = 
    this.sortArray(options.points)

  this.initData()

  this.initLayer()

  this.scrollTarget.on('scroll.parallax', 
    _.throttle($.proxy(this.onScroll, this), 50))
  this.onScroll()
}

Parallax.prototype = {
  constructor: Parallax.prototype.constructor,

  countThrough: function(point, nextPoint) {
    var distance = nextPoint.offset - point.offset
      , radio = point.velocityRadio

    if (radio === 0) {
      return point.delay
    }

    return distance / radio + point.delay
  },
  initLayer: function() {
    var lastPoint = this.points[this.points.length - 2]
      , sumTop = lastPoint.newOffset - lastPoint.offset
      , sumHeight = sumTop + this.moveTarget.outerHeight()

    this.layer = $('<div>').addClass('move-container').height(sumHeight)
    this.moveTarget.replaceWith(this.layer)
    this.layer.append(this.moveTarget)
    this.moveTarget
      .css('position', 'fixed')

    this.layer.on('update', this.updateLayer)
  },
  updateLayer: function() {
    var lastPoint = this.points[this.points.length - 2]
      , sumTop = lastPoint.newOffset - lastPoint.offset
      , sumHeight = sumTop + this.moveTarget.outerHeight()

    this.layer.height(sumHeight)
  },
  
  initData: function() {
    var array = this.points // sorted
      , emptyPoint = {
          offset: 0, velocityRadio: 1, 
          newOffset: 0, throughLength: array[0].offset}
      , endPoint = {offset: Number.POSITIVE_INFINITY, velocityRadio: 1}
      , i, ilen, point, lastPoint, nextPoint

    // add start/end point
    array.push(endPoint)
    if(array[0].offset !== 0) {
      array.unshift(emptyPoint)
    }

    // comput offsets after add margin
    for(i = 1, ilen = array.length; i < ilen; i++) {
      point = array[i]
      lastPoint = array[i - 1] || emptyPoint
      nextPoint = array[i + 1] || endPoint

      // check delay for v == 0
      point.delay = point.delay || 0
      if (point.velocityRadio === 0 && !point.delay) {
        point.delay = 100
      }

      point.newOffset = lastPoint.newOffset + lastPoint.throughLength
      point.throughLength = this.countThrough(point, nextPoint)

      if (point.delay > 0 && i+1 < ilen) {
        array.splice(i+1, 0, {
          offset: point.offset,
          velocityRadio: 1
        })
        ilen ++
      }

    }
    console.log(array)

    // init offsetTops array
    this.offsetTops = []
    for(var i = 0, ilen = array.length; i < ilen; i++) {
      this.offsetTops[i] = array[i].newOffset
    }
    // set origin margin-top
    this.originTop = 
      this.moveTarget.css('top').split('px')[0] | 0
  },

  sortArray: function(points) {
    return points.sort(function(left, right){
      return left.offset - right.offset
    })
  },

  countTop: function(distance, radio) {
    return distance * (1 - radio)
  },

  onScroll: function() {
    var scrollTop = this.scrollTarget.scrollTop()
      , curIndex = this.getCurIndex(scrollTop) - 1
      , curPoint = this.points[curIndex]
      , newTop
    
    if(curIndex === -1) {
      newTop = this.originTop - scrollTop
    } else {
      newTop = this.originTop 
        + curPoint.newOffset - curPoint.offset
        + this.countTop(
            scrollTop - curPoint.newOffset,
            curPoint.velocityRadio
          ) - scrollTop
    }
    this.moveTarget.css('top', newTop)
  },

  getCurIndex: function(scrollTop) {
    return _.sortedIndex(this.offsetTops, scrollTop)
  },

  destroy: function() {
    this.scrollTarget.off('scroll.parallax')
    this.layer.replaceWith(this.moveTarget)
    this.moveTarget.css('top', this.originTop)
  }
}

return exports.Parallax = Parallax

}($, window))
