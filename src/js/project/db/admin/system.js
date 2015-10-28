define(['jquery','jquery.ui'],function($){
  function navigate(){
    var $tab = $('.tabs');
    $tab.tabs();
  }

  return {
    navigate: navigate
  }

});