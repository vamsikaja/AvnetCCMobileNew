var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var obfuscate = require('gulp-obfuscate');
var sass = require('gulp-sass');
var ngAnnotate = require('gulp-ng-annotate');
var ngConstant = require('gulp-ng-constant');
var jeditor = require("gulp-json-editor");
var argv = require('yargs').argv;
var cheerio = require('gulp-cheerio');


/*
 * PATHS
 */

var paths = {
    root: './',
    sass: ['./common/assets/scss/main.scss'],
    css: ['./common/assets/css/'],
    js: {
        app: './common/app/*.js',
        shared: './common/app/shared/**/*.js',
        modules: {
            requests: './common/app/modules/requests/**/*.js',
            orders: './common/app/modules/orders/**/*.js'
        }
    },
    constants: ['./app.constants.json'],
    descriptor: './application-descriptor.xml'
};

gulp.task('buildAppJs', function () {
    gulp.src(paths.js.app)
        .pipe(ngAnnotate({
            remove: true,
            add: true,
            single_quotes: true
        }))
        .pipe(concat('app.min.js'))
        //.pipe(uglify())
        //.pipe(obfuscate())
        .pipe(gulp.dest('./common/dist/'));
});

gulp.task('buildSharedJs', function () {
    gulp.src(paths.js.shared)
        .pipe(ngAnnotate({
            remove: true,
            add: true,
            single_quotes: true
        }))
        .pipe(concat('app.shared.min.js'))
        //.pipe(uglify())
        //.pipe(obfuscate())
        .pipe(gulp.dest('./common/dist/'));
});

gulp.task('buildModuleRequests', function () {
    gulp.src(paths.js.modules.requests)
        .pipe(ngAnnotate({
            remove: true,
            add: true,
            single_quotes: true
        }))
        .pipe(concat('app.requests.min.js'))
        //.pipe(uglify())
        //.pipe(obfuscate())
        .pipe(gulp.dest('./common/dist/'));
});

gulp.task('buildModuleOrders', function () {
    gulp.src(paths.js.modules.orders)
        .pipe(ngAnnotate({
            remove: true,
            add: true,
            single_quotes: true
        }))
        .pipe(concat('app.orders.min.js'))
        //.pipe(uglify())
        //.pipe(obfuscate())
        .pipe(gulp.dest('./common/dist/'));
});


/*
 * SASS
 */
gulp.task('sass', function (done) {
    gulp.src(paths.sass)
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(gulp.dest('./common/assets/css/'))
        .on('end', done);
});


/*
 * Constants
 */


gulp.task('constants', function () {
    gulp.src(paths.constants)
        .pipe(ngConstant({
            name: 'ccMobile.constants'
        }))
        .pipe(gulp.dest('./common/app/'));
});

/*
 * Local
 */


gulp.task('env', function () {

    var local = false;

    if (argv.local) {
        local = true;
    }

    //update constants
    gulp.src(paths.constants)
        .pipe(jeditor(function (json) {
            json.CONST.LOCAL = local;
            return json;
        }))
        .pipe(gulp.dest(paths.root));


    //update application descriptor
    gulp.src(paths.descriptor)
        .pipe(cheerio({
            run: function ($, file) {

                var securityTestValue = 'ISAMforWorklight-mobilesecurityTest';

                if (local) {
                    securityTestValue = null;
                }

                $('iphone').attr('securityTest', securityTestValue);
                $('android').attr('securityTest', securityTestValue);

            },
            parserOptions: {
                xmlMode: true
            }
        }))

        .pipe(gulp.dest(paths.root));

    gulp.start('constants');

});


/*
 * WATCHES
 */

gulp.task('watch', function () {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.js.app, ['buildAppJs']);
    gulp.watch(paths.js.shared, ['buildSharedJs']);
    gulp.watch(paths.js.modules.requests, ['buildModuleRequests']);
    gulp.watch(paths.js.modules.orders, ['buildModuleOrders']);
    gulp.watch(paths.constants, ['constants']);
});


//default gulp task
gulp.task('default', ['sass', 'constants', 'buildAppJs', 'buildSharedJs', 'buildModuleRequests', 'buildModuleOrders', 'watch'], function () {
});
