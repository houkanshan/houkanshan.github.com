var gulp = require('gulp')
var gutil = require('gulp-util')
var fetchLocals = require('./lib/fetch-locals')

var stylus = require('gulp-stylus')
gulp.task('stylus', function () {
  gulp.src(['src/styl/index.styl'])
    .pipe(stylus({ set: ['compress'] })
      .on('error', gutil.log))
    .pipe(gulp.dest('./css/'))
})


var markdown = require('gulp-markdown')
var jade = require('gulp-jade')

function jadeOpts() {
  return {
    locals: fetchLocals({
      cwd: 'src/'
    , blob: ['template/**/data.json', 'posts/**/data.json']
    })
  }
}

gulp.task('markdown', function() {
  gulp.src('src/posts/**/*.md')
    .pipe(markdown().on('error', gutil.log))
    .pipe(gulp.dest('src/template/_posts/'))
})

gulp.task('jade', function() {
  gulp.src('src/template/**/*.jade')
    .pipe(jade(jadeOpts()).on('error', gutil.log))
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

gulp.task('watch', function() {
  gulp.watch('src/js/**/*.js', ['js'])
  gulp.watch('src/styl/**/*.styl', ['css'])
  gulp.watch('src/**/*.jade', ['html'])
})

var flo = require('fb-flo')
var fs = require('fs')
var path = require('path')
gulp.task('flo', function(done) {
  server = flo('./', {
    port: 8888
  , host: 'localhost'
  , verbose: false
  , glob: [
      'js/**/*.js'
    , 'css/**/*.css'
    , '**/*.html'
    , '!src/**/*'
    ]
  }, resolver)
  .once('ready', done)

  function resolver(filepath, callback) {
    var needReload
    if (path.extname(filepath) === '.html') {
      needReload = true
    }
    callback({
      resourceURL: filepath
    , contents: fs.readFileSync(filepath).toString()
    , reload: needReload
    })
  }
})

gulp.task('css', ['stylus'])
gulp.task('html', ['markdown', 'jade'])
gulp.task('build', ['css', 'html', 'js'])
gulp.task('server', ['build', 'watch', 'flo', 'static'])
gulp.task('default', ['server'])
