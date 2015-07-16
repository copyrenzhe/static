
var gulp        = require('gulp'),
	less        = require('gulp-less'),
    autoprefixer= require('gulp-autoprefixer'),
    header      = require('gulp-header'),
    footer      = require('gulp-footer'),
    clean       = require('gulp-clean'),
    concat      = require('gulp-concat'),
    notify      = require('gulp-notify'),
    moment      = require('moment'),
    _           = require('underscore'),
    cssmin      = require('gulp-cssmin');

var fs = require('fs');
var src = './src',
    dist = './dist';


//
var baseUrl = "localhost/static/dist/js";
var version = "1.0";
//
var concatConfig    =   ["/js/lib","/js/model","/js/plugin"];
var copyConfig      =   ["/fonts","thirdparty","/images"];
var appConfig       =   [src+'/js/require.js',src+'/js/config.js'];

var pkg = require('./package.json');
var banner = ['/**',
            ' * <%= pkg.name %> - <%= pkg.description %>',
            ' * @version v<%= pkg.version %>',
            ' * @link <%= pkg.homepage %>',
            ' * @license <%= pkg.license %>',
            ' */',
                ''
            ].join('\n');

//编译less
gulp.task('less',function(){
    return	gulp.src('src/less/*.less')
        		.pipe(less())
                .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
                .pipe(header(banner,{ pkg : pkg }))
        		.pipe(gulp.dest(src+'/css'));
});

//压缩css
gulp.task('css',function(){
    return gulp.src(src+'/css/**/*.css')
                .pipe(cssmin())
                .pipe(rename({suffix:'.min'}))
                .pipe(gulp.dest(dist));
});

gulp.task('clean',function(){
    return  gulp.src(dist,{read:false})
                .pipe(clean());
});

gulp.task('script',function(){
    var otherFiles  =   [src+'/js/**/*.js'];
    appJsConfig.forEach(function(file){
        otherFiles.push("!"+file);
    });

    gulp.src(appJsConfig)
        .pipe(concat('app.js'))
        .pipe(footer(initRequireConfig({pro:true})))
        .pipe(uglity())
        .pipe(header(banner,{pkg:pkg}))
        .pipe(gulp.dest(dist));
})

gulp.task('concat',function(){
    return  gulp.src(dist+'/css/*.css')
                .pipe(concat('all.css'))
                .pipe(gulp.dest(dist+'/css/'));
});

gulp.task('notify',function(){
    return  gulp.src(dist+'/css/*.css')
                .pipe(notify('Hello World!'));
})

gulp.task('default',['testLess','elseTask']);

/**
 * 自定义函数
 */
function getPath(pro){
    var paths = JSON.parse(fs.readFileSync(src+'/js/path.json'));
    if(!!pro){
        paths = _.mapObject(paths,function(v,k){
            var dir = v.match(/^.*(?=\/)/);
            if(dir && concatConfig.indexOf('/js/'+dir[0]) != -1){
                return dir[0];
            }
            return v;
        });
    }
    return paths;
}

function initRequireConfig (opt) {
    
    opt = opt || {};
    opt = _.extend({
        pro: false,
        waitSeconds: 10,
        baseUrl: baseUrl,
        version: version
    },opt);
    opt.paths = JSON.stringify(getPath(opt.pro),null,4).replace(/(\})$/,'   $1');

    var _temp = _.template(['',
        'require.config({',
            '   baseUrl:  "<%= baseUrl %>",',
            '   paths:  <%= paths %>,',
            '   urlArgs:    "ygVersion=<%= version %>"<% if(!pro){ %>+"&data="+new Date().getTime()<% } %>,',
            '   waitSeconds: <%= waitSeconds %>',
        '})'
        ].join('\n'));
    return _temp(opt);
}