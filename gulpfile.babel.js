'use strict';

import gulp from 'gulp';
import autoprefixer from 'gulp-autoprefixer';
import compass from 'gulp-compass';
import imagemin from 'gulp-imagemin';
import minifycss from 'gulp-minify-css';
import notify from 'gulp-notify';
import path from 'path';
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

const img = {
  app: `${dir.app}/images/*`,
  public: `${dir.public}/images`
}

const style = {
  input: `${dir.app}/scss/**/*.scss`,
  sass_path: `${dir.app}/scss`,
  css_path: `${dir.public}/css`
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

gulp.task('images', () =>
    gulp.src(img.app)
        .pipe(imagemin())
        .pipe(gulp.dest(img.public))
);

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

gulp.task('image-watch', ['img'], function(done) {
  browserSync.reload();
  done();
});

gulp.task('sass-watch', ['sass'], function (done) {
  done();
});

// BrowserSync

gulp.task('watch', function () {
  browserSync.init({
    server: {
        baseDir: "./public/"
    }
  });

  gulp.watch(style.input, ['sass-watch']);
  gulp.watch(files.app, ['files-watch']);
  gulp.watch(img.app, ['image-watch']);
  gulp.watch(files.input).on("change", reload);
});
