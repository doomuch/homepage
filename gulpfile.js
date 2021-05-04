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
            baseDir: "./app"
        }
    });

    browserSync.watch('app/').on('change', browserSync.reload);

    cb();
});

gulp.task('sass', function(cb) {
    gulp.src('app/scss/**/*.scss')
        .pipe(sass({
            outputStyle: 'expanded',
        }).on('error', sass.logError))
        .pipe(autoprefixer(
            ['Last 30 versions']
        ))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}));

    cb();
});

gulp.task('tinypng', function () {
    return gulp.src('app/img/**/*.{png,jpg,jpeg}')
        .pipe(tinypng({
            key: 'CMX7yWxk1lc5Fp9nMWGlRX7pMBGrwGsc',
            sigFile: 'app/img/.tinypng-sigs',
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
        .pipe(gulp.dest('app/js'));
});

gulp.task('default', function() {
    gulp.watch('app/**/*.html', gulp.series('browser-sync'));
    gulp.watch('app/**/*.scss', gulp.series('sass','browser-sync'));
    gulp.watch('app/img/**/*.{png,jpg,jpeg}', gulp.series('tinypng'));
});