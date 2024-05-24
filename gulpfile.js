var gulp = require('gulp');
var plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass')(require('sass')); // Specify the Sass compiler
const wait = require('gulp-wait');
const babel = require('gulp-babel');
const rename = require('gulp-rename');

// Scripts task
gulp.task('scripts', function() {
    return gulp.src('./js/scripts.js')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(babel({
          presets: [['@babel/env', {modules: false}]]
        }))
        .pipe(uglify({
            output: {
                comments: '/^!/'
            }
        }))
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest('./js'));
});

// Styles task
gulp.task('styles', function () {
    return gulp.src('./scss/styles.scss')
        .pipe(wait(250))
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./css'));
});

// Watch task
gulp.task('watch', function() {
    gulp.watch('./js/scripts.js', gulp.series('scripts'));
    gulp.watch('./scss/styles.scss', gulp.series('styles'));
});

// Build task
gulp.task('build', gulp.series('scripts', 'styles'));
