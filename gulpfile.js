var gulp = require('gulp');
var plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const sass = require('gulp-dart-sass');
const wait = require('gulp-wait');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const del = require('del');

// Clean the 'dist' directory
gulp.task('clean', function() {
    return del(['dist']);
});

// Build scripts into 'dist/js'
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
        .pipe(gulp.dest('dist/js'));
});

// Build styles into 'dist/css'
gulp.task('styles', function() {
    console.log('Running styles task...');
    return gulp.src('./scss/styles.scss')
        .pipe(wait(250))
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(gulp.dest('dist/css'));
});

// Copy other static files to 'dist'
gulp.task('copy', function() {
    return gulp.src(['./**/*', '!./scss/**/*', '!./js/**/*', '!./node_modules/**/*', '!./gulpfile.js', '!./package.json', '!./package-lock.json'])
        .pipe(gulp.dest('dist'));
});

// Build task that runs clean, scripts, styles, and copy tasks
gulp.task('build', gulp.series('clean', 'scripts', 'styles', 'copy'));

// Watch task
gulp.task('watch', function() {
    console.log('Starting watch task...');
    gulp.watch('./js/scripts.js', gulp.series('scripts'));
    gulp.watch('./scss/styles.scss', gulp.series('styles'));
});

// Default task
gulp.task('default', gulp.series('build', 'watch'));
