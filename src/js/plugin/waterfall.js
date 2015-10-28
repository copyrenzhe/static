define('jquery.waterfall',['jquery','underscore',
  'jquery.easing'],function($,_){
  //简单瀑布流实现
  var Waterfall = function(opt){
    this.options = $.extend(true,{},Waterfall.options,opt);
    this.$el = $(opt.el).css({position:'relative'});
    var _heights = [];
    $.extend(this,{
      createHeight : function(){
        _heights = new Array();
        $.each(_.range(this.options.column),function(index,ar){
          _heights.push(0)
        });
      },
      getHeight : function(index){
        return _heights[index] || _heights;
      },
      setHeight : function(index,height){
        _heights[index] = height;
      },
      getMinHeight : function(){
        return Math.min.apply(null,_heights);
      },
      getMaxHeight : function(){
        return Math.max.apply(null,_heights);
      },
      getMinIndex : function(){
        return _(_heights).indexOf(this.getMinHeight()) || 0;
      }
    });

    this.createHeight();
    this.init();
  }
  $.extend(Waterfall.prototype,{
    init : function(){
      var _this = this;
      list = this.$el.children().detach().toArray();
      _this.append(list);
    },
    append : function(list){
      var _this = this;
      if(list instanceof $){
        list = list.toArray();
      }
      if(!$.isArray(list)){
        list = [list];
      }
      $.each(list,function(){
        var $item = $(this).css({visibility:'hidden'}).appendTo(_this.$el);
        var itemAttr = {
          width : $item.outerWidth(true),
          height : $item.outerHeight(true)
        }

        var index = _this.getMinIndex();
        var minHeight = _this.getMinHeight();

        $item.css({
          position : 'absolute',
          left : index*itemAttr.width,
          top : minHeight,
        });
        _this.setHeight(index,minHeight+itemAttr.height);
      });
      this.$el.height(this.getMaxHeight());
      this.show(list);
    },
    show : function(list){
      var _this = this;
      var fx = _this.options.fx;
      $.each(_this.options.sort(list),function(){
        var $item = $(this);
        _this.$el.delay(fx.delay).queue(function(){
          var position = $item.position();
          var fromCss = $.extend({visibility:'visible'},position,_this.options.from(position,$item));
          var toCss = $.extend(position,_this.options.to(position,$item));
          $item.css(fromCss).animate(toCss,{
            duration : fx.duration,
            easing : fx.easing
          });
          $(_this.$el).dequeue();
        });
      });
    },
    refresh : function(){
      this.createHeight();
      this.append(this.$el.css({height:0}).stop(true,true).children().detach().stop(true,true));
    }
  });
  $.extend(Waterfall,{
    options : {
      column : 2,
      fx : {
        delay : 100,
        duration : 200,
        easing : 'linear'
      },
      from : function(position,$item){
        return {
          left : 300,
          top : 0,
          opacity : 0
        }
      },
      to : function(position,$item){
        return {
          left : position.left,
          top : position.top,
          opacity : 1
        }
      },
      sort : function(list){
        return list;
      }
    }
  });

  $.fn.extend({
    waterfall : function(opt){
      opt = opt || {};
      var args = Array.prototype.slice.apply(arguments);
      args.shift();
      return this.each(function(){
        var $this = $(this);
        var data = $this.data('waterfall');

        if($.type(opt) == 'object'){
          opt = $.extend({},opt,{el:$this});
          data = new Waterfall(opt);
          $this.data('waterfall',data);
        }
        if($.type(opt) == 'string') data[opt].apply(data,args);

        return this;
      });
    }
  });

  return Waterfall

});