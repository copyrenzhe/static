/**
 * 滚动元素
 * new Marquee(options);
 * el : //主元素
 * direction : 'up',//方向,up,left
 * speed : 30,//速度
 * step : 1,//步长
 * visible : 1,//显示元素个数

 */

define('jquery.marquee',['jquery'],function($){

  function Marquee(opt){
    this.options = $.extend(true,{},arguments.callee.options,opt);
    this.$el = $(opt.el).addClass('ui-marquee');
    this.init();
  }
  $.extend(Marquee.prototype,{
    init : function(){
      var width,
          height,
          length,
          timer,
          options = this.options,
          _this   = this;

      this.$items = this.$el.children().addClass('ui-marquee-li');
      if(this.options.direction == "left") this.$items.css({float:"left"});
      width = this.$items.innerWidth(),height = this.$items.innerHeight();
      $.extend(this.options,{
        width : width,
        height : height,
        showWidth : width*this.$items.length,
        showHeight : height*this.$items.length
      });
      this.$items.detach();
      if(this.$items.length >= options.visible){//大于visible个元素则进行滚动
        this.$items = this.$items.add(this.$items.slice(0,options.visible).clone());//复制前visible个li，并添加到ul后
        length = this.$items.length;
        this.$itemBox = $('<div class="ui-marquee-list"></div>').append(this.$items).appendTo(this.$el);
        this.$el.css({overflow:'hidden',zoom:1});
        this.$itemBox.css({overflow:'hidden',zoom:1});
        switch(options.direction){
          case "left":{
            this.$items.css({width:options.width});
            this.$el.css({width:options.visible*options.width});
            this.$itemBox.css({width:length*options.width});
            break;
          }
          case "up":{
            this.$items.css({height:options.height});
            this.$el.css({height:options.visible*options.height});
            this.$itemBox.css({height:length*options.height});
            break;
          }
        }
      }

      this.$itemBox.hover($.proxy(this.stop,this),$.proxy(this.start,this));
      this.start();
    },
    roll : function(){
      var options = this.options,
      $el = this.$el;

      if(options.direction == "left"){
        if($el.scrollLeft() >= options.showWidth){
          $el.scrollLeft(0);
        }else{
          $el.scrollLeft($el.scrollLeft()+options.step);
        }
      }
      
      if(options.direction == "up"){
        if($el.scrollTop() >= options.showHeight){
          $el.scrollTop(0);
        }else{
          $el.scrollTop($el.scrollTop()+options.step);
        }
      }
    },
    start : function(){
      this.timer = setInterval($.proxy(this.roll,this),this.options.speed);
    },
    stop : function(){
      clearInterval(this.timer);
    }
  });
  $.extend(Marquee,{
    options : {
      direction : 'up',
      speed : 30,
      step : 1,
      visible : 1
    }
  });
  $.extend($.fn,{
    marquee : function(opt){
      opt = opt || {};
      var args = Array.prototype.slice.apply(arguments);
      args.shift();
      return this.each(function(){
        var $this = $(this);
        var data = $this.data('marquee');

        if($.type(opt) == 'object'){
          opt = $.extend({},opt,{el:$this});
          data = new Marquee(opt);
          $this.data('marquee',data);
        }
        if($.type(opt) == 'string') data[opt].apply(data,args);

        return this;
      });
    }
  });

  return Marquee;

});
   