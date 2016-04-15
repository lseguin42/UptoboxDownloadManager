/// <reference path="typings/tsd.d.ts" />

import gulp = require('gulp')
import bowerFiles = require('main-bower-files')
import inject = require('gulp-inject')

var sources = require('./config/sources.json')

export default function injectTask() {
    return gulp.src('client/index.html')
        .pipe(inject(gulp.src(bowerFiles(), { read: false }), {
            name: 'bower',
            relative: true
        }))
        .pipe(inject(gulp.src(sources, { read: false }), {
            relative: true
        }))
        .pipe(gulp.dest('client'))
}