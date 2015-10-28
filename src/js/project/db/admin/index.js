require(['jquery','cookie','underscore','jquery.ui'],function($,cookie,_){
  $(function(){
    var $body = $(document.body),
        $nav = $('.page-nav'),
        $tab = $(".page-tab"),
        $theme = $(".theme");
    $nav.accordion();
    $tab.tabs().find(".ui-tabs-nav").sortable({
      axis: "x",
      stop: function() {
        $tab.tabs( "refresh" );
      }
    });

    $theme.selectmenu({
      change: function(){
        cookie.set('theme',$(this).val(),{expires:365});
        location.reload();
      }
    });

  });
});