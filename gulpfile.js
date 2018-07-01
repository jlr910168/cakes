var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var del = require('del');
var Fontmin = require('fontmin');

function buildCss() {
  del(['dist/css/*']);
  return gulp
    .src('src/sass/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist/css'));
}

function serveCss() {
  del(['src/css/*']);
  return gulp
    .src('src/sass/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream());
}

gulp.task('sass', buildCss);

gulp.task('copyHtml', function() {
  return gulp
    .src('src/*.html')
    .pipe(gulp.dest('dist/'));
});

function fonts(done) {
  del(['src/fonts/*', '!src/fonts/*.ttf']);
  var fontmin = new Fontmin()
    .src('src/fonts/*.ttf')
    .use(Fontmin.ttf2woff())
    .use(Fontmin.ttf2woff2())
    .dest('src/fonts/');
  fontmin.run(function(e) {
    if (e) throw e;
  });
  done();
}
gulp.task('fonts', fonts);

gulp.task('watch', function() {
  gulp.watch('src/sass/*.scss', gulp.series(buildCss));
  gulp.watch('src/*.html', gulp.series('copyHtml'));
});

gulp.task('serve', gulp.series(serveCss, function serve() {
  browserSync.init({ server: { baseDir: './src/' } });
  gulp.watch('src/sass/*.scss', serveCss);
  gulp.watch('src/*.html').on('change', browserSync.reload);
}));
