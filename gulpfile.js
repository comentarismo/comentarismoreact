var gulp = require('gulp'),
    $ = require('gulp-load-plugins')();
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');


var buildProperties = {
    publicDir: require('path').resolve('./dist'),
    GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID || 'DEVELOP',
    cssFiles: [
        //'app/styles/main.scss',
        'app/css/all.css',
        './bower_components/bootstrap/dist/css/bootstrap.css',
        './bower_components/components-font-awesome/css/font-awesome.css'
    ],
    comentarismoApi: [
        './vendor/comentarismo-client.js',
        './vendor/comentarismo-client-min.map.json',
        './vendor/comentarismo-client-min.js'
    ],
    imageFiles: ['./img/**/*']
};

gulp.task('css', function () {
    return gulp.src(buildProperties.cssFiles)
        //.pipe($.sourcemaps.init())
        //.pipe($.sass().on('error', $.sass.logError))
        //.pipe($.autoprefixer({
        //    browsers: ['last 2 versions'],
        //    cascade: false
        //}))
        //.pipe($.sourcemaps.write())
        .pipe(concat('all.css'))
        .pipe(gulp.dest(buildProperties.publicDir + "/static/"))
        .on('error', function (error) {
            console.log(error);
        })
        .on('end', function () {
            console.log('Done css concat dependencies.');
        }).pipe(rename('all.min.css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(buildProperties.publicDir + "/static/"))
        .on('end', function () {
            console.log('Done css minify dependencies.');
        })
});

gulp.task('css:watch', function () {
    gulp.watch('./app/styles/*', ['css']);
    gulp.watch('./app/css/*', ['css']);
});

gulp.task('js:watch', function () {
    gulp.watch('./vendor/*', ['minify-js']);
});

gulp.task('images', function () {
    gulp.src(buildProperties.imageFiles, {base: './img'})
        .pipe(gulp.dest(buildProperties.publicDir + '/static/img'))
        .on('error', function (error) {
            console.log(error);
        })
        .on('end', function () {
            console.log('Done copying images dependencies.');
        });
});

gulp.task('minify-js', function () {
    return gulp.src(
        [
            './bower_components/jquery/dist/jquery.js',
            './bower_components/bootstrap/dist/js/bootstrap.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('all.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(buildProperties.publicDir + "/static/"))
        .on('error', function (error) {
            console.log(error);
        })
        .on('end', function () {
            console.log('Done minify dependencies.');
        }).pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(buildProperties.publicDir + "/static/"))
});

gulp.task('vendor', function () {
    gulp.src(buildProperties.comentarismoApi)
        .pipe(gulp.dest(buildProperties.publicDir + '/static'))
        .on('error', function (error) {
            console.log(error);
        })
        .on('end', function () {
            console.log('Done copying vendor dependencies.');
        });
});

gulp.task('fonts', function () {
    gulp.src(
        [
            "./bower_components/components-font-awesome/fonts/**/*",
            "./bower_components/bootstrap/fonts/**/*"])
        .pipe(gulp.dest(buildProperties.publicDir + '/fonts/'))
        .on('error', function (error) {
            console.log(error);
        })
        .on('end', function () {
            console.log('Done copying fonts dependencies.');
        });
});

gulp.task('default', ['css', 'fonts', 'images', 'minify-js', 'vendor', 'css:watch']);

gulp.task('prod', ['css', 'fonts', 'images', 'minify-js', 'vendor']);
