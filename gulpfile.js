//base paths
var basePaths = {
    src : 'src/',
    dest : 'dist/'
};

/**
 * paths && constant
 */
var paths = {
    images: {
        src : basePaths.src + 'images/',
        dest : basePaths.dest + 'images/min/'
    },
    scripts: {
        src : basePaths.src + 'js/',
        dest : basePaths.dest + 'js/min/'
    },
    styles: {
        src : basePaths.src + 'less/',
        dest : basePaths.dest + 'css/min/'
    },
    sprite: {
        src : basePaths.src + 'sprite/*'
    } 
}

var appFiles = {
    styles : [paths.styles.src + '**/*.less','!'+paths.styles.src+'includes/**/*'],
    scripts : [paths.scripts.src+'require.js', paths.scripts.src+'config.js'],
    concatScripts : ['lib','plugin'],
}

var devbaseUrl = "http://static.dev/resource/src/js",
    probaseUrl = "http://static.vwoke.com/resource/src/js";
var version    = "1.0";

/**
 * gulp plugins
 */
var plugins     =   require('gulp-load-plugins')();    
var gulp        =   require('gulp'),
    moment      =   require('moment'),
    _           =   require('underscore'),
    gutil       =   require('gulp-util'),
    sourcemaps  =   require('gulp-sourcemaps'),
    fs          =   require('fs');

/**
 * package info
 */
var pkg = require('./package.json');
var banner = ['/**',
            ' * <%= pkg.name %> - <%= pkg.description %>',
            ' * @version v<%= pkg.version %>',
            ' * @link <%= pkg.homepage %>',
            ' * @license <%= pkg.license %>',
            ' */',
                ''
            ].join('\n');

/**
 * args
 * Allow gulp --dev to be run for more output
 */
var isProduction    =   true,
    sourceMap       =   false,
    header          =   false;
    
//if is dev mode
if(gulp.env.dev === true) {
    isProduction    =   false;
    sourcemaps      =   true;
    header          =   true;
}


//编译less
gulp.task('less',function(){
    gutil.beep();
    return  gulp.src(appFiles.styles)
                .pipe(sourcemaps.init())
                .pipe(plugins.less())
                .pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
                .pipe(isProduction ? plugins.cssmin() : gutil.noop())
                .pipe(isProduction ? plugins.rename({suffix:'.min'}) : gutil.noop())
                .pipe(header ? plugins.header(banner,{ pkg : pkg }) : gutil.noop())
                .pipe(sourceMap ? sourcemaps.write() : gutil.noop())
                .pipe(gulp.dest(paths.styles.dest));
});

//处理js的相关
gulp.task('script',function(){
    gutil.beep();
    var otherFiles = [paths.scripts.src+'**/*.js'];
    appFiles.scripts.forEach(function(file){
        otherFiles.push("!"+file);
    })
    //处理app.js
    gulp.src(appFiles.scripts)
        .pipe(sourcemaps.init())
        .pipe(plugins.concat('app.js'))
        .pipe(plugins.footer(initRequireConfig({pro:isProduction})))
        .pipe(isProduction ? 
                    (plugins.uglify().on('error', function(e) { console.log('\x07',e.message); return this.end(); }))
                    :
                    gutil.noop()
                )
        .pipe(header ? plugins.header(banner,{ pkg : pkg }) : gutil.noop())
        .pipe(sourceMap ? sourcemaps.write() : gutil.noop())
        .pipe(gulp.dest(paths.scripts.dest));

    //处理合并
    appFiles.concatScripts.forEach(function(file){
        var files = paths.scripts.src + file + '/*.js';
        otherFiles.push("!"+files);

        gulp.src(files)
            .pipe(sourcemaps.init())
            .pipe(isProduction ? 
                    (plugins.uglify().on('error', function(e) { console.log('\x07',e.message); return this.end(); }))
                    :
                    gutil.noop()
                )
            .pipe(plugins.concat(file+'.js'))
            .pipe(header ? plugins.header(banner,{ pkg : pkg }) : gutil.noop())
            .pipe(sourceMap ? sourcemaps.write() : gutil.noop())
            .pipe(gulp.dest(paths.scripts.dest));
    });

    //处理其他脚本
    gulp.src(otherFiles)
        .pipe(isProduction ? 
                    (plugins.uglify().on('error', function(e) { console.log('\x07',e.message); return this.end(); }))
                    :
                    gutil.noop()
            )
        .pipe(header ? plugins.header(banner, { pkg : pkg }) : gutil.noop())
        .pipe(gulp.dest(paths.scripts.dest));
})


gulp.task('clean',function(){
    return  gulp.src(dist,{read:false})
                .pipe(plugins.clean());
});

gulp.task('default',['less','script']);

/**
 * 自定义函数
 */

//获取path.json的路径
function getPath(pro){
    var paths = JSON.parse(fs.readFileSync(paths.scripts.src+'path.json'));
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

//初始化requireJs的config文件
function initRequireConfig (opt) {
    
    opt = opt || {};
    var baseUrl = devbaseUrl;
    if(opt.pro) baseUrl = probaseUrl;
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