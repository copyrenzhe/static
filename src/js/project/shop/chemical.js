define(['jquery','underscore','jquery.validate'],function($,_){

  function index(){
    
    var $form = $('.search-form');
    var validator = $form.validate({
      rules:{
        ch : {
          zhCode:true
        },
        eng : {
          enCode:true
        },
        xuhao : {
          zhCode:true
        },
        cas : {
          casCode:true
        }
      }
    });
    $form.on('submit',function(e){
      if(!validator.form()){
        return false;
      }
    });
  }

  function info(data){
    $(function(){
      var $colView = $('#col-view');
      var colTemplate = _.template($('#text-template-1').html());
      function render(data){
        $colView.html(colTemplate({
          data:data,
          get_formula:get_formula,
        }));
      }
      function get_formula(obj){
        obj2 = obj.replace(/[-]/g,"");
        return 'http://db.yaozh.com/jiegou/'+obj2.substr(0,2)+'/'+obj2.substr(2,2)+'/'+obj+'.png';
      }
      render(data);
    });
  }

  return {
    index : index,
    info : info
  }

});
