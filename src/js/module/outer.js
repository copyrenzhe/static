/**
 * file: module/outer.js
 * description: 
 *   通过实例化一个outer对象让一个元素获得outer事件。
 *   此事件重度依赖jquery。
 *   demo:
 *  //获得outer事件的能力
 *     //实例形式
 *     var elOuter = new outer({el:$elem});
 *     //插件形式
 *     $elem.outer();
 *     
 *  //绑定outer事件，可绑定多个，
 *     借助于jquery事件队例，实行先绑先执行，
 *     当然也可以使用事件命名空间。
 *     $elem.on('outer',function(){
 *       console.log(argument);
 *     });
 *     $elem.on('outer',function(){
 *       console.log(this);
 *     });
 *  //方法调用
 *    register:内部方法，为以后扩展需要，不建议调用（目前调了也没啥用）
 *    destroy:注销事件触发器，并不会注销事件，注销事件请使用jquery，$.fn.off,$.fn.unbind等。
 *    
 *      elOuter.destroy();
 *      $elem.outer('destroy');
 *      $elem.data('ui.outer').destroy();
 * 
 * author : [" 564493634@qq.com "]
 * date : 2014/10/24
 */
define('outer',['jquery'],function($){
   
    var $elems = $();

    function check(e){
      var target = e.target;
      var $target = $(target);
      var $parents = $target.parents();
      $elems.each(function(){
        if (this != target && $parents.filter(this).length==0){
          var $this = $(this);
          var event = $.Event('outer',{target : target});
          $this.trigger(event);
        }
      });
    }

    function Outer(options){
      var _this = this;
      this.$el = $(options.el);

      setTimeout(function(){_this.register();},0);
    }

    $.extend(Outer.prototype,{
      register : function(){
        if(!$elems.length){
          $(document).on('click.outer',check);
        }
        $elems = $elems.add(this.$el);
      },
      destroy : function(){
        $elems = $elems.not(this.$el);
        if (!$elems.length){
          $(document).off('click.outer',check);
        }
      }
    });

    $.fn.extend({
      outer : function(opt){
        opt = opt || {};
        return this.each(function(){
          var $this = $(this);
          var data = $this.data('event.outer');

          if($.type(opt) == 'object'){
            opt = $.extend({},opt);
            $.extend(opt,{el:$this});
            data = new Outer(opt);
            $this.data('event.outer',data);
          }
          
          if($.type(opt) == 'string') data[opt]();

          return this;
        });
      }
    });
    return Outer;
});