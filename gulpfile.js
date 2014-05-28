var gulp = require('gulp')
var gutil = require('gulp-util')
var fetchLocals = require('./lib/fetch-locals')

var stylus = require('gulp-stylus')
gulp.task('css', function () {
  gulp.src(['src/css/index.styl'])
    .pipe(stylus({ set: ['compress'] })
      .on('error', gutil.log))
    .pipe(gulp.dest('./css/'))
})

var jade = require('gulp-jade')

gulp.task('html', function() {
  gulp.src('src/template/**/*.jade')
    .pipe(
      jade({
      locals: fetchLocals({
        cwd: 'src/'
      , blob: ['template/**/_data.json', 'posts/**/_data.json']
      })
      }).on('error', gutil.log)
    )
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
