require(['jquery','browser','jquery.focusInput','jquery.placeholder','jquery.clearInput'],function($,browser){
  var $_html = $.fn.html;
  /**
   * jquery Component拓展
   */
  $.fn.component = function(){
    var $this = $(this);
    $this.find('[data-component]').each(function(){
      var $this = $(this);
      var components = $this.data('component').split(',');
      $.each(components,function(index,component){
        $this[component] && $this[component]();
      });
    });
  };
  /**
   * 添加component html兼容
   */
  $.fn.html = (function(orig){
    return function(value){
      var $this = $(this);
      orig.call(this,value);
      $this.component();
    }
  })($.fn.html);
  /**
   * 添加remove事件兼容，来自jqueryui
   */
  $.cleanData = (function( orig ) {
    return function( elems ) {
      var events, elem, i;
      for ( i = 0; (elem = elems[i]) != null; i++ ) {
        try {

          // Only trigger remove when necessary to save time
          events = $._data( elem, "events" );
          if ( events && events.remove ) {
            $( elem ).triggerHandler( "remove" );
          }

        // http://bugs.jquery.com/ticket/8235
        } catch ( e ) {}
      }
      orig( elems );
    };
  })( $.cleanData );

  $.focusInput();
});