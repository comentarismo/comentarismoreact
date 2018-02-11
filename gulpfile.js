var gulp = require('gulp'),
    $ = require('gulp-load-plugins')();
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var babel = require('gulp-babel');
var sass = require('gulp-sass');
var less = require('gulp-less');
var path = require('path');


var buildProperties = {
    publicDir: require('path').resolve('./dist'),
    GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID || 'DEVELOP',
    cssFiles: [
        './dist/static/styles/main.css',
        // './vendor/comentarismo-client.css',
        './vendor/bubblecharts.css',
        // './bower_components/components-font-awesome/css/font-awesome.css',
        './vendor/searchkit/dist/theming/components.css',
        './vendor/searchkit/dist/theming/theme.css',
        './vendor/searchkit/dist/theming/vars.css',
    ],
    assetFiles: [
        './vendor/app.js',
        // './vendor/vendor.js',
        './vendor/comentarismo-client.js',
        './vendor/comentarismo-client-min.map.json',
        './vendor/comentarismo-client-min.js',
        './pwa/manifest.json',
        './pwa/localforage.js',
        './pwa/ServiceWorkerWare.js',
        
    ],
    imageFiles: ['./img/**/*']
};

gulp.task('sourcemaps', function () {
    return gulp.src(buildProperties.cssFiles)
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('dist'));
});

gulp.task('css', ['searchkit','sass',"bubblecharts"], function () {
    return gulp.src(buildProperties.cssFiles)
        // .pipe($.sourcemaps.init())
        .pipe(concat('all.css'))
        .pipe(gulp.dest(buildProperties.publicDir + "/static/"))
        .on('error', function (error) {
            console.log(error);
        })
        .on('end', function () {
            console.log('Done css concat dependencies.');
        }).pipe(rename('all.min.css'))
        .pipe(cleanCSS({keepSpecialComments: 0, sourceMap: true,inline: ['none'],compatibility: 'ie8'}))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(buildProperties.publicDir + "/static/"))
        .on('end', function () {
            console.log('Done css minify dependencies.');
        })
});

gulp.task('css:watch', function () {
    gulp.watch('./app/styles/*', ['css']);
    gulp.watch('./app/css/*', ['css']);
    gulp.watch('./app/styles/*', ['css']);
    gulp.watch('./vendor/searchkit/theming/*', ['css']);
    gulp.watch('./vendor/searchkit/theming/components/*', ['css']);
});

gulp.task('searchkit', function () {
 return gulp.src(['./vendor/searchkit/**/*.scss'])
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(sourcemaps.write('./maps'))
  .pipe(gulp.dest('./vendor/searchkit/dist'));
});

gulp.task('sass', function () {
 return gulp.src(['./app/**/*.scss'])
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(sourcemaps.write('./maps'))
  .pipe(gulp.dest(buildProperties.publicDir + "/static/"))
});

gulp.task('bubblecharts', function () {
  return gulp.src('./app/styles/bubblecharts.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./vendor'));
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
        .pipe(babel({
            presets: ['babel-preset-es2015'].map(require.resolve)
        }))
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
    gulp.src(buildProperties.assetFiles)
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

gulp.task('default', ['css','fonts', 'images', 'minify-js', 'vendor', 'css:watch']);

gulp.task('prod', ['css', 'fonts', 'images', 'minify-js', 'vendor']);
