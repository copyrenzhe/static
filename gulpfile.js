
var gulp = require('gulp'),
	less = require('gulp-less')
    autoprefixer = require('gulp-autoprefixer');
    header = require('gulp-header');
    footer = require('gulp-footer')
    clean = require('gulp-clean')
    concat = require('gulp-concat');

var src = './src',
    dist = './dist';

var pkg = require('./package.json');
var banner = ['/**',
            ' * <%= pkg.name %> - <%= pkg.description %>',
            ' * @version v<%= pkg.version %>',
            ' * @link <%= pkg.homepage %>',
            ' * @license <%= pkg.license %>',
            ' */',
                ''
            ].join('\n');

gulp.task('less',function(){
    return	gulp.src('src/less/*.less')
        		.pipe(less())
                .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
                .pipe(header(banner,{ pkg : pkg }))
                .pipe(footer(banner,{ pkg : pkg }))
        		.pipe(gulp.dest('dist/css'));
});

gulp.task('clean',function(){
    return  gulp.src(dist,{read:false})
                .pipe(clean());
});

gulp.task('concat',function(){
    return  gulp.src(dist+'/css/*.css')
                .pipe(concat('all.css'))
                .pipe(gulp.dest(dist+'/css/'));
})

gulp.task('default',['testLess','elseTask']);