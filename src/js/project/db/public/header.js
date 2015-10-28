require(['jquery'],function($){
  console.log('执行topnav模块！');
  var $header = $("header");
  var $nav = $header.find('.topnav');
  $nav.on('mouseenter','>.item',function(){
    var $this = $(this).addClass('active');
  });
  $nav.on('mouseleave','>.item',function(){
    var $this = $(this).removeClass('active');
  });
});
