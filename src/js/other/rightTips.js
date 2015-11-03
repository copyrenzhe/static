    function rightTips () {
        $(function(){
            if ($(window).width() < 1105) {
                $(".rightTips").addClass("rightTipAuto")
            } else {
                $(".rightTips").removeClass("rightTipAuto")
            }
            $(window).scroll(function(){
                if($(window).scrollTop()>50){
                    $(".go_top").css("visibility", "visible");
                }else{
                    $(".go_top").css("visibility", "hidden");
                }
            });
            if($(window).scrollTop()>50){
                $(".go_top").css("visibility", "visible");
            }else{
                $(".go_top").css("visibility", "hidden");
            }
            $(window).resize(function(){
                if ($(window).width() < 1105) {
                    $(".rightTips").addClass("rightTipAuto");
                } else {
                    $(".rightTips").removeClass("rightTipAuto");
                }
            });

            $(".go_top").click(function(){
                $('body,html').animate({scrollTop:0},800);
                return false;
            });

            $(".rightTips a").hover(
                function(){
                    var posRight = 52;
                    if($(this).hasClass("weixin") || $(this).hasClass("service")){
                        posRight = 57;
                    }
                    $(this).find(".tipsText").show().animate({"right": posRight,"width":"80px"}, 150, "linear");
                },
                function(){
                    $(this).find(".tipsText").animate({"right":"52px","width":"0"}, 150, "linear", function(){
                        $(this).hide();
                    });
                }
            );
        });