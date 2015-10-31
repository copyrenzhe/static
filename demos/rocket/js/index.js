/**
 * 支付双重礼
 *
 * hashParams
 *   stoneMin  石头最小数目
 *   stoneMax  石头最大数目
 *   ovalA     石头椭圆分布长轴
 *   ovalB     石头椭圆分布短轴
 *   ovalMin   石头椭圆分布点偏移最小值
 *   ovalMax   石头椭圆分布点偏移最大值
 */

require([
  'jquery','underscore','backbone',
  'preloadjs','TweenMax','css!../css/font'
  ],function($,_,Backbone){
  
  var $banner = $('.banner');
  var $loading = $banner.find('.loading');
  var $progress = $loading.find('.progress');
  var $stage = $banner.find('.stage');
  var $actionBar = $banner.find('.action-bar');

  var images = [
    {id:'hole',src:"images/banner/hole.png"},
    {id:'rocket_1',src:"images/banner/rocket_1.png"},
    {id:'rocket_2',src:"images/banner/rocket_2.png"},
    {id:'text1',src:"images/banner/text1.png"},
    {id:'text2_1',src:"images/banner/text2_1.png"},
    {id:'text2_2',src:"images/banner/text2_2.png"},
    {id:'goods',src:"images/banner/goods.png"},
    {id:'stones',src:"images/banner/stones.png"},
    //bg
    {id:'bg1',src:"images/bg1.jpg"},
    {id:'bg2',src:"images/bg2.jpg"}
  ]
  var preload = new createjs.LoadQueue(false);

  var hash = (function(){
    var hashStr = location.hash.substring(1);
    var paramStrArr = hashStr.split('&');
    var obj = {}
    _.each(paramStrArr,function(str){
      var arr = str.split('=');
      obj[arr[0]] = arr[1] && parseInt(arr[1]);
    });
    return obj;
  })();
  var isIE8 = (function(){
    return navigator.userAgent.search('MSIE 8') >= 0;
  })();

  function createThing(id){
    var item = preload.getItem(id);
    return $('<img class="thing '+item.id+'" src="'+item.src+'">').appendTo($stage);
  }
  
  function createRocket(id){
    var item1 = preload.getItem(id+'_1');
    var item2 = preload.getItem(id+'_2');
    var temp = _.template([
      '<div class="<%= id %>">',
        '<img class="thing rocket_1" src="<%= item1.src %>" />',
        '<img class="thing rocket_2" src="<%= item2.src %>" />',
      '</div>'
    ].join(''));
    return $(temp({item1:item1,item2:item2,id:id})).appendTo($stage);
  }
  function createGoods(id){
    var item = preload.getItem(id);
    var arr = [1,2,3,4,5,6,7,8];
    var temp = _.template([
      '<div class="<%= id %>">',
      '<% _.each(arr,function(v,i){ %>',
        '<div class="thing good good<%= v %>" style="background-image:url(<%= src %>);"></div>',
      '<% }); %>',
      '</div>'
    ].join(''));
    return $(temp({src:item.src,arr:arr,id:id})).appendTo($stage);
  }
  function createStones(id){
    var item = preload.getItem(id);
    var $stones = $('<div>').addClass(id).appendTo($stage);

    function createEl(num){
      //设长轴a=520,短轴b=240建立椭圆,设偏移区间p
      //允许通过hash值传参
      var a = hash.ovalA || 520,b = hash.ovalB || 240,
          p = [hash.ovalMin || -60,hash.ovalMax || 60],
          a2 = Math.pow(a,2),b2 = Math.pow(b,2);
      _.times(num,function(){
        var type = _.random(0,5);
        var rotation = _.random(0,360);
        var scale = _.random(0.5,1.5);
        var x = _.random(-a,a);
        var ySign = _.sample([1,-1]);
        var y = ySign*Math.sqrt((1-Math.pow(x,2)/a2)*b2);
        var background = 'url('+item.src+') no-repeat 0px '+(-type*50)+'px transparent';

        var $el = $('<div>').addClass('thing stone').appendTo($stones);
        TweenMax.set($el,{
          left : x+_.random.apply(null,p),
          bottom : y+_.random.apply(null,p),
          scale : scale,
          rotation : rotation,
          background : background
        });

      });

    }

    createEl(_.random(hash.stoneMin || 28,hash.stoneMax || 38));
    return $stones;
  }

  function loading(){
    var $def = $.Deferred();
    var loadingLine = {progress : 0,time : 0.5};
    
    preload.on('progress',function(e){
      var _this = this;
      TweenMax.to(loadingLine,loadingLine.time,{
        progress : e.progress,
        onUpdate : function(){
          $progress.text('Loading - '+parseInt(loadingLine.progress*100)+'%');
        },
        onComplete : function(){
          if(loadingLine.progress<1) return;
          TweenMax.to($progress,0.4,{
            css:{left:"100%",opacity:0},
            ease:Expo.easeOut,
            onComplete:function(){
              $loading.remove();
              $def.resolve();
            }
          });
          var $bg = $('.bg');
          $bg.each(function(i){
            $(this).css({backgroundImage:'url('+preload.getItem('bg'+(i+1)).src+')'});
          });
          TweenMax.to($bg,0.5,{
            css : {
              marginTop : "0px"
            },
            ease : Expo.easeOut
          });
        }
      });
    });
    preload.loadManifest(images);

    preload.load();
    TweenMax.from($progress,0.4,{css:{left:"-220px",opacity:0}});
    $progress.css({visibility:'visible'});
    return $def;
  }

  function animate(){
    var $hole = createThing('hole');
    var $text1 = createThing('text1');
    var $text2_1 = createThing('text2_1');
    var $text2_2 = createThing('text2_2');

    var $rocket = createRocket('rocket');
    var $goods = createGoods('goods');
    var $stones = createStones('stones');

    console.log('animate start');

    timeLine = new TimelineMax();
    //舞台
    timeLine.fromTo($stage,0.2,{
      css:{opacity:0}
    },{
      css:{opacity:1},
      ease:Linear.easeNone
    });
    timeLine.from($stage,0.05,{
      css:{
        opacity:0.6,
        marginLeft:"-=10px",
        marginTop:"+=10px"
      },
      ease:Expo.easeOut,
      repeat:20,
      yoyo:true
    },"-=0.5");

    //石头
    timeLine.staggerFrom(_.shuffle($stones.find('.stone')),0.6,{
      css:{scale:0.2,opacity:0},
      ease:Bounce.easeOut
    },0.02,"-=0.6");

    //火箭
    timeLine.fromTo($rocket,1.2,{
      css:{
        left:"-80px",bottom:"120px",zIndex:1,
        scale:0.2,rotation:"30deg"
      },
      ease:Expo.easeOut
    },{
      css:{
        left:"758px",bottom:"272px",zIndex:6,
        scale:1,rotation:"-20deg"
    },ease:Expo.easeOut},"-=0.8");

    if(!isIE8){
      TweenMax.from($rocket.find('.rocket_2'),0.15,{
        css : {scale:0.5,transformOrigin:"184px 40px"},
        ease : Linear.easeNone,repeat : -1,yoyo : true
      });
    }

    //文字1
    timeLine.from($text1,0.2,{
      css:{
        opacity:0,
        scale:4
      },
      ease:Expo.easeOut
    },"-=1");

    //文字2_1
    timeLine.from($text2_1,0.6,{
      css:{
        opacity:0,
        left:"40px",
        bottom:"236px"
      },
      ease:Expo.easeOut
    },"-=0.2");
    //文字2_2
    timeLine.from($text2_2,0.6,{
      css:{
        opacity:0,
        left:"120px",
        bottom:"80px"
      },
      ease:Expo.easeOut
    },"-=0.5");

    //礼物
    timeLine.staggerFrom(_.shuffle($goods.find('.good')),0.5,{
      css:{left:"600px",bottom:"300px",scale:0.4,opacity:0},
      ease:Expo.easeOut
    },0.1,"-=1.2");

    //事件
    $actionBar.on('click','.forward',function(){
      timeLine.play();
    });
    $actionBar.on('click','.backward',function(){
      timeLine.reverse();
    });
    $actionBar.on('click','.pause,.play',function(){
      var $this = $(this);
      $this.toggleClass('pause play');
      $this.find('.fa').toggleClass('fa-pause fa-play');
      
      $this.hasClass('play') && timeLine.pause() || timeLine.resume();
    });
    $actionBar.on('click','.repeat',function(){
      timeLine.restart();
    });
    $actionBar.on('click','.speed',function(){
      var $this = $(this);
      var $num = $this.find('.num');
      var num = parseFloat($num.text());
      if(num != 2){
        num *=2;
      }else{
        num = 0.5;
      }
      timeLine.timeScale(num);
      $num.text(num);
    });

  }

  $.when(loading())
  .done(animate);

  var router = new Backbone.Router();
  
  Backbone.history.start();
  router.route(/.*/,'anything',function(){
    window.location.reload();
  });

});