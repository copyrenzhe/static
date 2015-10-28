//弹窗事件通知传递
+(function(){
  var top = window.top;
  if(!top.dialogMessage){
    //给top注册事件绑定，事件触发
    var dialogMessage = {},_callbacks = {};
    top.dialogMessage = dialogMessage;
    dialogMessage.on = function(event,callback){
      if(!_callbacks[event]){
        _callbacks[event] = [];
      }
      var callbacks = _callbacks[event];
      callbacks.push(callback);
    }
    dialogMessage.trigger = function(event,data){
      var callbacks = _callbacks[event];
      if(!callbacks) return;
      for(var i=0;i<callbacks.length;i++){
        callbacks[i](data);
      }
    }
  }
  //给当前window添加接口方法
  window.sendDialogMessage = function(){
    top.dialogMessage.trigger.apply(top.dialogMessage,arguments);
  };
  window.onDialogMessage = function(){
    top.dialogMessage.on.apply(top.dialogMessage,arguments);
  }
})();


require(['jquery','underscore','backbone','jquery.pagination','jquery.ui'],function($,_,Backbone){
  $.dialogSetting = $.extend({
    width: 600,
    height: 400
  },$.dialogSetting);
  $(function(){
    var $body = $(document.body);

    /* 添加链接弹窗支持 */
    +(function(){
      $body.on('click','a[data-dialog]',function(e){
        e.preventDefault();
        var $dialog,$iframe;
        var $this = $(this);
        if(!!$this[0].href.match(/^javascript:/)) return;
        var data = $this.data();
        var opt = $.extend({
          id: data.dialog.replace('#',''),
          title: $this.attr('title') || $this.text(),
          href: $this[0].href,
          target: data.dialog,
        },$.dialogSetting,data);

        var $dialog = $(opt.target);
        if($dialog.length == 0){
          $dialog = $(linkDialogTemp(opt)).dialog({
            width:opt.width,
            height:opt.height,
            modal:true,
            autoOpen:false
          });
        }
        $dialog.dialog('option',{
          title:opt.title
        });
        var frameName = $dialog.find('iframe').attr('name');
        window.open(opt.href,frameName);
        $dialog.dialog('open');
      });
      $body.on('click','[data-action=closeDialog]',function(){
        window.closeDialog();
      });

      window.closeDialog = function(reload){
        reload = reload || false;
        if(window.parent === window) return false;
        var parent = window.parent;
        if(reload){
          parent.location.reload();
        }else{
          parent.$(window.frameElement).parents('.dialog-page').dialog('close');
        }
      }
      window.updateTitle = function(){
        if(window.parent === window) return false;
        var title = window.document.title;
        var parent = window.parent;
        var $ = parent.$;
        $(window.frameElement).closest('.dialog-page').dialog('option',{
          title: title
        });
      }
      window.updateTitle();
    })();
  
    /* 添加链接tab支持 */
    +(function(){
      $body.on('click',"a[data-tabs]",function(e){
        var $link = $(this)
        var tabs = $link.data('tabs');
        var tab = $(tabs).data('uiTabs');

        if(tab){
          e.preventDefault();
          var href = $link[0].href;
          var title = $link.attr('title') || $link.text();
          var id = encodeURIComponent(href);
          var $target = tab.tabs.find('>a[href="#'+id+'"]');
          var opt = {
            id: id,
            href: href,
            title: title,
            height: $body.height()-130
          }
          if($target.length==0){
            var $li = $(tabNavTemp(opt));
            var $target = $li.find('>a');
            tab.tablist.append($li);
            tab.element.append($(tabContentTemp(opt)));
            tab.refresh();
          }
          $target.trigger('click');
        }
      });

      $body.on("click",".ui-tabs-nav li .ui-icon-close",function() {
        var $this = $(this);
        var $tab = $this.closest(".ui-tabs")
        var panelId = $this.closest( "li" ).remove().attr( "aria-controls" );
        $(document.getElementById(panelId)).remove();
        $tab.tabs( "refresh" );
      });
    })();
      
    /* 添加navigate功能 */
    +(function(){
      //刷新
      $body.on('click',".navigate .reload",function(){
        window.location.reload();
      });
      $body.on('click',".navigate .back",function(){
        window.history.back();
      });
      $body.on('click',".navigate .forward",function(){
        window.history.forward();
      });
    })();

    /* 添加pagination支持*/
    $('.pagination').pagination();

    /* 添加widget支持 */
    //设置默认时间格式
    $.datepicker.setDefaults({
      dateFormat:"yy-mm-dd"
    });

    $('[data-widget]').each(function(){
      var $this = $(this);
      var data = $this.data();
      var widget = data.widget;
      if(!$.fn[widget]) return;
      delete data.widget;
      $this[widget](data);
    });

  });

  var linkDialogTemp = _.template([
    '<div id="<%= id %>" title="<%= title %>" class="dialog-page">',
      '<div class="content">',
        '<iframe name="<%= id %>-iframe" src="" class="dialog-iframe" style="height:<%= (height-60) %>px;"></iframe>',
      '</div>',
    '</div>'
  ].join(''));

  var tabNavTemp = _.template([
    '<li>',
      '<a href="#<%= id %>"><%= title %></a>',
      '<span class="ui-icon ui-icon-close" role="presentation"></span>',
    '</li>'
  ].join(''));

  var tabContentTemp = _.template([
    '<div id="<%= id %>">',
      '<div class="content">',
        '<iframe class="tab-iframe" src="<%= href %>" style="height:<%= height%>px;"></iframe>',
      '</div>',
    '</div>'
  ].join(''));

});
