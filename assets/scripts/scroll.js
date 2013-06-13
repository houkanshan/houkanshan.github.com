(function($, exports){

function sortedIndex(array, value) {
  var low = 0, high = array.length;
  while (low < high) {
    var mid = (low + high) >>> 1;
    array[mid] < value ? low = mid + 1 : high = mid;
  }
  return low;
}

var defaultOptions = {
  scrollTarget: $(window),
  moveTarget: $('body'),
  breakElems: $(),
  slowDownLength: 20,
  stopLength: 50
}

function Scroll(options) {
  options = $.extend({}, defaultOptions, options || {})

  this.slowDownLength = options.slowDownLength
  this.slowDownSlope = 1 / this.slowDownLength
  this.stopLength = options.stopLength
  this.scrollTarget = options.scrollTarget
  this.moveTarget = options.moveTarget

  this.initBreakElements()
  this.addBreakElements(options.breakElems)

  this.originMarginTop = + this.moveTarget.css('margin-top').split('px')[0]
  this.marginTop = this.originMarginTop
  this.elemFullMargin = 
    this.getElemMarginTop(this.slowDownLength + this.stopLength)
  
  this.scrollTarget
    .on('scroll', $.proxy(this.onScroll, this))

  console.log(this.breakPoints)
  this.onScroll()
}

Scroll.prototype = {
  constructor: Scroll.prototype.constructor,

  addBreakElements: function(els){
    var self = this
    this.breakElems = this.breakElems.add(els).filter(_filter)

    this.breakPoints = this.breakPoints.concat(
      this.breakElems.map(function(i, el){
        return $(el).offset().top
      }).get())

    function _filter(i, el) {
      return $(el).offset().top > self.slowDownLength
    }
  },

  setBreakElements:function(el) {
    this.initBreakElements()
    this.addBreakElements(el)
  },

  initBreakElements: function() {
    this.breakElems = $()
    this.breakPoints = []
  },

  onScroll: function() {
    var scrollTop = this.scrollTarget.scrollTop()
      , reachingIndex = this.getReachingPointIndex(scrollTop)
      , marginTop

    if(this.breakElems.length === 0) {return}

    this.marginTop = this.originMarginTop 
      + this.getMarginTop(scrollTop, reachingIndex)

    this.moveTarget.css('margin-top', this.marginTop)
  },

  getMarginTop: function(scrollTop, reachingIndex) {
    var reachingElem = this.breakElems.eq(reachingIndex)
      , beforeMargin = this.elemFullMargin * reachingIndex
      , elemTop = reachingElem.offset().top 
      , distance = elemTop - scrollTop 
          - (this.marginTop - beforeMargin)

    console.log(distance)
    return beforeMargin + this.getElemMarginTop(distance)
  },

  getElemMarginTop: function(distance){
    debugger
    var stopDistance
    if (distance < 0) {
      return 0
    }
    if(distance <= this.slowDownLength) {
      return distance * this.slowDownSlope * distance
    }
    stopDistance = distance - this.slowDownLength
    if(stopDistance <= this.stopLength) {
      return this.slowDownLength + stopDistance
    }

    throw new Error('er!')
  },

  getReachingPointIndex: function(scrollTop) {
    var i, point
      , marginTop = this.marginTop
      , slowDownLength = this.slowDownLength

    //for(i = 0; i < this.breakPoints.length; i++) {
      //point = this.breakPoints[i] + marginTop
      //if (scrollTop < point && scrollTop > point - slowDownLength) {
        //console.log('has element: ', this.breakElems[i].innerText)
        //return i
      //}
    //}
    return sortedIndex(this.breakPoints, scrollTop - marginTop)
  }
}


return exports.Scroll = Scroll

}($, window))
