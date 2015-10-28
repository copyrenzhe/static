define(['jquery','baidu.map','jquery.validate','jquery.ui'],function($){

  function index(){
    
    
  }

  function contactUs(){
    var $mapcode = $('input[name="contact[mapcode]"]');
    var mapcode = $mapcode.val().split(",");
    var defaultPoint = [106.570025,29.52886];
    var p0 = parseFloat(mapcode[0]) || defaultPoint[0];
    var p1 = parseFloat(mapcode[1]) || defaultPoint[1];

    var map = new BMap.Map("bmap");
    var point = new BMap.Point(p0,p1);
    map.centerAndZoom(point,15);//根据point居中
    map.addControl(new BMap.NavigationControl());//添加平稳缩放
    map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
    map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用

    var marker = new BMap.Marker(point);        // 创建标注    
    marker.enableDragging();
    marker.addEventListener("dragend",function(e){
      $mapcode.val([e.point.lng,e.point.lat].join(','));
    });
    map.addOverlay(marker);                     // 将标注添加到地图中


    var $form = $('.submit-form');
    var validator = $form.validate();
    $form.on('submit',function(e){
      if(!validator.form()){
        return false;
      }
    });
  }
  function releaseSupply(){
    window.show_child = function(obj,table,back,name){
      var _this = this;
      if(obj>0){
        $.post(AJAX.linkage,{table:table,pid:obj},
        function(data){
          if(data.length){
            $('#'+back+' .child').remove();
            var content = '<select name="'+name+'" class="child">';
            var option = '';
            $.each(data,function(i,item){
              option += '<option value="'+item['id']+'">'+item['name']+'</option>';
            })
            var content = content+option+'</select>';
            $('#'+back+' select').after(content);
          }else{
            $(_this).siblings('select').remove();
            $(_this).attr('name',name);
          }
        },'json');
      }
      else{
        $('#'+back+' .child').remove();
      }
      
    }

    window.CheckSubmit = function() {
      var taglist = $('a[class=st-ifo-a-hover]');
      taglist.each(function(item,e){
        $("form").append("<input name='tag[]' type='hidden' value='"+$(e).attr('tag-id')+"'>");
        // tag[item] = $(e).attr('tag-id');
      });
      if($('#protocal').is(':checked')){
        return true;
      }
      else{
        alert('请阅读阅读药智商城行为准则，并同意后再提交');
        return false;
      }
      
    }

    $(function(){
      $('.st-ifo-a').click(function(){
        if($(this).attr('class')=='st-ifo-a-hover'){
          $(this).removeClass().addClass('st-ifo-a');
        }
        else{
          $(this).removeClass().addClass('st-ifo-a-hover');
        }
      });
      $('.prev').on('click','.cancel',function() {
        $(this).parents('li').remove();
      });

      $('body').on('mouseenter mouseleave','.prev li',function(){
        $(this).find('.file-panel').toggle(1);
      });

      $(".upload").click(function(){
        ue.getDialog("insertimage").open();
        $(this).nextAll('.error').remove();
      })

      var ue = UE.getEditor('ueditor_upload');   
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
      })

      /* 表单验证 */
      ueditor = UE.getEditor('ueditor_contents');
      ueditor.addListener('contentChange',function(){
        ueditor.sync();
        $(this.textarea).valid();
      });
      var $publishForm = $('.publish-form');
      var validator = $publishForm.validate({
        ignore : "input[type=file],.ignore"
      });
      $publishForm.on('submit',function(e){
        if($publishForm.find('input[name=protocal]:checked').length == 0){
          alert("请阅读阅读药智商城行为准则，并同意后再提交");
          return false;
        }

        var $pictures = $publishForm.find('input[name="pictures[]"]');
        if(!$pictures.length){
        var $err = $(".upload").nextAll('.error');
        if(!$err.length){
          $(".upload").after('<span class="error">相关图片不能为空</span>');
        }
          return false;
        }

        if(!validator.form()){
          return false;
        }

        var taglist = $('a[class=st-ifo-a-hover]');
        $publishForm.find('input[name="tag[]"]').remove();
        taglist.each(function(item,e){
          $publishForm.append("<input name='tag[]' type='hidden' value='"+$(e).attr('tag-id')+"'>");
          // tag[item] = $(e).attr('tag-id');
        });

      });

    });
  }

  function shopInfo(){

    $(function(){

      ue = UE.getEditor('ueditor_upload');
      ue2 = UE.getEditor('ueditor_upload2');
      ue3 = UE.getEditor('ueditor_upload3');
      ue4 = UE.getEditor('ueditor_upload4');
      ue5 = UE.getEditor('ueditor_upload5');
      ue.ready(function(){
        ue.hide();
        // ue.getDialog("insertimage").open();
        ue.addListener('beforeInsertImage', function(t, args) {
          if(args.length>1){
            alert('最多上传1张图片');
            return false;
          }
          $.each(args,function(i,item){
            $('.prev1').html('<img src="'+item.src+'" /><input type="hidden" name="logo" value="'+item.src+'" />');
          })
        });
      })
      ue2.ready(function(){
        ue2.hide();
        // ue.getDialog("insertimage").open();
        ue2.addListener('beforeInsertImage', function(t, args) {
          if(args.length>1){
            alert('最多上传1张图片');
            return false;
          }
          $.each(args,function(i,item){
            $('.prev2').html('<img src="'+item.src+'" /><input type="hidden" name="sell_certificate" value="'+item.src+'" />');
          })
        });
      })
      ue3.ready(function(){
        ue3.hide();
        // ue.getDialog("insertimage").open();
        ue3.addListener('beforeInsertImage', function(t, args) {
          if(args.length>1){
            alert('最多上传1张图片');
            return false;
          }
          $.each(args,function(i,item){
            $('.prev3').html('<img src="'+item.src+'" /><input type="hidden" name="agent_certificate" value="'+item.src+'" />');
          })
        });
      })
      ue4.ready(function(){
        ue4.hide();
        // ue.getDialog("insertimage").open();
        ue4.addListener('beforeInsertImage', function(t, args) {
          if(args.length>1){
            alert('最多上传1张图片');
            return false;
          }
          $.each(args,function(i,item){
            $('.prev4').html('<img src="'+item.src+'" /><input type="hidden" name="profile_pic" value="'+item.src+'" />');
          })
        });
      })
      ue5.ready(function(){
        ue5.hide();
        // ue.getDialog("insertimage").open();
        ue5.addListener('beforeInsertImage', function(t, args) {
          if(args.length>5){
            alert('最多上传5张图片');
            return false;
          }
          $.each(args,function(i,item){
            if($('.prev5 ul').find('li').length<5){
              $('.prev5 ul').append('<li><img src="'+item.src+'" /><input type="hidden" name="pictures[]" value="'+item.src+'" /><div class="file-panel"><span class="cancel">删除</span></div></li>');
            }
            else{
              alert('公司荣誉最多上传5张图片');
            }
            
          })
        });
      });

      $('.prev5s').on('mouseenter mouseleave', 'li', function(event) {
        $(this).find('.file-panel').toggle(1);
      });
      $('.prev5s').on('click','.cancel',function(event) {
        $(this).parents('li').remove();
      });

      $("#upload1").click(function(){
        ue.getDialog("insertimage").open();
        $(this).nextAll('.error').remove();
      });
      $("#upload2").click(function(){
        ue2.getDialog("insertimage").open();
      });
      $("#upload3").click(function(){
        ue3.getDialog("insertimage").open();
      });
      $("#upload4").click(function(){
        ue4.getDialog("insertimage").open();
        $(this).nextAll('.error').remove();
      });
      $("#upload5").click(function(){
        ue5.getDialog("insertimage").open();
      });
      get_area("<{$shopinfo['company_province']}>","company_city","<{$shopinfo['company_city']}>");
      get_area("<{$shopinfo['company_city']}>","company_district","<{$shopinfo['company_area']}>");
      get_area("<{$shopinfo['reg_province']}>","reg_city","<{$shopinfo['reg_city']}>");
      get_area("<{$shopinfo['reg_city']}>","reg_district","<{$shopinfo['reg_area']}>");

      /**
       * 表单验证
       */
      ueditor = UE.getEditor('ueditor_contents');
      ueditor.addListener('contentChange',function(){
        ueditor.sync();
        $(this.textarea).valid();
      });
      var $infoForm = $('.info-form');
      var validator = $infoForm.validate();
      $infoForm.on('submit',function(e){
        var $logo = $infoForm.find('input[name="logo"]');
        var $profile_pic = $infoForm.find('input[name="profile_pic"]');

        if(!$profile_pic.length){
        var $err = $("#upload4").nextAll('.error');
        if(!$err.length){
          $("#upload4").after('<span class="error">公司简介不能为空</span>');
        }
        return false;
        }
        if(!$logo.length){
        var $err = $("#upload1").nextAll('.error');
        if(!$err.length){
          $("#upload1").after('<span class="error">公司Logo不能为空</span>');
        }
        return false;
        }

        if(!validator.form()){
        return false;
        }
      });
      $('.datepicker').datepicker();
    });
  
  }

  return {
    index : index,
    contactUs : contactUs,
    releaseSupply:releaseSupply,
    shopInfo:shopInfo
  }

});
