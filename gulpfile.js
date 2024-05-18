var gulp = require('gulp');
var plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const sass = require('gulp-dart-sass');
const wait = require('gulp-wait');
const babel = require('gulp-babel');
const rename = require('gulp-rename');

// Define the 'scripts' task
gulp.task('scripts', function() {
    console.log('Running scripts task...');
    return gulp.src('./js/scripts.js')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(babel({
          presets: [['@babel/env', { modules: false }]]
        }))
        .pipe(uglify({
            output: {
                comments: '/^!/'
            }
        }))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest('./js'));
});

// Define the 'styles' task
gulp.task('styles', function() {
    console.log('Running styles task...');
    return gulp.src('./scss/styles.scss')
        .pipe(wait(250))
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(gulp.dest('./css'));
});

// Define the 'build' task that runs both 'scripts' and 'styles'
gulp.task('build', gulp.series('scripts', 'styles'));

// Define the 'watch' task
gulp.task('watch', function() {
    console.log('Starting watch task...');
    gulp.watch('./js/scripts.js', gulp.series('scripts'))
        .on('change', function(path, stats) {
            console.log(`File ${path} was changed`);
        });
    gulp.watch('./scss/styles.scss', gulp.series('styles'))
        .on('change', function(path, stats) {
            console.log(`File ${path} was changed`);
        });
});

// Default task
gulp.task('default', gulp.series('build', 'watch'));
