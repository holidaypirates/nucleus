/* gulpfile.js -- Builds the assets for the style guide documentation pages
 *
 * Copyright (C) 2016 Michael Seibt
 *
 * With contributions from: -
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

/* global process */
/* global __dirname */

'use strict';

/*
|--------------------------------------------------------------------------
| DEPENDENCIES
|--------------------------------------------------------------------------
*/

var gulp         = require('gulp');
var sass         = require('gulp-sass');             // Transpiles SASS to CSS
var pug          = require('gulp-pug');              // Thin layer for Pug
var rename       = require("gulp-rename");           // Renames a set of files
var iconfont     = require('gulp-iconfont');         // Generates an icon-font
var consolidate  = require('gulp-consolidate');      // Passes a file to a template engine
var livereload   = require('gulp-livereload');       // Reloads the browser window after changes
var gutil        = require('gulp-util');             // Utility toolbox
var hashFiles    = require('hash-files');            // Hashes a set of files
var plumber      = require('gulp-plumber');          // Catches gulp errors and prevents exit
var imagemin     = require('gulp-imagemin');         // Optimizes images
var merge        = require('merge-stream');          // Merges two streams
var spritesmith  = require('gulp.spritesmith');      // Generates a spritesheet
var buffer       = require('vinyl-buffer');          // Creates a vinyl file buffer
var autoprefixer = require('gulp-autoprefixer');     // Adds prefixes to css properties if needed
var del          = require('del');                   // Removes a set of files
var webpack      = require('webpack');               // Used for Javascript packing

/*
|--------------------------------------------------------------------------
| CONFIGURATION
|--------------------------------------------------------------------------
*/

var config = {
  // Build config version
  version: 1,

  // Root folder for source files
  sources: 'src',

  // Root folder for target
  target: 'build',

  // Flag to indicate a production-ready build
  production: process.argv.indexOf('--production') !== -1,

  // Warn for these logging leftovers in the source
  logwarn: [
    'console.log', 'console.warn', 'console.info', 'debugger;'
  ]
};

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

  /**
   * Hashes a set of files with a given "tolerance"
   */
  var makeHash = function (files, tolerance) {
    tolerance = tolerance || 5;
    return hashFiles.sync({files: files}).substring(0, tolerance);
  };

  var webpack_error_handler = function (err, stats, callback) {

    if(err) throw new gutil.PluginError('webpack', err);
    if(config.production){
      gutil.log('[webpack]', stats.toString({
          // output options
          source: false
      }));
    } else {
      var jsonStats = stats.toJson({
        errorDetails: false
      });
      if(jsonStats.errors.length > 0){
          gutil.log(gutil.colors.red('ERROR\n' + jsonStats.errors.join('\n')));
      }
      if(jsonStats.warnings.length > 0){
          gutil.log(gutil.colors.yellow('WARNING\n' + jsonStats.warnings.join('\n')));
      }
    }

    callback();
  };

/*
|--------------------------------------------------------------------------
| TASK GROUPS
|--------------------------------------------------------------------------
*/

gulp.task('default',  ['dev']);
gulp.task('dist',     ['build', 'copy']);
gulp.task('dev',      ['build', 'copy', 'watch']);
gulp.task('copy',     ['copy:images', 'copy:favicon']);
gulp.task('build',    ['build:views', 'build:styles', 'build:scripts']);
gulp.task('watch',    ['watch:views', 'watch:styles', 'livereload']);

/*
|--------------------------------------------------------------------------
| VIEWS
|--------------------------------------------------------------------------
*/

gulp.task('build:views', [], function () {
  return gulp
    .src([
      config.sources + '/views/*.pug',
      config.sources + '/views/doc/*.pug'
    ])
    .pipe(plumber())
    .pipe(pug({
      // ...
    }))
    .pipe(plumber.stop())
    .pipe(gulp.dest(config.target))
    .pipe(livereload());
});

/*
|--------------------------------------------------------------------------
| SCRIPTS
|--------------------------------------------------------------------------
*/

  gulp.task('build:scripts', ['clean:scripts'], function (callback) {
    webpack({
     // watch: !config.production, TODO!
      context: __dirname + '/' + config.sources + '/scripts',
      entry: {
        'app': './app',
      },
      output: {
        path: config.target + '/scripts/',
        publicPath: '/scripts/',
        filename: '[name].js',
        chunkFilename: '[chunkhash].bundle.js'
      },
      module: {
        loaders: [
          { test: /\.html$/, loader: "tpl-loader" }
        ]
      },
      amd: {jQuery: true },
      resolve: {
        fallback: [
          __dirname + '/' + config.sources + '/scripts'
        ]
      },
      plugins: [
        new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
          'window.jQuery': 'jquery',
        }),
      ].concat(config.production ? [new webpack.optimize.UglifyJsPlugin({ output: {comments: false} })] : [])
    }, function(e,s) { webpack_error_handler(e,s,callback); });
  });


/*
|--------------------------------------------------------------------------
| STYLES
|--------------------------------------------------------------------------
*/

gulp.task('build:styles', ['build:sprites', 'build:icons'], function () {
  return gulp
    .src(config.sources + '/styles/app.scss')
    .pipe(plumber())
    .pipe(sass({
      unixNewlines: true,
      precision: 6,
      includePaths: [
        __dirname + '/../node_modules',
        __dirname + '/../assets/styles'
      ],
      outputStyle: config.production ? 'compressed' : 'nested'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(plumber.stop())
    .pipe(gulp.dest(config.target + '/styles'))
    .pipe(livereload());
});

/*
|--------------------------------------------------------------------------
| ICONS
|--------------------------------------------------------------------------
*/

gulp.task('build:icons', [], function () {
  return gulp.src(config.sources + '/icons/*.svg')
    .pipe(iconfont({
      fontName: 'icons',
      prependUnicode: true,
      formats: ['ttf', 'eot', 'woff'],
    }))
    .on('glyphs', function( glyphs ) {
      gulp.src(config.sources + '/styles/templates/icons.lodash.css')
          .pipe(consolidate('lodash', {
            glyphs: glyphs,
            fontName: 'icons',
            fontPath: '../fonts/',
            className: 'ico'
          }))
          .pipe(rename({ basename: 'icons' }))
          .pipe(gulp.dest(config.sources + '/styles/nuclides/'));
      })
    .pipe(gulp.dest(config.target + '/fonts/'));
});

/*
|--------------------------------------------------------------------------
| SPRITES
|--------------------------------------------------------------------------
*/

gulp.task('build:sprites', [], function () {
  // Hash the content of the sprite elements folders to bust the cache.
  var hash = makeHash([
    config.sources + '/sprites/*.png'
  ]);

  // Create the data for our spritesheet
  var sprite = gulp
    .src(config.sources + '/sprites/*.png')
    .pipe(plumber())
    .pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: 'sprites.scss',
      imgPath: '../images/sprite.png?v='+hash+'--'+config.version,
      retinaSrcFilter: config.sources + '/sprites/*@2x.png',
      retinaImgName: 'sprite@2x.png',
      padding: 0,
      retinaImgPath: '../images/sprite@2x.png?v='+hash+'--'+config.version,
      cssTemplate: config.sources + '/styles/templates/sprites.handlebars'
    }));


  // Pipe image stream through image optimizer and onto disk
  var imgStream = sprite.img
      .pipe(buffer())
      .pipe(imagemin())
      .pipe(gulp.dest(config.target + '/images/'));

  // Write SASS to disc
  var cssStream = sprite.css.pipe(gulp.dest(config.sources + '/styles/nuclides/'));

  // Return a merged stream to handle all `end` events
  return merge(imgStream, cssStream);
});

/*
|--------------------------------------------------------------------------
| STATIC IMAGES
|--------------------------------------------------------------------------
*/

gulp.task('copy:images', [], function () {
  return gulp
    .src([
      config.sources + '/images/*.png',
      config.sources + '/images/*.jpg'
    ])
    .pipe(buffer())
    .pipe(imagemin())
    .pipe(gulp.dest(config.target + '/images'));
});

gulp.task('copy:favicon', [], function () {
  return gulp
    .src(config.sources + '/favicon.ico')
    .pipe(gulp.dest(config.target));
});

/*
|--------------------------------------------------------------------------
| LINTING
|--------------------------------------------------------------------------
*/

gulp.task('lint:styles', [], function () {});
gulp.task('lint:scripts', [], function () {});

/*
|--------------------------------------------------------------------------
| CLEANING
|--------------------------------------------------------------------------
*/

gulp.task('clean:scripts', [], function () {
  return del(config.target + '/scripts/*.js');
});

/*
|--------------------------------------------------------------------------
| WATCHING
|--------------------------------------------------------------------------
*/

  gulp.task('livereload', [], function () {
    gutil.log(gutil.colors.bgGreen.white('Starting LiveReload ...'));
    gutil.log(gutil.colors.green('When developing locally make sure ',
      '"Allow access to file URLs"'));
     gutil.log(gutil.colors.green('is ticked for LiveReload in Chrome\'s' +
     ' Extensions settings'));
    livereload.listen();
  });

  gulp.task('watch:styles', [], function () {
    return gulp
      .watch([
        config.sources + '/styles/*.scss',
        config.sources + '/styles/**/*.scss',
        config.sources + '/sprites/*.png',
        config.sources + '/icons/*.svg',
        '../styleguide/assets/**/*.scss'
      ], ['build:styles', 'lint:styles'])
      .on('change', watcher_log_callback);
  });

  gulp.task('watch:views', function () {
     gulp
      .watch([
        config.sources + '/views/*.pug',
        config.sources + '/views/**/*.pug',
      ], ['build:views'])
      .on('change', watcher_log_callback);
  });

  function watcher_log_callback (event) {
    var relative_path = event.path.replace(__dirname, '');
    gutil.log('file ' + gutil.colors.magenta(relative_path) + ' ' + event.type);
  }
