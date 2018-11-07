'use strict';

import gulp from 'gulp';
import autoprefixer from 'gulp-autoprefixer';
import compass from 'gulp-compass';
import minifycss from 'gulp-minify-css';
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';

const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

// Files & Directories

const dir = {
  app: 'app/',
  public: 'public/'
}

const files = {
  input: `${dir.public}/**/*.*`,
  app: `${dir.app}/index.html`,
  public: dir.public
}

const notifyInfo = {
  title: 'Gulp',
  icon: path.join(__dirname, 'gulp.png')
};

const plumberErrorHandler = { errorHandler: notify.onError({
      title: notifyInfo.title,
      icon: notifyInfo.icon,
      message: "Error: <%= error.message %>"
  })
};

// Tasks

gulp.task('files', () => {
  gulp.src(files.app)
  .pipe(gulp.dest(files.public))
});

gulp.task('sass', () => {
  gulp.src(style.input)
  .pipe(plumber(plumberErrorHandler))
  .pipe(compass({
      css: style.css_path,
      sass: style.sass_path
  }))
  .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false,
      grid: true
  }))
  .pipe(rename({ suffix: '.min' }))
  .pipe(minifycss())
  .pipe(gulp.dest(style.css_path))
  .pipe(browserSync.stream());
});


// Watchers

gulp.task('files-watch', ['files'], function(done) {
  browserSync.reload();
  done();
});

// BrowserSync

gulp.task('watch', function () {
  browserSync.init({
    proxy: 'localhost:8888',
  });

  gulp.watch(style.input, ['sass']);
  gulp.watch(files.app, ['files-watch']);
  gulp.watch(files.input).on("change", reload);
});
