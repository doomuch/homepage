'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
  	tinypng = require('gulp-tinypng-compress'),
    browserSync = require('browser-sync').create();


sass.compiler = require('node-sass');
const { watch } = require('gulp');

gulp.task('browser-sync', function(cb) {
    browserSync.init({
        server: {
            baseDir: "./docs"
        }
    });

    browserSync.watch('docs/').on('change', browserSync.reload);

    cb();
});

gulp.task('sass', function(cb) {
    gulp.src('docs/scss/**/*.scss')
        .pipe(sass({
            outputStyle: 'expanded',
        }).on('error', sass.logError))
        .pipe(autoprefixer(
            ['Last 30 versions']
        ))
        .pipe(gulp.dest('docs/css'))
        .pipe(browserSync.reload({stream: true}));

    cb();
});

gulp.task('tinypng', function () {
    return gulp.src('docs/img/**/*.{png,jpg,jpeg}')
        .pipe(tinypng({
            key: 'CMX7yWxk1lc5Fp9nMWGlRX7pMBGrwGsc',
            sigFile: 'docs/img/.tinypng-sigs',
            log: true
        }))
        .pipe(gulp.dest('img'));
});

gulp.task('scripts', function () {
    return gulp.src('src/**/*.ts')
        .pipe(ts({
            noImplicitAny: true,
            outFile: 'output.js'
        }))
        .pipe(gulp.dest('docs/js'));
});

gulp.task('default', function() {
    gulp.watch('docs/**/*.html', gulp.series('browser-sync'));
    gulp.watch('docs/**/*.scss', gulp.series('sass','browser-sync'));
    gulp.watch('docs/img/**/*.{png,jpg,jpeg}', gulp.series('tinypng'));
});