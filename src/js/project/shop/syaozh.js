//require start
require(['jquery','underscore','browser','jquery.ui'],function($,_,browser){

//--------------------------------------------------------------------------------------------------
$(function() {
	var $body = $(document.body);

	$(window).scroll(function(){
		if ($(window).scrollTop() > 100) { 
      $(".return-top").fadeIn(); 
    } 
    else if ($(window).scrollTop() == 0) { 
      $(".return-top").fadeOut(); 
    } 
	});
	//返回顶部
	$(".return-top").click(function(){
		$('html,body').animate({
      scrollTop:'0px'
    },400);
	});

	/**
	 * 分类目录
	 */
	$("#category").hover(function(){
			$(this).children('.fl').addClass('hover');
			$(this).find("bb").addClass('bbup');	
		},function()
		{ 
			$(this).children('.fl').removeClass('hover');
			$(this).find("bb").removeClass('bbup');
		}
	);

	/**
	 * 举报
	 */
	$body.on('click','.action-btn-report',function(){
		var $this = $(this);
		var data = $this.data();

		var dialog = [
			'<div class="report-dialog" style="padding:20px;" title="举报">',
				'<div><textarea name="report" id="" style="height:100px;width:248px;"></textarea></div>',
				'<div style="margin-top:20px;"><a href="javascript:;" class="submit button">确认</a><a style="margin-left:20px;" href="javascript:;" class="cancel button">取消</a></div>',
			'</div>'
		].join('');
		var $dialog = $(dialog);

		$dialog.dialog({
			height:240,
			modal:true
		});
		$dialog.find('.button').button();
		$dialog.on('click','.submit',function(){
			$.post('/index/report', {id: data.id,cat: data.cat,content: $dialog.find('textarea').val()}, function(data) {
				alert("感谢您的举报，我们将尽快处理");
				$dialog.dialog('close');
			});
		});
		$dialog.on('click','.cancel',function(){
			$dialog.dialog('close');
		});
	});

	/**
	 * 收藏
	 */
	$body.on('click','.action-btn-collect',function(){
		if(!user_id){
 			alert('请先登录！');
 		}else{
 			$.post(collect_url,{'user_id':user_id,'product_id':product_id,'category':category,'type':type},function(data){
 				if(data.status==1){
 					$('.btn-collect span').html('已收藏');
 				}
 				else{
 					$('.btn-collect span').html('收藏');
 				}
 			},'json');
 		}
	});

	/**
	 * 分享
	 */
	$body.on('click','.action-btn-share',function(){
		var $this = $(this);
		var data = $this.data();
		type = data.type || 's_weibo';
		delete data.type;
		data.title = data.title || '药智商城';
		data.url = window.location.href
		var shareUrl = {
			's_weibo' : 'http://v.t.sina.com.cn/share/share.php?<%=params%>',
			't_weibo' : 'http://v.t.qq.com.cn/share/share.php?<%=params%>',
			'qzone' : 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?<%=params%>'
		}

		if(!shareUrl[type]){
			throw '错误的分享类型';
			return;
		}
		window.open(_.template(shareUrl[type])({params:$.param(data)}),'_blank');
	});

});


//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------


$(function() {
	var sWidth = $("#list").width(); 
	var len = ($("#list ul li").length)/3; 
	var index = 0;
	var picTimer;
	
	var btn = "";
	for(var i=0; i < len; i++) 
	btn += "<div class='preNext pre'></div><div class='preNext next'></div>";
	$("#list").append(btn);

	$("#list .preNext").css("opacity",0.04).hover(function() {
		$(this).stop(true,false).animate({"opacity":"0.5"},300);
	},function() {
		$(this).stop(true,false).animate({"opacity":"0.04"},300);
	});

	$("#list .pre").click(function() {
		index -= 1;
		if(index == -1) {index = len - 1;}
		showPics(index);
	});

	$("#list .next").click(function() {
		index += 1;
		if(index == len) {index = 0;}
		showPics(index);
	});
	$("#list ul").css("width",(sWidth+1) * (len));
	
	$("#list").hover(function() {
		clearInterval(picTimer);
	},function() {
		picTimer = setInterval(function() {
			showPics(index);
			index++;
			if(index == len) {index = 0;}
		},4000); 
	}).trigger("mouseleave");
	
	function showPics(index) { 
		var nowLeft = -index*sWidth; 
		$("#list ul").stop(true,false).animate({"left":nowLeft},300);
	}
});


//----------xiangqing-----------------------------------------------------------------------------------------------
$(function() {
	var sWidth = $("#preview").width(); 
	var len = $("#preview ul li").length;
	var index = 0;
	var picTimer;
	if(len>1){
		var btn = "<div class='control'>";
		for(var i=0; i < len; i++) {
			btn += "<span></span>";
		}
		btn += "</div>"; 
		$("#preview").append(btn);
		$("#preview .btnBg").css("opacity",1);

		$("#preview .control span").css("opacity",1).mouseover(function() {
			index = $("#preview .control span").index(this);
			showPics(index);
		}).eq(0).trigger("mouseover");

		$("#preview ul").css("width",sWidth * (len));
		
		$("#preview").hover(function() {
			clearInterval(picTimer);
		},function() {
			picTimer = setInterval(function() {
				showPics(index);
				index++;
				if(index == len) {index = 0;}
			},4000);
		}).trigger("mouseleave");
	}
	function showPics(index) { 
		var nowLeft = -index*sWidth;
		$("#preview ul").stop(true,false).animate({"left":nowLeft},300); 
		$("#preview .control span").stop(true,false).animate({"opacity":"0.4"},300).eq(index).stop(true,false).animate({"opacity":"1"},300); 
	}
});

//------tabbox---------------------------------------------------------------------------------------------------

$(document).ready(function() {
  jQuery.jqtab = function(tabtit,tab_conbox,shijian) {
    $(tab_conbox).find("li").hide();
		$(tabtit).find("li:first").addClass("thistab").show(); 
		$(tab_conbox).find("li:first").show();	
		$(tabtit).find("li").bind(shijian,function(){
		  $(this).addClass("thistab").siblings("li").removeClass("thistab"); 
			var activeindex = $(tabtit).find("li").index(this);
			$(tab_conbox).children().eq(activeindex).show().siblings().hide();
			return false;
		});
	
	};
    /*调用方法如下：*/
	$.jqtab("#tabs2","#tab_conbox2","mouseenter");
    
});


$(document).ready(function() {
    jQuery.jqtab = function(tabtit,tab_search,shijian) {
        $(tab_search).find("li").hide();
		// $(tabtit).find("li:first").addClass("x-search-li").show(); 
		// $(tab_search).find("li:first").show();	
		$(tabtit).find("li").bind(shijian,function(){
		  $(this).addClass("x-search-li").siblings("li").removeClass("x-search-li"); 
			var activeindex = $(tabtit).find("li").index(this);
			$(tab_search).children().eq(activeindex).show().siblings().hide();
			return false;
		});
	
	};
	$.jqtab("#tab-search","#search-o","click");
});


//------------product-detail---------------------------------------------------------


$(document).ready(function(){
$("#tabs li:first").addClass("curr");
$("#product-detail .yc:gt(0)").hide();
$("#tabs li").click(function(){//mouseover 改为 click 将变成点击后才显示，mouseover是滑过就显示
$(this).addClass("curr").siblings("li").removeClass("curr");
$("#product-detail .yc:eq("+$(this).index()+")").show().siblings(".yc").hide().addClass("curr");
});
});

//----------category--------------------------------------------

$(document).ready(function(){
	$(".sort-area,.area-b a").hover(function(){
			$(this).children(".area-n").addClass('hover0');
			$(this).children("b").addClass('bboup');
		},function()
		{ 
			$(this).children(".area-n").removeClass('hover0');
			$(this).children("b").removeClass('bboup');
		}
	); 	 
})

//--------filters----------------------------------------------
 $(document).ready(function(){
 	$(".filters a").click(function () {
            $(this).parents(".filter").children("div").each(function () {
				$('a',this).removeClass("seled");
            });
          $(this).attr("class", "seled");
 
        });

});


//--------#fil----------------------------------------------
 $(document).ready(function(){
 	$("#fil a").click(function () {
            $(this).parents(".sort-se").children("div").each(function () {
				$('a',this).removeClass("ba");
            });
          $(this).attr("class", "ba");
        });

});

//------------------------------------------------------------------
 

$(document).ready(function(){
 if($(this).hasClass('uparrow')){

$(this).removeClass('uparrow').addClass('downarrow');

//收起

}else{

$(this).removeClass('downarrow').addClass('uparrow');

//展开
}
})

//------------------------------------------------------------------
$(document).ready(function(){
 	$(".branletter a").click(function () {
            $(this).parents(".bran").children("div").each(function () {
				$('a',this).removeClass("on");
            });
          $(this).attr("class", "on");
 
        });

});
$(document).ready(function(){
 	$(".branarea a").click(function () {
            $(this).parents(".bran").children("div").each(function () {
				$('a',this).removeClass("on");
            });
          $(this).attr("class", "on");
 
        });
 	

 	//--------------------------全选---------------------------
 	$('.all-checkbox').click(function(){
        var ck = $(this).is(':checked');
        for (var i=0;i<$('.tr-checkboxs').length;i++)
        {
            var e = $('.tr-checkboxs')[i];
            // var ck = $($('.alb-i-checbox')[i]).is(':checked');
            e.checked = ck?true:false;
        }
    })

});


//------------------------弹出窗------------------------------------------------------
$(function() {
		
	$('.showbox').click(function(){
			$('#kui_d_pane').hide();
		});	
	$('.pop-butn-cancel').click(function(){
		// $("#pop-create-album").hide();
		$(this).parents('.pop-upsmin').hide();
		if($("#pop-upload").is(':hidden')||document.getElementById("pop-upload")==null){
			$(".pop-bj").hide();
		}
	});
	$('.pop-close').click(function(){
		$(this).parents('.pop-ups').hide();
		// console.log($(this).parents('.pop-ups').siblings('.pop-ups').length);
		if($(this).parents('.pop-ups').siblings('.pop-ups').is(':hidden')||$(this).parents('.pop-ups').siblings('.pop-ups').length==0){
			$(".pop-bj").hide();
		}
	});
	document.onkeydown = function(e){ 
    var ev = document.all ? window.event : e;
	    if(ev.keyCode==13) {
	           $('#tab_search').click();//处理事件

	    }
	}
	$("#hotwords>a").click(function(e) {
		e.preventDefault();
		$("input[name=search]").val($(this).html());
		search();
	});

})


function check_inquiry(){
	var contact = $("input[name=contact]").val();
	var content = $("textarea[name=content]").val();
	var mobi = $("input[name=mobi]").val();
	var telephone = $("input[name=telephone]").val();
	var mail = $("input[name=mail]").val();
	if(!contact){
		alert('请输入联系人');
		return false;
	}
	if(!mobi&&!telephone&&!mail){
		alert('电话和E-mail至少填定一项');
	}
	if(!content){
		alert('请输入内容');
		return false;
	}
	return true;
}
/**
 * 商城店铺留言提交
 * @return {[type]} [description]
 */
    function checkFeedbackSubmit () {
        var content = $("#content").val();
        var contact = $("#contact").val();
        var phone = $("#phone").val();
        var mail = $("#mail").val();
        if(!content){
            alert("请填写留言内容");
            return false;
        }
        if(!phone&&!mail){
            alert("电话和E-mail至少填写一项");
            return false;
        }
        else{
            return true;
        }
    }
function trim(str){ //删除左右两端的空格 
return str.replace(/(^\s*)|(\s*$)/g, ""); 
} 

//-------------------------------share----------------------------
function share_s_weibo(url,title){
    var url ="http://v.t.sina.com.cn/share/share.php?url="+encodeURIComponent(window.location.href)+"&title="+document.title;
    window.open(url);
}
function share_t_weibo(url,title){
    var url ="http://v.t.qq.com/share/share.php?url="+encodeURIComponent(window.location.href)+"&title="+document.title;
    window.open(url);
}
function share_qzone(url,title){
    var url ="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url="+encodeURIComponent(window.location.href)+"&title="+document.title;
    window.open(url);
}

$('.J-msg-cancel').click(function(event) {
	$(this).parents('.fr-a').hide();
});
$('.J-messages-cancel').click(function(event) {
	$(this).parents('.messages').hide();
});

//require end
});