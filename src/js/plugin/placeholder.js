define('jquery.placeholder',['jquery','modernizr'],function($,modernizr){
  function Placeholder(opt){
    Placeholder.options.id++;
    this.options = $.extend(true,{},Placeholder.options,opt);
    this.$el = $(opt.el);
    this.init();
  }

  $.extend(Placeholder.prototype,{
    init : function(){
      if(modernizr.input.placeholder){
        return;
      }
      var _this = this;
      var options = this.options;
      options.height = this.$el.height();
      var height = options.height;
      var borderWidth = parseInt(this.$el.css('borderTopWidth')) || 0;
      var id = this.$el.attr('id');
      if(!id){
        id = 'placeholder_'+options.id;
        this.$el.attr('id',id);
      }
      this.$label = $('<label for="'+id+'">'+options.placeholder+'</label>')
        .css({
          position : 'absolute',
          cursor : 'text',
          color : "graytext",
          fontSize : this.$el.css('fontSize'),
          paddingTop : parseInt(this.$el.css('paddingTop'))+borderWidth,
          paddingLeft : parseInt(this.$el.css('paddingLeft'))+borderWidth,
          lineHeight : height+'px'
        }).insertBefore(this.$el);
      this.$el.on('keyup focus input propertychange',function(){
        if(_this.$el.val() == ""){
          _this.$label.text(options.placeholder);
        }else{
          _this.$label.text("");
        }
      });
      this.$el.trigger('input');
    }
  });

  $.extend(Placeholder,{
    options : {
      placeholder : '请输入内容',
      id : 1
    }
  });

  $.fn.extend({
    placeholder : function(opt){
      opt = opt || {};
      var args = Array.prototype.slice.apply(arguments);
      args.shift();
      return this.each(function(){
        var $this = $(this);
        var data = $this.data('placeholder');

        if($.type(opt) == 'object'){
          opt = $.extend({},opt,{
            el:$this,
            placeholder:$this.attr('placeholder')
          });
          data = new Placeholder(opt);
          $this.data('placeholder',data);
        }
        if($.type(opt) == 'string') data[opt].apply(data,args);

        return this;
      });
    }
  });

  return Placeholder;

});
