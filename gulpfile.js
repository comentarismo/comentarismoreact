var gulp = require('gulp'),
    $ = require('gulp-load-plugins')();

var buildProperties = {
    publicDir: require('path').resolve('./dist'),
    GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID || 'DEVELOP',
    vendorFiles: [
        './bower_components/bootstrap/dist/**/*',
        './bower_components/jquery/dist/**/*',
        './vendor/**/*'
    ],
    imageFiles : ['./img/**/*']
};

gulp.task('css', function () {
    return gulp.src('app/styles/main.scss')
        .pipe($.sourcemaps.init())
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('./dist'));
});

gulp.task('css-copy', function () {
    return gulp.src('app/css/*.css')
        .pipe(gulp.dest('./dist/static/css'));
});

gulp.task('css:watch', function () {
    gulp.watch('app/styles/*', ['css','css-copy']);
    gulp.watch('app/css/*', ['css','css-copy']);
});

gulp.task('css:build', ['css'], function () {
    return gulp.src('./dist/*.css')
        .pipe($.rev())
        .pipe(gulp.dest('./dist'))
        .pipe($.rev.manifest())
        .pipe(gulp.dest('./dist'));
});


gulp.task('vendor', function () {
    gulp.src(buildProperties.vendorFiles, {base: './bower_components/'})
        .pipe(gulp.dest(buildProperties.publicDir + '/static'))
        .on('error', function (error) {
            console.log(error);
        })
        .on('end', function () {
            console.log('Done copying vendor dependencies.');
        });
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


gulp.task('default', ['css','vendor','images','css-copy','css:watch']);
