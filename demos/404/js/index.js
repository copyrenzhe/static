require(['jquery'],function($){
  var
    MOUSE_LOCS_TRACKED   = 3,
    $body                = $(document.body),
    $waves               = $('.ft'),
    $plaxify             = $('.plaxify'),
    mouseDot             = [],
    verticalSection      = 15,
    verticalMoveDelay    = 500,
    verticalMoveDuration = 1000;

  var getDuration = (function(){
    var num = 0;
    var duration = verticalMoveDuration;
    return function(){
      if(!(num%8)){
        //Math.random()*0.8 设置缓区间
        duration = verticalMoveDuration*(1+Math.random());
      }

      num++;
      return duration *(1+Math.random()*0.2);
    }
  })();

  function waveUP(){
    this.animate({
      marginTop : '-='+verticalSection*(1+Math.random()*0.4)
    },{
      duration : getDuration(),
      done : $.proxy(waveDown,this)
    });
  }
  function waveDown(){
    this.animate({
      marginTop : '+='+verticalSection*(1+Math.random()*0.4)
    },{
      duration : getDuration(),
      done : $.proxy(waveUP,this)
    });
  }

  $waves.each(function(index,wave){
    $body.queue(function(){
      waveUP.call($waves.eq(index));
      $body.dequeue();
    }).delay(verticalMoveDelay);
  });

  if(window.ie>8){
    require(['jquery.plax'],function(plax){
      $plaxify.plaxify();
      $.plax.enable();
    });
  }

});