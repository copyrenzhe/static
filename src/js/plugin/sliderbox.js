define('jquery.sliderbox',['jquery','underscore',
  'jquery.easing'],function($,_){
  //滑动显示一个列表
  var SliderBox = function(opt){
    this.options = $.extend(true,{},arguments.callee.options,opt);
    this.$el = $(opt.el);
    this.init();
  }
  $.extend(SliderBox.prototype,{
    init : function(){
      var _this = this;
      this.$el.css({
        position:'relative',
        overflow:'hidden'
      });
      this.$items = this.$el.children().detach().addClass('ui-sliderbox-item');
      if(this.options.direction == "vertical") this.$items.css({float:'left'});
      this.$itemBox = $('<div class="ui-sliderbox-box"></div>').css({
        position:'absolute',left:0,top:0
      }).append(this.$items).appendTo(this.$el);

      if(this.options.direction == "horizontal") this.$itemBox.css({width:'100%'});

      this.current = 0;
      var width = this.$items.eq(0).outerWidth(true),
          height = this.$items.eq(0).outerHeight(true);
      this.options.item = {
        width : width,
        height : height
      }
      if(this.options.direction == "horizontal"){
        this.$itemBox.css({height:height*this.$items.length});
      }else{
        this.$itemBox.css({width:width*this.$items.length});
      }

      this.$el.css({
        width : width,
        height : height
      }).addClass('ui-sliderbox');
      this.initControl();
      this.slider(0);
      if(this.options.auto){
        if(this.options.hoverPause){
          this.$el.hover($.proxy(this.closeAuto,this),$.proxy(this.openAuto,this));
        }
        this.openAuto();
      }
    },
    initControl : function(){
      var _this = this;
      if(!this.options.control){
        this.$controlBox = $('<div>');
        return ;
      }
      this.$controlBox = $('<div class="ui-sliderbox-control"></div>').appendTo(this.$el);
      this.$controlBox.css({
        position:'absolute'
      });
      this.$items.each(function(i){
        var $ct;
        if(!!_this.options.createControl){
          $ct = _this.options.createControl($(this),i);
        }else{
          $ct = $('<a href="javascript:;">'+i+'</a>');
        }
        _this.$controlBox.append($ct);
      });
      this.$controlBox.on(this.options.eventType,'a',function(){
        var $this = $(this);
        _this.slider($this.index());
      });
      this.$el.on('slider',function(e){
        _this.$controlBox.children().eq(e.index).addClass('active')
        .siblings('.active').removeClass('active');
      });
    },
    slider : function(index,direction){
      var _this = this;
      var fx = this.options.fx;

      index = (this.$items.length+index) % this.$items.length
      
      if(this.options.direction == "horizontal"){
        endCss = {top:-this.options.item.height*index}
      }else{
        endCss = {left:-this.options.item.width*index}
      }
      this.$itemBox.stop(true).animate(endCss,{
        duration : fx.duration,
        easing : fx.easing
      });
      var event = $.Event('slider',{index : index});
      this.$el.trigger(event);
      this.current = index;
    },
    prev : function(){
      this.slider(this.current-1);
    },
    next : function(){
      this.slider(this.current+1);
    },
    openAuto: function(){
      clearInterval(this.timer);
      this.timer = setInterval($.proxy(this.next,this),this.options.delay);
    },
    closeAuto: function(){
      clearInterval(this.timer);
    }
  });
  $.extend(SliderBox,{
    options : {
      direction : 'vertical',//horizontal,vertical
      eventType : 'click',
      displayNumber : 1,
      control : true,
      auto : true,
      hoverPause: true,
      delay : 3000,
      fx : {
        duration : 400,
        easing : 'easeOutExpo'
      }
    }
  });

  $.fn.extend({
    sliderbox : function(opt){
      opt = opt || {};
      var args = Array.prototype.slice.apply(arguments);
      args.shift();
      return this.each(function(){
        var $this = $(this);
        var data = $this.data('sliderbox');

        if($.type(opt) == 'object'){
          opt = $.extend({},opt,{el:$this});
          data = new SliderBox(opt);
          $this.data('sliderbox',data);
        }
        if($.type(opt) == 'string') data[opt].apply(data,args);

        return this;
      });
    }
  });

  return SliderBox

});