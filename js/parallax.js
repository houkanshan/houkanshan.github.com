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

var defaultOptions = {
  scrollTarget: $(window),
  moveTarget: $('body'),
  points: [] // [{offsetTop, velocityRadio}]
}

function Parallax(options) {
  options = _.defaults(options, defaultOptions)

  this.scrollTarget = options.scrollTarget
  this.moveTarget = options.moveTarget
  this.points = 
    this.sortArray(options.points)

  this.initData()

  this.scrollTarget.on('scroll', $.proxy(this.onScroll, this))
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
    this.originMarginTop = 
      this.moveTarget.css('margin-top').split('px')[0] | 0
  },

  sortArray: function(points) {
    return points.sort(function(left, right){
      return left.offsetTop - right.offsetTop
    })
  },

  countMargin: function(distance, radio) {
    return distance * (1 - radio)
  },

  onScroll: function() {
    var scrollTop = this.scrollTarget.scrollTop()
      , curIndex = this.getCurIndex(scrollTop) - 1
      , curPoint = this.points[curIndex]
      , marginTop
    
    console.log('now point of:', curPoint && curPoint.offset)
    if(curIndex === -1) {
      marginTop = this.originMarginTop
    } else {
      marginTop = this.originMarginTop 
        + curPoint.newOffset - curPoint.offset
        + this.countMargin(
            scrollTop - curPoint.newOffset,
            curPoint.velocityRadio
          )
    }
    console.log('set margin-top', marginTop)
    this.moveTarget.css('margin-top', marginTop)
  },

  getCurIndex: function(scrollTop) {
    return _.sortedIndex(this.offsetTops, scrollTop)
  },

  destroy: function() {
    this.moveTarget('margin-top', 0)
    // TODO: move to origin
  }
}


return exports.Parallax = Parallax

}($, window))
