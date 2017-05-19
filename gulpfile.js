var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    rename = require('gulp-rename'),
    server = require('gulp-express');

// Configurations for bundling task
var config = {
  src: './public/src/index.js',
  output: './public/build/',
  outputFile: 'bundle.js'
};

// Bundle the source into a single JS file using browserify
gulp.task('bundle', function() {
  browserify(config.src)
    .bundle()
    .pipe(source(config.src))
    .pipe(buffer())
    .pipe(rename(config.outputFile))
    .pipe(gulp.dest(config.output));
});

// Launch the node server using express
gulp.task('server', function() {
  server.run(['app.js']);
});

// Watch for file changes
// If client JS is changed - rebundle it
// If server code is changed - restart it
gulp.task('watch', function() {
  gulp.watch('public/src/**/*', ['bundle', 'server']);
  gulp.watch('public/config/**/*', ['bundle', 'server']);
  gulp.watch('public/images/**/*', ['bundle', 'server']);
  gulp.watch('server/**/*', ['server']);
  gulp.watch('app.js', ['server']);
});

gulp.task('default', ['watch', 'bundle', 'server']);