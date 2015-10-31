require(['jquery','underscore','jquery.waterfall','jquery.easing','prism'],function($,_){
  $(function(){
    var $list = $('.list');
    $list.waterfall({
      column : 5,
      fx : {
        delay : 30,
        easing : 'easeOutExpo'
      },
      from : function(position){
        return {
          top : '50%',
          left : '50%',
          opacity : 0
        }
      },
      to : function(position){
        return {
          opacity : 1
        }
      },
      sort : function(list){
        return list;
        //return _(list).shuffle();
      }
    });
    var i=0;
    function createLi(){
      var $el = $('<div class="li">');
      $el.css({
        backgroundColor:'hsl('+(i)+', 50%, 50%)',
        height:_.random(100,400)
      });
      i+=3;
      return $el;
    }

    $('.add-one').on('click',function(){
      var $el = createLi();
      $list.waterfall('append',$el);
      return false;
    });
    $('.add-more').on('click',function(){
      var list = [];
      $.each(_.range(10),function(){
        list.push(createLi());
      });
      $list.waterfall('append',list);
      return false;
    });
    $('.refresh').on('click',function(){
      $list.waterfall('refresh');
      return false;
    });
  });
  
});