var gulp = require('gulp');
var path = require('path');
var merge = require('merge2');
var changeCase = require('change-case');
var pkg = require('./package.json');

var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');
var typescript = require('gulp-typescript');
var rename = require('gulp-rename');
var header = require('gulp-header');
var uglify = require('gulp-uglify');
var foreach = require('gulp-foreach');
var minifyCss = require('gulp-minify-css');

var headerTemplate = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

gulp.task('default', ['less', 'debug-build', 'watch']);
gulp.task('release', ['less', 'ts-release']);

gulp.task('debug-build', ['less', 'ts-debug']);

gulp.task('less', function() {
  gulp.src('./src/**/*.less')
    .pipe(foreach(function(stream, file) {
      return stream
        .pipe(sourcemaps.init())
        .pipe(less({
          paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(rename(function(rPath) {
          rPath.basename = changeCase.paramCase(rPath.basename); 
        }))
        .pipe(gulp.dest('./dist'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./docs/dist'));
    }));

  return gulp.src('./src/**/*.less')
    .pipe(foreach(function(stream, file) {
      return stream
        .pipe(sourcemaps.init())
        .pipe(less({
          paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(minifyCss())
        .pipe(rename(function(rPath) {
          rPath.basename = changeCase.paramCase(rPath.basename) + '.min'; 
        }))
        .pipe(gulp.dest('./dist'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./docs/dist'));
    }));
});

gulp.task('ts-debug', function() {
  var tsResult = gulp
    .src('src/**/*.ts')
    .pipe(sourcemaps.init()) // for sourcemaps only
    .pipe(typescript({
      noImplicitAny: true,
      out: 'ab-grid.js'
    }));

  return tsResult.js
    .pipe(sourcemaps.write()) // for sourcemaps only
    .pipe(rename('ab-grid.js'))
    .pipe(gulp.dest('./docs/dist'));

});

gulp.task('ts-release', function() {
  var tsResult = gulp
    .src('src/**/*.ts')
    .pipe(typescript({
      noImplicitAny: true,
      declarationFiles: true,
      out: 'ab-grid.js'
    }));

  return merge([
    tsResult.dts.pipe(gulp.dest('dist')),
    tsResult.js
      .pipe(rename('ab-grid.js'))
      .pipe(header(headerTemplate, { pkg : pkg }))
      .pipe(gulp.dest('./dist'))
      .pipe(gulp.dest('./docs/dist'))
      .pipe(uglify())
      .pipe(rename('ab-grid.min.js'))
      .pipe(gulp.dest('./dist'))
      .pipe(gulp.dest('./docs/dist'))
  ]);
});

gulp.task('watch', function() {
  gulp.watch('./src/**/*', ['ts-debug']);
  gulp.watch('./src/**/*', ['less']);
});
