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
  gulp.src(['src/styl/**/*.styl', '!src/styl/_*/**/*', '!src/styl/**/_*'])
    .pipe(stylus({
        //set: ['compress'],
        include: ['bower_components'],
      })
      .on('error', gutil.log))
    .pipe(gulp.dest('./css/'))
})

// TODO: config
var paths = [
  {
    blob: ['src/posts/**/*.md', '!src/posts/**/*.draft.md']
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
var hljs = require('highlight.js')
gulp.task('posts', ['posts-json'], function() {
  paths.forEach(function(path) {
    var posts = jsonfile.readFileSync(path.dataPath)
    posts.forEach(function(post) {
      // extract render layout
      console.log(post.file)
      gulp.src(post.file)
        .pipe(markdown({
          highlight: highlight
        , smartypants: true
        , gfm: true
        , breaks: false
        }).on('error', gutil.log))
        .pipe(map(function(postHtml, cb) {
          if (!postHtml.contents) {
            return
          }
          postHtml = postHtml.contents.toString()
          gulp.src(post.layout)
            .pipe(jade({
                locals: _.extend({
                  'yield': postHtml
                , current: {
                    post: post
                  , index: posts.indexOf(post)
                  }
                , helpers: require('./lib/helpers')
                }, globalLocals)
              , basedir: jadeBasedir
              }).on('error', gutil.log))
            .pipe(rename('index.html'))
            .pipe(gulp.dest(post.dest))
        }))
    })
  })

  function highlight(code, lang, cb) {
    if(lang) {
      cb(null, hljs.highlight(lang, code).value)
    }
    cb(null, hljs.highlightAuto(code).value)
  }
})

var jade = require('gulp-jade')
var path = require('path')
gulp.task('jade', ['posts'], function() {
  gulp.src([
      'src/template/**/*.jade'
    , '!src/template/_*/**/*'
    , '!src/template/**/_*'
    ])
    .pipe(jade({
      locals: _.extend({
        helpers: require('./lib/helpers')
      }, globalLocals)
    , basedir: jadeBasedir
    }).on('error', gutil.log))
    .pipe(rename(detectExt))
    .pipe(gulp.dest('./'))

  function detectExt(pathObj) {
    var secondExtname = path.extname(pathObj.basename)
    if (secondExtname.length) {
      pathObj.basename = path.basename(pathObj.basename, secondExtname)
      pathObj.extname = secondExtname
    }
  }
})

var webpack = require('webpack')
var gs = require('glob-stream') // for it support multi patterns
var path = require('path')
gulp.task('js', function(callback) {
  gs.create(['src/js/**/*.js', '!src/js/_*/**/*', '!src/js/**/_*'])
    .pipe(map(function(file, cb) {
      var filename = file.path
      var output = path.relative('src', filename)
      webpack({
          entry: filename,
          output: {
            path: path.dirname(output),
            filename: path.basename(output),
          },
          resolve: {
            root: './js/',
            modulesDirectories: ["node_modules"],

          }
        }, function(err, stats) {
            if(err) throw new gutil.PluginError("webpack", err);
            gutil.log("[webpack]", stats.toString({}));
        })
    }))

  // Support old js
  gulp.src('src/js/_nopack/**/*.js')
    .pipe(gulp.dest('js/'))
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
  gulp.watch('src/template/**/*.jade', ['html'])
  gulp.watch('src/posts/**/*', ['html'])
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
gulp.task('clean-data', function() {
  gulp.src([
  , 'src/posts/data.json'
  ])
    .pipe(clean())

})
gulp.task('clean', function() {
  gulp.src([
    '*.html'
  , 'js'
  , 'css'
  , 'posts/*.html'
  , 'about/*.html'
  ])
    .pipe(clean())
})

gulp.task('css', ['stylus'])
gulp.task('json', ['posts-json'])
gulp.task('html', ['jade'])
gulp.task('build', ['css', 'html', 'js'])
gulp.task('server', ['build', 'watch', 'flo', 'static'])
gulp.task('post-server', ['html', 'watch', 'static'])
gulp.task('default', ['server'])
