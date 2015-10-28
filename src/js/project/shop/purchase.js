define(['jquery','underscore','backbone','backbone.epoxy','jquery.validate','jquery.ui'],function($,_,Backbone){

  function release(){
    var $parent = $("#parent");
    $parent.on('change',function(){
      show_child(this.value,"purchase_category");
    });
    window.show_child = function(obj,table){
      if(obj>0){
          $.post(AJAX.linkage,{table:table,pid:obj},
          function(data){
              $('#child').remove();
              var content = '<select name="category" id="child">';
              var option = '';
              $.each(data,function(i,item){
                option += '<option value="'+item['id']+'">'+item['name']+'</option>';
              });
              var content = content+option+'</select>';
              if(data.length>0){
                $('#st-category select').after(content);
              }
          },'json');
      }
      else{
          $('#child').remove();
      }
        
    }
    window.saveaddr = function(){
      var contact = $("input[name=contact]").val();
      var mobi = $("input[name=mobi]").val();
      var tel = $("input[name=tel]").val();
      var email = $("input[name=email]").val();
      var address = $("input[name=address]").val();
      var company = $("input[name=company]").val();
      var postcode = $("input[name=postcode]").val();
      var add_id = $("input[name=address_id]:checked").val();
      var uid = $("input[name=uid]").val();
      $.post(AJAX.save_address,{id:add_id,user_id:uid,contact:contact,mobi:mobi,tel:tel,email:email,address:address,company:company,postcode:postcode},function(data){
        if(data['status']==1){
            alert('保存成功！');
        }
        else{
            alert('保存失败！');
        }
      },'json')
    }
    $(document.body).on('click','.change_address_a',function(){
        obj=$(this);
        $('.change_address_a').attr('isad',0);
        $('.contacts').remove();
        $('#anonymous-contact').hide();
        if(obj.attr('isad')!=1){
            $.post(AJAX.edit_address,{id:$(this).attr('data')},function(data){
                (data['contact']==null)?data['contact']='':'';
                (data['mobi']==null)?data['mobi']='':'';
                (data['tel']==null)?data['tel']='':'';
                (data['email']==null)?data['email']='':'';
                (data['address']==null)?data['address']='':'';
                (data['company']==null)?data['company']='':'';
                (data['postcode']==null)?data['postcode']='':'';
            var address_info =  '<div class="contacts edit-contacts"> <div class="st">  <span class="st-span"><b>*</b>联系人：</span>  <div class="st-ifo"><input class="text" type="text" name="contact" value="'+data['contact']+'"></div> </div> <div class="st">  <span class="st-span"><b>*</b>手机号码：</span>  <div class="st-ifo"><input class="text" type="text" name="mobi" value="'+data['mobi']+'"></div>  </div> <div class="st"><span class="st-span">或固定电话</span>  <div class="st-ifo">  <input class="text" type="text" name="tel" value="'+data['tel']+'"></div> </div> <div class="st">  <span class="st-span"><b>*</b>E-mail：</span>  <div class="st-ifo">  <input class="text" type="text" name="email" value="'+data['email']+'"> </div> </div> <div class="st">  <span class="st-span">联系地址：</span>  <div class="st-ifo">  <input class="text" type="text" name="address" value="'+data['address']+'">  </div> </div> <div class="st">  <span class="st-span">所属单位：</span>  <div class="st-ifo">  <input class="text" type="text" name="company" value="'+data['company']+'">  </div> </div> <div class="st">  <span class="st-span">邮编：</span>  <div class="st-ifo">  <input class="text" type="text" name="postcode" value="'+data['postcode']+'">  </div> <div class="st"><span class="st-span">&nbsp;</span><input class="button saveaddress" type="button" value="保存" onclick="saveaddr();"></div></div> </div>';
                obj.attr('isad',1);
                obj.parent('.tit-contact').after(address_info);
                obj.parent('.tit-contact').find('.tit-contact-input').attr('checked','checked');
            },'json')
        }
        
    });
    $('#new_address').click(function(){
        // $('#anonymous-contact').show();
        $('.contacts').remove();
        if($('ano-contacts').length==0){
            var address_info =  '<div class="contacts ano-contacts"> <div class="st">  <span class="st-span"><b>*</b>联系人：</span>  <div class="st-ifo"><input class="text" type="text" name="contact" value=""></div> </div> <div class="st">  <span class="st-span"><b>*</b>手机号码：</span>  <div class="st-ifo"><input class="text" type="text" name="mobi" value=""></div> </div><div class="st"><span class="st-span">或固定电话</span>  <div class="st-ifo">  <input class="text" type="text" name="tel" value=""></div> </div> <div class="st">  <span class="st-span"><b>*</b>E-mail：</span>  <div class="st-ifo">  <input class="text" type="text" name="email" value=""> </div> </div> <div class="st">  <span class="st-span">联系地址：</span>  <div class="st-ifo">  <input class="text" type="text" name="address" value="">  </div> </div> <div class="st">  <span class="st-span">所属单位：</span>  <div class="st-ifo">  <input class="text" type="text" name="company" value="">  </div> </div> <div class="st">  <span class="st-span">邮编：</span>  <div class="st-ifo">  <input class="text" type="text" name="postcode" value="">  </div> </div> </div>';
            $('.anonymous-contact').after(address_info);
        }
        else{
            alert($('ano-contacts').length);
        }
    });

    $(function(){
      /* ueditor 表单验证 */
      ueditor = UE.getEditor('ueditor_contents');
      ueditor.addListener('contentChange',function(){
        ueditor.sync();
        $(this.textarea).valid();
      });

      //--------------------------
      var ue = UE.getEditor('ueditor_upload');

      $('.prev').on('click','.cancel',function() {
        $(this).parents('li').remove();
      });
      $('body').on('mouseenter mouseleave','.prev li',function(){
        $(this).find('.file-panel').toggle(1);
      });

      ue.ready(function(){
          ue.hide();
          // ue.getDialog("insertimage").open();
          ue.addListener('beforeInsertImage', function(t, args) {
              if(args.length>5){
                  alert('最多上传5张图片');
                  return false;
              }
              $.each(args,function(i,item){
                 $('.prev').append('<li><img src="'+item.src+'" /><div class="file-panel"><span class="cancel"></span></div><input type="hidden" name="pictures[]" value="'+item.src+'" /></li>');
              })
          });
      });

      $(".upload").on("click",function(){
        ue.getDialog("insertimage").open();
        $(this).nextAll('.error').remove();
      });
      var $publishForm = $('.publish-form');
      var validator = $publishForm.validate({
        ignore : "input[type=file],.ignore"
      });
      $publishForm.on('submit',function(e){
        if(!validator.form()){
          return false;
        }
      });
    });

  }

  function releaseSuccess(){
    $(function(){
      $('.copy').click(function(){
        $("#webaddr").select();
        document.execCommand("Copy");
        alert('复制成功');
      });
    });
  }

  return {
    release : release,
    edit : release,
    releaseSuccess:releaseSuccess
  }

});
