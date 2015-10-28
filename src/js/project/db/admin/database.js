define(['jquery','jquery.ui'],function($){
  function index(){
    var $tab = $('.tabs');
    $tab.tabs();
    $.dialogSetting = {
      width: 800,
      height: 600
    }
  }

  function dataExamine(){
    var $tab = $('.tabs');
    $tab.tabs();
  }

  function dataCode(){
    $.dialogSetting = {
      width: 720,
      height: 600
    }
  }

  function changeCodeConfig(){
    var $tab = $('.tabs');
    $tab.tabs();
  }

  return {
    index: index,
    dataExamine: dataExamine,
    dataCode: dataCode,
    changeCodeConfig: changeCodeConfig
  }

});