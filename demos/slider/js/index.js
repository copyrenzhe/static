require(['jquery','jquery.sliderbox','prism'],function($,Slider){
  var $slider = $('.sliders');
  var $customSlider = $('.custom-slider');
  var $cSliders = $customSlider.children('.c-sliders');
  var $cControl = $customSlider.children('.c-control');

  $slider.sliderbox();
  $cSliders.sliderbox({control:false}).on('slider',function(e){
    $cControl.children().eq(e.index).addClass('active')
    .siblings('.active').removeClass('active');
  });
  $cControl.on('click','a',function(){
    var $this = $(this);
    $cSliders.sliderbox('slider',$this.index());
  }).appendTo($cSliders);

});