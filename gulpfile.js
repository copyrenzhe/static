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
        dest : basePaths.dest + 'js/min'
    },
    styles: {
        src : basePaths.src + 'less/',
        dest : basePaths.dest + 'css/min'
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

var devbaseUrl = "http://static.belusky.com/resource/src/js",
    probaseUrl = "http://static.belusky.com/resource/src/js";
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

//编译less
gulp.task('less',function(){
    return	gulp.src('src/less/filter.less')
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