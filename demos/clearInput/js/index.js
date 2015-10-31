require(['jquery','browser','jquery.clearInput'],function($,browser){
  $('.text').clearInput();
  if(browser>8){
    require(['prism']);
  }
});
