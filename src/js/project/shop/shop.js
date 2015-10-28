define(['jquery','baidu.map','jquery.validate'],function($){

  function index(){
    $(function(){
      var $submitForm = $('.submit-form');
      var $phone = $submitForm.find('input[name="phone"]');
      var $mail = $submitForm.find('input[name="mail"]');
      var $elements = $phone.add($mail);

      jQuery.validator.addMethod("mobilePhoneEmail", function(value, element) {
        if(!$phone.val() && !$mail.val()){
          return false;
        }
        return true;
      }, "电话和E-mail至少填写一项");

      $elements.on('focus keyup',function(){
        $elements.nextAll('.validate-error:not(.validate-success)').remove();
      });
      var validator = $submitForm.validate();
      $submitForm.on('submit',function(e){
        if(!validator.form()){
          return false;
        }
      });

      //焦点图
      (function(){
        var sWidth = $("#focus").width(); //获取焦点图的宽度（显示面积）
        var len = $("#focus ul li").length; //获取焦点图个数
        var index = 0;
        var picTimer;
        if(len>1){

          //以下代码添加数字按钮和按钮后的半透明条，还有上一页、下一页两个按钮
          var btn = "<div class='control'>";
          for(var i=0; i < len; i++) {
            btn += "<span></span>";
          }
          btn += "</div>";         //</div><div class='preNext pre'></div><div class='preNext next'>
          $("#focus").append(btn);
          $("#focus .btnBg").css("opacity",1);

          //为小按钮添加鼠标滑入事件，以显示相应的内容
          $("#focus .control span").css("opacity",1).mouseover(function() {
            index = $("#focus .control span").index(this);
            showPics(index);
          }).eq(0).trigger("mouseover");


          //本例为左右滚动，即所有li元素都是在同一排向左浮动，所以这里需要计算出外围ul元素的宽度
          $("#focus ul").css("width",sWidth * (len));
          
          //鼠标滑上焦点图时停止自动播放，滑出时开始自动播放
          $("#focus").hover(function() {
            clearInterval(picTimer);
          },function() {
            picTimer = setInterval(function() {
              showPics(index);
              index++;
              if(index == len) {index = 0;}
            },4000); //此4000代表自动播放的间隔，单位：毫秒
          }).trigger("mouseleave");
          
        }
        //显示图片函数，根据接收的index值显示相应的内容
        function showPics(index) { //普通切换
          var nowLeft = -index*sWidth; //根据index值计算ul元素的left值
          $("#focus ul").stop(true,false).animate({"left":nowLeft},300); //通过animate()调整ul元素滚动到计算出的position
          //$("#focus .control span").removeClass("on").eq(index).addClass("on"); //为当前的按钮切换到选中的效果
          $("#focus .control span").stop(true,false).animate({"opacity":"0.4"},300).eq(index).stop(true,false).animate({"opacity":"1"},300); //为当前的按钮切换到选中的效果
        }
      })();

    });
  }

  function contactUs(){
    var $map = $("#bmap");
    var data = $map.data();
    var mapcode = data.mapcode.split(",");
    var defaultPoint = [106.570025,29.52886];
    var p0 = parseFloat(mapcode[0]) || defaultPoint[0];
    var p1 = parseFloat(mapcode[1]) || defaultPoint[1];

    var map = new BMap.Map("bmap");
    var point = new BMap.Point(p0,p1);
    map.centerAndZoom(point,15);//根据point居中
    map.addControl(new BMap.NavigationControl());//添加平稳缩放
    map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
    map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用

    var infoWindow = new BMap.InfoWindow("<div style='font-size:14px;'>"+data.address+"</div>",{
      width : 250,height:100,title:"联系地址",enableCloseOnClick:false,enableMessage:false
    });
    map.openInfoWindow(infoWindow,point);

  }

  function feedbackList(){
    $(function(){
      var $submitForm = $('.submit-form');
      var $phone = $submitForm.find('input[name="phone"]');
      var $mail = $submitForm.find('input[name="mail"]');
      var $elements = $phone.add($mail);

      jQuery.validator.addMethod("mobilePhoneEmail", function(value, element) {
        if(!$phone.val() && !$mail.val()){
          return false;
        }
        return true;
      }, "电话和E-mail至少填写一项");

      $elements.on('focus keyup',function(){
        $elements.nextAll('.validate-error:not(.validate-success)').remove();
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
    index : index,
    contactUs : contactUs,
    feedbackList : feedbackList,
    summary : index
  }

});
