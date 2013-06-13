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

var defaultOptions = {
  elems: $(''),
  slowDownLenght: 100,
  slowDownRadio: 0.2,
  stopDelay: 500
}

function TextSorption(options) {
  this.options = _.defaults(options, defaultOptions)
  if(!this.options.elems.length) {return}
  this.setParallax()
}

TextSorption.prototype = {
  constructor: TextSorption.prototype.constructor,

  getPoints: function() {
    var elems = this.options.elems
      , points = []
      , self = this

    elems.each(function(i, el){
      el = $(el)
      var offsetTop = el.offset().top
        , slowDownOffset = offsetTop - self.options.slowDownLenght

      if(self.options.slowDown && slowDownOffset > 0) {
        if(i > 0 && slowDownOffset < points[i - 1].offset) {
          slowDownOffset = points[i - 1].offset
        }
        points.push({
          offset: slowDownOffset,
          velocityRadio: self.options.slowDownRadio
        })
      }
      points.push({
        offset: offsetTop,
        velocityRadio: 0,
        delay: self.options.stopDelay
      })
    })

    return points
  },

  setParallax: function() {
    this.points = this.getPoints()

    this.parallax = new Parallax({
      moveTarget: $('.wrapper'),
      points: this.points
    })
  },

  update: function() {
    this.parallax.updateLayer()
  },

  destroy: function() {
    this.parallax.destroy()
  }
}

exports.TextSorption = TextSorption

}($, window))
