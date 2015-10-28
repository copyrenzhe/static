define(['jquery','jquery.validate'],function($){

  function supply(){
    $(function(){
      var $submitForm = $('.submit-form');
      var $mobi = $submitForm.find('input[name="mobi"]');
      var $telephone = $submitForm.find('input[name="telephone"]');
      var $mail = $submitForm.find('input[name="mail"]');
      var $elements = $mobi.add($telephone).add($mail);

      $.validator.addMethod("mobilePhoneEmail", function(value, element) {
        if(!$mobi.val() && !$telephone.val() && !$mail.val()){
          return false;
        }
        return true;
      }, "电话和E-mail至少填写一项");

      $elements.on('focus keyup',function(){
        $elements.siblings('.validate-error:not(.validate-success)').remove();
      });
      var validator = $submitForm.validate();
      $submitForm.on('submit',function(e){
        if(!validator.form()){
          return false;
        }
      });

    });
    
  }

  return {
    supply : supply,
    purchase : supply
  }

});
