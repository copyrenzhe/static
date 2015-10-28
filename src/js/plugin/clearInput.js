define('jquery.clearInput',['jquery'],function($){
  function ClearInput(opt){
    this.options = $.extend(true,{},ClearInput.options,opt);
    this.$el = $(opt.el);
    this.init();
  }

  $.extend(ClearInput.prototype,{
    init : function(){
      var _this = this;
      this.options.height = this.$el.outerHeight();
      var height = this.options.height;
      this.$button = $('<a href="javascript:;">&times;</a>')
        .css({
          position : 'absolute',
          display : 'none',
          height : height,
          width : height,
          fontSize : Math.ceil(height*0.8),
          fontWeight : 700,
          color : "#000",
          lineHeight : height-2+'px',
          verticalAlign : 'middle',
          textDecoration : 'none',
          textAlign : 'center'
        }).appendTo($(document.body));
      this.$button.on('mousedown',$.proxy(this.clear,this));
      this.$el.on('focus keyup input propertychange',function(e){
        if(e.type == 'focus') _this.position();
        _this.action();
      });
      this.$el.on('blur',$.proxy(this.hide,this));
      this.position();
      this.$el.on('remove',$.proxy(this.destory,this));
    },
    show : function(){
      this.$button.show();
    },
    hide : function(){
      this.$button.hide();
    },
    position : function(){
      var width = this.$el.outerWidth();
      var offset = this.$el.offset();
      offset.left = offset.left + width - this.options.height;
      this.$button.css(offset);
    },
    action : function(){
      if(this.$el.val() !== ""){
        this.show();
      }else{
        this.hide();
      }
    },
    clear : function(){
      this.$el.val('').trigger('focus');
    },
    destory : function(){
      this.$button.remove();
    }
  });

  $.extend(ClearInput,{
    options : {
    }
  });

  $.fn.extend({
    clearInput : function(opt){
      opt = opt || {};
      var args = Array.prototype.slice.apply(arguments);
      args.shift();
      return this.each(function(){
        var $this = $(this);
        var data = $this.data('clearInput');

        if($.type(opt) == 'object'){
          opt = $.extend({},opt,{el:$this});
          data = new ClearInput(opt);
          $this.data('clearInput',data);
        }
        if($.type(opt) == 'string') data[opt].apply(data,args);

        return this;
      });
    }
  });

  return ClearInput;

});
