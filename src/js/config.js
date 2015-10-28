/**
 * file: config.js
 * description:   require.config
 * author : [" 564493634@qq.com "]
 * date : 2015/3/19
 * devbaseUrl http://192.168.1.251/static/src/js || http://192.168.1.251/static/dist/js
 * probaseUrl http://static.yaozh.com/js
 */
window.config = config = window.config || {};
config.deps = config.deps || [];

require.config({
  map : {
    '*' : {
      'css' : 'require.css'
    }
  },
  shim : {
    "prism": {
      deps : ['css!../css/plugin/prism-twilight']
    },
    "jquery.ui": {
      deps : ['css!../css/jquery-ui']
    }
  },
  deps : ["global"].concat(window.config.deps)
});