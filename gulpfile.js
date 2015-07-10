
var gulp = require('gulp'),
	less = require('gulp-less')
    autoprefixer = require('gulp-autoprefixer');
    header = require('gulp-header');
    footer = require('gulp-footer');

var pkg = require('./package.json');
var banner = ['/**',
            ' * <%= pkg.name %> - <%= pkg.description %>',
            ' * @version v<%= pkg.version %>',
            ' * @link <%= pkg.homepage %>',
            ' * @license <%= pkg.license %>',
            ' */',
                ''
            ].join('\n');

gulp.task('testLess',function(){
	gulp.src('src/less/index.less')
		.pipe(less())
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(header(banner,{ pkg : pkg }))
        .pipe(footer(banner,{ pkg : pkg }))
		.pipe(gulp.dest('src/css'));
});

gulp.task('default',['testLess','elseTask']);