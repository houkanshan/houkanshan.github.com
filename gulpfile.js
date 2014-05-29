var gulp = require('gulp')
var gutil = require('gulp-util')
var _ = require('lodash')

var fetchLocals = require('./lib/fetch-locals')
var postsData = require('./lib/posts-data')

var stylus = require('gulp-stylus')
gulp.task('stylus', function () {
  gulp.src(['src/styl/index.styl'])
    .pipe(stylus({ set: ['compress'] })
      .on('error', gutil.log))
    .pipe(gulp.dest('./css/'))
})



var jsonfile = require('jsonfile')
gulp.task('posts-json', function() {
  // TODO: config
  var filename = 'src/posts/data.json'
  // TODO: exception
  var origData
    , newData

  try {
    origData = jsonfile.readFileSync(filename)
  } catch(e) {
    origData = {}
  }
  newData = postsData()
  newData = _.extend(newData, origData)
  jsonfile.writeFileSync(filename, newData)
})

var markdown = require('gulp-markdown')
gulp.task('markdown', function() {
  gulp.src('src/posts/**/*.md')
    .pipe(markdown().on('error', gutil.log))
    .pipe(gulp.dest('src/template/_posts/'))
})

function jadeOpts() {
  return {
    locals: fetchLocals({
      cwd: 'src/'
    , blob: ['template/**/data.json', 'posts/**/data.json']
    })
  }
}
var jade = require('gulp-jade')
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
gulp.task('json', ['posts-json'])
gulp.task('html', ['json', 'markdown', 'jade'])
gulp.task('build', ['css', 'html', 'js'])
gulp.task('server', ['build', 'watch', 'flo', 'static'])
gulp.task('default', ['server'])
