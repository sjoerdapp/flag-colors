/* jshint node: true */
'use strict';

var gulp = require('gulp'),
    g = require('gulp-load-plugins')({lazy: false});


function requireUncached(module){
    delete require.cache[require.resolve(module)];
    return require(module);
}

function getTemplateData() {
  return {
    version: requireUncached('../package.json').version,
    flags: requireUncached('../data/flagColors.js').getAll()
  };
}

gulp.task('dev-extras', function () {
  return gulp.src(['./app/CNAME', './app/favicon.ico'])
    .pipe(gulp.dest('.tmp/'))
});

gulp.task('dev-flag-colors-css', function () {
  return gulp.src(['templates/flag-colors.css'])
    .on('error', g.notify.onError('<%= error.message%>'))
    .pipe(g.data(getTemplateData()))
    .pipe(g.swig())
    .pipe(g.rename('flag-colors.latest.css'))
    .pipe(gulp.dest('.tmp/dist/latest/css/'))
});

gulp.task('dev-scss', function () {
  return gulp.src(['./app/stylesheets/main.scss'])
    .on('error', g.notify.onError('<%= error.message%>'))
    .pipe(g.sass())
    .pipe(g.rename('styles.css'))
    .pipe(gulp.dest('.tmp/'))
});

gulp.task('dev-jade', function () {
  return gulp.src(['./app/index.jade'])
    .pipe(g.jade({
      locals: getTemplateData(),
      pretty: true,
    }))
    .pipe(gulp.dest('.tmp/'));
});

gulp.task('dev-js', function () {
  return gulp.src(['./app/scripts/index.js'])
    .pipe(gulp.dest('.tmp/'));
});

gulp.task('dev-build', ['dev-flag-colors-css','dev-scss','dev-jade','dev-js', 'dev-extras'])

gulp.task('live-server', ['dev-build'], function(){
  var server = g.liveServer.static(['.tmp/'], 3000);
  server.start();
  gulp.watch('./data/flagColors.js', ['dev-flag-colors-css', 'dev-jade']);
  gulp.watch('./app/stylesheets/*.scss', ['dev-scss']);
  gulp.watch('./app/scripts/*.js', ['dev-js']);
  gulp.watch('./app/*.jade', ['dev-jade']);

  gulp.watch('./.tmp/*', function (file){
    server.notify.apply(server, [file]);
  });
})