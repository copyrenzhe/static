    /*!
        tinyDrag v0.9.2
        (c) 2010 Ben Kay <http://bunnyfire.co.uk>

        MIT license
    */

define('picbox.core',['jquery'], function($) {
    $.fn.tinyDrag = function(callback) {
        return $.tinyDrag(this, callback);
    }

    $.tinyDrag = function(el, callback) {
        var mouseStart, elStart, moved, doc = $(document), abs = Math.abs;
        el.mousedown(function(e) {
            moved = false;
            mouseStart = {x: e.pageX, y: e.pageY};
            elStart = {x: parseInt(el.css("left")), y: parseInt(el.css("top"))}
            doc.mousemove(drag).mouseup(stop);
            return false;
        });
        
        function drag(e) {
            var x = e.pageX, y = e.pageY;
            if (moved) {
                el.css({left: elStart.x + (x - mouseStart.x), top: elStart.y + (y - mouseStart.y)});
            } else {
                if (abs(x - mouseStart.x) > 1 || abs(y - mouseStart.y) > 1)
                    moved = true;
            }
            return false;
        }
        
        function stop() {
            doc.unbind("mousemove", drag).unbind("mouseup");
            moved&&callback&&callback()
        }
        
        return el;
    }

    return $;
})