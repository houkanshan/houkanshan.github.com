var gulp = require('gulp')
var gutil = require('gulp-util')
var _ = require('lodash')

var fetchLocals = require('./lib/fetch-locals')
var postsData = require('./lib/posts-data')

var globalLocals = fetchLocals({
      cwd: 'src/'
    , blob: ['template/**/data.json', 'posts/**/data.json']
    })
  , jadeBasedir = 'src/template/'

var stylus = require('gulp-stylus')
gulp.task('stylus', function () {
  gulp.src(['src/styl/index.styl'])
    .pipe(stylus({ set: ['compress'] })
      .on('error', gutil.log))
    .pipe(gulp.dest('./css/'))
})

// TODO: config
var paths = [
  {
    blob: 'src/posts/**/*.md'
  , dataPath: 'src/posts/data.json'
  , dest: 'posts/'
  , defaultData: {
      layout: 'src/template/posts/_post.jade'
    }
  }
]

var jsonfile = require('jsonfile')
gulp.task('posts-json', function() {
  paths.forEach(function(path) {
    var origData
      , newData

    try {
      origData = jsonfile.readFileSync(path.dataPath)
    } catch(e) {
      origData = {}
    }
    newData = postsData({
      postsPattern: path.blob
    , defaultData: path.defaultData
    })
    _.extend(newData, origData)
    jsonfile.writeFileSync(path.dataPath, newData)
  })
})

var markdown = require('gulp-markdown')
var map = require('map-stream')
var rename = require('gulp-rename')
gulp.task('posts', function() {
  paths.forEach(function(path) {
    var data = jsonfile.readFileSync(path.dataPath)
    data.forEach(function(post) {
      // extract render layout
      console.log(post.file)
      gulp.src(post.file)
        .pipe(markdown().on('error', gutil.log))
        .pipe(map(function(postHtml, cb) {
          if (!postHtml.contents) {
            return
          }
          postHtml = postHtml.contents.toString()
          gulp.src(post.layout)
            .pipe(jade({
                locals: _.extend({}, globalLocals, { 'yield': postHtml })
              , basedir: jadeBasedir
              }).on('error', gutil.log))
            .pipe(rename('index.html'))
            .pipe(gulp.dest(post.dest))
        }))
    })
  })
})

var jade = require('gulp-jade')
gulp.task('jade', function() {
  gulp.src([
      'src/template/**/*.jade'
    , '!src/template/**/_*'
    , '!src/template/_**/*'
    ])
    .pipe(jade({
      locals: globalLocals
    , basedir: jadeBasedir
    }).on('error', gutil.log))
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

var clean = require('gulp-clean')
gulp.task('clean', function() {
  gulp.src([
    '*.html'
  , 'posts/*.html'
  , 'about/*.html'
  , 'src/posts/data.json'
  ])
    .pipe(clean())
})

gulp.task('css', ['stylus'])
gulp.task('json', ['posts-json'])
gulp.task('html', ['json', 'posts', 'jade'])
gulp.task('build', ['css', 'html', 'js'])
gulp.task('server', ['build', 'watch', 'flo', 'static'])
gulp.task('default', ['server'])
