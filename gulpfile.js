var gulp = require('gulp')
var gutil = require('gulp-util')
var path = require('path')
var fs = require('fs')
var through = require('through2')
var map = require('map-stream')

var stylus = require('gulp-stylus')
gulp.task('css', function () {
  gulp.src(['src/css/index.styl'])
    .pipe(stylus({ set: ['compress'] })
      .on('error', gutil.log))
    .pipe(gulp.dest('./css/'))
})

var jade = require('gulp-jade')
var jadeWrap = function(opts) {
  opts = opts || {}
  return map(function(file, cb) {
    var dir = path.dirname(file.path)
      , dataFileName = dir + '/data.json'
      , local = {}

    try {
      var jsonfile = fs.readFileSync(dataFileName)
      local = JSON.parse(jsonfile.contents.toJSON())
    } catch(e) {
    }

    opts.local = local
    var stream = jade(opts)
    stream.on('readable', function() {
      var data = stream.read()
      if (!data) { return }
      cb(null, data)
    })
    stream.write(file)
  })
}

gulp.task('html', function() {
  gulp.src('src/template/**/*.jade')
    .pipe(jadeWrap().on('error', gutil.log))
    .pipe(map(function(a, cv) {
      console.log(a)
      cv(null, a)
    }))
    .pipe(gulp.dest('./'))
})

gulp.task('js', function() {
  gulp.src('src/js/**/*.js')
    .pipe(gulp.dest('./js/'))
})

var HTTPServer = require('http-server')
gulp.task('static', function() {
  HTTPServer.createServer({
    root: './'
  }).listen('8080', '0.0.0.0')
})

var flo = require('fb-flo')
var fs = require('fs')
gulp.task('watch', function(done) {
  server = flo('./', {
    port: 8888
  , host: 'localhost'
  , verbose: 1
  , glob: [
      'js/**/*.js'
    , 'css/**/*.css'
    , '*.html'
    , '!src**/*'
    ]
  }, resolver)
  .once('ready', done)

  function resolver(filepath, callback) {
    callback({
      resourceURL: filepath
    , contents: fs.readFileSync(filepath).toString()
    })
  }
})

gulp.task('default', ['css', 'html', 'js'])
gulp.task('server', ['default', 'watch', 'static'])
