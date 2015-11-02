define('jquery.pagination',['jquery','underscore'],function($,_){
  function Pagination(opt){
    this.$el = $(opt.el);
    var _data = this.$el.data(),data = {};
    _.mapObject(_data,function(v,k){
      switch(k){
        case 'page': {
          data.currentPage = v;
          break;
        }
        case 'size': {
          data.pageSize = v;
          break;
        }
        default: {
          data[k] = v;
        }
      }
    });
    this.options = $.extend(this,arguments.callee.options,data,opt);
    this.init();
  }

  $.extend(Pagination.prototype,{
    init: function(){
      this.$el.addClass('pagination');
      this._events();
      this.render();
    },
    setOptions: function(opt){
      $.extend(this,opt);
      var pageChange = $.Event('pageChange',{page : this.currentPage});
      this.$el.trigger(pageChange);
      this.render();
    },
    setPage: function(number){
      this.setOptions({currentPage:number});
    },
    setPageSize: function(number){
      this.setOptions({pageSize:number});
    },
    render: function(){
      var self = this;
      var totalPage = Math.ceil(this.total/this.pageSize);
      var items = [];
      this.$el.empty();
      if(totalPage <= 1) return;
      //添加当前页
      items.push({page: this.currentPage,html: this.currentPage,style:'current'});

      //添加显示条数
      _.times(this.displayEdges,_.bind(function(index){
        index = index+1;
        var prev = this.currentPage-index,
            next = this.currentPage+index;
        if(prev > 0){
          items.unshift({page: prev,html: prev});
        }
        if(next < totalPage+1){
          items.push({page: next,html: next});
        }
      },this));
      
      //添加边缘
      _.times(this.edges,_.bind(function(index){
        index = this.edges-index;
        var prevStart = this.currentPage-this.displayEdges;
        var nextStart = this.currentPage+this.displayEdges;
        var prev = index,
            next = totalPage+1-index;

        if(prev<prevStart){
          //添加省略
          if(index == this.edges && (prevStart>1+index)){
            items.unshift({page: 0,html: this.ellipseText,style:'ellipse'});
          }
          items.unshift({page: prev,html: prev});
          
        }
        if(next>nextStart){
          //添加省略
          if(index == this.edges &&(nextStart<totalPage-index)){
            items.push({page: 0,html: this.ellipseText,style:'ellipse'});
          }
          items.push({page: next,html: next});
        }

      },this));
      //上一页
      if(this.currentPage!=1){
        items.unshift({page: this.currentPage-1,html: this.prevHtml});
      }
      //下一页
      if(this.currentPage!=totalPage){
        items.push({page: this.currentPage+1,html: this.nextHtml});
      }

      //使用items列表生成节点
      var $els = this._createElements(items);
      this.$el.append($els);

      //附加功能
      this.showTotal && this.$el.append('<span class="total-page">共 '+totalPage+' 页</span>');
      this.skipPage && this._skipPage();
      this.pageSizeSelect && this._pageSizeSelect();
    },
    _events: function(){
      var self = this;
      this.$el.on('click','.page',function(){
        var $this = $(this);
        if($this.hasClass('ellipse')) return;
        if($this.hasClass('current')) return;
        self.setPage($this.data('page'));
      });
      this.$el.on('keydown','.skip',function(e){
        var totalPage = Math.ceil(self.total/self.pageSize);
        var $this = $(this);
        if(e.keyCode == 13){
          var val = parseInt($this.val());
          if(!isNaN(val) && val<=totalPage){
            var href = _.template(self.href)({page:val});
            //处理hash兼容
            if(href.search("#") == 0){
              location.hash = href.substring(1);
            }
            self.setPage(val);
          }else{
            $this.val('');
          }
        }
      });
      this.$el.on('change','.page-size',function(){
        self.setPageSize($(this).val());
      });
    },
    _createElements: function(items){
      var self = this,$els = $();
      ($.type(items) == "object") && (items = [items]);
      $.each(items,function(index,item){
        item.href = item.page ? _.template(self.href)({page:item.page}) : "javascript:;";
        var opt = $.extend({style:'',href:"javascript:;"},item);
        var $el = $(self._elementTemp(opt));
        $els = $els.add($el);
        $el.data('page',opt.page);
      });
      return $els;
    },
    _skipPage: function(){
      var $el = $(this._skipPageTemp({
        items: this.pageSizeArray,
        pageSize: this.pageSize
      }));
      this.$el.append($el);
    },
    _pageSizeSelect: function(){
      var $el = $(this._pageSizeSelectTemp({
        items: this.pageSizeArray,
        pageSize: this.pageSize
      }));
      this.$el.append($el);
    },
    _skipPageTemp: _.template([
      '<span class="skip-page">跳转到 <input type="text" class="skip" value="" /> 页</span>'
    ].join('')),
    _pageSizeSelectTemp: _.template([
      '<select class="page-size">',
        '<% _.each(items,function(item,index){ %>',
        '<option value="<%= item %>" <% if(item == pageSize){ %>selected="selected"<%}%> ><%= item %></option>',
        '<% }); %>',
      '</select>'
    ].join('')),
    _elementTemp: _.template([
      '<a href="<%= href%>" class="page <%= style %>"><%= html %></a>'
    ].join(''))
  });

  $.extend(Pagination,{
    options : {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      edges: 1,
      displayEdges: 2,
      prevHtml: "上一页",
      nextHtml: "下一页",
      href: "#page-<%= page %>",
      ellipseText: "&hellip;",
      pageSizeSelect: false,//是否允许选择每页数量
      pageSizeArray: [10,20,50,100],//分页选择控制
      skipPage: false,//是否允许跳转到指定页
      showTotal: false,//是否显示总页数
      onChange: $.noop
    }
  });

  function Plugin(option) {
    option = option || {}
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.pagination')
      option.el = $this;

      if (!data) $this.data('bs.pagination', (data = new Pagination(option)))
      if (typeof option == 'string') data[option].call($this)
    })
  }
  $.fn.pagination = Plugin;
  $.fn.pagination.Constructor = Pagination;

});
