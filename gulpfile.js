var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    clean = require("gulp-clean"),
    // browserify = require("browserify"),
    // source = require('vinyl-source-stream'),
    // tsify = require("tsify"),
    ts = require('gulp-typescript'),
    deployTarget = './dist';

'use strict';

gulp.task('sass', function () {
    return gulp.src('./sass/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(concat('style.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./css'));
});

gulp.task('watch-sass', function() {
    gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task("bundle-ts", function () {
    return gulp.src('ts/**/*.ts')
        .pipe(ts({
            noImplicitAny: true,
            out: 'js.js'
        }))
        .pipe(gulp.dest('js'));
});

gulp.task('watch-ts' ,function () {
    gulp.watch('./ts/**/*.ts' , ['bundle-ts']);
});

gulp.task('clean', function() {
    gulp.src(deployTarget, {read: false})
        .pipe(clean({force: true}));
});

gulp.task('deploy', ['clean', 'sass', 'bundle-ts'], function () {
    gulp.src('./css/*.*').pipe(gulp.dest(deployTarget + '/css'));
    gulp.src('./js/*.*').pipe(gulp.dest(deployTarget + '/js'));
    gulp.src('./images/**/*.*').pipe(gulp.dest(deployTarget + '/images'));
    gulp.src('./fonts/*.*').pipe(gulp.dest(deployTarget + '/fonts'));
    gulp.src('./lokacje/*.*').pipe(gulp.dest(deployTarget + '/lokacje'));
    gulp.src('./index.html').pipe(gulp.dest(deployTarget));
});