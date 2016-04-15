/// <reference path="tasks/typings/tsd.d.ts" />

import gulp = require('gulp')
import tasks = require('./tasks')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

gulp.task('default', ['inject'])
gulp.task('inject',                 tasks.inject)