/**
 * static - a resource of static
 * @version v1.0.0
 * @link https://github.com/copyrenzhe/static
 * @license ISC
 */
define('jquery.clearInput',['jquery'],function($){
  function ClearInput(opt){
    this.options = $.extend(true,{},ClearInput.options,opt);
    this.$el = $(opt.el);
    this.init();
  }

  $.extend(ClearInput.prototype,{
    init : function(){
      var _this = this;
      this.options.height = this.$el.outerHeight();
      var height = this.options.height;
      this.$button = $('<a href="javascript:;">&times;</a>')
        .css({
          position : 'absolute',
          display : 'none',
          height : height,
          width : height,
          fontSize : Math.ceil(height*0.8),
          fontWeight : 700,
          color : "#000",
          lineHeight : height-2+'px',
          verticalAlign : 'middle',
          textDecoration : 'none',
          textAlign : 'center'
        }).appendTo($(document.body));
      this.$button.on('mousedown',$.proxy(this.clear,this));
      this.$el.on('focus keyup input propertychange',function(e){
        if(e.type == 'focus') _this.position();
        _this.action();
      });
      this.$el.on('blur',$.proxy(this.hide,this));
      this.position();
      this.$el.on('remove',$.proxy(this.destory,this));
    },
    show : function(){
      this.$button.show();
    },
    hide : function(){
      this.$button.hide();
    },
    position : function(){
      var width = this.$el.outerWidth();
      var offset = this.$el.offset();
      offset.left = offset.left + width - this.options.height;
      this.$button.css(offset);
    },
    action : function(){
      if(this.$el.val() !== ""){
        this.show();
      }else{
        this.hide();
      }
    },
    clear : function(){
      this.$el.val('').trigger('focus');
    },
    destory : function(){
      this.$button.remove();
    }
  });

  $.extend(ClearInput,{
    options : {
    }
  });

  $.fn.extend({
    clearInput : function(opt){
      opt = opt || {};
      var args = Array.prototype.slice.apply(arguments);
      args.shift();
      return this.each(function(){
        var $this = $(this);
        var data = $this.data('clearInput');

        if($.type(opt) == 'object'){
          opt = $.extend({},opt,{el:$this});
          data = new ClearInput(opt);
          $this.data('clearInput',data);
        }
        if($.type(opt) == 'string') data[opt].apply(data,args);

        return this;
      });
    }
  });

  return ClearInput;

});

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.4
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+define('jquery.dropdown',['jquery'],function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.4'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('[role="menu"]' + desc + ', [role="listbox"]' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form,.dropdown .dropdown-menu', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

  return $
});

define('jquery.focusInput',['jquery','jquery.easing'],function($){

  var $body = $(document.body);

  var focusInput = {
    options : {
      inited:false,
      disabled : false,
      ignore: "ignore-focus",
      fx : {
        duration : 600,
        easing : 'easeOutExpo',
        done : function(){
          $(this).remove();
        }
      }
    },
    init : function(param){
      var _this = this;
      if(this.options.inited) return;
      this.options.inited = true;
      $.extend(true,this.options,param);
      $body.on('focus.focusInput','input[type=text],input[type=password],select,textarea',function(e){
        if(_this.options.disabled) return;
        var $tar,$pre,tar,pre;
        $tar = $(e.target);
        $pre = $(e.relatedTarget);
        if($tar.hasClass(_this.options.ignore)) return;
        setTimeout(function(){
          tar = _this.getCss($tar);
          if($pre.length>0){
            pre = _this.getCss($pre);
          }else{
            pre = _this.getCss($tar,1.6);
          }
          pre.opacity = 0;
          tar.opacity = 1;
          _this.animate(tar,pre);
        },0);
      });
    },
    animate : function(tar,pre,other){
      var $el = $('<div>').appendTo(document.body);
      pre.position = 'absolute';
      pre.cursor = 'text';
      pre.border = tar.border;
      $el.css(pre);
      $el.animate(tar,this.options.fx);
    },
    getCss : function($el,times){
      times = times || 1;
      var offset,size,borderWidth;
      offset = $el.offset();
      borderWidth = parseInt($el.css('borderTopWidth'));
      size = {
        width:$el.outerWidth()-borderWidth*2,
        height:$el.outerHeight()-borderWidth*2
      }
      return {
        zIndex:100000,
        width:size.width*times,
        height:size.height*times,
        left:offset.left-size.width*(times-1)/2,
        top:offset.top-size.height*(times-1)/2,
        border:$el.css('borderTopWidth')+" "+$el.css('borderTopStyle')+" "+$el.css('borderTopColor'),
        borderRadius:$el.css('borderTopLeftRadius')
      }
    },
    enable : function(){
      this.options.disabled = false;
    },
    disabled : function(){
      this.options.disabled = false;
    }
  }

  $.extend({
    focusInput : function(param){
      param = param || {};
      if($.type(param) == "object"){
        focusInput.init(param);
      }
      if($.type(param) == "string"){
        $.type(focusInput[param] == "function") && focusInput[param]();
      }
    }
  });
  return $;

});

/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/
define('jquery.easing', ['jquery'], function($) {
  $.easing['jswing'] = $.easing['swing'];

	$.extend( $.easing,{
		def: 'easeOutQuad',
		swing: function (x, t, b, c, d) {
			//alert(jQuery.easing.default);
			return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
		},
		easeInQuad: function (x, t, b, c, d) {
			return c*(t/=d)*t + b;
		},
		easeOutQuad: function (x, t, b, c, d) {
			return -c *(t/=d)*(t-2) + b;
		},
		easeInOutQuad: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t + b;
			return -c/2 * ((--t)*(t-2) - 1) + b;
		},
		easeInCubic: function (x, t, b, c, d) {
			return c*(t/=d)*t*t + b;
		},
		easeOutCubic: function (x, t, b, c, d) {
			return c*((t=t/d-1)*t*t + 1) + b;
		},
		easeInOutCubic: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t + b;
			return c/2*((t-=2)*t*t + 2) + b;
		},
		easeInQuart: function (x, t, b, c, d) {
			return c*(t/=d)*t*t*t + b;
		},
		easeOutQuart: function (x, t, b, c, d) {
			return -c * ((t=t/d-1)*t*t*t - 1) + b;
		},
		easeInOutQuart: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
			return -c/2 * ((t-=2)*t*t*t - 2) + b;
		},
		easeInQuint: function (x, t, b, c, d) {
			return c*(t/=d)*t*t*t*t + b;
		},
		easeOutQuint: function (x, t, b, c, d) {
			return c*((t=t/d-1)*t*t*t*t + 1) + b;
		},
		easeInOutQuint: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
			return c/2*((t-=2)*t*t*t*t + 2) + b;
		},
		easeInSine: function (x, t, b, c, d) {
			return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
		},
		easeOutSine: function (x, t, b, c, d) {
			return c * Math.sin(t/d * (Math.PI/2)) + b;
		},
		easeInOutSine: function (x, t, b, c, d) {
			return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
		},
		easeInExpo: function (x, t, b, c, d) {
			return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
		},
		easeOutExpo: function (x, t, b, c, d) {
			return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
		},
		easeInOutExpo: function (x, t, b, c, d) {
			if (t==0) return b;
			if (t==d) return b+c;
			if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
			return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
		},
		easeInCirc: function (x, t, b, c, d) {
			return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
		},
		easeOutCirc: function (x, t, b, c, d) {
			return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
		},
		easeInOutCirc: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
			return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
		},
		easeInElastic: function (x, t, b, c, d) {
			var s=1.70158;var p=0;var a=c;
			if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
			if (a < Math.abs(c)) { a=c; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (c/a);
			return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		},
		easeOutElastic: function (x, t, b, c, d) {
			var s=1.70158;var p=0;var a=c;
			if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
			if (a < Math.abs(c)) { a=c; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (c/a);
			return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
		},
		easeInOutElastic: function (x, t, b, c, d) {
			var s=1.70158;var p=0;var a=c;
			if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
			if (a < Math.abs(c)) { a=c; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (c/a);
			if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
			return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
		},
		easeInBack: function (x, t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c*(t/=d)*t*((s+1)*t - s) + b;
		},
		easeOutBack: function (x, t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
		},
		easeInOutBack: function (x, t, b, c, d, s) {
			if (s == undefined) s = 1.70158; 
			if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
			return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
		},
		easeInBounce: function (x, t, b, c, d) {
			return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
		},
		easeOutBounce: function (x, t, b, c, d) {
			if ((t/=d) < (1/2.75)) {
				return c*(7.5625*t*t) + b;
			} else if (t < (2/2.75)) {
				return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
			} else if (t < (2.5/2.75)) {
				return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
			} else {
				return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
			}
		},
		easeInOutBounce: function (x, t, b, c, d) {
			if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
			return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
		}
	});
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */
/*!
 * jQuery Validation Plugin v1.13.2-pre
 *
 * http://jqueryvalidation.org/
 *
 * Copyright (c) 2015 Jörn Zaefferer
 * Released under the MIT license
 */
(function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		define("jquery.validate.core",["jquery"], factory );
	} else {
		factory( jQuery );
	}
}(function( $ ) {

$.extend($.fn, {
	// http://jqueryvalidation.org/validate/
	validate: function( options ) {

		// if nothing is selected, return nothing; can't chain anyway
		if ( !this.length ) {
			if ( options && options.debug && window.console ) {
				console.warn( "Nothing selected, can't validate, returning nothing." );
			}
			return;
		}

		// check if a validator for this form was already created
		var validator = $.data( this[ 0 ], "validator" );
		if ( validator ) {
			return validator;
		}

		// Add novalidate tag if HTML5.
		this.attr( "novalidate", "novalidate" );

		validator = new $.validator( options, this[ 0 ] );
		$.data( this[ 0 ], "validator", validator );

		if ( validator.settings.onsubmit ) {

			this.validateDelegate( ":submit", "click", function( event ) {
				if ( validator.settings.submitHandler ) {
					validator.submitButton = event.target;
				}
				// allow suppressing validation by adding a cancel class to the submit button
				if ( $( event.target ).hasClass( "cancel" ) ) {
					validator.cancelSubmit = true;
				}

				// allow suppressing validation by adding the html5 formnovalidate attribute to the submit button
				if ( $( event.target ).attr( "formnovalidate" ) !== undefined ) {
					validator.cancelSubmit = true;
				}
			});

			// validate the form on submit
			this.submit( function( event ) {
				if ( validator.settings.debug ) {
					// prevent form submit to be able to see console output
					event.preventDefault();
				}
				function handle() {
					var hidden, result;
					if ( validator.settings.submitHandler ) {
						if ( validator.submitButton ) {
							// insert a hidden input as a replacement for the missing submit button
							hidden = $( "<input type='hidden'/>" )
								.attr( "name", validator.submitButton.name )
								.val( $( validator.submitButton ).val() )
								.appendTo( validator.currentForm );
						}
						result = validator.settings.submitHandler.call( validator, validator.currentForm, event );
						if ( validator.submitButton ) {
							// and clean up afterwards; thanks to no-block-scope, hidden can be referenced
							hidden.remove();
						}
						if ( result !== undefined ) {
							return result;
						}
						return false;
					}
					return true;
				}

				// prevent submit for invalid forms or custom submit handlers
				if ( validator.cancelSubmit ) {
					validator.cancelSubmit = false;
					return handle();
				}
				if ( validator.form() ) {
					if ( validator.pendingRequest ) {
						validator.formSubmitted = true;
						return false;
					}
					return handle();
				} else {
					validator.focusInvalid();
					return false;
				}
			});
		}

		return validator;
	},
	// http://jqueryvalidation.org/valid/
	valid: function() {
		var valid, validator, errorList;

		if ( $( this[ 0 ] ).is( "form" ) ) {
			valid = this.validate().form();
		} else {
			errorList = [];
			valid = true;
			validator = $( this[ 0 ].form ).validate();
			this.each( function() {
				valid = validator.element( this ) && valid;
				errorList = errorList.concat( validator.errorList );
			});
			validator.errorList = errorList;
		}
		return valid;
	},
	// attributes: space separated list of attributes to retrieve and remove
	removeAttrs: function( attributes ) {
		var result = {},
			$element = this;
		$.each( attributes.split( /\s/ ), function( index, value ) {
			result[ value ] = $element.attr( value );
			$element.removeAttr( value );
		});
		return result;
	},
	// http://jqueryvalidation.org/rules/
	rules: function( command, argument ) {
		var element = this[ 0 ],
			settings, staticRules, existingRules, data, param, filtered;

		if ( command ) {
			settings = $.data( element.form, "validator" ).settings;
			staticRules = settings.rules;
			existingRules = $.validator.staticRules( element );
			switch ( command ) {
			case "add":
				$.extend( existingRules, $.validator.normalizeRule( argument ) );
				// remove messages from rules, but allow them to be set separately
				delete existingRules.messages;
				staticRules[ element.name ] = existingRules;
				if ( argument.messages ) {
					settings.messages[ element.name ] = $.extend( settings.messages[ element.name ], argument.messages );
				}
				break;
			case "remove":
				if ( !argument ) {
					delete staticRules[ element.name ];
					return existingRules;
				}
				filtered = {};
				$.each( argument.split( /\s/ ), function( index, method ) {
					filtered[ method ] = existingRules[ method ];
					delete existingRules[ method ];
					if ( method === "required" ) {
						$( element ).removeAttr( "aria-required" );
					}
				});
				return filtered;
			}
		}

		data = $.validator.normalizeRules(
		$.extend(
			{},
			$.validator.classRules( element ),
			$.validator.attributeRules( element ),
			$.validator.dataRules( element ),
			$.validator.staticRules( element )
		), element );

		// make sure required is at front
		if ( data.required ) {
			param = data.required;
			delete data.required;
			data = $.extend( { required: param }, data );
			$( element ).attr( "aria-required", "true" );
		}

		// make sure remote is at back
		if ( data.remote ) {
			param = data.remote;
			delete data.remote;
			data = $.extend( data, { remote: param });
		}

		return data;
	}
});

// Custom selectors
$.extend( $.expr[ ":" ], {
	// http://jqueryvalidation.org/blank-selector/
	blank: function( a ) {
		return !$.trim( "" + $( a ).val() );
	},
	// http://jqueryvalidation.org/filled-selector/
	filled: function( a ) {
		return !!$.trim( "" + $( a ).val() );
	},
	// http://jqueryvalidation.org/unchecked-selector/
	unchecked: function( a ) {
		return !$( a ).prop( "checked" );
	}
});

// constructor for validator
$.validator = function( options, form ) {
	this.settings = $.extend( true, {}, $.validator.defaults, options );
	this.currentForm = form;
	this.init();
};

// http://jqueryvalidation.org/jQuery.validator.format/
$.validator.format = function( source, params ) {
	if ( arguments.length === 1 ) {
		return function() {
			var args = $.makeArray( arguments );
			args.unshift( source );
			return $.validator.format.apply( this, args );
		};
	}
	if ( arguments.length > 2 && params.constructor !== Array  ) {
		params = $.makeArray( arguments ).slice( 1 );
	}
	if ( params.constructor !== Array ) {
		params = [ params ];
	}
	$.each( params, function( i, n ) {
		source = source.replace( new RegExp( "\\{" + i + "\\}", "g" ), function() {
			return n;
		});
	});
	return source;
};

$.extend( $.validator, {

	defaults: {
		messages: {},
		groups: {},
		rules: {},
		errorClass: "error",
		validClass: "valid",
		errorElement: "label",
		focusCleanup: false,
		focusInvalid: true,
		errorContainer: $( [] ),
		errorLabelContainer: $( [] ),
		onsubmit: true,
		ignore: ":hidden",
		ignoreTitle: false,
		onfocusin: function( element ) {
			this.lastActive = element;

			// Hide error label and remove error class on focus if enabled
			if ( this.settings.focusCleanup ) {
				if ( this.settings.unhighlight ) {
					this.settings.unhighlight.call( this, element, this.settings.errorClass, this.settings.validClass );
				}
				this.hideThese( this.errorsFor( element ) );
			}
		},
		onfocusout: function( element ) {
			if ( !this.checkable( element ) && ( element.name in this.submitted || !this.optional( element ) ) ) {
				this.element( element );
			} else if( element.nodeName.toLowerCase() == "select" ){
				/* 解决select组件bug */
				this.element( element );
			}
		},
		onkeyup: function( element, event ) {
			// Avoid revalidate the field when pressing one of the following keys
			// Shift       => 16
			// Ctrl        => 17
			// Alt         => 18
			// Caps lock   => 20
			// End         => 35
			// Home        => 36
			// Left arrow  => 37
			// Up arrow    => 38
			// Right arrow => 39
			// Down arrow  => 40
			// Insert      => 45
			// Num lock    => 144
			// AltGr key   => 225
			var excludedKeys = [
				16, 17, 18, 20, 35, 36, 37,
				38, 39, 40, 45, 144, 225
			];

			if ( event.which === 9 && this.elementValue( element ) === "" || excludedKeys.join(',').indexOf( event.keyCode ) !== -1 ) {
				return;
			} else if ( element.name in this.submitted || element === this.lastElement ) {
				this.element( element );
			}
		},
		onclick: function( element ) {
			// click on selects, radiobuttons and checkboxes
			if ( element.name in this.submitted ) {
				this.element( element );
			// or option elements, check parent select in that case
			} else if ( element.parentNode.name in this.submitted ) {
				this.element( element.parentNode );
			}
		},
		highlight: function( element, errorClass, validClass ) {
			if ( element.type === "radio" ) {
				this.findByName( element.name ).addClass( errorClass ).removeClass( validClass );
			} else {
				$( element ).addClass( errorClass ).removeClass( validClass );
			}
		},
		unhighlight: function( element, errorClass, validClass ) {
			if ( element.type === "radio" ) {
				this.findByName( element.name ).removeClass( errorClass ).addClass( validClass );
			} else {
				$( element ).removeClass( errorClass ).addClass( validClass );
			}
		}
	},

	// http://jqueryvalidation.org/jQuery.validator.setDefaults/
	setDefaults: function( settings ) {
		$.extend( $.validator.defaults, settings );
	},

	messages: {
		required: "This field is required.",
		remote: "Please fix this field.",
		email: "Please enter a valid email address.",
		url: "Please enter a valid URL.",
		date: "Please enter a valid date.",
		dateISO: "Please enter a valid date ( ISO ).",
		number: "Please enter a valid number.",
		digits: "Please enter only digits.",
		creditcard: "Please enter a valid credit card number.",
		equalTo: "Please enter the same value again.",
		maxlength: $.validator.format( "Please enter no more than {0} characters." ),
		minlength: $.validator.format( "Please enter at least {0} characters." ),
		rangelength: $.validator.format( "Please enter a value between {0} and {1} characters long." ),
		range: $.validator.format( "Please enter a value between {0} and {1}." ),
		max: $.validator.format( "Please enter a value less than or equal to {0}." ),
		min: $.validator.format( "Please enter a value greater than or equal to {0}." )
	},

	autoCreateRanges: false,

	prototype: {

		init: function() {
			this.labelContainer = $( this.settings.errorLabelContainer );
			this.errorContext = this.labelContainer.length && this.labelContainer || $( this.currentForm );
			this.containers = $( this.settings.errorContainer ).add( this.settings.errorLabelContainer );
			this.submitted = {};
			this.valueCache = {};
			this.pendingRequest = 0;
			this.pending = {};
			this.invalid = {};
			this.reset();

			var groups = ( this.groups = {} ),
				rules;
			$.each( this.settings.groups, function( key, value ) {
				if ( typeof value === "string" ) {
					value = value.split( /\s/ );
				}
				$.each( value, function( index, name ) {
					groups[ name ] = key;
				});
			});
			rules = this.settings.rules;
			$.each( rules, function( key, value ) {
				rules[ key ] = $.validator.normalizeRule( value );
			});

			function delegate( event ) {
				var validator = $.data( this[ 0 ].form, "validator" ),
					eventType = "on" + event.type.replace( /^validate/, "" ),
					settings = validator.settings;
				if ( settings[ eventType ] && !this.is( settings.ignore ) ) {
					settings[ eventType ].call( validator, this[ 0 ], event );
				}
			}
			$( this.currentForm )
				.validateDelegate( ":text, [type='password'], [type='file'], select, textarea, " +
					"[type='number'], [type='search'] ,[type='tel'], [type='url'], " +
					"[type='email'], [type='datetime'], [type='date'], [type='month'], " +
					"[type='week'], [type='time'], [type='datetime-local'], " +
					"[type='range'], [type='color'], [type='radio'], [type='checkbox']",
					"focusin focusout keyup", delegate)
				// Support: Chrome, oldIE
				// "select" is provided as event.target when clicking a option
				.validateDelegate("select, option, [type='radio'], [type='checkbox']", "click", delegate);

			if ( this.settings.invalidHandler ) {
				$( this.currentForm ).bind( "invalid-form.validate", this.settings.invalidHandler );
			}

			// Add aria-required to any Static/Data/Class required fields before first validation
			// Screen readers require this attribute to be present before the initial submission http://www.w3.org/TR/WCAG-TECHS/ARIA2.html
			$( this.currentForm ).find( "[required], [data-rule-required], .required" ).attr( "aria-required", "true" );
		},

		// http://jqueryvalidation.org/Validator.form/
		form: function() {
			this.checkForm();
			$.extend( this.submitted, this.errorMap );
			this.invalid = $.extend({}, this.errorMap );
			if ( !this.valid() ) {
				$( this.currentForm ).triggerHandler( "invalid-form", [ this ]);
			}
			this.showErrors();
			return this.valid();
		},

		checkForm: function() {
			this.prepareForm();
			for ( var i = 0, elements = ( this.currentElements = this.elements() ); elements[ i ]; i++ ) {
				this.check( elements[ i ] );
			}
			return this.valid();
		},

		// http://jqueryvalidation.org/Validator.element/
		element: function( element ) {
			var cleanElement = this.clean( element ),
				checkElement = this.validationTargetFor( cleanElement ),
				result = true;

			this.lastElement = checkElement;

			if ( checkElement === undefined ) {
				delete this.invalid[ cleanElement.name ];
			} else {
				this.prepareElement( checkElement );
				this.currentElements = $( checkElement );

				result = this.check( checkElement ) !== false;
				if ( result ) {
					delete this.invalid[ checkElement.name ];
				} else {
					this.invalid[ checkElement.name ] = true;
				}
			}
			// Add aria-invalid status for screen readers
			$( element ).attr( "aria-invalid", !result );

			if ( !this.numberOfInvalids() ) {
				// Hide error containers on last error
				this.toHide = this.toHide.add( this.containers );
			}
			this.showErrors();
			return result;
		},

		// http://jqueryvalidation.org/Validator.showErrors/
		showErrors: function( errors ) {
			if ( errors ) {
				// add items to error list and map
				$.extend( this.errorMap, errors );
				this.errorList = [];
				for ( var name in errors ) {
					this.errorList.push({
						message: errors[ name ],
						element: this.findByName( name )[ 0 ]
					});
				}
				// remove items from success list
				this.successList = $.grep( this.successList, function( element ) {
					return !( element.name in errors );
				});
			}
			if ( this.settings.showErrors ) {
				this.settings.showErrors.call( this, this.errorMap, this.errorList );
			} else {
				this.defaultShowErrors();
			}
		},

		// http://jqueryvalidation.org/Validator.resetForm/
		resetForm: function() {
			if ( $.fn.resetForm ) {
				$( this.currentForm ).resetForm();
			}
			this.submitted = {};
			this.lastElement = null;
			this.prepareForm();
			this.hideErrors();
			var i, elements = this.elements()
				.removeData( "previousValue" )
				.removeAttr( "aria-invalid" );

			if ( this.settings.unhighlight ) {
				for ( i = 0; elements[ i ]; i++ ) {
					this.settings.unhighlight.call( this, elements[ i ],
						this.settings.errorClass, "" );
				}
			} else {
				elements.removeClass( this.settings.errorClass );
			}
		},

		numberOfInvalids: function() {
			return this.objectLength( this.invalid );
		},

		objectLength: function( obj ) {
			/* jshint unused: false */
			var count = 0,
				i;
			for ( i in obj ) {
				count++;
			}
			return count;
		},

		hideErrors: function() {
			this.hideThese( this.toHide );
		},

		hideThese: function( errors ) {
			errors.not( this.containers ).text( "" );
			this.addWrapper( errors ).hide();
		},

		valid: function() {
			return this.size() === 0;
		},

		size: function() {
			return this.errorList.length;
		},

		focusInvalid: function() {
			if ( this.settings.focusInvalid ) {
				try {
					$( this.findLastActive() || this.errorList.length && this.errorList[ 0 ].element || [])
					.filter( ":visible" )
					.focus()
					// manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
					.trigger( "focusin" );
				} catch ( e ) {
					// ignore IE throwing errors when focusing hidden elements
				}
			}
		},

		findLastActive: function() {
			var lastActive = this.lastActive;
			return lastActive && $.grep( this.errorList, function( n ) {
				return n.element.name === lastActive.name;
			}).length === 1 && lastActive;
		},

		elements: function() {
			var validator = this,
				rulesCache = {};

			// select all valid inputs inside the form (no submit or reset buttons)
			return $( this.currentForm )
			.find( "input, select, textarea" )
			.not( ":submit, :reset, :image, [disabled]" )
			.not( this.settings.ignore )
			.filter( function() {
				if ( !this.name && validator.settings.debug && window.console ) {
					console.error( "%o has no name assigned", this );
				}

				// select only the first element for each name, and only those with rules specified
				if ( this.name in rulesCache || !validator.objectLength( $( this ).rules() ) ) {
					return false;
				}

				rulesCache[ this.name ] = true;
				return true;
			});
		},

		clean: function( selector ) {
			return $( selector )[ 0 ];
		},

		errors: function() {
			var errorClass = this.settings.errorClass.split( " " ).join( "." );
			return $( this.settings.errorElement + "." + errorClass, this.errorContext );
		},

		reset: function() {
			this.successList = [];
			this.errorList = [];
			this.errorMap = {};
			this.toShow = $( [] );
			this.toHide = $( [] );
			this.currentElements = $( [] );
		},

		prepareForm: function() {
			this.reset();
			this.toHide = this.errors().add( this.containers );
		},

		prepareElement: function( element ) {
			this.reset();
			this.toHide = this.errorsFor( element );
		},

		elementValue: function( element ) {
			var val,
				$element = $( element ),
				type = element.type;

			if ( type === "radio" || type === "checkbox" ) {
				return this.findByName( element.name ).filter(":checked").val();
			} else if ( type === "number" && typeof element.validity !== "undefined" ) {
				return element.validity.badInput ? false : $element.val();
			}

			val = $element.val();
			if ( typeof val === "string" ) {
				return val.replace(/\r/g, "" );
			}
			return val;
		},

		check: function( element ) {
			element = this.validationTargetFor( this.clean( element ) );

			var rules = $( element ).rules(),
				rulesCount = $.map( rules, function( n, i ) {
					return i;
				}).length,
				dependencyMismatch = false,
				val = this.elementValue( element ),
				result, method, rule;

			for ( method in rules ) {
				rule = { method: method, parameters: rules[ method ] };
				try {

					result = $.validator.methods[ method ].call( this, val, element, rule.parameters );

					// if a method indicates that the field is optional and therefore valid,
					// don't mark it as valid when there are no other rules
					if ( result === "dependency-mismatch" && rulesCount === 1 ) {
						dependencyMismatch = true;
						continue;
					}
					dependencyMismatch = false;

					if ( result === "pending" ) {
						this.toHide = this.toHide.not( this.errorsFor( element ) );
						return;
					}

					if ( !result ) {
						this.formatAndAdd( element, rule );
						return false;
					}
				} catch ( e ) {
					if ( this.settings.debug && window.console ) {
						console.log( "Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.", e );
					}
					if ( e instanceof TypeError ) {
						e.message += ".  Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.";
					}

					throw e;
				}
			}
			if ( dependencyMismatch ) {
				return;
			}
			if ( this.objectLength( rules ) ) {
				this.successList.push( element );
			}
			return true;
		},

		// return the custom message for the given element and validation method
		// specified in the element's HTML5 data attribute
		// return the generic message if present and no method specific message is present
		customDataMessage: function( element, method ) {
			return $( element ).data( "msg" + method.charAt( 0 ).toUpperCase() +
				method.substring( 1 ).toLowerCase() ) || $( element ).data( "msg" );
		},

		// return the custom message for the given element name and validation method
		customMessage: function( name, method ) {
			var m = this.settings.messages[ name ];
			return m && ( m.constructor === String ? m : m[ method ]);
		},

		// return the first defined argument, allowing empty strings
		findDefined: function() {
			for ( var i = 0; i < arguments.length; i++) {
				if ( arguments[ i ] !== undefined ) {
					return arguments[ i ];
				}
			}
			return undefined;
		},

		defaultMessage: function( element, method ) {
			return this.findDefined(
				this.customMessage( element.name, method ),
				this.customDataMessage( element, method ),
				// title is never undefined, so handle empty string as undefined
				!this.settings.ignoreTitle && element.title || undefined,
				$.validator.messages[ method ],
				"<strong>Warning: No message defined for " + element.name + "</strong>"
			);
		},

		formatAndAdd: function( element, rule ) {
			var message = this.defaultMessage( element, rule.method ),
				theregex = /\$?\{(\d+)\}/g;
			if ( typeof message === "function" ) {
				message = message.call( this, rule.parameters, element );
			} else if ( theregex.test( message ) ) {
				message = $.validator.format( message.replace( theregex, "{$1}" ), rule.parameters );
			}
			this.errorList.push({
				message: message,
				element: element,
				method: rule.method
			});

			this.errorMap[ element.name ] = message;
			this.submitted[ element.name ] = message;
		},

		addWrapper: function( toToggle ) {
			if ( this.settings.wrapper ) {
				toToggle = toToggle.add( toToggle.parent( this.settings.wrapper ) );
			}
			return toToggle;
		},

		defaultShowErrors: function() {
			var i, elements, error;
			for ( i = 0; this.errorList[ i ]; i++ ) {
				error = this.errorList[ i ];
				if ( this.settings.highlight ) {
					this.settings.highlight.call( this, error.element, this.settings.errorClass, this.settings.validClass );
				}
				this.showLabel( error.element, error.message );
			}
			if ( this.errorList.length ) {
				this.toShow = this.toShow.add( this.containers );
			}
			if ( this.settings.success ) {
				for ( i = 0; this.successList[ i ]; i++ ) {
					this.showLabel( this.successList[ i ] );
				}
			}
			if ( this.settings.unhighlight ) {
				for ( i = 0, elements = this.validElements(); elements[ i ]; i++ ) {
					this.settings.unhighlight.call( this, elements[ i ], this.settings.errorClass, this.settings.validClass );
				}
			}
			this.toHide = this.toHide.not( this.toShow );
			this.hideErrors();
			this.addWrapper( this.toShow ).show();
		},

		validElements: function() {
			return this.currentElements.not( this.invalidElements() );
		},

		invalidElements: function() {
			return $( this.errorList ).map(function() {
				return this.element;
			});
		},

		showLabel: function( element, message ) {
			var place, group, errorID,
				error = this.errorsFor( element ),
				elementID = this.idOrName( element ),
				describedBy = $( element ).attr( "aria-describedby" );
			if ( error.length ) {
				// refresh error/success class
				error.removeClass( this.settings.validClass ).addClass( this.settings.errorClass );
				// replace message on existing label
				error.html( message );
			} else {
				// create error element
				error = $( "<" + this.settings.errorElement + ">" )
					.attr( "id", elementID + "-error" )
					.addClass( this.settings.errorClass )
					.html( message || "" );

				// Maintain reference to the element to be placed into the DOM
				place = error;
				if ( this.settings.wrapper ) {
					// make sure the element is visible, even in IE
					// actually showing the wrapped element is handled elsewhere
					place = error.hide().show().wrap( "<" + this.settings.wrapper + "/>" ).parent();
				}
				if ( this.labelContainer.length ) {
					this.labelContainer.append( place );
				} else if ( this.settings.errorPlacement ) {
					this.settings.errorPlacement( place, $( element ) );
				} else {
					place.insertAfter( element );
				}

				// Link error back to the element
				if ( error.is( "label" ) ) {
					// If the error is a label, then associate using 'for'
					error.attr( "for", elementID );
				} else if ( error.parents( "label[for='" + elementID + "']" ).length === 0 ) {
					// If the element is not a child of an associated label, then it's necessary
					// to explicitly apply aria-describedby

					errorID = error.attr( "id" ).replace( /(:|\.|\[|\]|\$)/g, "\\$1");
					// Respect existing non-error aria-describedby
					if ( !describedBy ) {
						describedBy = errorID;
					} else if ( !describedBy.match( new RegExp( "\\b" + errorID + "\\b" ) ) ) {
						// Add to end of list if not already present
						describedBy += " " + errorID;
					}
					$( element ).attr( "aria-describedby", describedBy );

					// If this element is grouped, then assign to all elements in the same group
					group = this.groups[ element.name ];
					if ( group ) {
						$.each( this.groups, function( name, testgroup ) {
							if ( testgroup === group ) {
								$( "[name='" + name + "']", this.currentForm )
									.attr( "aria-describedby", error.attr( "id" ) );
							}
						});
					}
				}
			}
			if ( !message && this.settings.success ) {
				error.text( "" );
				if ( typeof this.settings.success === "string" ) {
					error.addClass( this.settings.success );
				} else {
					this.settings.success( error, element );
				}
			}
			this.toShow = this.toShow.add( error );
		},

		errorsFor: function( element ) {
			var name = this.idOrName( element ),
				describer = $( element ).attr( "aria-describedby" ),
				selector = "label[for='" + name + "'], label[for='" + name + "'] *";

			// aria-describedby should directly reference the error element
			if ( describer ) {
				selector = selector + ", #" + describer.replace( /\s+/g, ", #" );
			}
			return this
				.errors()
				.filter( selector );
		},

		idOrName: function( element ) {
			return this.groups[ element.name ] || ( this.checkable( element ) ? element.name : element.id || element.name );
		},

		validationTargetFor: function( element ) {

			// If radio/checkbox, validate first element in group instead
			if ( this.checkable( element ) ) {
				element = this.findByName( element.name );
			}

			// Always apply ignore filter
			return $( element ).not( this.settings.ignore )[ 0 ];
		},

		checkable: function( element ) {
			return ( /radio|checkbox/i ).test( element.type );
		},

		findByName: function( name ) {
			return $( this.currentForm ).find( "[name='" + name + "']" );
		},

		getLength: function( value, element ) {
			switch ( element.nodeName.toLowerCase() ) {
			case "select":
				return $( "option:selected", element ).length;
			case "input":
				if ( this.checkable( element ) ) {
					return this.findByName( element.name ).filter( ":checked" ).length;
				}
			}
			return value.length;
		},

		depend: function( param, element ) {
			return this.dependTypes[typeof param] ? this.dependTypes[typeof param]( param, element ) : true;
		},

		dependTypes: {
			"boolean": function( param ) {
				return param;
			},
			"string": function( param, element ) {
				return !!$( param, element.form ).length;
			},
			"function": function( param, element ) {
				return param( element );
			}
		},

		optional: function( element ) {
			var val = this.elementValue( element );
			return !$.validator.methods.required.call( this, val, element ) && "dependency-mismatch";
		},

		startRequest: function( element ) {
			if ( !this.pending[ element.name ] ) {
				this.pendingRequest++;
				this.pending[ element.name ] = true;
			}
		},

		stopRequest: function( element, valid ) {
			this.pendingRequest--;
			// sometimes synchronization fails, make sure pendingRequest is never < 0
			if ( this.pendingRequest < 0 ) {
				this.pendingRequest = 0;
			}
			delete this.pending[ element.name ];
			if ( valid && this.pendingRequest === 0 && this.formSubmitted && this.form() ) {
				$( this.currentForm ).submit();
				this.formSubmitted = false;
			} else if (!valid && this.pendingRequest === 0 && this.formSubmitted ) {
				$( this.currentForm ).triggerHandler( "invalid-form", [ this ]);
				this.formSubmitted = false;
			}
		},

		previousValue: function( element ) {
			return $.data( element, "previousValue" ) || $.data( element, "previousValue", {
				old: null,
				valid: true,
				message: this.defaultMessage( element, "remote" )
			});
		}

	},

	classRuleSettings: {
		required: { required: true },
		email: { email: true },
		url: { url: true },
		date: { date: true },
		dateISO: { dateISO: true },
		number: { number: true },
		digits: { digits: true },
		creditcard: { creditcard: true }
	},

	addClassRules: function( className, rules ) {
		if ( className.constructor === String ) {
			this.classRuleSettings[ className ] = rules;
		} else {
			$.extend( this.classRuleSettings, className );
		}
	},

	classRules: function( element ) {
		var rules = {},
			classes = $( element ).attr( "class" );

		if ( classes ) {
			$.each( classes.split( " " ), function() {
				if ( this in $.validator.classRuleSettings ) {
					$.extend( rules, $.validator.classRuleSettings[ this ]);
				}
			});
		}
		return rules;
	},

	attributeRules: function( element ) {
		var rules = {},
			$element = $( element ),
			type = element.getAttribute( "type" ),
			method, value;

		for ( method in $.validator.methods ) {

			// support for <input required> in both html5 and older browsers
			if ( method === "required" ) {
				value = element.getAttribute( method );
				// Some browsers return an empty string for the required attribute
				// and non-HTML5 browsers might have required="" markup
				if ( value === "" ) {
					value = true;
				}
				// force non-HTML5 browsers to return bool
				value = !!value;
			} else {
				value = $element.attr( method );
			}

			// convert the value to a number for number inputs, and for text for backwards compability
			// allows type="date" and others to be compared as strings
			if ( /min|max/.test( method ) && ( type === null || /number|range|text/.test( type ) ) ) {
				value = Number( value );
			}

			if ( value || value === 0 ) {
				rules[ method ] = value;
			} else if ( type === method && type !== "range" ) {
				// exception: the jquery validate 'range' method
				// does not test for the html5 'range' type
				rules[ method ] = true;
			}
		}

		// maxlength may be returned as -1, 2147483647 ( IE ) and 524288 ( safari ) for text inputs
		if ( rules.maxlength && /-1|2147483647|524288/.test( rules.maxlength ) ) {
			delete rules.maxlength;
		}

		return rules;
	},

	dataRules: function( element ) {
		var method, value,
			rules = {}, $element = $( element );
		for ( method in $.validator.methods ) {
			value = $element.data( "rule" + method.charAt( 0 ).toUpperCase() + method.substring( 1 ).toLowerCase() );
			if ( value !== undefined ) {
				rules[ method ] = value;
			}
		}
		return rules;
	},

	staticRules: function( element ) {
		var rules = {},
			validator = $.data( element.form, "validator" );

		if ( validator.settings.rules ) {
			rules = $.validator.normalizeRule( validator.settings.rules[ element.name ] ) || {};
		}
		return rules;
	},

	normalizeRules: function( rules, element ) {
		// handle dependency check
		$.each( rules, function( prop, val ) {
			// ignore rule when param is explicitly false, eg. required:false
			if ( val === false ) {
				delete rules[ prop ];
				return;
			}
			if ( val.param || val.depends ) {
				var keepRule = true;
				switch ( typeof val.depends ) {
				case "string":
					keepRule = !!$( val.depends, element.form ).length;
					break;
				case "function":
					keepRule = val.depends.call( element, element );
					break;
				}
				if ( keepRule ) {
					rules[ prop ] = val.param !== undefined ? val.param : true;
				} else {
					delete rules[ prop ];
				}
			}
		});

		// evaluate parameters
		$.each( rules, function( rule, parameter ) {
			rules[ rule ] = $.isFunction( parameter ) ? parameter( element ) : parameter;
		});

		// clean number parameters
		$.each([ "minlength", "maxlength" ], function() {
			if ( rules[ this ] ) {
				rules[ this ] = Number( rules[ this ] );
			}
		});
		$.each([ "rangelength", "range" ], function() {
			var parts;
			if ( rules[ this ] ) {
				if ( $.isArray( rules[ this ] ) ) {
					rules[ this ] = [ Number( rules[ this ][ 0 ]), Number( rules[ this ][ 1 ] ) ];
				} else if ( typeof rules[ this ] === "string" ) {
					parts = rules[ this ].replace(/[\[\]]/g, "" ).split( /[\s,]+/ );
					rules[ this ] = [ Number( parts[ 0 ]), Number( parts[ 1 ] ) ];
				}
			}
		});

		if ( $.validator.autoCreateRanges ) {
			// auto-create ranges
			if ( rules.min != null && rules.max != null ) {
				rules.range = [ rules.min, rules.max ];
				delete rules.min;
				delete rules.max;
			}
			if ( rules.minlength != null && rules.maxlength != null ) {
				rules.rangelength = [ rules.minlength, rules.maxlength ];
				delete rules.minlength;
				delete rules.maxlength;
			}
		}

		return rules;
	},

	// Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
	normalizeRule: function( data ) {
		if ( typeof data === "string" ) {
			var transformed = {};
			$.each( data.split( /\s/ ), function() {
				transformed[ this ] = true;
			});
			data = transformed;
		}
		return data;
	},

	// http://jqueryvalidation.org/jQuery.validator.addMethod/
	addMethod: function( name, method, message ) {
		$.validator.methods[ name ] = method;
		$.validator.messages[ name ] = message !== undefined ? message : $.validator.messages[ name ];
		if ( method.length < 3 ) {
			$.validator.addClassRules( name, $.validator.normalizeRule( name ) );
		}
	},

	methods: {

		// http://jqueryvalidation.org/required-method/
		required: function( value, element, param ) {
			// check if dependency is met
			if ( !this.depend( param, element ) ) {
				return "dependency-mismatch";
			}
			if ( element.nodeName.toLowerCase() === "select" ) {
				// could be an array for select-multiple or a string, both are fine this way
				var val = $( element ).val();
				return val && val.length > 0;
			}
			if ( this.checkable( element ) ) {
				return this.getLength( value, element ) > 0;
			}
			return $.trim( value ).length > 0;
		},

		// http://jqueryvalidation.org/email-method/
		email: function( value, element ) {
			// From https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
			// Retrieved 2014-01-14
			// If you have a problem with this implementation, report a bug against the above spec
			// Or use custom methods to implement your own email validation
			return this.optional( element ) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test( value );
		},

		// http://jqueryvalidation.org/url-method/
		url: function( value, element ) {
			// contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
			return this.optional( element ) || /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test( value );
		},

		// http://jqueryvalidation.org/date-method/
		date: function( value, element ) {
			return this.optional( element ) || !/Invalid|NaN/.test( new Date( value ).toString() );
		},

		// http://jqueryvalidation.org/dateISO-method/
		dateISO: function( value, element ) {
			return this.optional( element ) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test( value );
		},

		// http://jqueryvalidation.org/number-method/
		number: function( value, element ) {
		    return this.optional( element ) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test( value );
		},

		// http://jqueryvalidation.org/digits-method/
		digits: function( value, element ) {
			return this.optional( element ) || /^\d+$/.test( value );
		},

		// http://jqueryvalidation.org/creditcard-method/
		// based on http://en.wikipedia.org/wiki/Luhn_algorithm
		creditcard: function( value, element ) {
			if ( this.optional( element ) ) {
				return "dependency-mismatch";
			}
			// accept only spaces, digits and dashes
			if ( /[^0-9 \-]+/.test( value ) ) {
				return false;
			}
			var nCheck = 0,
				nDigit = 0,
				bEven = false,
				n, cDigit;

			value = value.replace( /\D/g, "" );

			// Basing min and max length on
			// http://developer.ean.com/general_info/Valid_Credit_Card_Types
			if ( value.length < 13 || value.length > 19 ) {
				return false;
			}

			for ( n = value.length - 1; n >= 0; n--) {
				cDigit = value.charAt( n );
				nDigit = parseInt( cDigit, 10 );
				if ( bEven ) {
					if ( ( nDigit *= 2 ) > 9 ) {
						nDigit -= 9;
					}
				}
				nCheck += nDigit;
				bEven = !bEven;
			}

			return ( nCheck % 10 ) === 0;
		},

		// http://jqueryvalidation.org/minlength-method/
		minlength: function( value, element, param ) {
			var length = $.isArray( value ) ? value.length : this.getLength( value, element );
			return this.optional( element ) || length >= param;
		},

		// http://jqueryvalidation.org/maxlength-method/
		maxlength: function( value, element, param ) {
			var length = $.isArray( value ) ? value.length : this.getLength( value, element );
			return this.optional( element ) || length <= param;
		},

		// http://jqueryvalidation.org/rangelength-method/
		rangelength: function( value, element, param ) {
			var length = $.isArray( value ) ? value.length : this.getLength( value, element );
			return this.optional( element ) || ( length >= param[ 0 ] && length <= param[ 1 ] );
		},

		// http://jqueryvalidation.org/min-method/
		min: function( value, element, param ) {
			return this.optional( element ) || value >= param;
		},

		// http://jqueryvalidation.org/max-method/
		max: function( value, element, param ) {
			return this.optional( element ) || value <= param;
		},

		// http://jqueryvalidation.org/range-method/
		range: function( value, element, param ) {
			return this.optional( element ) || ( value >= param[ 0 ] && value <= param[ 1 ] );
		},

		// http://jqueryvalidation.org/equalTo-method/
		equalTo: function( value, element, param ) {
			// bind to the blur event of the target in order to revalidate whenever the target field is updated
			// TODO find a way to bind the event just once, avoiding the unbind-rebind overhead
			var target = $( param );
			if ( this.settings.onfocusout ) {
				target.unbind( ".validate-equalTo" ).bind( "blur.validate-equalTo", function() {
					$( element ).valid();
				});
			}
			return value === target.val();
		},

		// http://jqueryvalidation.org/remote-method/
		remote: function( value, element, param ) {
			if ( this.optional( element ) ) {
				return "dependency-mismatch";
			}

			var previous = this.previousValue( element ),
				validator, data;

			if (!this.settings.messages[ element.name ] ) {
				this.settings.messages[ element.name ] = {};
			}
			previous.originalMessage = this.settings.messages[ element.name ].remote;
			this.settings.messages[ element.name ].remote = previous.message;

			param = typeof param === "string" && { url: param } || param;

			if ( previous.old === value ) {
				return previous.valid;
			}

			previous.old = value;
			validator = this;
			this.startRequest( element );
			data = {};
			data[ element.name ] = value;
			$.ajax( $.extend( true, {
				url: param,
				mode: "abort",
				port: "validate" + element.name,
				dataType: "json",
				data: data,
				context: validator.currentForm,
				success: function( response ) {
					var valid = response === true || response === "true",
						errors, message, submitted;

					validator.settings.messages[ element.name ].remote = previous.originalMessage;
					if ( valid ) {
						submitted = validator.formSubmitted;
						validator.prepareElement( element );
						validator.formSubmitted = submitted;
						validator.successList.push( element );
						delete validator.invalid[ element.name ];
						validator.showErrors();
					} else {
						errors = {};
						message = response || validator.defaultMessage( element, "remote" );
						errors[ element.name ] = previous.message = $.isFunction( message ) ? message( value ) : message;
						validator.invalid[ element.name ] = true;
						validator.showErrors( errors );
					}
					previous.valid = valid;
					validator.stopRequest( element, valid );
				}
			}, param ) );
			return "pending";
		}

	}

});

$.format = function deprecated() {
	throw "$.format has been deprecated. Please use $.validator.format instead.";
};

// ajax mode: abort
// usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
// if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()

var pendingRequests = {},
	ajax;
// Use a prefilter if available (1.5+)
if ( $.ajaxPrefilter ) {
	$.ajaxPrefilter(function( settings, _, xhr ) {
		var port = settings.port;
		if ( settings.mode === "abort" ) {
			if ( pendingRequests[port] ) {
				pendingRequests[port].abort();
			}
			pendingRequests[port] = xhr;
		}
	});
} else {
	// Proxy ajax
	ajax = $.ajax;
	$.ajax = function( settings ) {
		var mode = ( "mode" in settings ? settings : $.ajaxSettings ).mode,
			port = ( "port" in settings ? settings : $.ajaxSettings ).port;
		if ( mode === "abort" ) {
			if ( pendingRequests[port] ) {
				pendingRequests[port].abort();
			}
			pendingRequests[port] = ajax.apply(this, arguments);
			return pendingRequests[port];
		}
		return ajax.apply(this, arguments);
	};
}

// provides delegate(type: String, delegate: Selector, handler: Callback) plugin for easier event delegation
// handler is only called when $(event.target).is(delegate), in the scope of the jquery-object for event.target

$.extend($.fn, {
	validateDelegate: function( delegate, type, handler ) {
		return this.bind(type, function( event ) {
			var target = $(event.target);
			if ( target.is(delegate) ) {
				return handler.apply(target, arguments);
			}
		});
	}
});

}));
/*!
 * jQuery Validation Plugin v1.13.2-pre
 *
 * http://jqueryvalidation.org/
 *
 * Copyright (c) 2015 Jörn Zaefferer
 * Released under the MIT license
 */
(function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		define("jquery.validate",["jquery", "jquery.validate.core"], factory );
	} else {
		factory( jQuery );
	}
}(function( $ ) {

  /**
   * 英文和空格
   */
  $.validator.addMethod('enCode',function(value,element,param){
    return this.optional(element) || !/[^a-zA-Z\s]/.test(value);
  },$.validator.format("请输入英文字符"));

  /**
   * 中文和空格
   */

  $.validator.addMethod('zhCode',function(value,element,param){
    return this.optional(element) || /^[\u2E80-\u9FFF\s]+$/.test(value);
  },$.validator.format("请输入中文字符"));

  /**
   * 手机号码
   */
  $.validator.addMethod('mobile',function(value,element,param){
    return this.optional(element) || /^\+?(86)?-?1\d{10}$/.test(value);
  },$.validator.format("请输入正确的手机号码"));

  /**
   * 固定电话(加区号)
   */
  $.validator.addMethod('phone',function(value,element,param){
    return this.optional(element) || /^(\d{3,4}-?)?\d{8}$/.test(value);
  },$.validator.format("请输入固定电话号码"));

  /**
   * 手机或固话
   */
  $.validator.addMethod('mobilePhone',function(value,element,param){
    return this.optional(element) || /^\+?(86)?-?1\d{10}$/.test(value) || /^(\d{3,4}-?)?\d{8}$/.test(value);
  },$.validator.format("请输入手机或固定电话号码"));

  /**
   * CSA编号
   */
  $.validator.addMethod('casCode',function(value,element,param){
    return this.optional(element) || /^\d+\-\d+\-\d+$/.test(value);
  },$.validator.format("请输入正确的CSA编号"));


  /* 中文 
   * Translated default messages for the jQuery validation plugin.
   * Locale: ZH (Chinese, 中文 (Zhōngwén), 汉语, 漢語)
   */
  $.extend($.validator.messages, {
    required: "这是必填字段",
    remote: "请修正此字段",
    email: "请输入有效的电子邮件地址",
    url: "请输入有效的网址",
    date: "请输入有效的日期",
    dateISO: "请输入有效的日期 (YYYY-MM-DD)",
    number: "请输入有效的数字",
    digits: "只能输入数字",
    creditcard: "请输入有效的信用卡号码",
    equalTo: "你的输入不相同",
    extension: "请输入有效的后缀",
    maxlength: $.validator.format("最多可以输入 {0} 个字符"),
    minlength: $.validator.format("最少要输入 {0} 个字符"),
    rangelength: $.validator.format("请输入长度在 {0} 到 {1} 之间的字符串"),
    range: $.validator.format("请输入范围在 {0} 到 {1} 之间的数值"),
    max: $.validator.format("请输入不大于 {0} 的数值"),
    min: $.validator.format("请输入不小于 {0} 的数值")
  });

  /**
   * 设置默认值
   */
  var defaultsHighlight = $.validator.defaults.highlight;
  $.validator.setDefaults({
    ignore : ".ignore",
    errorClass : "validate-error",
    success : function(label){
      //验证成功设置class并添加fa-check图标
      label.addClass('validate-success');
    },
    errorPlacement : function(error,element){
      element.parent().append(error);
    },
    highlight : function(el,errorClass){
      var $el = $(el);
      $el.siblings("."+errorClass).removeClass('validate-success');
      defaultsHighlight.apply(this,arguments);
    }
  });
  return $;
}));
/**
 * 滚动元素
 * new Marquee(options);
 * el : //主元素
 * direction : 'up',//方向,up,left
 * speed : 30,//速度
 * step : 1,//步长
 * visible : 1,//显示元素个数

 */

define('jquery.marquee',['jquery'],function($){

  function Marquee(opt){
    this.options = $.extend(true,{},arguments.callee.options,opt);
    this.$el = $(opt.el).addClass('ui-marquee');
    this.init();
  }
  $.extend(Marquee.prototype,{
    init : function(){
      var width,
          height,
          length,
          timer,
          options = this.options,
          _this   = this;

      this.$items = this.$el.children().addClass('ui-marquee-li');
      if(this.options.direction == "left") this.$items.css({float:"left"});
      width = this.$items.innerWidth(),height = this.$items.innerHeight();
      $.extend(this.options,{
        width : width,
        height : height,
        showWidth : width*this.$items.length,
        showHeight : height*this.$items.length
      });
      this.$items.detach();
      if(this.$items.length >= options.visible){//大于visible个元素则进行滚动
        this.$items = this.$items.add(this.$items.slice(0,options.visible).clone());//复制前visible个li，并添加到ul后
        length = this.$items.length;
        this.$itemBox = $('<div class="ui-marquee-list"></div>').append(this.$items).appendTo(this.$el);
        this.$el.css({overflow:'hidden',zoom:1});
        this.$itemBox.css({overflow:'hidden',zoom:1});
        switch(options.direction){
          case "left":{
            this.$items.css({width:options.width});
            this.$el.css({width:options.visible*options.width});
            this.$itemBox.css({width:length*options.width});
            break;
          }
          case "up":{
            this.$items.css({height:options.height});
            this.$el.css({height:options.visible*options.height});
            this.$itemBox.css({height:length*options.height});
            break;
          }
        }
      }

      this.$itemBox.hover($.proxy(this.stop,this),$.proxy(this.start,this));
      this.start();
    },
    roll : function(){
      var options = this.options,
      $el = this.$el;

      if(options.direction == "left"){
        if($el.scrollLeft() >= options.showWidth){
          $el.scrollLeft(0);
        }else{
          $el.scrollLeft($el.scrollLeft()+options.step);
        }
      }
      
      if(options.direction == "up"){
        if($el.scrollTop() >= options.showHeight){
          $el.scrollTop(0);
        }else{
          $el.scrollTop($el.scrollTop()+options.step);
        }
      }
    },
    start : function(){
      this.timer = setInterval($.proxy(this.roll,this),this.options.speed);
    },
    stop : function(){
      clearInterval(this.timer);
    }
  });
  $.extend(Marquee,{
    options : {
      direction : 'up',
      speed : 30,
      step : 1,
      visible : 1
    }
  });
  $.extend($.fn,{
    marquee : function(opt){
      opt = opt || {};
      var args = Array.prototype.slice.apply(arguments);
      args.shift();
      return this.each(function(){
        var $this = $(this);
        var data = $this.data('marquee');

        if($.type(opt) == 'object'){
          opt = $.extend({},opt,{el:$this});
          data = new Marquee(opt);
          $this.data('marquee',data);
        }
        if($.type(opt) == 'string') data[opt].apply(data,args);

        return this;
      });
    }
  });

  return Marquee;

});
   
define('jquery.pagination',['jquery','underscore'],function($,_){
  function Pagination(opt){
    this.$el = $(opt.el);
    var _data = this.$el.data(),data = {};
    _.mapObject(_data,function(v,k){
      switch(k){
        case 'page': {
          data.currentPage = v;
          break;
        }
        case 'size': {
          data.pageSize = v;
          break;
        }
        default: {
          data[k] = v;
        }
      }
    });
    this.options = $.extend(this,arguments.callee.options,data,opt);
    this.init();
  }

  $.extend(Pagination.prototype,{
    init: function(){
      this.$el.addClass('pagination');
      this._events();
      this.render();
    },
    setOptions: function(opt){
      $.extend(this,opt);
      var pageChange = $.Event('pageChange',{page : this.currentPage});
      this.$el.trigger(pageChange);
      this.render();
    },
    setPage: function(number){
      this.setOptions({currentPage:number});
    },
    setPageSize: function(number){
      this.setOptions({pageSize:number});
    },
    render: function(){
      var self = this;
      var totalPage = Math.ceil(this.total/this.pageSize);
      var items = [];
      this.$el.empty();
      if(totalPage <= 1) return;
      //添加当前页
      items.push({page: this.currentPage,html: this.currentPage,style:'current'});

      //添加显示条数
      _.times(this.displayEdges,_.bind(function(index){
        index = index+1;
        var prev = this.currentPage-index,
            next = this.currentPage+index;
        if(prev > 0){
          items.unshift({page: prev,html: prev});
        }
        if(next < totalPage+1){
          items.push({page: next,html: next});
        }
      },this));
      
      //添加边缘
      _.times(this.edges,_.bind(function(index){
        index = this.edges-index;
        var prevStart = this.currentPage-this.displayEdges;
        var nextStart = this.currentPage+this.displayEdges;
        var prev = index,
            next = totalPage+1-index;

        if(prev<prevStart){
          //添加省略
          if(index == this.edges && (prevStart>1+index)){
            items.unshift({page: 0,html: this.ellipseText,style:'ellipse'});
          }
          items.unshift({page: prev,html: prev});
          
        }
        if(next>nextStart){
          //添加省略
          if(index == this.edges &&(nextStart<totalPage-index)){
            items.push({page: 0,html: this.ellipseText,style:'ellipse'});
          }
          items.push({page: next,html: next});
        }

      },this));
      //上一页
      if(this.currentPage!=1){
        items.unshift({page: this.currentPage-1,html: this.prevHtml});
      }
      //下一页
      if(this.currentPage!=totalPage){
        items.push({page: this.currentPage+1,html: this.nextHtml});
      }

      //使用items列表生成节点
      var $els = this._createElements(items);
      this.$el.append($els);

      //附加功能
      this.showTotal && this.$el.append('<span class="total-page">共 '+totalPage+' 页</span>');
      this.skipPage && this._skipPage();
      this.pageSizeSelect && this._pageSizeSelect();
    },
    _events: function(){
      var self = this;
      this.$el.on('click','.page',function(){
        var $this = $(this);
        if($this.hasClass('ellipse')) return;
        if($this.hasClass('current')) return;
        self.setPage($this.data('page'));
      });
      this.$el.on('keydown','.skip',function(e){
        var totalPage = Math.ceil(self.total/self.pageSize);
        var $this = $(this);
        if(e.keyCode == 13){
          var val = parseInt($this.val());
          if(!isNaN(val) && val<=totalPage){
            var href = _.template(self.href)({page:val});
            //处理hash兼容
            if(href.search("#") == 0){
              location.hash = href.substring(1);
            }
            self.setPage(val);
          }else{
            $this.val('');
          }
        }
      });
      this.$el.on('change','.page-size',function(){
        self.setPageSize($(this).val());
      });
    },
    _createElements: function(items){
      var self = this,$els = $();
      ($.type(items) == "object") && (items = [items]);
      $.each(items,function(index,item){
        item.href = item.page ? _.template(self.href)({page:item.page}) : "javascript:;";
        var opt = $.extend({style:'',href:"javascript:;"},item);
        var $el = $(self._elementTemp(opt));
        $els = $els.add($el);
        $el.data('page',opt.page);
      });
      return $els;
    },
    _skipPage: function(){
      var $el = $(this._skipPageTemp({
        items: this.pageSizeArray,
        pageSize: this.pageSize
      }));
      this.$el.append($el);
    },
    _pageSizeSelect: function(){
      var $el = $(this._pageSizeSelectTemp({
        items: this.pageSizeArray,
        pageSize: this.pageSize
      }));
      this.$el.append($el);
    },
    _skipPageTemp: _.template([
      '<span class="skip-page">跳转到 <input type="text" class="skip" value="" /> 页</span>'
    ].join('')),
    _pageSizeSelectTemp: _.template([
      '<select class="page-size">',
        '<% _.each(items,function(item,index){ %>',
        '<option value="<%= item %>" <% if(item == pageSize){ %>selected="selected"<%}%> ><%= item %></option>',
        '<% }); %>',
      '</select>'
    ].join('')),
    _elementTemp: _.template([
      '<a href="<%= href%>" class="page <%= style %>"><%= html %></a>'
    ].join(''))
  });

  $.extend(Pagination,{
    options : {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      edges: 1,
      displayEdges: 2,
      prevHtml: "上一页",
      nextHtml: "下一页",
      href: "#page-<%= page %>",
      ellipseText: "&hellip;",
      pageSizeSelect: false,//是否允许选择每页数量
      pageSizeArray: [10,20,50,100],//分页选择控制
      skipPage: false,//是否允许跳转到指定页
      showTotal: false,//是否显示总页数
      onChange: $.noop
    }
  });

  function Plugin(option) {
    option = option || {}
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.pagination')
      option.el = $this;

      if (!data) $this.data('bs.pagination', (data = new Pagination(option)))
      if (typeof option == 'string') data[option].call($this)
    })
  }
  $.fn.pagination = Plugin;
  $.fn.pagination.Constructor = Pagination;

});

define('jquery.placeholder',['jquery','modernizr'],function($,modernizr){
  function Placeholder(opt){
    Placeholder.options.id++;
    this.options = $.extend(true,{},Placeholder.options,opt);
    this.$el = $(opt.el);
    this.init();
  }

  $.extend(Placeholder.prototype,{
    init : function(){
      if(modernizr.input.placeholder){
        return;
      }
      var _this = this;
      var options = this.options;
      options.height = this.$el.height();
      var height = options.height;
      var borderWidth = parseInt(this.$el.css('borderTopWidth')) || 0;
      var id = this.$el.attr('id');
      if(!id){
        id = 'placeholder_'+options.id;
        this.$el.attr('id',id);
      }
      this.$label = $('<label for="'+id+'">'+options.placeholder+'</label>')
        .css({
          position : 'absolute',
          cursor : 'text',
          color : "graytext",
          fontSize : this.$el.css('fontSize'),
          paddingTop : parseInt(this.$el.css('paddingTop'))+borderWidth,
          paddingLeft : parseInt(this.$el.css('paddingLeft'))+borderWidth,
          lineHeight : height+'px'
        }).insertBefore(this.$el);
      this.$el.on('keyup focus input propertychange',function(){
        if(_this.$el.val() == ""){
          _this.$label.text(options.placeholder);
        }else{
          _this.$label.text("");
        }
      });
      this.$el.trigger('input');
    }
  });

  $.extend(Placeholder,{
    options : {
      placeholder : '请输入内容',
      id : 1
    }
  });

  $.fn.extend({
    placeholder : function(opt){
      opt = opt || {};
      var args = Array.prototype.slice.apply(arguments);
      args.shift();
      return this.each(function(){
        var $this = $(this);
        var data = $this.data('placeholder');

        if($.type(opt) == 'object'){
          opt = $.extend({},opt,{
            el:$this,
            placeholder:$this.attr('placeholder')
          });
          data = new Placeholder(opt);
          $this.data('placeholder',data);
        }
        if($.type(opt) == 'string') data[opt].apply(data,args);

        return this;
      });
    }
  });

  return Placeholder;

});

/* Plax version 1.4.1 */

/*
  Copyright (c) 2011 Cameron McEfee

  Permission is hereby granted, free of charge, to any person obtaining
  a copy of this software and associated documentation files (the
  "Software"), to deal in the Software without restriction, including
  without limitation the rights to use, copy, modify, merge, publish,
  distribute, sublicense, and/or sell copies of the Software, and to
  permit persons to whom the Software is furnished to do so, subject to
  the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
  WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

//官方 (function ($) {
define('jquery.plax',['jquery'],function($){
  var maxfps             = 25,
      delay              = 1 / maxfps * 1000,
      lastRender         = new Date().getTime(),
      layers             = [],
      plaxActivityTarget = $(window),
      motionDegrees      = 30,
      motionMax          = 1,
      motionMin          = -1,
      motionStartX       = null,
      motionStartY       = null,
      ignoreMoveable     = false,
      options            = null;

  var defaults = {
    useTransform : true
  };

  // Public Methods
  $.fn.plaxify = function (params){
    options = $.extend({}, defaults, params);
    options.useTransform = (options.useTransform ? supports3dTransform() : false);

    return this.each(function () {

      var layerExistsAt = -1;
      var layer         = {
        "xRange": $(this).data('xrange') || 0,
        "yRange": $(this).data('yrange') || 0,
        "zRange": $(this).data('zrange') || 0,
        "invert": $(this).data('invert') || false,
        "background": $(this).data('background') || false
      };

      for (var i=0;i<layers.length;i++){
        if (this === layers[i].obj.get(0)){
          layerExistsAt = i;
        }
      }

      for (var param in params) {
        if (layer[param] == 0) {
          layer[param] = params[param];
        }
      }

      layer.inversionFactor = (layer.invert ? -1 : 1); // inversion factor for calculations

      // Add an object to the list of things to parallax
      layer.obj    = $(this);
      if(layer.background) {
        // animate using the element's background
        pos = (layer.obj.css('background-position') || "0px 0px").split(/ /);
        if(pos.length != 2) {
          return;
        }
        x = pos[0].match(/^((-?\d+)\s*px|0+\s*%|left)$/);
        y = pos[1].match(/^((-?\d+)\s*px|0+\s*%|top)$/);
        if(!x || !y) {
          // no can-doesville, babydoll, we need pixels or top/left as initial values (it mightbe possible to construct a temporary image from the background-image property and get the dimensions and run some numbers, but that'll almost definitely be slow)
          return;
        }
        layer.originX = layer.startX = x[2] || 0;
        layer.originY = layer.startY = y[2] || 0;
        layer.transformOriginX = layer.transformStartX = 0;
        layer.transformOriginY = layer.transformStartY = 0;
        layer.transformOriginZ = layer.transformStartZ = 0;

      } else {

        // Figure out where the element is positioned, then reposition it from the top/left, same for transform if using translate3d
        var position           = layer.obj.position(),
            transformTranslate = get3dTranslation(layer.obj);

        layer.obj.css({
          'transform' : transformTranslate.join() + 'px',
          'top'   : position.top,
          'left'  : position.left,
          'right' :'',
          'bottom':''
        });
        layer.originX = layer.startX = position.left;
        layer.originY = layer.startY = position.top;
        layer.transformOriginX = layer.transformStartX = transformTranslate[0];
        layer.transformOriginY = layer.transformStartY = transformTranslate[1];
        layer.transformOriginZ = layer.transformStartZ = transformTranslate[2];
      }

      layer.startX -= layer.inversionFactor * Math.floor(layer.xRange/2);
      layer.startY -= layer.inversionFactor * Math.floor(layer.yRange/2);

      layer.transformStartX -= layer.inversionFactor * Math.floor(layer.xRange/2);
      layer.transformStartY -= layer.inversionFactor * Math.floor(layer.yRange/2);
      layer.transformStartZ -= layer.inversionFactor * Math.floor(layer.zRange/2);

      if(layerExistsAt >= 0){
        layers.splice(layerExistsAt,1,layer);
      } else {
        layers.push(layer);
      }

    });
  };

  // Get the translate position of the element
  //
  // return 3 element array for translate3d
  function get3dTranslation(obj) {
    var translate = [0,0,0],
        matrix    = obj.css("-webkit-transform") ||
                    obj.css("-moz-transform")    ||
                    obj.css("-ms-transform")     ||
                    obj.css("-o-transform")      ||
                    obj.css("transform");

    if(matrix !== 'none') {
      var values = matrix.split('(')[1].split(')')[0].split(',');
      var x = 0,
          y = 0,
          z = 0;
      if(values.length == 16){
        // 3d matrix
        x = (parseFloat(values[values.length - 4]));
        y = (parseFloat(values[values.length - 3]));
        z = (parseFloat(values[values.length - 2]));
      }else{
        // z is not transformed as is not a 3d matrix
        x = (parseFloat(values[values.length - 2]));
        y = (parseFloat(values[values.length - 1]));
        z = 0;
      }
      translate = [x,y,z];
    }
    return translate;
  }

  // Check if element is in viewport area
  //
  // Returns boolean
  function inViewport(element) {
    if (element.offsetWidth === 0 || element.offsetHeight === 0) return false;

	var height = document.documentElement.clientHeight,
      rects  = element.getClientRects();

	for (var i = 0, l = rects.length; i < l; i++) {

    var r           = rects[i],
        in_viewport = r.top > 0 ? r.top <= height : (r.bottom > 0 && r.bottom <= height);

    if (in_viewport) return true;
	}
	return false;
  }

  // Check support for 3dTransform
  //
  // Returns boolean
  function supports3dTransform() {
    var el = document.createElement('p'),
        has3d,
        transforms = {
          'webkitTransform':'-webkit-transform',
          'OTransform':'-o-transform',
          'msTransform':'-ms-transform',
          'MozTransform':'-moz-transform',
          'transform':'transform'
        };

    document.body.insertBefore(el, null);

    for (var t in transforms) {
      if (el.style[t] !== undefined) {
        el.style[t] = "translate3d(1px,1px,1px)";
        has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
      }
    }

    document.body.removeChild(el);
    return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
  }

  // Determine if the device has an accelerometer
  //
  // returns true if the browser has window.DeviceMotionEvent (mobile)
  function moveable(){
    return (ignoreMoveable===true) ? false : window.DeviceOrientationEvent !== undefined;
  }

  // The values pulled from the gyroscope of a motion device.
  //
  // Returns an object literal with x and y as options.
  function valuesFromMotion(e) {
    x = e.gamma;
    y = e.beta;

    // Swap x and y in Landscape orientation
    if (Math.abs(window.orientation) === 90) {
      var a = x;
      x = y;
      y = a;
    }

    // Invert x and y in upsidedown orientations
    if (window.orientation < 0) {
      x = -x;
      y = -y;
    }

    motionStartX = (motionStartX === null) ? x : motionStartX;
    motionStartY = (motionStartY === null) ? y : motionStartY;

    return {
      x: x - motionStartX,
      y: y - motionStartY
    };
  }

  // Move the elements in the `layers` array within their ranges,
  // based on mouse or motion input
  //
  // Parameters
  //
  //  e - mousemove or devicemotion event
  //
  // returns nothing
  function plaxifier(e) {
    if (new Date().getTime() < lastRender + delay) return;
      lastRender = new Date().getTime();

    var leftOffset = (plaxActivityTarget.offset() != null) ? plaxActivityTarget.offset().left : 0,
        topOffset  = (plaxActivityTarget.offset() != null) ? plaxActivityTarget.offset().top : 0,
        x          = e.pageX-leftOffset,
        y          = e.pageY-topOffset;

    if (!inViewport(layers[0].obj[0].parentNode)) return;

    if(moveable()){
      if(e.gamma === undefined){
        ignoreMoveable = true;
        return;
      }
      values = valuesFromMotion(e);

      // Admittedly fuzzy measurements
      x = values.x / motionDegrees;
      y = values.y / motionDegrees;
      // Ensure not outside of expected range, -1 to 1
      x = x < motionMin ? motionMin : (x > motionMax ? motionMax : x);
      y = y < motionMin ? motionMin : (y > motionMax ? motionMax : y);
      // Normalize from -1 to 1 => 0 to 1
      x = (x + 1) / 2;
      y = (y + 1) / 2;
    }

    var hRatio = x/((moveable() === true) ? motionMax : plaxActivityTarget.width()),
        vRatio = y/((moveable() === true) ? motionMax : plaxActivityTarget.height()),
        layer, i;

    for (i = layers.length; i--;) {
      layer = layers[i];
      if(options.useTransform && !layer.background){
        newX = layer.transformStartX + layer.inversionFactor*(layer.xRange*hRatio);
        newY = layer.transformStartY + layer.inversionFactor*(layer.yRange*vRatio);
        newZ = layer.transformStartZ;
        layer.obj
            .css({'transform':'translate3d('+newX+'px,'+newY+'px,'+newZ+'px)'});
      }else{
        newX = layer.startX + layer.inversionFactor*(layer.xRange*hRatio);
        newY = layer.startY + layer.inversionFactor*(layer.yRange*vRatio);
        if(layer.background) {
          layer.obj
            .css('background-position', newX+'px '+newY+'px');
        } else {
          layer.obj
            .css('left', newX)
            .css('top', newY);
        }
      }
    }
  }

  $.plax = {
    // Begin parallaxing
    //
    // Parameters
    //
    //  opts - options for plax
    //    activityTarget - optional; plax will only work within the bounds of this element, if supplied.
    //
    //  Examples
    //
    //    $.plax.enable({ "activityTarget": $('#myPlaxDiv')})
    //    # plax only happens when the mouse is over #myPlaxDiv
    //
    // returns nothing
    enable: function(opts){
      if (opts) {
        if (opts.activityTarget) plaxActivityTarget = opts.activityTarget || $(window);
        if (typeof opts.gyroRange === 'number' && opts.gyroRange > 0) motionDegrees = opts.gyroRange;
      }

      plaxActivityTarget.bind('mousemove.plax', function (e) {
        plaxifier(e);
      });

      if(moveable()){
        window.ondeviceorientation = function(e){plaxifier(e);};
      }

    },

    // Stop parallaxing
    //
    //  Examples
    //
    //    $.plax.disable()
    //    # plax no longer runs
    //
    //    $.plax.disable({ "clearLayers": true })
    //    # plax no longer runs and all layers are forgotten
    //
    // returns nothing
    disable: function(opts){
      $(document).unbind('mousemove.plax');
      window.ondeviceorientation = undefined;
      if (opts && typeof opts.restorePositions === 'boolean' && opts.restorePositions) {
        for(var i = layers.length; i--;) {
          layer = layers[i];
          if(options.useTransform && !layer.background){
            layer.obj
                .css('transform', 'translate3d('+layer.transformOriginX+'px,'+layer.transformOriginY+'px,'+layer.transformOriginZ+'px)')
                .css('top', layer.originY);
          }else{
            if(layers[i].background) {
              layer.obj.css('background-position', layer.originX+'px '+layer.originY+'px');
            } else {
              layer.obj
                .css('left', layer.originX)
                .css('top', layer.originY);
            }
          }
        }
      }
      if (opts && typeof opts.clearLayers === 'boolean' && opts.clearLayers) layers = [];
    }
  };

  if (typeof ender !== 'undefined') {
    $.ender($.fn, true);
  }

})/*(function () {
  return typeof jQuery !== 'undefined' ? jQuery : ender;
}())*/;

define('jquery.sliderbox',['jquery','underscore',
  'jquery.easing'],function($,_){
  //滑动显示一个列表
  var SliderBox = function(opt){
    this.options = $.extend(true,{},arguments.callee.options,opt);
    this.$el = $(opt.el);
    this.init();
  }
  $.extend(SliderBox.prototype,{
    init : function(){
      var _this = this;
      this.$el.css({
        position:'relative',
        overflow:'hidden'
      });
      this.$items = this.$el.children().detach().addClass('ui-sliderbox-item');
      if(this.options.direction == "vertical") this.$items.css({float:'left'});
      this.$itemBox = $('<div class="ui-sliderbox-box"></div>').css({
        position:'absolute',left:0,top:0
      }).append(this.$items).appendTo(this.$el);

      if(this.options.direction == "horizontal") this.$itemBox.css({width:'100%'});

      this.current = 0;
      var width = this.$items.eq(0).outerWidth(true),
          height = this.$items.eq(0).outerHeight(true);
      this.options.item = {
        width : width,
        height : height
      }
      if(this.options.direction == "horizontal"){
        this.$itemBox.css({height:height*this.$items.length});
      }else{
        this.$itemBox.css({width:width*this.$items.length});
      }

      this.$el.css({
        width : width,
        height : height
      }).addClass('ui-sliderbox');
      this.initControl();
      this.slider(0);
      if(this.options.auto){
        if(this.options.hoverPause){
          this.$el.hover($.proxy(this.closeAuto,this),$.proxy(this.openAuto,this));
        }
        this.openAuto();
      }
    },
    initControl : function(){
      var _this = this;
      if(!this.options.control){
        this.$controlBox = $('<div>');
        return ;
      }
      this.$controlBox = $('<div class="ui-sliderbox-control"></div>').appendTo(this.$el);
      this.$controlBox.css({
        position:'absolute'
      });
      this.$items.each(function(i){
        var $ct;
        if(!!_this.options.createControl){
          $ct = _this.options.createControl($(this),i);
        }else{
          $ct = $('<a href="javascript:;">'+i+'</a>');
        }
        _this.$controlBox.append($ct);
      });
      this.$controlBox.on(this.options.eventType,'a',function(){
        var $this = $(this);
        _this.slider($this.index());
      });
      this.$el.on('slider',function(e){
        _this.$controlBox.children().eq(e.index).addClass('active')
        .siblings('.active').removeClass('active');
      });
    },
    slider : function(index,direction){
      var _this = this;
      var fx = this.options.fx;

      index = (this.$items.length+index) % this.$items.length
      
      if(this.options.direction == "horizontal"){
        endCss = {top:-this.options.item.height*index}
      }else{
        endCss = {left:-this.options.item.width*index}
      }
      this.$itemBox.stop(true).animate(endCss,{
        duration : fx.duration,
        easing : fx.easing
      });
      var event = $.Event('slider',{index : index});
      this.$el.trigger(event);
      this.current = index;
    },
    prev : function(){
      this.slider(this.current-1);
    },
    next : function(){
      this.slider(this.current+1);
    },
    openAuto: function(){
      clearInterval(this.timer);
      this.timer = setInterval($.proxy(this.next,this),this.options.delay);
    },
    closeAuto: function(){
      clearInterval(this.timer);
    }
  });
  $.extend(SliderBox,{
    options : {
      direction : 'vertical',//horizontal,vertical
      eventType : 'click',
      displayNumber : 1,
      control : true,
      auto : true,
      hoverPause: true,
      delay : 3000,
      fx : {
        duration : 400,
        easing : 'easeOutExpo'
      }
    }
  });

  $.fn.extend({
    sliderbox : function(opt){
      opt = opt || {};
      var args = Array.prototype.slice.apply(arguments);
      args.shift();
      return this.each(function(){
        var $this = $(this);
        var data = $this.data('sliderbox');

        if($.type(opt) == 'object'){
          opt = $.extend({},opt,{el:$this});
          data = new SliderBox(opt);
          $this.data('sliderbox',data);
        }
        if($.type(opt) == 'string') data[opt].apply(data,args);

        return this;
      });
    }
  });

  return SliderBox

});
define('jquery.waterfall',['jquery','underscore',
  'jquery.easing'],function($,_){
  //简单瀑布流实现
  var Waterfall = function(opt){
    this.options = $.extend(true,{},Waterfall.options,opt);
    this.$el = $(opt.el).css({position:'relative'});
    var _heights = [];
    $.extend(this,{
      createHeight : function(){
        _heights = new Array();
        $.each(_.range(this.options.column),function(index,ar){
          _heights.push(0)
        });
      },
      getHeight : function(index){
        return _heights[index] || _heights;
      },
      setHeight : function(index,height){
        _heights[index] = height;
      },
      getMinHeight : function(){
        return Math.min.apply(null,_heights);
      },
      getMaxHeight : function(){
        return Math.max.apply(null,_heights);
      },
      getMinIndex : function(){
        return _(_heights).indexOf(this.getMinHeight()) || 0;
      }
    });

    this.createHeight();
    this.init();
  }
  $.extend(Waterfall.prototype,{
    init : function(){
      var _this = this;
      list = this.$el.children().detach().toArray();
      _this.append(list);
    },
    append : function(list){
      var _this = this;
      if(list instanceof $){
        list = list.toArray();
      }
      if(!$.isArray(list)){
        list = [list];
      }
      $.each(list,function(){
        var $item = $(this).css({visibility:'hidden'}).appendTo(_this.$el);
        var itemAttr = {
          width : $item.outerWidth(true),
          height : $item.outerHeight(true)
        }

        var index = _this.getMinIndex();
        var minHeight = _this.getMinHeight();

        $item.css({
          position : 'absolute',
          left : index*itemAttr.width,
          top : minHeight,
        });
        _this.setHeight(index,minHeight+itemAttr.height);
      });
      this.$el.height(this.getMaxHeight());
      this.show(list);
    },
    show : function(list){
      var _this = this;
      var fx = _this.options.fx;
      $.each(_this.options.sort(list),function(){
        var $item = $(this);
        _this.$el.delay(fx.delay).queue(function(){
          var position = $item.position();
          var fromCss = $.extend({visibility:'visible'},position,_this.options.from(position,$item));
          var toCss = $.extend(position,_this.options.to(position,$item));
          $item.css(fromCss).animate(toCss,{
            duration : fx.duration,
            easing : fx.easing
          });
          $(_this.$el).dequeue();
        });
      });
    },
    refresh : function(){
      this.createHeight();
      this.append(this.$el.css({height:0}).stop(true,true).children().detach().stop(true,true));
    }
  });
  $.extend(Waterfall,{
    options : {
      column : 2,
      fx : {
        delay : 100,
        duration : 200,
        easing : 'linear'
      },
      from : function(position,$item){
        return {
          left : 300,
          top : 0,
          opacity : 0
        }
      },
      to : function(position,$item){
        return {
          left : position.left,
          top : position.top,
          opacity : 1
        }
      },
      sort : function(list){
        return list;
      }
    }
  });

  $.fn.extend({
    waterfall : function(opt){
      opt = opt || {};
      var args = Array.prototype.slice.apply(arguments);
      args.shift();
      return this.each(function(){
        var $this = $(this);
        var data = $this.data('waterfall');

        if($.type(opt) == 'object'){
          opt = $.extend({},opt,{el:$this});
          data = new Waterfall(opt);
          $this.data('waterfall',data);
        }
        if($.type(opt) == 'string') data[opt].apply(data,args);

        return this;
      });
    }
  });

  return Waterfall

});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBsdWdpbi5qcyIsImNsZWFySW5wdXQuanMiLCJkcm9wZG93bi5qcyIsImZvY3VzSW5wdXQuanMiLCJqcXVlcnkuZWFzaW5nLjEuMy5qcyIsImpxdWVyeS52YWxpZGF0ZS5jb3JlLmpzIiwianF1ZXJ5LnZhbGlkYXRlLmpzIiwibWFycXVlZS5qcyIsInBhZ2luYXRpb24uanMiLCJwbGFjZWhvbGRlci5qcyIsInBsYXguanMiLCJzbGlkZXJib3guanMiLCJ3YXRlcmZhbGwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM01BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3gzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNySkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoicGx1Z2luLmpzIiwic291cmNlc0NvbnRlbnQiOltudWxsLCJkZWZpbmUoJ2pxdWVyeS5jbGVhcklucHV0JyxbJ2pxdWVyeSddLGZ1bmN0aW9uKCQpe1xyXG4gIGZ1bmN0aW9uIENsZWFySW5wdXQob3B0KXtcclxuICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUse30sQ2xlYXJJbnB1dC5vcHRpb25zLG9wdCk7XHJcbiAgICB0aGlzLiRlbCA9ICQob3B0LmVsKTtcclxuICAgIHRoaXMuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgJC5leHRlbmQoQ2xlYXJJbnB1dC5wcm90b3R5cGUse1xyXG4gICAgaW5pdCA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgIHRoaXMub3B0aW9ucy5oZWlnaHQgPSB0aGlzLiRlbC5vdXRlckhlaWdodCgpO1xyXG4gICAgICB2YXIgaGVpZ2h0ID0gdGhpcy5vcHRpb25zLmhlaWdodDtcclxuICAgICAgdGhpcy4kYnV0dG9uID0gJCgnPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiPiZ0aW1lczs8L2E+JylcclxuICAgICAgICAuY3NzKHtcclxuICAgICAgICAgIHBvc2l0aW9uIDogJ2Fic29sdXRlJyxcclxuICAgICAgICAgIGRpc3BsYXkgOiAnbm9uZScsXHJcbiAgICAgICAgICBoZWlnaHQgOiBoZWlnaHQsXHJcbiAgICAgICAgICB3aWR0aCA6IGhlaWdodCxcclxuICAgICAgICAgIGZvbnRTaXplIDogTWF0aC5jZWlsKGhlaWdodCowLjgpLFxyXG4gICAgICAgICAgZm9udFdlaWdodCA6IDcwMCxcclxuICAgICAgICAgIGNvbG9yIDogXCIjMDAwXCIsXHJcbiAgICAgICAgICBsaW5lSGVpZ2h0IDogaGVpZ2h0LTIrJ3B4JyxcclxuICAgICAgICAgIHZlcnRpY2FsQWxpZ24gOiAnbWlkZGxlJyxcclxuICAgICAgICAgIHRleHREZWNvcmF0aW9uIDogJ25vbmUnLFxyXG4gICAgICAgICAgdGV4dEFsaWduIDogJ2NlbnRlcidcclxuICAgICAgICB9KS5hcHBlbmRUbygkKGRvY3VtZW50LmJvZHkpKTtcclxuICAgICAgdGhpcy4kYnV0dG9uLm9uKCdtb3VzZWRvd24nLCQucHJveHkodGhpcy5jbGVhcix0aGlzKSk7XHJcbiAgICAgIHRoaXMuJGVsLm9uKCdmb2N1cyBrZXl1cCBpbnB1dCBwcm9wZXJ0eWNoYW5nZScsZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgaWYoZS50eXBlID09ICdmb2N1cycpIF90aGlzLnBvc2l0aW9uKCk7XHJcbiAgICAgICAgX3RoaXMuYWN0aW9uKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLiRlbC5vbignYmx1cicsJC5wcm94eSh0aGlzLmhpZGUsdGhpcykpO1xyXG4gICAgICB0aGlzLnBvc2l0aW9uKCk7XHJcbiAgICAgIHRoaXMuJGVsLm9uKCdyZW1vdmUnLCQucHJveHkodGhpcy5kZXN0b3J5LHRoaXMpKTtcclxuICAgIH0sXHJcbiAgICBzaG93IDogZnVuY3Rpb24oKXtcclxuICAgICAgdGhpcy4kYnV0dG9uLnNob3coKTtcclxuICAgIH0sXHJcbiAgICBoaWRlIDogZnVuY3Rpb24oKXtcclxuICAgICAgdGhpcy4kYnV0dG9uLmhpZGUoKTtcclxuICAgIH0sXHJcbiAgICBwb3NpdGlvbiA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHZhciB3aWR0aCA9IHRoaXMuJGVsLm91dGVyV2lkdGgoKTtcclxuICAgICAgdmFyIG9mZnNldCA9IHRoaXMuJGVsLm9mZnNldCgpO1xyXG4gICAgICBvZmZzZXQubGVmdCA9IG9mZnNldC5sZWZ0ICsgd2lkdGggLSB0aGlzLm9wdGlvbnMuaGVpZ2h0O1xyXG4gICAgICB0aGlzLiRidXR0b24uY3NzKG9mZnNldCk7XHJcbiAgICB9LFxyXG4gICAgYWN0aW9uIDogZnVuY3Rpb24oKXtcclxuICAgICAgaWYodGhpcy4kZWwudmFsKCkgIT09IFwiXCIpe1xyXG4gICAgICAgIHRoaXMuc2hvdygpO1xyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICB0aGlzLmhpZGUoKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGNsZWFyIDogZnVuY3Rpb24oKXtcclxuICAgICAgdGhpcy4kZWwudmFsKCcnKS50cmlnZ2VyKCdmb2N1cycpO1xyXG4gICAgfSxcclxuICAgIGRlc3RvcnkgOiBmdW5jdGlvbigpe1xyXG4gICAgICB0aGlzLiRidXR0b24ucmVtb3ZlKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gICQuZXh0ZW5kKENsZWFySW5wdXQse1xyXG4gICAgb3B0aW9ucyA6IHtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgJC5mbi5leHRlbmQoe1xyXG4gICAgY2xlYXJJbnB1dCA6IGZ1bmN0aW9uKG9wdCl7XHJcbiAgICAgIG9wdCA9IG9wdCB8fCB7fTtcclxuICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYXJndW1lbnRzKTtcclxuICAgICAgYXJncy5zaGlmdCgpO1xyXG4gICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcclxuICAgICAgICB2YXIgZGF0YSA9ICR0aGlzLmRhdGEoJ2NsZWFySW5wdXQnKTtcclxuXHJcbiAgICAgICAgaWYoJC50eXBlKG9wdCkgPT0gJ29iamVjdCcpe1xyXG4gICAgICAgICAgb3B0ID0gJC5leHRlbmQoe30sb3B0LHtlbDokdGhpc30pO1xyXG4gICAgICAgICAgZGF0YSA9IG5ldyBDbGVhcklucHV0KG9wdCk7XHJcbiAgICAgICAgICAkdGhpcy5kYXRhKCdjbGVhcklucHV0JyxkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoJC50eXBlKG9wdCkgPT0gJ3N0cmluZycpIGRhdGFbb3B0XS5hcHBseShkYXRhLGFyZ3MpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBDbGVhcklucHV0O1xyXG5cclxufSk7XHJcbiIsIi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBCb290c3RyYXA6IGRyb3Bkb3duLmpzIHYzLjMuNFxyXG4gKiBodHRwOi8vZ2V0Ym9vdHN0cmFwLmNvbS9qYXZhc2NyaXB0LyNkcm9wZG93bnNcclxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAqIENvcHlyaWdodCAyMDExLTIwMTUgVHdpdHRlciwgSW5jLlxyXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxyXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuXHJcblxyXG4rZGVmaW5lKCdqcXVlcnkuZHJvcGRvd24nLFsnanF1ZXJ5J10sZnVuY3Rpb24gKCQpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIC8vIERST1BET1dOIENMQVNTIERFRklOSVRJT05cclxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gIHZhciBiYWNrZHJvcCA9ICcuZHJvcGRvd24tYmFja2Ryb3AnXHJcbiAgdmFyIHRvZ2dsZSAgID0gJ1tkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCJdJ1xyXG4gIHZhciBEcm9wZG93biA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAkKGVsZW1lbnQpLm9uKCdjbGljay5icy5kcm9wZG93bicsIHRoaXMudG9nZ2xlKVxyXG4gIH1cclxuXHJcbiAgRHJvcGRvd24uVkVSU0lPTiA9ICczLjMuNCdcclxuXHJcbiAgZnVuY3Rpb24gZ2V0UGFyZW50KCR0aGlzKSB7XHJcbiAgICB2YXIgc2VsZWN0b3IgPSAkdGhpcy5hdHRyKCdkYXRhLXRhcmdldCcpXHJcblxyXG4gICAgaWYgKCFzZWxlY3Rvcikge1xyXG4gICAgICBzZWxlY3RvciA9ICR0aGlzLmF0dHIoJ2hyZWYnKVxyXG4gICAgICBzZWxlY3RvciA9IHNlbGVjdG9yICYmIC8jW0EtWmEtel0vLnRlc3Qoc2VsZWN0b3IpICYmIHNlbGVjdG9yLnJlcGxhY2UoLy4qKD89I1teXFxzXSokKS8sICcnKSAvLyBzdHJpcCBmb3IgaWU3XHJcbiAgICB9XHJcblxyXG4gICAgdmFyICRwYXJlbnQgPSBzZWxlY3RvciAmJiAkKHNlbGVjdG9yKVxyXG5cclxuICAgIHJldHVybiAkcGFyZW50ICYmICRwYXJlbnQubGVuZ3RoID8gJHBhcmVudCA6ICR0aGlzLnBhcmVudCgpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjbGVhck1lbnVzKGUpIHtcclxuICAgIGlmIChlICYmIGUud2hpY2ggPT09IDMpIHJldHVyblxyXG4gICAgJChiYWNrZHJvcCkucmVtb3ZlKClcclxuICAgICQodG9nZ2xlKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyICR0aGlzICAgICAgICAgPSAkKHRoaXMpXHJcbiAgICAgIHZhciAkcGFyZW50ICAgICAgID0gZ2V0UGFyZW50KCR0aGlzKVxyXG4gICAgICB2YXIgcmVsYXRlZFRhcmdldCA9IHsgcmVsYXRlZFRhcmdldDogdGhpcyB9XHJcblxyXG4gICAgICBpZiAoISRwYXJlbnQuaGFzQ2xhc3MoJ29wZW4nKSkgcmV0dXJuXHJcblxyXG4gICAgICBpZiAoZSAmJiBlLnR5cGUgPT0gJ2NsaWNrJyAmJiAvaW5wdXR8dGV4dGFyZWEvaS50ZXN0KGUudGFyZ2V0LnRhZ05hbWUpICYmICQuY29udGFpbnMoJHBhcmVudFswXSwgZS50YXJnZXQpKSByZXR1cm5cclxuXHJcbiAgICAgICRwYXJlbnQudHJpZ2dlcihlID0gJC5FdmVudCgnaGlkZS5icy5kcm9wZG93bicsIHJlbGF0ZWRUYXJnZXQpKVxyXG5cclxuICAgICAgaWYgKGUuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxyXG5cclxuICAgICAgJHRoaXMuYXR0cignYXJpYS1leHBhbmRlZCcsICdmYWxzZScpXHJcbiAgICAgICRwYXJlbnQucmVtb3ZlQ2xhc3MoJ29wZW4nKS50cmlnZ2VyKCdoaWRkZW4uYnMuZHJvcGRvd24nLCByZWxhdGVkVGFyZ2V0KVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIERyb3Bkb3duLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgdmFyICR0aGlzID0gJCh0aGlzKVxyXG5cclxuICAgIGlmICgkdGhpcy5pcygnLmRpc2FibGVkLCA6ZGlzYWJsZWQnKSkgcmV0dXJuXHJcblxyXG4gICAgdmFyICRwYXJlbnQgID0gZ2V0UGFyZW50KCR0aGlzKVxyXG4gICAgdmFyIGlzQWN0aXZlID0gJHBhcmVudC5oYXNDbGFzcygnb3BlbicpXHJcblxyXG4gICAgY2xlYXJNZW51cygpXHJcblxyXG4gICAgaWYgKCFpc0FjdGl2ZSkge1xyXG4gICAgICBpZiAoJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmICEkcGFyZW50LmNsb3Nlc3QoJy5uYXZiYXItbmF2JykubGVuZ3RoKSB7XHJcbiAgICAgICAgLy8gaWYgbW9iaWxlIHdlIHVzZSBhIGJhY2tkcm9wIGJlY2F1c2UgY2xpY2sgZXZlbnRzIGRvbid0IGRlbGVnYXRlXHJcbiAgICAgICAgJChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSlcclxuICAgICAgICAgIC5hZGRDbGFzcygnZHJvcGRvd24tYmFja2Ryb3AnKVxyXG4gICAgICAgICAgLmluc2VydEFmdGVyKCQodGhpcykpXHJcbiAgICAgICAgICAub24oJ2NsaWNrJywgY2xlYXJNZW51cylcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIHJlbGF0ZWRUYXJnZXQgPSB7IHJlbGF0ZWRUYXJnZXQ6IHRoaXMgfVxyXG4gICAgICAkcGFyZW50LnRyaWdnZXIoZSA9ICQuRXZlbnQoJ3Nob3cuYnMuZHJvcGRvd24nLCByZWxhdGVkVGFyZ2V0KSlcclxuXHJcbiAgICAgIGlmIChlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cclxuXHJcbiAgICAgICR0aGlzXHJcbiAgICAgICAgLnRyaWdnZXIoJ2ZvY3VzJylcclxuICAgICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsICd0cnVlJylcclxuXHJcbiAgICAgICRwYXJlbnRcclxuICAgICAgICAudG9nZ2xlQ2xhc3MoJ29wZW4nKVxyXG4gICAgICAgIC50cmlnZ2VyKCdzaG93bi5icy5kcm9wZG93bicsIHJlbGF0ZWRUYXJnZXQpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG5cclxuICBEcm9wZG93bi5wcm90b3R5cGUua2V5ZG93biA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICBpZiAoIS8oMzh8NDB8Mjd8MzIpLy50ZXN0KGUud2hpY2gpIHx8IC9pbnB1dHx0ZXh0YXJlYS9pLnRlc3QoZS50YXJnZXQudGFnTmFtZSkpIHJldHVyblxyXG5cclxuICAgIHZhciAkdGhpcyA9ICQodGhpcylcclxuXHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuXHJcbiAgICBpZiAoJHRoaXMuaXMoJy5kaXNhYmxlZCwgOmRpc2FibGVkJykpIHJldHVyblxyXG5cclxuICAgIHZhciAkcGFyZW50ICA9IGdldFBhcmVudCgkdGhpcylcclxuICAgIHZhciBpc0FjdGl2ZSA9ICRwYXJlbnQuaGFzQ2xhc3MoJ29wZW4nKVxyXG5cclxuICAgIGlmICghaXNBY3RpdmUgJiYgZS53aGljaCAhPSAyNyB8fCBpc0FjdGl2ZSAmJiBlLndoaWNoID09IDI3KSB7XHJcbiAgICAgIGlmIChlLndoaWNoID09IDI3KSAkcGFyZW50LmZpbmQodG9nZ2xlKS50cmlnZ2VyKCdmb2N1cycpXHJcbiAgICAgIHJldHVybiAkdGhpcy50cmlnZ2VyKCdjbGljaycpXHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGRlc2MgPSAnIGxpOm5vdCguZGlzYWJsZWQpOnZpc2libGUgYSdcclxuICAgIHZhciAkaXRlbXMgPSAkcGFyZW50LmZpbmQoJ1tyb2xlPVwibWVudVwiXScgKyBkZXNjICsgJywgW3JvbGU9XCJsaXN0Ym94XCJdJyArIGRlc2MpXHJcblxyXG4gICAgaWYgKCEkaXRlbXMubGVuZ3RoKSByZXR1cm5cclxuXHJcbiAgICB2YXIgaW5kZXggPSAkaXRlbXMuaW5kZXgoZS50YXJnZXQpXHJcblxyXG4gICAgaWYgKGUud2hpY2ggPT0gMzggJiYgaW5kZXggPiAwKSAgICAgICAgICAgICAgICAgaW5kZXgtLSAgICAgICAgIC8vIHVwXHJcbiAgICBpZiAoZS53aGljaCA9PSA0MCAmJiBpbmRleCA8ICRpdGVtcy5sZW5ndGggLSAxKSBpbmRleCsrICAgICAgICAgLy8gZG93blxyXG4gICAgaWYgKCF+aW5kZXgpICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAwXHJcblxyXG4gICAgJGl0ZW1zLmVxKGluZGV4KS50cmlnZ2VyKCdmb2N1cycpXHJcbiAgfVxyXG5cclxuXHJcbiAgLy8gRFJPUERPV04gUExVR0lOIERFRklOSVRJT05cclxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XHJcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKVxyXG4gICAgICB2YXIgZGF0YSAgPSAkdGhpcy5kYXRhKCdicy5kcm9wZG93bicpXHJcblxyXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLmRyb3Bkb3duJywgKGRhdGEgPSBuZXcgRHJvcGRvd24odGhpcykpKVxyXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dLmNhbGwoJHRoaXMpXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgdmFyIG9sZCA9ICQuZm4uZHJvcGRvd25cclxuXHJcbiAgJC5mbi5kcm9wZG93biAgICAgICAgICAgICA9IFBsdWdpblxyXG4gICQuZm4uZHJvcGRvd24uQ29uc3RydWN0b3IgPSBEcm9wZG93blxyXG5cclxuXHJcbiAgLy8gRFJPUERPV04gTk8gQ09ORkxJQ1RcclxuICAvLyA9PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAkLmZuLmRyb3Bkb3duLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAkLmZuLmRyb3Bkb3duID0gb2xkXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuXHJcblxyXG4gIC8vIEFQUExZIFRPIFNUQU5EQVJEIERST1BET1dOIEVMRU1FTlRTXHJcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgJChkb2N1bWVudClcclxuICAgIC5vbignY2xpY2suYnMuZHJvcGRvd24uZGF0YS1hcGknLCBjbGVhck1lbnVzKVxyXG4gICAgLm9uKCdjbGljay5icy5kcm9wZG93bi5kYXRhLWFwaScsICcuZHJvcGRvd24gZm9ybSwuZHJvcGRvd24gLmRyb3Bkb3duLW1lbnUnLCBmdW5jdGlvbiAoZSkgeyBlLnN0b3BQcm9wYWdhdGlvbigpIH0pXHJcbiAgICAub24oJ2NsaWNrLmJzLmRyb3Bkb3duLmRhdGEtYXBpJywgdG9nZ2xlLCBEcm9wZG93bi5wcm90b3R5cGUudG9nZ2xlKVxyXG4gICAgLm9uKCdrZXlkb3duLmJzLmRyb3Bkb3duLmRhdGEtYXBpJywgdG9nZ2xlLCBEcm9wZG93bi5wcm90b3R5cGUua2V5ZG93bilcclxuICAgIC5vbigna2V5ZG93bi5icy5kcm9wZG93bi5kYXRhLWFwaScsICcuZHJvcGRvd24tbWVudScsIERyb3Bkb3duLnByb3RvdHlwZS5rZXlkb3duKVxyXG5cclxuICByZXR1cm4gJFxyXG59KTtcclxuIiwiZGVmaW5lKCdqcXVlcnkuZm9jdXNJbnB1dCcsWydqcXVlcnknLCdqcXVlcnkuZWFzaW5nJ10sZnVuY3Rpb24oJCl7XHJcblxyXG4gIHZhciAkYm9keSA9ICQoZG9jdW1lbnQuYm9keSk7XHJcblxyXG4gIHZhciBmb2N1c0lucHV0ID0ge1xyXG4gICAgb3B0aW9ucyA6IHtcclxuICAgICAgaW5pdGVkOmZhbHNlLFxyXG4gICAgICBkaXNhYmxlZCA6IGZhbHNlLFxyXG4gICAgICBpZ25vcmU6IFwiaWdub3JlLWZvY3VzXCIsXHJcbiAgICAgIGZ4IDoge1xyXG4gICAgICAgIGR1cmF0aW9uIDogNjAwLFxyXG4gICAgICAgIGVhc2luZyA6ICdlYXNlT3V0RXhwbycsXHJcbiAgICAgICAgZG9uZSA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAkKHRoaXMpLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGluaXQgOiBmdW5jdGlvbihwYXJhbSl7XHJcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgIGlmKHRoaXMub3B0aW9ucy5pbml0ZWQpIHJldHVybjtcclxuICAgICAgdGhpcy5vcHRpb25zLmluaXRlZCA9IHRydWU7XHJcbiAgICAgICQuZXh0ZW5kKHRydWUsdGhpcy5vcHRpb25zLHBhcmFtKTtcclxuICAgICAgJGJvZHkub24oJ2ZvY3VzLmZvY3VzSW5wdXQnLCdpbnB1dFt0eXBlPXRleHRdLGlucHV0W3R5cGU9cGFzc3dvcmRdLHNlbGVjdCx0ZXh0YXJlYScsZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgaWYoX3RoaXMub3B0aW9ucy5kaXNhYmxlZCkgcmV0dXJuO1xyXG4gICAgICAgIHZhciAkdGFyLCRwcmUsdGFyLHByZTtcclxuICAgICAgICAkdGFyID0gJChlLnRhcmdldCk7XHJcbiAgICAgICAgJHByZSA9ICQoZS5yZWxhdGVkVGFyZ2V0KTtcclxuICAgICAgICBpZigkdGFyLmhhc0NsYXNzKF90aGlzLm9wdGlvbnMuaWdub3JlKSkgcmV0dXJuO1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgIHRhciA9IF90aGlzLmdldENzcygkdGFyKTtcclxuICAgICAgICAgIGlmKCRwcmUubGVuZ3RoPjApe1xyXG4gICAgICAgICAgICBwcmUgPSBfdGhpcy5nZXRDc3MoJHByZSk7XHJcbiAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgcHJlID0gX3RoaXMuZ2V0Q3NzKCR0YXIsMS42KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHByZS5vcGFjaXR5ID0gMDtcclxuICAgICAgICAgIHRhci5vcGFjaXR5ID0gMTtcclxuICAgICAgICAgIF90aGlzLmFuaW1hdGUodGFyLHByZSk7XHJcbiAgICAgICAgfSwwKTtcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgYW5pbWF0ZSA6IGZ1bmN0aW9uKHRhcixwcmUsb3RoZXIpe1xyXG4gICAgICB2YXIgJGVsID0gJCgnPGRpdj4nKS5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTtcclxuICAgICAgcHJlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuICAgICAgcHJlLmN1cnNvciA9ICd0ZXh0JztcclxuICAgICAgcHJlLmJvcmRlciA9IHRhci5ib3JkZXI7XHJcbiAgICAgICRlbC5jc3MocHJlKTtcclxuICAgICAgJGVsLmFuaW1hdGUodGFyLHRoaXMub3B0aW9ucy5meCk7XHJcbiAgICB9LFxyXG4gICAgZ2V0Q3NzIDogZnVuY3Rpb24oJGVsLHRpbWVzKXtcclxuICAgICAgdGltZXMgPSB0aW1lcyB8fCAxO1xyXG4gICAgICB2YXIgb2Zmc2V0LHNpemUsYm9yZGVyV2lkdGg7XHJcbiAgICAgIG9mZnNldCA9ICRlbC5vZmZzZXQoKTtcclxuICAgICAgYm9yZGVyV2lkdGggPSBwYXJzZUludCgkZWwuY3NzKCdib3JkZXJUb3BXaWR0aCcpKTtcclxuICAgICAgc2l6ZSA9IHtcclxuICAgICAgICB3aWR0aDokZWwub3V0ZXJXaWR0aCgpLWJvcmRlcldpZHRoKjIsXHJcbiAgICAgICAgaGVpZ2h0OiRlbC5vdXRlckhlaWdodCgpLWJvcmRlcldpZHRoKjJcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHpJbmRleDoxMDAwMDAsXHJcbiAgICAgICAgd2lkdGg6c2l6ZS53aWR0aCp0aW1lcyxcclxuICAgICAgICBoZWlnaHQ6c2l6ZS5oZWlnaHQqdGltZXMsXHJcbiAgICAgICAgbGVmdDpvZmZzZXQubGVmdC1zaXplLndpZHRoKih0aW1lcy0xKS8yLFxyXG4gICAgICAgIHRvcDpvZmZzZXQudG9wLXNpemUuaGVpZ2h0Kih0aW1lcy0xKS8yLFxyXG4gICAgICAgIGJvcmRlcjokZWwuY3NzKCdib3JkZXJUb3BXaWR0aCcpK1wiIFwiKyRlbC5jc3MoJ2JvcmRlclRvcFN0eWxlJykrXCIgXCIrJGVsLmNzcygnYm9yZGVyVG9wQ29sb3InKSxcclxuICAgICAgICBib3JkZXJSYWRpdXM6JGVsLmNzcygnYm9yZGVyVG9wTGVmdFJhZGl1cycpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBlbmFibGUgOiBmdW5jdGlvbigpe1xyXG4gICAgICB0aGlzLm9wdGlvbnMuZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgIH0sXHJcbiAgICBkaXNhYmxlZCA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHRoaXMub3B0aW9ucy5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgJC5leHRlbmQoe1xyXG4gICAgZm9jdXNJbnB1dCA6IGZ1bmN0aW9uKHBhcmFtKXtcclxuICAgICAgcGFyYW0gPSBwYXJhbSB8fCB7fTtcclxuICAgICAgaWYoJC50eXBlKHBhcmFtKSA9PSBcIm9iamVjdFwiKXtcclxuICAgICAgICBmb2N1c0lucHV0LmluaXQocGFyYW0pO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKCQudHlwZShwYXJhbSkgPT0gXCJzdHJpbmdcIil7XHJcbiAgICAgICAgJC50eXBlKGZvY3VzSW5wdXRbcGFyYW1dID09IFwiZnVuY3Rpb25cIikgJiYgZm9jdXNJbnB1dFtwYXJhbV0oKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG4gIHJldHVybiAkO1xyXG5cclxufSk7XHJcbiIsIi8qXHJcbiAqIGpRdWVyeSBFYXNpbmcgdjEuMyAtIGh0dHA6Ly9nc2dkLmNvLnVrL3NhbmRib3gvanF1ZXJ5L2Vhc2luZy9cclxuICpcclxuICogVXNlcyB0aGUgYnVpbHQgaW4gZWFzaW5nIGNhcGFiaWxpdGllcyBhZGRlZCBJbiBqUXVlcnkgMS4xXHJcbiAqIHRvIG9mZmVyIG11bHRpcGxlIGVhc2luZyBvcHRpb25zXHJcbiAqXHJcbiAqIFRFUk1TIE9GIFVTRSAtIGpRdWVyeSBFYXNpbmdcclxuICogXHJcbiAqIE9wZW4gc291cmNlIHVuZGVyIHRoZSBCU0QgTGljZW5zZS4gXHJcbiAqIFxyXG4gKiBDb3B5cmlnaHQgwqkgMjAwOCBHZW9yZ2UgTWNHaW5sZXkgU21pdGhcclxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuICogXHJcbiAqIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dCBtb2RpZmljYXRpb24sIFxyXG4gKiBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XHJcbiAqIFxyXG4gKiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsIHRoaXMgbGlzdCBvZiBcclxuICogY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxyXG4gKiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsIHRoaXMgbGlzdCBcclxuICogb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZSBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgXHJcbiAqIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cclxuICogXHJcbiAqIE5laXRoZXIgdGhlIG5hbWUgb2YgdGhlIGF1dGhvciBub3IgdGhlIG5hbWVzIG9mIGNvbnRyaWJ1dG9ycyBtYXkgYmUgdXNlZCB0byBlbmRvcnNlIFxyXG4gKiBvciBwcm9tb3RlIHByb2R1Y3RzIGRlcml2ZWQgZnJvbSB0aGlzIHNvZnR3YXJlIHdpdGhvdXQgc3BlY2lmaWMgcHJpb3Igd3JpdHRlbiBwZXJtaXNzaW9uLlxyXG4gKiBcclxuICogVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SUyBcIkFTIElTXCIgQU5EIEFOWSBcclxuICogRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRCBXQVJSQU5USUVTIE9GXHJcbiAqIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gKiAgQ09QWVJJR0hUIE9XTkVSIE9SIENPTlRSSUJVVE9SUyBCRSBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLFxyXG4gKiAgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFXHJcbiAqICBHT09EUyBPUiBTRVJWSUNFUzsgTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgXHJcbiAqIEFORCBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HXHJcbiAqICBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVMgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBcclxuICogT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLiBcclxuICpcclxuKi9cclxuZGVmaW5lKCdqcXVlcnkuZWFzaW5nJywgWydqcXVlcnknXSwgZnVuY3Rpb24oJCkge1xyXG4gICQuZWFzaW5nWydqc3dpbmcnXSA9ICQuZWFzaW5nWydzd2luZyddO1xyXG5cclxuXHQkLmV4dGVuZCggJC5lYXNpbmcse1xyXG5cdFx0ZGVmOiAnZWFzZU91dFF1YWQnLFxyXG5cdFx0c3dpbmc6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XHJcblx0XHRcdC8vYWxlcnQoalF1ZXJ5LmVhc2luZy5kZWZhdWx0KTtcclxuXHRcdFx0cmV0dXJuIGpRdWVyeS5lYXNpbmdbalF1ZXJ5LmVhc2luZy5kZWZdKHgsIHQsIGIsIGMsIGQpO1xyXG5cdFx0fSxcclxuXHRcdGVhc2VJblF1YWQ6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XHJcblx0XHRcdHJldHVybiBjKih0Lz1kKSp0ICsgYjtcclxuXHRcdH0sXHJcblx0XHRlYXNlT3V0UXVhZDogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcclxuXHRcdFx0cmV0dXJuIC1jICoodC89ZCkqKHQtMikgKyBiO1xyXG5cdFx0fSxcclxuXHRcdGVhc2VJbk91dFF1YWQ6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XHJcblx0XHRcdGlmICgodC89ZC8yKSA8IDEpIHJldHVybiBjLzIqdCp0ICsgYjtcclxuXHRcdFx0cmV0dXJuIC1jLzIgKiAoKC0tdCkqKHQtMikgLSAxKSArIGI7XHJcblx0XHR9LFxyXG5cdFx0ZWFzZUluQ3ViaWM6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XHJcblx0XHRcdHJldHVybiBjKih0Lz1kKSp0KnQgKyBiO1xyXG5cdFx0fSxcclxuXHRcdGVhc2VPdXRDdWJpYzogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcclxuXHRcdFx0cmV0dXJuIGMqKCh0PXQvZC0xKSp0KnQgKyAxKSArIGI7XHJcblx0XHR9LFxyXG5cdFx0ZWFzZUluT3V0Q3ViaWM6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XHJcblx0XHRcdGlmICgodC89ZC8yKSA8IDEpIHJldHVybiBjLzIqdCp0KnQgKyBiO1xyXG5cdFx0XHRyZXR1cm4gYy8yKigodC09MikqdCp0ICsgMikgKyBiO1xyXG5cdFx0fSxcclxuXHRcdGVhc2VJblF1YXJ0OiBmdW5jdGlvbiAoeCwgdCwgYiwgYywgZCkge1xyXG5cdFx0XHRyZXR1cm4gYyoodC89ZCkqdCp0KnQgKyBiO1xyXG5cdFx0fSxcclxuXHRcdGVhc2VPdXRRdWFydDogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcclxuXHRcdFx0cmV0dXJuIC1jICogKCh0PXQvZC0xKSp0KnQqdCAtIDEpICsgYjtcclxuXHRcdH0sXHJcblx0XHRlYXNlSW5PdXRRdWFydDogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcclxuXHRcdFx0aWYgKCh0Lz1kLzIpIDwgMSkgcmV0dXJuIGMvMip0KnQqdCp0ICsgYjtcclxuXHRcdFx0cmV0dXJuIC1jLzIgKiAoKHQtPTIpKnQqdCp0IC0gMikgKyBiO1xyXG5cdFx0fSxcclxuXHRcdGVhc2VJblF1aW50OiBmdW5jdGlvbiAoeCwgdCwgYiwgYywgZCkge1xyXG5cdFx0XHRyZXR1cm4gYyoodC89ZCkqdCp0KnQqdCArIGI7XHJcblx0XHR9LFxyXG5cdFx0ZWFzZU91dFF1aW50OiBmdW5jdGlvbiAoeCwgdCwgYiwgYywgZCkge1xyXG5cdFx0XHRyZXR1cm4gYyooKHQ9dC9kLTEpKnQqdCp0KnQgKyAxKSArIGI7XHJcblx0XHR9LFxyXG5cdFx0ZWFzZUluT3V0UXVpbnQ6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XHJcblx0XHRcdGlmICgodC89ZC8yKSA8IDEpIHJldHVybiBjLzIqdCp0KnQqdCp0ICsgYjtcclxuXHRcdFx0cmV0dXJuIGMvMiooKHQtPTIpKnQqdCp0KnQgKyAyKSArIGI7XHJcblx0XHR9LFxyXG5cdFx0ZWFzZUluU2luZTogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcclxuXHRcdFx0cmV0dXJuIC1jICogTWF0aC5jb3ModC9kICogKE1hdGguUEkvMikpICsgYyArIGI7XHJcblx0XHR9LFxyXG5cdFx0ZWFzZU91dFNpbmU6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XHJcblx0XHRcdHJldHVybiBjICogTWF0aC5zaW4odC9kICogKE1hdGguUEkvMikpICsgYjtcclxuXHRcdH0sXHJcblx0XHRlYXNlSW5PdXRTaW5lOiBmdW5jdGlvbiAoeCwgdCwgYiwgYywgZCkge1xyXG5cdFx0XHRyZXR1cm4gLWMvMiAqIChNYXRoLmNvcyhNYXRoLlBJKnQvZCkgLSAxKSArIGI7XHJcblx0XHR9LFxyXG5cdFx0ZWFzZUluRXhwbzogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcclxuXHRcdFx0cmV0dXJuICh0PT0wKSA/IGIgOiBjICogTWF0aC5wb3coMiwgMTAgKiAodC9kIC0gMSkpICsgYjtcclxuXHRcdH0sXHJcblx0XHRlYXNlT3V0RXhwbzogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcclxuXHRcdFx0cmV0dXJuICh0PT1kKSA/IGIrYyA6IGMgKiAoLU1hdGgucG93KDIsIC0xMCAqIHQvZCkgKyAxKSArIGI7XHJcblx0XHR9LFxyXG5cdFx0ZWFzZUluT3V0RXhwbzogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcclxuXHRcdFx0aWYgKHQ9PTApIHJldHVybiBiO1xyXG5cdFx0XHRpZiAodD09ZCkgcmV0dXJuIGIrYztcclxuXHRcdFx0aWYgKCh0Lz1kLzIpIDwgMSkgcmV0dXJuIGMvMiAqIE1hdGgucG93KDIsIDEwICogKHQgLSAxKSkgKyBiO1xyXG5cdFx0XHRyZXR1cm4gYy8yICogKC1NYXRoLnBvdygyLCAtMTAgKiAtLXQpICsgMikgKyBiO1xyXG5cdFx0fSxcclxuXHRcdGVhc2VJbkNpcmM6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XHJcblx0XHRcdHJldHVybiAtYyAqIChNYXRoLnNxcnQoMSAtICh0Lz1kKSp0KSAtIDEpICsgYjtcclxuXHRcdH0sXHJcblx0XHRlYXNlT3V0Q2lyYzogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcclxuXHRcdFx0cmV0dXJuIGMgKiBNYXRoLnNxcnQoMSAtICh0PXQvZC0xKSp0KSArIGI7XHJcblx0XHR9LFxyXG5cdFx0ZWFzZUluT3V0Q2lyYzogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcclxuXHRcdFx0aWYgKCh0Lz1kLzIpIDwgMSkgcmV0dXJuIC1jLzIgKiAoTWF0aC5zcXJ0KDEgLSB0KnQpIC0gMSkgKyBiO1xyXG5cdFx0XHRyZXR1cm4gYy8yICogKE1hdGguc3FydCgxIC0gKHQtPTIpKnQpICsgMSkgKyBiO1xyXG5cdFx0fSxcclxuXHRcdGVhc2VJbkVsYXN0aWM6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XHJcblx0XHRcdHZhciBzPTEuNzAxNTg7dmFyIHA9MDt2YXIgYT1jO1xyXG5cdFx0XHRpZiAodD09MCkgcmV0dXJuIGI7ICBpZiAoKHQvPWQpPT0xKSByZXR1cm4gYitjOyAgaWYgKCFwKSBwPWQqLjM7XHJcblx0XHRcdGlmIChhIDwgTWF0aC5hYnMoYykpIHsgYT1jOyB2YXIgcz1wLzQ7IH1cclxuXHRcdFx0ZWxzZSB2YXIgcyA9IHAvKDIqTWF0aC5QSSkgKiBNYXRoLmFzaW4gKGMvYSk7XHJcblx0XHRcdHJldHVybiAtKGEqTWF0aC5wb3coMiwxMCoodC09MSkpICogTWF0aC5zaW4oICh0KmQtcykqKDIqTWF0aC5QSSkvcCApKSArIGI7XHJcblx0XHR9LFxyXG5cdFx0ZWFzZU91dEVsYXN0aWM6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XHJcblx0XHRcdHZhciBzPTEuNzAxNTg7dmFyIHA9MDt2YXIgYT1jO1xyXG5cdFx0XHRpZiAodD09MCkgcmV0dXJuIGI7ICBpZiAoKHQvPWQpPT0xKSByZXR1cm4gYitjOyAgaWYgKCFwKSBwPWQqLjM7XHJcblx0XHRcdGlmIChhIDwgTWF0aC5hYnMoYykpIHsgYT1jOyB2YXIgcz1wLzQ7IH1cclxuXHRcdFx0ZWxzZSB2YXIgcyA9IHAvKDIqTWF0aC5QSSkgKiBNYXRoLmFzaW4gKGMvYSk7XHJcblx0XHRcdHJldHVybiBhKk1hdGgucG93KDIsLTEwKnQpICogTWF0aC5zaW4oICh0KmQtcykqKDIqTWF0aC5QSSkvcCApICsgYyArIGI7XHJcblx0XHR9LFxyXG5cdFx0ZWFzZUluT3V0RWxhc3RpYzogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcclxuXHRcdFx0dmFyIHM9MS43MDE1ODt2YXIgcD0wO3ZhciBhPWM7XHJcblx0XHRcdGlmICh0PT0wKSByZXR1cm4gYjsgIGlmICgodC89ZC8yKT09MikgcmV0dXJuIGIrYzsgIGlmICghcCkgcD1kKiguMyoxLjUpO1xyXG5cdFx0XHRpZiAoYSA8IE1hdGguYWJzKGMpKSB7IGE9YzsgdmFyIHM9cC80OyB9XHJcblx0XHRcdGVsc2UgdmFyIHMgPSBwLygyKk1hdGguUEkpICogTWF0aC5hc2luIChjL2EpO1xyXG5cdFx0XHRpZiAodCA8IDEpIHJldHVybiAtLjUqKGEqTWF0aC5wb3coMiwxMCoodC09MSkpICogTWF0aC5zaW4oICh0KmQtcykqKDIqTWF0aC5QSSkvcCApKSArIGI7XHJcblx0XHRcdHJldHVybiBhKk1hdGgucG93KDIsLTEwKih0LT0xKSkgKiBNYXRoLnNpbiggKHQqZC1zKSooMipNYXRoLlBJKS9wICkqLjUgKyBjICsgYjtcclxuXHRcdH0sXHJcblx0XHRlYXNlSW5CYWNrOiBmdW5jdGlvbiAoeCwgdCwgYiwgYywgZCwgcykge1xyXG5cdFx0XHRpZiAocyA9PSB1bmRlZmluZWQpIHMgPSAxLjcwMTU4O1xyXG5cdFx0XHRyZXR1cm4gYyoodC89ZCkqdCooKHMrMSkqdCAtIHMpICsgYjtcclxuXHRcdH0sXHJcblx0XHRlYXNlT3V0QmFjazogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQsIHMpIHtcclxuXHRcdFx0aWYgKHMgPT0gdW5kZWZpbmVkKSBzID0gMS43MDE1ODtcclxuXHRcdFx0cmV0dXJuIGMqKCh0PXQvZC0xKSp0KigocysxKSp0ICsgcykgKyAxKSArIGI7XHJcblx0XHR9LFxyXG5cdFx0ZWFzZUluT3V0QmFjazogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQsIHMpIHtcclxuXHRcdFx0aWYgKHMgPT0gdW5kZWZpbmVkKSBzID0gMS43MDE1ODsgXHJcblx0XHRcdGlmICgodC89ZC8yKSA8IDEpIHJldHVybiBjLzIqKHQqdCooKChzKj0oMS41MjUpKSsxKSp0IC0gcykpICsgYjtcclxuXHRcdFx0cmV0dXJuIGMvMiooKHQtPTIpKnQqKCgocyo9KDEuNTI1KSkrMSkqdCArIHMpICsgMikgKyBiO1xyXG5cdFx0fSxcclxuXHRcdGVhc2VJbkJvdW5jZTogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcclxuXHRcdFx0cmV0dXJuIGMgLSBqUXVlcnkuZWFzaW5nLmVhc2VPdXRCb3VuY2UgKHgsIGQtdCwgMCwgYywgZCkgKyBiO1xyXG5cdFx0fSxcclxuXHRcdGVhc2VPdXRCb3VuY2U6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XHJcblx0XHRcdGlmICgodC89ZCkgPCAoMS8yLjc1KSkge1xyXG5cdFx0XHRcdHJldHVybiBjKig3LjU2MjUqdCp0KSArIGI7XHJcblx0XHRcdH0gZWxzZSBpZiAodCA8ICgyLzIuNzUpKSB7XHJcblx0XHRcdFx0cmV0dXJuIGMqKDcuNTYyNSoodC09KDEuNS8yLjc1KSkqdCArIC43NSkgKyBiO1xyXG5cdFx0XHR9IGVsc2UgaWYgKHQgPCAoMi41LzIuNzUpKSB7XHJcblx0XHRcdFx0cmV0dXJuIGMqKDcuNTYyNSoodC09KDIuMjUvMi43NSkpKnQgKyAuOTM3NSkgKyBiO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBjKig3LjU2MjUqKHQtPSgyLjYyNS8yLjc1KSkqdCArIC45ODQzNzUpICsgYjtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdGVhc2VJbk91dEJvdW5jZTogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcclxuXHRcdFx0aWYgKHQgPCBkLzIpIHJldHVybiBqUXVlcnkuZWFzaW5nLmVhc2VJbkJvdW5jZSAoeCwgdCoyLCAwLCBjLCBkKSAqIC41ICsgYjtcclxuXHRcdFx0cmV0dXJuIGpRdWVyeS5lYXNpbmcuZWFzZU91dEJvdW5jZSAoeCwgdCoyLWQsIDAsIGMsIGQpICogLjUgKyBjKi41ICsgYjtcclxuXHRcdH1cclxuXHR9KTtcclxufSk7XHJcblxyXG4vKlxyXG4gKlxyXG4gKiBURVJNUyBPRiBVU0UgLSBFQVNJTkcgRVFVQVRJT05TXHJcbiAqIFxyXG4gKiBPcGVuIHNvdXJjZSB1bmRlciB0aGUgQlNEIExpY2Vuc2UuIFxyXG4gKiBcclxuICogQ29weXJpZ2h0IMKpIDIwMDEgUm9iZXJ0IFBlbm5lclxyXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKiBcclxuICogUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0IG1vZGlmaWNhdGlvbiwgXHJcbiAqIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcclxuICogXHJcbiAqIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IG9mIFxyXG4gKiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXHJcbiAqIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IFxyXG4gKiBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlIGRvY3VtZW50YXRpb24gYW5kL29yIG90aGVyIG1hdGVyaWFscyBcclxuICogcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxyXG4gKiBcclxuICogTmVpdGhlciB0aGUgbmFtZSBvZiB0aGUgYXV0aG9yIG5vciB0aGUgbmFtZXMgb2YgY29udHJpYnV0b3JzIG1heSBiZSB1c2VkIHRvIGVuZG9yc2UgXHJcbiAqIG9yIHByb21vdGUgcHJvZHVjdHMgZGVyaXZlZCBmcm9tIHRoaXMgc29mdHdhcmUgd2l0aG91dCBzcGVjaWZpYyBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24uXHJcbiAqIFxyXG4gKiBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTIFwiQVMgSVNcIiBBTkQgQU5ZIFxyXG4gKiBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRSBJTVBMSUVEIFdBUlJBTlRJRVMgT0ZcclxuICogTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiAqICBDT1BZUklHSFQgT1dORVIgT1IgQ09OVFJJQlVUT1JTIEJFIExJQUJMRSBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsXHJcbiAqICBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEVcclxuICogIEdPT0RTIE9SIFNFUlZJQ0VTOyBMT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBcclxuICogQU5EIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUIChJTkNMVURJTkdcclxuICogIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIFxyXG4gKiBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuIFxyXG4gKlxyXG4gKi8iLCIvKiFcclxuICogalF1ZXJ5IFZhbGlkYXRpb24gUGx1Z2luIHYxLjEzLjItcHJlXHJcbiAqXHJcbiAqIGh0dHA6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9cclxuICpcclxuICogQ29weXJpZ2h0IChjKSAyMDE1IErDtnJuIFphZWZmZXJlclxyXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcclxuICovXHJcbihmdW5jdGlvbiggZmFjdG9yeSApIHtcclxuXHRpZiAoIHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kICkge1xyXG5cdFx0ZGVmaW5lKFwianF1ZXJ5LnZhbGlkYXRlLmNvcmVcIixbXCJqcXVlcnlcIl0sIGZhY3RvcnkgKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0ZmFjdG9yeSggalF1ZXJ5ICk7XHJcblx0fVxyXG59KGZ1bmN0aW9uKCAkICkge1xyXG5cclxuJC5leHRlbmQoJC5mbiwge1xyXG5cdC8vIGh0dHA6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy92YWxpZGF0ZS9cclxuXHR2YWxpZGF0ZTogZnVuY3Rpb24oIG9wdGlvbnMgKSB7XHJcblxyXG5cdFx0Ly8gaWYgbm90aGluZyBpcyBzZWxlY3RlZCwgcmV0dXJuIG5vdGhpbmc7IGNhbid0IGNoYWluIGFueXdheVxyXG5cdFx0aWYgKCAhdGhpcy5sZW5ndGggKSB7XHJcblx0XHRcdGlmICggb3B0aW9ucyAmJiBvcHRpb25zLmRlYnVnICYmIHdpbmRvdy5jb25zb2xlICkge1xyXG5cdFx0XHRcdGNvbnNvbGUud2FybiggXCJOb3RoaW5nIHNlbGVjdGVkLCBjYW4ndCB2YWxpZGF0ZSwgcmV0dXJuaW5nIG5vdGhpbmcuXCIgKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gY2hlY2sgaWYgYSB2YWxpZGF0b3IgZm9yIHRoaXMgZm9ybSB3YXMgYWxyZWFkeSBjcmVhdGVkXHJcblx0XHR2YXIgdmFsaWRhdG9yID0gJC5kYXRhKCB0aGlzWyAwIF0sIFwidmFsaWRhdG9yXCIgKTtcclxuXHRcdGlmICggdmFsaWRhdG9yICkge1xyXG5cdFx0XHRyZXR1cm4gdmFsaWRhdG9yO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEFkZCBub3ZhbGlkYXRlIHRhZyBpZiBIVE1MNS5cclxuXHRcdHRoaXMuYXR0ciggXCJub3ZhbGlkYXRlXCIsIFwibm92YWxpZGF0ZVwiICk7XHJcblxyXG5cdFx0dmFsaWRhdG9yID0gbmV3ICQudmFsaWRhdG9yKCBvcHRpb25zLCB0aGlzWyAwIF0gKTtcclxuXHRcdCQuZGF0YSggdGhpc1sgMCBdLCBcInZhbGlkYXRvclwiLCB2YWxpZGF0b3IgKTtcclxuXHJcblx0XHRpZiAoIHZhbGlkYXRvci5zZXR0aW5ncy5vbnN1Ym1pdCApIHtcclxuXHJcblx0XHRcdHRoaXMudmFsaWRhdGVEZWxlZ2F0ZSggXCI6c3VibWl0XCIsIFwiY2xpY2tcIiwgZnVuY3Rpb24oIGV2ZW50ICkge1xyXG5cdFx0XHRcdGlmICggdmFsaWRhdG9yLnNldHRpbmdzLnN1Ym1pdEhhbmRsZXIgKSB7XHJcblx0XHRcdFx0XHR2YWxpZGF0b3Iuc3VibWl0QnV0dG9uID0gZXZlbnQudGFyZ2V0O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBhbGxvdyBzdXBwcmVzc2luZyB2YWxpZGF0aW9uIGJ5IGFkZGluZyBhIGNhbmNlbCBjbGFzcyB0byB0aGUgc3VibWl0IGJ1dHRvblxyXG5cdFx0XHRcdGlmICggJCggZXZlbnQudGFyZ2V0ICkuaGFzQ2xhc3MoIFwiY2FuY2VsXCIgKSApIHtcclxuXHRcdFx0XHRcdHZhbGlkYXRvci5jYW5jZWxTdWJtaXQgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gYWxsb3cgc3VwcHJlc3NpbmcgdmFsaWRhdGlvbiBieSBhZGRpbmcgdGhlIGh0bWw1IGZvcm1ub3ZhbGlkYXRlIGF0dHJpYnV0ZSB0byB0aGUgc3VibWl0IGJ1dHRvblxyXG5cdFx0XHRcdGlmICggJCggZXZlbnQudGFyZ2V0ICkuYXR0ciggXCJmb3Jtbm92YWxpZGF0ZVwiICkgIT09IHVuZGVmaW5lZCApIHtcclxuXHRcdFx0XHRcdHZhbGlkYXRvci5jYW5jZWxTdWJtaXQgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQvLyB2YWxpZGF0ZSB0aGUgZm9ybSBvbiBzdWJtaXRcclxuXHRcdFx0dGhpcy5zdWJtaXQoIGZ1bmN0aW9uKCBldmVudCApIHtcclxuXHRcdFx0XHRpZiAoIHZhbGlkYXRvci5zZXR0aW5ncy5kZWJ1ZyApIHtcclxuXHRcdFx0XHRcdC8vIHByZXZlbnQgZm9ybSBzdWJtaXQgdG8gYmUgYWJsZSB0byBzZWUgY29uc29sZSBvdXRwdXRcclxuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGZ1bmN0aW9uIGhhbmRsZSgpIHtcclxuXHRcdFx0XHRcdHZhciBoaWRkZW4sIHJlc3VsdDtcclxuXHRcdFx0XHRcdGlmICggdmFsaWRhdG9yLnNldHRpbmdzLnN1Ym1pdEhhbmRsZXIgKSB7XHJcblx0XHRcdFx0XHRcdGlmICggdmFsaWRhdG9yLnN1Ym1pdEJ1dHRvbiApIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBpbnNlcnQgYSBoaWRkZW4gaW5wdXQgYXMgYSByZXBsYWNlbWVudCBmb3IgdGhlIG1pc3Npbmcgc3VibWl0IGJ1dHRvblxyXG5cdFx0XHRcdFx0XHRcdGhpZGRlbiA9ICQoIFwiPGlucHV0IHR5cGU9J2hpZGRlbicvPlwiIClcclxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKCBcIm5hbWVcIiwgdmFsaWRhdG9yLnN1Ym1pdEJ1dHRvbi5uYW1lIClcclxuXHRcdFx0XHRcdFx0XHRcdC52YWwoICQoIHZhbGlkYXRvci5zdWJtaXRCdXR0b24gKS52YWwoKSApXHJcblx0XHRcdFx0XHRcdFx0XHQuYXBwZW5kVG8oIHZhbGlkYXRvci5jdXJyZW50Rm9ybSApO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdHJlc3VsdCA9IHZhbGlkYXRvci5zZXR0aW5ncy5zdWJtaXRIYW5kbGVyLmNhbGwoIHZhbGlkYXRvciwgdmFsaWRhdG9yLmN1cnJlbnRGb3JtLCBldmVudCApO1xyXG5cdFx0XHRcdFx0XHRpZiAoIHZhbGlkYXRvci5zdWJtaXRCdXR0b24gKSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gYW5kIGNsZWFuIHVwIGFmdGVyd2FyZHM7IHRoYW5rcyB0byBuby1ibG9jay1zY29wZSwgaGlkZGVuIGNhbiBiZSByZWZlcmVuY2VkXHJcblx0XHRcdFx0XHRcdFx0aGlkZGVuLnJlbW92ZSgpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmICggcmVzdWx0ICE9PSB1bmRlZmluZWQgKSB7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIHByZXZlbnQgc3VibWl0IGZvciBpbnZhbGlkIGZvcm1zIG9yIGN1c3RvbSBzdWJtaXQgaGFuZGxlcnNcclxuXHRcdFx0XHRpZiAoIHZhbGlkYXRvci5jYW5jZWxTdWJtaXQgKSB7XHJcblx0XHRcdFx0XHR2YWxpZGF0b3IuY2FuY2VsU3VibWl0ID0gZmFsc2U7XHJcblx0XHRcdFx0XHRyZXR1cm4gaGFuZGxlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICggdmFsaWRhdG9yLmZvcm0oKSApIHtcclxuXHRcdFx0XHRcdGlmICggdmFsaWRhdG9yLnBlbmRpbmdSZXF1ZXN0ICkge1xyXG5cdFx0XHRcdFx0XHR2YWxpZGF0b3IuZm9ybVN1Ym1pdHRlZCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiBoYW5kbGUoKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dmFsaWRhdG9yLmZvY3VzSW52YWxpZCgpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHZhbGlkYXRvcjtcclxuXHR9LFxyXG5cdC8vIGh0dHA6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy92YWxpZC9cclxuXHR2YWxpZDogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdmFsaWQsIHZhbGlkYXRvciwgZXJyb3JMaXN0O1xyXG5cclxuXHRcdGlmICggJCggdGhpc1sgMCBdICkuaXMoIFwiZm9ybVwiICkgKSB7XHJcblx0XHRcdHZhbGlkID0gdGhpcy52YWxpZGF0ZSgpLmZvcm0oKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGVycm9yTGlzdCA9IFtdO1xyXG5cdFx0XHR2YWxpZCA9IHRydWU7XHJcblx0XHRcdHZhbGlkYXRvciA9ICQoIHRoaXNbIDAgXS5mb3JtICkudmFsaWRhdGUoKTtcclxuXHRcdFx0dGhpcy5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YWxpZCA9IHZhbGlkYXRvci5lbGVtZW50KCB0aGlzICkgJiYgdmFsaWQ7XHJcblx0XHRcdFx0ZXJyb3JMaXN0ID0gZXJyb3JMaXN0LmNvbmNhdCggdmFsaWRhdG9yLmVycm9yTGlzdCApO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0dmFsaWRhdG9yLmVycm9yTGlzdCA9IGVycm9yTGlzdDtcclxuXHRcdH1cclxuXHRcdHJldHVybiB2YWxpZDtcclxuXHR9LFxyXG5cdC8vIGF0dHJpYnV0ZXM6IHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGF0dHJpYnV0ZXMgdG8gcmV0cmlldmUgYW5kIHJlbW92ZVxyXG5cdHJlbW92ZUF0dHJzOiBmdW5jdGlvbiggYXR0cmlidXRlcyApIHtcclxuXHRcdHZhciByZXN1bHQgPSB7fSxcclxuXHRcdFx0JGVsZW1lbnQgPSB0aGlzO1xyXG5cdFx0JC5lYWNoKCBhdHRyaWJ1dGVzLnNwbGl0KCAvXFxzLyApLCBmdW5jdGlvbiggaW5kZXgsIHZhbHVlICkge1xyXG5cdFx0XHRyZXN1bHRbIHZhbHVlIF0gPSAkZWxlbWVudC5hdHRyKCB2YWx1ZSApO1xyXG5cdFx0XHQkZWxlbWVudC5yZW1vdmVBdHRyKCB2YWx1ZSApO1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH0sXHJcblx0Ly8gaHR0cDovL2pxdWVyeXZhbGlkYXRpb24ub3JnL3J1bGVzL1xyXG5cdHJ1bGVzOiBmdW5jdGlvbiggY29tbWFuZCwgYXJndW1lbnQgKSB7XHJcblx0XHR2YXIgZWxlbWVudCA9IHRoaXNbIDAgXSxcclxuXHRcdFx0c2V0dGluZ3MsIHN0YXRpY1J1bGVzLCBleGlzdGluZ1J1bGVzLCBkYXRhLCBwYXJhbSwgZmlsdGVyZWQ7XHJcblxyXG5cdFx0aWYgKCBjb21tYW5kICkge1xyXG5cdFx0XHRzZXR0aW5ncyA9ICQuZGF0YSggZWxlbWVudC5mb3JtLCBcInZhbGlkYXRvclwiICkuc2V0dGluZ3M7XHJcblx0XHRcdHN0YXRpY1J1bGVzID0gc2V0dGluZ3MucnVsZXM7XHJcblx0XHRcdGV4aXN0aW5nUnVsZXMgPSAkLnZhbGlkYXRvci5zdGF0aWNSdWxlcyggZWxlbWVudCApO1xyXG5cdFx0XHRzd2l0Y2ggKCBjb21tYW5kICkge1xyXG5cdFx0XHRjYXNlIFwiYWRkXCI6XHJcblx0XHRcdFx0JC5leHRlbmQoIGV4aXN0aW5nUnVsZXMsICQudmFsaWRhdG9yLm5vcm1hbGl6ZVJ1bGUoIGFyZ3VtZW50ICkgKTtcclxuXHRcdFx0XHQvLyByZW1vdmUgbWVzc2FnZXMgZnJvbSBydWxlcywgYnV0IGFsbG93IHRoZW0gdG8gYmUgc2V0IHNlcGFyYXRlbHlcclxuXHRcdFx0XHRkZWxldGUgZXhpc3RpbmdSdWxlcy5tZXNzYWdlcztcclxuXHRcdFx0XHRzdGF0aWNSdWxlc1sgZWxlbWVudC5uYW1lIF0gPSBleGlzdGluZ1J1bGVzO1xyXG5cdFx0XHRcdGlmICggYXJndW1lbnQubWVzc2FnZXMgKSB7XHJcblx0XHRcdFx0XHRzZXR0aW5ncy5tZXNzYWdlc1sgZWxlbWVudC5uYW1lIF0gPSAkLmV4dGVuZCggc2V0dGluZ3MubWVzc2FnZXNbIGVsZW1lbnQubmFtZSBdLCBhcmd1bWVudC5tZXNzYWdlcyApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSBcInJlbW92ZVwiOlxyXG5cdFx0XHRcdGlmICggIWFyZ3VtZW50ICkge1xyXG5cdFx0XHRcdFx0ZGVsZXRlIHN0YXRpY1J1bGVzWyBlbGVtZW50Lm5hbWUgXTtcclxuXHRcdFx0XHRcdHJldHVybiBleGlzdGluZ1J1bGVzO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRmaWx0ZXJlZCA9IHt9O1xyXG5cdFx0XHRcdCQuZWFjaCggYXJndW1lbnQuc3BsaXQoIC9cXHMvICksIGZ1bmN0aW9uKCBpbmRleCwgbWV0aG9kICkge1xyXG5cdFx0XHRcdFx0ZmlsdGVyZWRbIG1ldGhvZCBdID0gZXhpc3RpbmdSdWxlc1sgbWV0aG9kIF07XHJcblx0XHRcdFx0XHRkZWxldGUgZXhpc3RpbmdSdWxlc1sgbWV0aG9kIF07XHJcblx0XHRcdFx0XHRpZiAoIG1ldGhvZCA9PT0gXCJyZXF1aXJlZFwiICkge1xyXG5cdFx0XHRcdFx0XHQkKCBlbGVtZW50ICkucmVtb3ZlQXR0ciggXCJhcmlhLXJlcXVpcmVkXCIgKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRyZXR1cm4gZmlsdGVyZWQ7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRkYXRhID0gJC52YWxpZGF0b3Iubm9ybWFsaXplUnVsZXMoXHJcblx0XHQkLmV4dGVuZChcclxuXHRcdFx0e30sXHJcblx0XHRcdCQudmFsaWRhdG9yLmNsYXNzUnVsZXMoIGVsZW1lbnQgKSxcclxuXHRcdFx0JC52YWxpZGF0b3IuYXR0cmlidXRlUnVsZXMoIGVsZW1lbnQgKSxcclxuXHRcdFx0JC52YWxpZGF0b3IuZGF0YVJ1bGVzKCBlbGVtZW50ICksXHJcblx0XHRcdCQudmFsaWRhdG9yLnN0YXRpY1J1bGVzKCBlbGVtZW50IClcclxuXHRcdCksIGVsZW1lbnQgKTtcclxuXHJcblx0XHQvLyBtYWtlIHN1cmUgcmVxdWlyZWQgaXMgYXQgZnJvbnRcclxuXHRcdGlmICggZGF0YS5yZXF1aXJlZCApIHtcclxuXHRcdFx0cGFyYW0gPSBkYXRhLnJlcXVpcmVkO1xyXG5cdFx0XHRkZWxldGUgZGF0YS5yZXF1aXJlZDtcclxuXHRcdFx0ZGF0YSA9ICQuZXh0ZW5kKCB7IHJlcXVpcmVkOiBwYXJhbSB9LCBkYXRhICk7XHJcblx0XHRcdCQoIGVsZW1lbnQgKS5hdHRyKCBcImFyaWEtcmVxdWlyZWRcIiwgXCJ0cnVlXCIgKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBtYWtlIHN1cmUgcmVtb3RlIGlzIGF0IGJhY2tcclxuXHRcdGlmICggZGF0YS5yZW1vdGUgKSB7XHJcblx0XHRcdHBhcmFtID0gZGF0YS5yZW1vdGU7XHJcblx0XHRcdGRlbGV0ZSBkYXRhLnJlbW90ZTtcclxuXHRcdFx0ZGF0YSA9ICQuZXh0ZW5kKCBkYXRhLCB7IHJlbW90ZTogcGFyYW0gfSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGRhdGE7XHJcblx0fVxyXG59KTtcclxuXHJcbi8vIEN1c3RvbSBzZWxlY3RvcnNcclxuJC5leHRlbmQoICQuZXhwclsgXCI6XCIgXSwge1xyXG5cdC8vIGh0dHA6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9ibGFuay1zZWxlY3Rvci9cclxuXHRibGFuazogZnVuY3Rpb24oIGEgKSB7XHJcblx0XHRyZXR1cm4gISQudHJpbSggXCJcIiArICQoIGEgKS52YWwoKSApO1xyXG5cdH0sXHJcblx0Ly8gaHR0cDovL2pxdWVyeXZhbGlkYXRpb24ub3JnL2ZpbGxlZC1zZWxlY3Rvci9cclxuXHRmaWxsZWQ6IGZ1bmN0aW9uKCBhICkge1xyXG5cdFx0cmV0dXJuICEhJC50cmltKCBcIlwiICsgJCggYSApLnZhbCgpICk7XHJcblx0fSxcclxuXHQvLyBodHRwOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvdW5jaGVja2VkLXNlbGVjdG9yL1xyXG5cdHVuY2hlY2tlZDogZnVuY3Rpb24oIGEgKSB7XHJcblx0XHRyZXR1cm4gISQoIGEgKS5wcm9wKCBcImNoZWNrZWRcIiApO1xyXG5cdH1cclxufSk7XHJcblxyXG4vLyBjb25zdHJ1Y3RvciBmb3IgdmFsaWRhdG9yXHJcbiQudmFsaWRhdG9yID0gZnVuY3Rpb24oIG9wdGlvbnMsIGZvcm0gKSB7XHJcblx0dGhpcy5zZXR0aW5ncyA9ICQuZXh0ZW5kKCB0cnVlLCB7fSwgJC52YWxpZGF0b3IuZGVmYXVsdHMsIG9wdGlvbnMgKTtcclxuXHR0aGlzLmN1cnJlbnRGb3JtID0gZm9ybTtcclxuXHR0aGlzLmluaXQoKTtcclxufTtcclxuXHJcbi8vIGh0dHA6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9qUXVlcnkudmFsaWRhdG9yLmZvcm1hdC9cclxuJC52YWxpZGF0b3IuZm9ybWF0ID0gZnVuY3Rpb24oIHNvdXJjZSwgcGFyYW1zICkge1xyXG5cdGlmICggYXJndW1lbnRzLmxlbmd0aCA9PT0gMSApIHtcclxuXHRcdHJldHVybiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIGFyZ3MgPSAkLm1ha2VBcnJheSggYXJndW1lbnRzICk7XHJcblx0XHRcdGFyZ3MudW5zaGlmdCggc291cmNlICk7XHJcblx0XHRcdHJldHVybiAkLnZhbGlkYXRvci5mb3JtYXQuYXBwbHkoIHRoaXMsIGFyZ3MgKTtcclxuXHRcdH07XHJcblx0fVxyXG5cdGlmICggYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgcGFyYW1zLmNvbnN0cnVjdG9yICE9PSBBcnJheSAgKSB7XHJcblx0XHRwYXJhbXMgPSAkLm1ha2VBcnJheSggYXJndW1lbnRzICkuc2xpY2UoIDEgKTtcclxuXHR9XHJcblx0aWYgKCBwYXJhbXMuY29uc3RydWN0b3IgIT09IEFycmF5ICkge1xyXG5cdFx0cGFyYW1zID0gWyBwYXJhbXMgXTtcclxuXHR9XHJcblx0JC5lYWNoKCBwYXJhbXMsIGZ1bmN0aW9uKCBpLCBuICkge1xyXG5cdFx0c291cmNlID0gc291cmNlLnJlcGxhY2UoIG5ldyBSZWdFeHAoIFwiXFxcXHtcIiArIGkgKyBcIlxcXFx9XCIsIFwiZ1wiICksIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gbjtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cdHJldHVybiBzb3VyY2U7XHJcbn07XHJcblxyXG4kLmV4dGVuZCggJC52YWxpZGF0b3IsIHtcclxuXHJcblx0ZGVmYXVsdHM6IHtcclxuXHRcdG1lc3NhZ2VzOiB7fSxcclxuXHRcdGdyb3Vwczoge30sXHJcblx0XHRydWxlczoge30sXHJcblx0XHRlcnJvckNsYXNzOiBcImVycm9yXCIsXHJcblx0XHR2YWxpZENsYXNzOiBcInZhbGlkXCIsXHJcblx0XHRlcnJvckVsZW1lbnQ6IFwibGFiZWxcIixcclxuXHRcdGZvY3VzQ2xlYW51cDogZmFsc2UsXHJcblx0XHRmb2N1c0ludmFsaWQ6IHRydWUsXHJcblx0XHRlcnJvckNvbnRhaW5lcjogJCggW10gKSxcclxuXHRcdGVycm9yTGFiZWxDb250YWluZXI6ICQoIFtdICksXHJcblx0XHRvbnN1Ym1pdDogdHJ1ZSxcclxuXHRcdGlnbm9yZTogXCI6aGlkZGVuXCIsXHJcblx0XHRpZ25vcmVUaXRsZTogZmFsc2UsXHJcblx0XHRvbmZvY3VzaW46IGZ1bmN0aW9uKCBlbGVtZW50ICkge1xyXG5cdFx0XHR0aGlzLmxhc3RBY3RpdmUgPSBlbGVtZW50O1xyXG5cclxuXHRcdFx0Ly8gSGlkZSBlcnJvciBsYWJlbCBhbmQgcmVtb3ZlIGVycm9yIGNsYXNzIG9uIGZvY3VzIGlmIGVuYWJsZWRcclxuXHRcdFx0aWYgKCB0aGlzLnNldHRpbmdzLmZvY3VzQ2xlYW51cCApIHtcclxuXHRcdFx0XHRpZiAoIHRoaXMuc2V0dGluZ3MudW5oaWdobGlnaHQgKSB7XHJcblx0XHRcdFx0XHR0aGlzLnNldHRpbmdzLnVuaGlnaGxpZ2h0LmNhbGwoIHRoaXMsIGVsZW1lbnQsIHRoaXMuc2V0dGluZ3MuZXJyb3JDbGFzcywgdGhpcy5zZXR0aW5ncy52YWxpZENsYXNzICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMuaGlkZVRoZXNlKCB0aGlzLmVycm9yc0ZvciggZWxlbWVudCApICk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHRvbmZvY3Vzb3V0OiBmdW5jdGlvbiggZWxlbWVudCApIHtcclxuXHRcdFx0aWYgKCAhdGhpcy5jaGVja2FibGUoIGVsZW1lbnQgKSAmJiAoIGVsZW1lbnQubmFtZSBpbiB0aGlzLnN1Ym1pdHRlZCB8fCAhdGhpcy5vcHRpb25hbCggZWxlbWVudCApICkgKSB7XHJcblx0XHRcdFx0dGhpcy5lbGVtZW50KCBlbGVtZW50ICk7XHJcblx0XHRcdH0gZWxzZSBpZiggZWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09IFwic2VsZWN0XCIgKXtcclxuXHRcdFx0XHQvKiDop6PlhrNzZWxlY3Tnu4Tku7ZidWcgKi9cclxuXHRcdFx0XHR0aGlzLmVsZW1lbnQoIGVsZW1lbnQgKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdG9ua2V5dXA6IGZ1bmN0aW9uKCBlbGVtZW50LCBldmVudCApIHtcclxuXHRcdFx0Ly8gQXZvaWQgcmV2YWxpZGF0ZSB0aGUgZmllbGQgd2hlbiBwcmVzc2luZyBvbmUgb2YgdGhlIGZvbGxvd2luZyBrZXlzXHJcblx0XHRcdC8vIFNoaWZ0ICAgICAgID0+IDE2XHJcblx0XHRcdC8vIEN0cmwgICAgICAgID0+IDE3XHJcblx0XHRcdC8vIEFsdCAgICAgICAgID0+IDE4XHJcblx0XHRcdC8vIENhcHMgbG9jayAgID0+IDIwXHJcblx0XHRcdC8vIEVuZCAgICAgICAgID0+IDM1XHJcblx0XHRcdC8vIEhvbWUgICAgICAgID0+IDM2XHJcblx0XHRcdC8vIExlZnQgYXJyb3cgID0+IDM3XHJcblx0XHRcdC8vIFVwIGFycm93ICAgID0+IDM4XHJcblx0XHRcdC8vIFJpZ2h0IGFycm93ID0+IDM5XHJcblx0XHRcdC8vIERvd24gYXJyb3cgID0+IDQwXHJcblx0XHRcdC8vIEluc2VydCAgICAgID0+IDQ1XHJcblx0XHRcdC8vIE51bSBsb2NrICAgID0+IDE0NFxyXG5cdFx0XHQvLyBBbHRHciBrZXkgICA9PiAyMjVcclxuXHRcdFx0dmFyIGV4Y2x1ZGVkS2V5cyA9IFtcclxuXHRcdFx0XHQxNiwgMTcsIDE4LCAyMCwgMzUsIDM2LCAzNyxcclxuXHRcdFx0XHQzOCwgMzksIDQwLCA0NSwgMTQ0LCAyMjVcclxuXHRcdFx0XTtcclxuXHJcblx0XHRcdGlmICggZXZlbnQud2hpY2ggPT09IDkgJiYgdGhpcy5lbGVtZW50VmFsdWUoIGVsZW1lbnQgKSA9PT0gXCJcIiB8fCBleGNsdWRlZEtleXMuam9pbignLCcpLmluZGV4T2YoIGV2ZW50LmtleUNvZGUgKSAhPT0gLTEgKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9IGVsc2UgaWYgKCBlbGVtZW50Lm5hbWUgaW4gdGhpcy5zdWJtaXR0ZWQgfHwgZWxlbWVudCA9PT0gdGhpcy5sYXN0RWxlbWVudCApIHtcclxuXHRcdFx0XHR0aGlzLmVsZW1lbnQoIGVsZW1lbnQgKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdG9uY2xpY2s6IGZ1bmN0aW9uKCBlbGVtZW50ICkge1xyXG5cdFx0XHQvLyBjbGljayBvbiBzZWxlY3RzLCByYWRpb2J1dHRvbnMgYW5kIGNoZWNrYm94ZXNcclxuXHRcdFx0aWYgKCBlbGVtZW50Lm5hbWUgaW4gdGhpcy5zdWJtaXR0ZWQgKSB7XHJcblx0XHRcdFx0dGhpcy5lbGVtZW50KCBlbGVtZW50ICk7XHJcblx0XHRcdC8vIG9yIG9wdGlvbiBlbGVtZW50cywgY2hlY2sgcGFyZW50IHNlbGVjdCBpbiB0aGF0IGNhc2VcclxuXHRcdFx0fSBlbHNlIGlmICggZWxlbWVudC5wYXJlbnROb2RlLm5hbWUgaW4gdGhpcy5zdWJtaXR0ZWQgKSB7XHJcblx0XHRcdFx0dGhpcy5lbGVtZW50KCBlbGVtZW50LnBhcmVudE5vZGUgKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdGhpZ2hsaWdodDogZnVuY3Rpb24oIGVsZW1lbnQsIGVycm9yQ2xhc3MsIHZhbGlkQ2xhc3MgKSB7XHJcblx0XHRcdGlmICggZWxlbWVudC50eXBlID09PSBcInJhZGlvXCIgKSB7XHJcblx0XHRcdFx0dGhpcy5maW5kQnlOYW1lKCBlbGVtZW50Lm5hbWUgKS5hZGRDbGFzcyggZXJyb3JDbGFzcyApLnJlbW92ZUNsYXNzKCB2YWxpZENsYXNzICk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0JCggZWxlbWVudCApLmFkZENsYXNzKCBlcnJvckNsYXNzICkucmVtb3ZlQ2xhc3MoIHZhbGlkQ2xhc3MgKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdHVuaGlnaGxpZ2h0OiBmdW5jdGlvbiggZWxlbWVudCwgZXJyb3JDbGFzcywgdmFsaWRDbGFzcyApIHtcclxuXHRcdFx0aWYgKCBlbGVtZW50LnR5cGUgPT09IFwicmFkaW9cIiApIHtcclxuXHRcdFx0XHR0aGlzLmZpbmRCeU5hbWUoIGVsZW1lbnQubmFtZSApLnJlbW92ZUNsYXNzKCBlcnJvckNsYXNzICkuYWRkQ2xhc3MoIHZhbGlkQ2xhc3MgKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQkKCBlbGVtZW50ICkucmVtb3ZlQ2xhc3MoIGVycm9yQ2xhc3MgKS5hZGRDbGFzcyggdmFsaWRDbGFzcyApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0Ly8gaHR0cDovL2pxdWVyeXZhbGlkYXRpb24ub3JnL2pRdWVyeS52YWxpZGF0b3Iuc2V0RGVmYXVsdHMvXHJcblx0c2V0RGVmYXVsdHM6IGZ1bmN0aW9uKCBzZXR0aW5ncyApIHtcclxuXHRcdCQuZXh0ZW5kKCAkLnZhbGlkYXRvci5kZWZhdWx0cywgc2V0dGluZ3MgKTtcclxuXHR9LFxyXG5cclxuXHRtZXNzYWdlczoge1xyXG5cdFx0cmVxdWlyZWQ6IFwiVGhpcyBmaWVsZCBpcyByZXF1aXJlZC5cIixcclxuXHRcdHJlbW90ZTogXCJQbGVhc2UgZml4IHRoaXMgZmllbGQuXCIsXHJcblx0XHRlbWFpbDogXCJQbGVhc2UgZW50ZXIgYSB2YWxpZCBlbWFpbCBhZGRyZXNzLlwiLFxyXG5cdFx0dXJsOiBcIlBsZWFzZSBlbnRlciBhIHZhbGlkIFVSTC5cIixcclxuXHRcdGRhdGU6IFwiUGxlYXNlIGVudGVyIGEgdmFsaWQgZGF0ZS5cIixcclxuXHRcdGRhdGVJU086IFwiUGxlYXNlIGVudGVyIGEgdmFsaWQgZGF0ZSAoIElTTyApLlwiLFxyXG5cdFx0bnVtYmVyOiBcIlBsZWFzZSBlbnRlciBhIHZhbGlkIG51bWJlci5cIixcclxuXHRcdGRpZ2l0czogXCJQbGVhc2UgZW50ZXIgb25seSBkaWdpdHMuXCIsXHJcblx0XHRjcmVkaXRjYXJkOiBcIlBsZWFzZSBlbnRlciBhIHZhbGlkIGNyZWRpdCBjYXJkIG51bWJlci5cIixcclxuXHRcdGVxdWFsVG86IFwiUGxlYXNlIGVudGVyIHRoZSBzYW1lIHZhbHVlIGFnYWluLlwiLFxyXG5cdFx0bWF4bGVuZ3RoOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiUGxlYXNlIGVudGVyIG5vIG1vcmUgdGhhbiB7MH0gY2hhcmFjdGVycy5cIiApLFxyXG5cdFx0bWlubGVuZ3RoOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiUGxlYXNlIGVudGVyIGF0IGxlYXN0IHswfSBjaGFyYWN0ZXJzLlwiICksXHJcblx0XHRyYW5nZWxlbmd0aDogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlBsZWFzZSBlbnRlciBhIHZhbHVlIGJldHdlZW4gezB9IGFuZCB7MX0gY2hhcmFjdGVycyBsb25nLlwiICksXHJcblx0XHRyYW5nZTogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlBsZWFzZSBlbnRlciBhIHZhbHVlIGJldHdlZW4gezB9IGFuZCB7MX0uXCIgKSxcclxuXHRcdG1heDogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlBsZWFzZSBlbnRlciBhIHZhbHVlIGxlc3MgdGhhbiBvciBlcXVhbCB0byB7MH0uXCIgKSxcclxuXHRcdG1pbjogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlBsZWFzZSBlbnRlciBhIHZhbHVlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB7MH0uXCIgKVxyXG5cdH0sXHJcblxyXG5cdGF1dG9DcmVhdGVSYW5nZXM6IGZhbHNlLFxyXG5cclxuXHRwcm90b3R5cGU6IHtcclxuXHJcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhpcy5sYWJlbENvbnRhaW5lciA9ICQoIHRoaXMuc2V0dGluZ3MuZXJyb3JMYWJlbENvbnRhaW5lciApO1xyXG5cdFx0XHR0aGlzLmVycm9yQ29udGV4dCA9IHRoaXMubGFiZWxDb250YWluZXIubGVuZ3RoICYmIHRoaXMubGFiZWxDb250YWluZXIgfHwgJCggdGhpcy5jdXJyZW50Rm9ybSApO1xyXG5cdFx0XHR0aGlzLmNvbnRhaW5lcnMgPSAkKCB0aGlzLnNldHRpbmdzLmVycm9yQ29udGFpbmVyICkuYWRkKCB0aGlzLnNldHRpbmdzLmVycm9yTGFiZWxDb250YWluZXIgKTtcclxuXHRcdFx0dGhpcy5zdWJtaXR0ZWQgPSB7fTtcclxuXHRcdFx0dGhpcy52YWx1ZUNhY2hlID0ge307XHJcblx0XHRcdHRoaXMucGVuZGluZ1JlcXVlc3QgPSAwO1xyXG5cdFx0XHR0aGlzLnBlbmRpbmcgPSB7fTtcclxuXHRcdFx0dGhpcy5pbnZhbGlkID0ge307XHJcblx0XHRcdHRoaXMucmVzZXQoKTtcclxuXHJcblx0XHRcdHZhciBncm91cHMgPSAoIHRoaXMuZ3JvdXBzID0ge30gKSxcclxuXHRcdFx0XHRydWxlcztcclxuXHRcdFx0JC5lYWNoKCB0aGlzLnNldHRpbmdzLmdyb3VwcywgZnVuY3Rpb24oIGtleSwgdmFsdWUgKSB7XHJcblx0XHRcdFx0aWYgKCB0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgKSB7XHJcblx0XHRcdFx0XHR2YWx1ZSA9IHZhbHVlLnNwbGl0KCAvXFxzLyApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQkLmVhY2goIHZhbHVlLCBmdW5jdGlvbiggaW5kZXgsIG5hbWUgKSB7XHJcblx0XHRcdFx0XHRncm91cHNbIG5hbWUgXSA9IGtleTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdHJ1bGVzID0gdGhpcy5zZXR0aW5ncy5ydWxlcztcclxuXHRcdFx0JC5lYWNoKCBydWxlcywgZnVuY3Rpb24oIGtleSwgdmFsdWUgKSB7XHJcblx0XHRcdFx0cnVsZXNbIGtleSBdID0gJC52YWxpZGF0b3Iubm9ybWFsaXplUnVsZSggdmFsdWUgKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBkZWxlZ2F0ZSggZXZlbnQgKSB7XHJcblx0XHRcdFx0dmFyIHZhbGlkYXRvciA9ICQuZGF0YSggdGhpc1sgMCBdLmZvcm0sIFwidmFsaWRhdG9yXCIgKSxcclxuXHRcdFx0XHRcdGV2ZW50VHlwZSA9IFwib25cIiArIGV2ZW50LnR5cGUucmVwbGFjZSggL152YWxpZGF0ZS8sIFwiXCIgKSxcclxuXHRcdFx0XHRcdHNldHRpbmdzID0gdmFsaWRhdG9yLnNldHRpbmdzO1xyXG5cdFx0XHRcdGlmICggc2V0dGluZ3NbIGV2ZW50VHlwZSBdICYmICF0aGlzLmlzKCBzZXR0aW5ncy5pZ25vcmUgKSApIHtcclxuXHRcdFx0XHRcdHNldHRpbmdzWyBldmVudFR5cGUgXS5jYWxsKCB2YWxpZGF0b3IsIHRoaXNbIDAgXSwgZXZlbnQgKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0JCggdGhpcy5jdXJyZW50Rm9ybSApXHJcblx0XHRcdFx0LnZhbGlkYXRlRGVsZWdhdGUoIFwiOnRleHQsIFt0eXBlPSdwYXNzd29yZCddLCBbdHlwZT0nZmlsZSddLCBzZWxlY3QsIHRleHRhcmVhLCBcIiArXHJcblx0XHRcdFx0XHRcIlt0eXBlPSdudW1iZXInXSwgW3R5cGU9J3NlYXJjaCddICxbdHlwZT0ndGVsJ10sIFt0eXBlPSd1cmwnXSwgXCIgK1xyXG5cdFx0XHRcdFx0XCJbdHlwZT0nZW1haWwnXSwgW3R5cGU9J2RhdGV0aW1lJ10sIFt0eXBlPSdkYXRlJ10sIFt0eXBlPSdtb250aCddLCBcIiArXHJcblx0XHRcdFx0XHRcIlt0eXBlPSd3ZWVrJ10sIFt0eXBlPSd0aW1lJ10sIFt0eXBlPSdkYXRldGltZS1sb2NhbCddLCBcIiArXHJcblx0XHRcdFx0XHRcIlt0eXBlPSdyYW5nZSddLCBbdHlwZT0nY29sb3InXSwgW3R5cGU9J3JhZGlvJ10sIFt0eXBlPSdjaGVja2JveCddXCIsXHJcblx0XHRcdFx0XHRcImZvY3VzaW4gZm9jdXNvdXQga2V5dXBcIiwgZGVsZWdhdGUpXHJcblx0XHRcdFx0Ly8gU3VwcG9ydDogQ2hyb21lLCBvbGRJRVxyXG5cdFx0XHRcdC8vIFwic2VsZWN0XCIgaXMgcHJvdmlkZWQgYXMgZXZlbnQudGFyZ2V0IHdoZW4gY2xpY2tpbmcgYSBvcHRpb25cclxuXHRcdFx0XHQudmFsaWRhdGVEZWxlZ2F0ZShcInNlbGVjdCwgb3B0aW9uLCBbdHlwZT0ncmFkaW8nXSwgW3R5cGU9J2NoZWNrYm94J11cIiwgXCJjbGlja1wiLCBkZWxlZ2F0ZSk7XHJcblxyXG5cdFx0XHRpZiAoIHRoaXMuc2V0dGluZ3MuaW52YWxpZEhhbmRsZXIgKSB7XHJcblx0XHRcdFx0JCggdGhpcy5jdXJyZW50Rm9ybSApLmJpbmQoIFwiaW52YWxpZC1mb3JtLnZhbGlkYXRlXCIsIHRoaXMuc2V0dGluZ3MuaW52YWxpZEhhbmRsZXIgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gQWRkIGFyaWEtcmVxdWlyZWQgdG8gYW55IFN0YXRpYy9EYXRhL0NsYXNzIHJlcXVpcmVkIGZpZWxkcyBiZWZvcmUgZmlyc3QgdmFsaWRhdGlvblxyXG5cdFx0XHQvLyBTY3JlZW4gcmVhZGVycyByZXF1aXJlIHRoaXMgYXR0cmlidXRlIHRvIGJlIHByZXNlbnQgYmVmb3JlIHRoZSBpbml0aWFsIHN1Ym1pc3Npb24gaHR0cDovL3d3dy53My5vcmcvVFIvV0NBRy1URUNIUy9BUklBMi5odG1sXHJcblx0XHRcdCQoIHRoaXMuY3VycmVudEZvcm0gKS5maW5kKCBcIltyZXF1aXJlZF0sIFtkYXRhLXJ1bGUtcmVxdWlyZWRdLCAucmVxdWlyZWRcIiApLmF0dHIoIFwiYXJpYS1yZXF1aXJlZFwiLCBcInRydWVcIiApO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBodHRwOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvVmFsaWRhdG9yLmZvcm0vXHJcblx0XHRmb3JtOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhpcy5jaGVja0Zvcm0oKTtcclxuXHRcdFx0JC5leHRlbmQoIHRoaXMuc3VibWl0dGVkLCB0aGlzLmVycm9yTWFwICk7XHJcblx0XHRcdHRoaXMuaW52YWxpZCA9ICQuZXh0ZW5kKHt9LCB0aGlzLmVycm9yTWFwICk7XHJcblx0XHRcdGlmICggIXRoaXMudmFsaWQoKSApIHtcclxuXHRcdFx0XHQkKCB0aGlzLmN1cnJlbnRGb3JtICkudHJpZ2dlckhhbmRsZXIoIFwiaW52YWxpZC1mb3JtXCIsIFsgdGhpcyBdKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLnNob3dFcnJvcnMoKTtcclxuXHRcdFx0cmV0dXJuIHRoaXMudmFsaWQoKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Y2hlY2tGb3JtOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhpcy5wcmVwYXJlRm9ybSgpO1xyXG5cdFx0XHRmb3IgKCB2YXIgaSA9IDAsIGVsZW1lbnRzID0gKCB0aGlzLmN1cnJlbnRFbGVtZW50cyA9IHRoaXMuZWxlbWVudHMoKSApOyBlbGVtZW50c1sgaSBdOyBpKysgKSB7XHJcblx0XHRcdFx0dGhpcy5jaGVjayggZWxlbWVudHNbIGkgXSApO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB0aGlzLnZhbGlkKCk7XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIGh0dHA6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9WYWxpZGF0b3IuZWxlbWVudC9cclxuXHRcdGVsZW1lbnQ6IGZ1bmN0aW9uKCBlbGVtZW50ICkge1xyXG5cdFx0XHR2YXIgY2xlYW5FbGVtZW50ID0gdGhpcy5jbGVhbiggZWxlbWVudCApLFxyXG5cdFx0XHRcdGNoZWNrRWxlbWVudCA9IHRoaXMudmFsaWRhdGlvblRhcmdldEZvciggY2xlYW5FbGVtZW50ICksXHJcblx0XHRcdFx0cmVzdWx0ID0gdHJ1ZTtcclxuXHJcblx0XHRcdHRoaXMubGFzdEVsZW1lbnQgPSBjaGVja0VsZW1lbnQ7XHJcblxyXG5cdFx0XHRpZiAoIGNoZWNrRWxlbWVudCA9PT0gdW5kZWZpbmVkICkge1xyXG5cdFx0XHRcdGRlbGV0ZSB0aGlzLmludmFsaWRbIGNsZWFuRWxlbWVudC5uYW1lIF07XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5wcmVwYXJlRWxlbWVudCggY2hlY2tFbGVtZW50ICk7XHJcblx0XHRcdFx0dGhpcy5jdXJyZW50RWxlbWVudHMgPSAkKCBjaGVja0VsZW1lbnQgKTtcclxuXHJcblx0XHRcdFx0cmVzdWx0ID0gdGhpcy5jaGVjayggY2hlY2tFbGVtZW50ICkgIT09IGZhbHNlO1xyXG5cdFx0XHRcdGlmICggcmVzdWx0ICkge1xyXG5cdFx0XHRcdFx0ZGVsZXRlIHRoaXMuaW52YWxpZFsgY2hlY2tFbGVtZW50Lm5hbWUgXTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5pbnZhbGlkWyBjaGVja0VsZW1lbnQubmFtZSBdID0gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gQWRkIGFyaWEtaW52YWxpZCBzdGF0dXMgZm9yIHNjcmVlbiByZWFkZXJzXHJcblx0XHRcdCQoIGVsZW1lbnQgKS5hdHRyKCBcImFyaWEtaW52YWxpZFwiLCAhcmVzdWx0ICk7XHJcblxyXG5cdFx0XHRpZiAoICF0aGlzLm51bWJlck9mSW52YWxpZHMoKSApIHtcclxuXHRcdFx0XHQvLyBIaWRlIGVycm9yIGNvbnRhaW5lcnMgb24gbGFzdCBlcnJvclxyXG5cdFx0XHRcdHRoaXMudG9IaWRlID0gdGhpcy50b0hpZGUuYWRkKCB0aGlzLmNvbnRhaW5lcnMgKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLnNob3dFcnJvcnMoKTtcclxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gaHR0cDovL2pxdWVyeXZhbGlkYXRpb24ub3JnL1ZhbGlkYXRvci5zaG93RXJyb3JzL1xyXG5cdFx0c2hvd0Vycm9yczogZnVuY3Rpb24oIGVycm9ycyApIHtcclxuXHRcdFx0aWYgKCBlcnJvcnMgKSB7XHJcblx0XHRcdFx0Ly8gYWRkIGl0ZW1zIHRvIGVycm9yIGxpc3QgYW5kIG1hcFxyXG5cdFx0XHRcdCQuZXh0ZW5kKCB0aGlzLmVycm9yTWFwLCBlcnJvcnMgKTtcclxuXHRcdFx0XHR0aGlzLmVycm9yTGlzdCA9IFtdO1xyXG5cdFx0XHRcdGZvciAoIHZhciBuYW1lIGluIGVycm9ycyApIHtcclxuXHRcdFx0XHRcdHRoaXMuZXJyb3JMaXN0LnB1c2goe1xyXG5cdFx0XHRcdFx0XHRtZXNzYWdlOiBlcnJvcnNbIG5hbWUgXSxcclxuXHRcdFx0XHRcdFx0ZWxlbWVudDogdGhpcy5maW5kQnlOYW1lKCBuYW1lIClbIDAgXVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIHJlbW92ZSBpdGVtcyBmcm9tIHN1Y2Nlc3MgbGlzdFxyXG5cdFx0XHRcdHRoaXMuc3VjY2Vzc0xpc3QgPSAkLmdyZXAoIHRoaXMuc3VjY2Vzc0xpc3QsIGZ1bmN0aW9uKCBlbGVtZW50ICkge1xyXG5cdFx0XHRcdFx0cmV0dXJuICEoIGVsZW1lbnQubmFtZSBpbiBlcnJvcnMgKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIHRoaXMuc2V0dGluZ3Muc2hvd0Vycm9ycyApIHtcclxuXHRcdFx0XHR0aGlzLnNldHRpbmdzLnNob3dFcnJvcnMuY2FsbCggdGhpcywgdGhpcy5lcnJvck1hcCwgdGhpcy5lcnJvckxpc3QgKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmRlZmF1bHRTaG93RXJyb3JzKCk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gaHR0cDovL2pxdWVyeXZhbGlkYXRpb24ub3JnL1ZhbGlkYXRvci5yZXNldEZvcm0vXHJcblx0XHRyZXNldEZvcm06IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZiAoICQuZm4ucmVzZXRGb3JtICkge1xyXG5cdFx0XHRcdCQoIHRoaXMuY3VycmVudEZvcm0gKS5yZXNldEZvcm0oKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLnN1Ym1pdHRlZCA9IHt9O1xyXG5cdFx0XHR0aGlzLmxhc3RFbGVtZW50ID0gbnVsbDtcclxuXHRcdFx0dGhpcy5wcmVwYXJlRm9ybSgpO1xyXG5cdFx0XHR0aGlzLmhpZGVFcnJvcnMoKTtcclxuXHRcdFx0dmFyIGksIGVsZW1lbnRzID0gdGhpcy5lbGVtZW50cygpXHJcblx0XHRcdFx0LnJlbW92ZURhdGEoIFwicHJldmlvdXNWYWx1ZVwiIClcclxuXHRcdFx0XHQucmVtb3ZlQXR0ciggXCJhcmlhLWludmFsaWRcIiApO1xyXG5cclxuXHRcdFx0aWYgKCB0aGlzLnNldHRpbmdzLnVuaGlnaGxpZ2h0ICkge1xyXG5cdFx0XHRcdGZvciAoIGkgPSAwOyBlbGVtZW50c1sgaSBdOyBpKysgKSB7XHJcblx0XHRcdFx0XHR0aGlzLnNldHRpbmdzLnVuaGlnaGxpZ2h0LmNhbGwoIHRoaXMsIGVsZW1lbnRzWyBpIF0sXHJcblx0XHRcdFx0XHRcdHRoaXMuc2V0dGluZ3MuZXJyb3JDbGFzcywgXCJcIiApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRlbGVtZW50cy5yZW1vdmVDbGFzcyggdGhpcy5zZXR0aW5ncy5lcnJvckNsYXNzICk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0bnVtYmVyT2ZJbnZhbGlkczogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLm9iamVjdExlbmd0aCggdGhpcy5pbnZhbGlkICk7XHJcblx0XHR9LFxyXG5cclxuXHRcdG9iamVjdExlbmd0aDogZnVuY3Rpb24oIG9iaiApIHtcclxuXHRcdFx0LyoganNoaW50IHVudXNlZDogZmFsc2UgKi9cclxuXHRcdFx0dmFyIGNvdW50ID0gMCxcclxuXHRcdFx0XHRpO1xyXG5cdFx0XHRmb3IgKCBpIGluIG9iaiApIHtcclxuXHRcdFx0XHRjb3VudCsrO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBjb3VudDtcclxuXHRcdH0sXHJcblxyXG5cdFx0aGlkZUVycm9yczogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHRoaXMuaGlkZVRoZXNlKCB0aGlzLnRvSGlkZSApO1xyXG5cdFx0fSxcclxuXHJcblx0XHRoaWRlVGhlc2U6IGZ1bmN0aW9uKCBlcnJvcnMgKSB7XHJcblx0XHRcdGVycm9ycy5ub3QoIHRoaXMuY29udGFpbmVycyApLnRleHQoIFwiXCIgKTtcclxuXHRcdFx0dGhpcy5hZGRXcmFwcGVyKCBlcnJvcnMgKS5oaWRlKCk7XHJcblx0XHR9LFxyXG5cclxuXHRcdHZhbGlkOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuc2l6ZSgpID09PSAwO1xyXG5cdFx0fSxcclxuXHJcblx0XHRzaXplOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuZXJyb3JMaXN0Lmxlbmd0aDtcclxuXHRcdH0sXHJcblxyXG5cdFx0Zm9jdXNJbnZhbGlkOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYgKCB0aGlzLnNldHRpbmdzLmZvY3VzSW52YWxpZCApIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0JCggdGhpcy5maW5kTGFzdEFjdGl2ZSgpIHx8IHRoaXMuZXJyb3JMaXN0Lmxlbmd0aCAmJiB0aGlzLmVycm9yTGlzdFsgMCBdLmVsZW1lbnQgfHwgW10pXHJcblx0XHRcdFx0XHQuZmlsdGVyKCBcIjp2aXNpYmxlXCIgKVxyXG5cdFx0XHRcdFx0LmZvY3VzKClcclxuXHRcdFx0XHRcdC8vIG1hbnVhbGx5IHRyaWdnZXIgZm9jdXNpbiBldmVudDsgd2l0aG91dCBpdCwgZm9jdXNpbiBoYW5kbGVyIGlzbid0IGNhbGxlZCwgZmluZExhc3RBY3RpdmUgd29uJ3QgaGF2ZSBhbnl0aGluZyB0byBmaW5kXHJcblx0XHRcdFx0XHQudHJpZ2dlciggXCJmb2N1c2luXCIgKTtcclxuXHRcdFx0XHR9IGNhdGNoICggZSApIHtcclxuXHRcdFx0XHRcdC8vIGlnbm9yZSBJRSB0aHJvd2luZyBlcnJvcnMgd2hlbiBmb2N1c2luZyBoaWRkZW4gZWxlbWVudHNcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0ZmluZExhc3RBY3RpdmU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgbGFzdEFjdGl2ZSA9IHRoaXMubGFzdEFjdGl2ZTtcclxuXHRcdFx0cmV0dXJuIGxhc3RBY3RpdmUgJiYgJC5ncmVwKCB0aGlzLmVycm9yTGlzdCwgZnVuY3Rpb24oIG4gKSB7XHJcblx0XHRcdFx0cmV0dXJuIG4uZWxlbWVudC5uYW1lID09PSBsYXN0QWN0aXZlLm5hbWU7XHJcblx0XHRcdH0pLmxlbmd0aCA9PT0gMSAmJiBsYXN0QWN0aXZlO1xyXG5cdFx0fSxcclxuXHJcblx0XHRlbGVtZW50czogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciB2YWxpZGF0b3IgPSB0aGlzLFxyXG5cdFx0XHRcdHJ1bGVzQ2FjaGUgPSB7fTtcclxuXHJcblx0XHRcdC8vIHNlbGVjdCBhbGwgdmFsaWQgaW5wdXRzIGluc2lkZSB0aGUgZm9ybSAobm8gc3VibWl0IG9yIHJlc2V0IGJ1dHRvbnMpXHJcblx0XHRcdHJldHVybiAkKCB0aGlzLmN1cnJlbnRGb3JtIClcclxuXHRcdFx0LmZpbmQoIFwiaW5wdXQsIHNlbGVjdCwgdGV4dGFyZWFcIiApXHJcblx0XHRcdC5ub3QoIFwiOnN1Ym1pdCwgOnJlc2V0LCA6aW1hZ2UsIFtkaXNhYmxlZF1cIiApXHJcblx0XHRcdC5ub3QoIHRoaXMuc2V0dGluZ3MuaWdub3JlIClcclxuXHRcdFx0LmZpbHRlciggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0aWYgKCAhdGhpcy5uYW1lICYmIHZhbGlkYXRvci5zZXR0aW5ncy5kZWJ1ZyAmJiB3aW5kb3cuY29uc29sZSApIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoIFwiJW8gaGFzIG5vIG5hbWUgYXNzaWduZWRcIiwgdGhpcyApO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gc2VsZWN0IG9ubHkgdGhlIGZpcnN0IGVsZW1lbnQgZm9yIGVhY2ggbmFtZSwgYW5kIG9ubHkgdGhvc2Ugd2l0aCBydWxlcyBzcGVjaWZpZWRcclxuXHRcdFx0XHRpZiAoIHRoaXMubmFtZSBpbiBydWxlc0NhY2hlIHx8ICF2YWxpZGF0b3Iub2JqZWN0TGVuZ3RoKCAkKCB0aGlzICkucnVsZXMoKSApICkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0cnVsZXNDYWNoZVsgdGhpcy5uYW1lIF0gPSB0cnVlO1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Y2xlYW46IGZ1bmN0aW9uKCBzZWxlY3RvciApIHtcclxuXHRcdFx0cmV0dXJuICQoIHNlbGVjdG9yIClbIDAgXTtcclxuXHRcdH0sXHJcblxyXG5cdFx0ZXJyb3JzOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIGVycm9yQ2xhc3MgPSB0aGlzLnNldHRpbmdzLmVycm9yQ2xhc3Muc3BsaXQoIFwiIFwiICkuam9pbiggXCIuXCIgKTtcclxuXHRcdFx0cmV0dXJuICQoIHRoaXMuc2V0dGluZ3MuZXJyb3JFbGVtZW50ICsgXCIuXCIgKyBlcnJvckNsYXNzLCB0aGlzLmVycm9yQ29udGV4dCApO1xyXG5cdFx0fSxcclxuXHJcblx0XHRyZXNldDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHRoaXMuc3VjY2Vzc0xpc3QgPSBbXTtcclxuXHRcdFx0dGhpcy5lcnJvckxpc3QgPSBbXTtcclxuXHRcdFx0dGhpcy5lcnJvck1hcCA9IHt9O1xyXG5cdFx0XHR0aGlzLnRvU2hvdyA9ICQoIFtdICk7XHJcblx0XHRcdHRoaXMudG9IaWRlID0gJCggW10gKTtcclxuXHRcdFx0dGhpcy5jdXJyZW50RWxlbWVudHMgPSAkKCBbXSApO1xyXG5cdFx0fSxcclxuXHJcblx0XHRwcmVwYXJlRm9ybTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHRoaXMucmVzZXQoKTtcclxuXHRcdFx0dGhpcy50b0hpZGUgPSB0aGlzLmVycm9ycygpLmFkZCggdGhpcy5jb250YWluZXJzICk7XHJcblx0XHR9LFxyXG5cclxuXHRcdHByZXBhcmVFbGVtZW50OiBmdW5jdGlvbiggZWxlbWVudCApIHtcclxuXHRcdFx0dGhpcy5yZXNldCgpO1xyXG5cdFx0XHR0aGlzLnRvSGlkZSA9IHRoaXMuZXJyb3JzRm9yKCBlbGVtZW50ICk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGVsZW1lbnRWYWx1ZTogZnVuY3Rpb24oIGVsZW1lbnQgKSB7XHJcblx0XHRcdHZhciB2YWwsXHJcblx0XHRcdFx0JGVsZW1lbnQgPSAkKCBlbGVtZW50ICksXHJcblx0XHRcdFx0dHlwZSA9IGVsZW1lbnQudHlwZTtcclxuXHJcblx0XHRcdGlmICggdHlwZSA9PT0gXCJyYWRpb1wiIHx8IHR5cGUgPT09IFwiY2hlY2tib3hcIiApIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5maW5kQnlOYW1lKCBlbGVtZW50Lm5hbWUgKS5maWx0ZXIoXCI6Y2hlY2tlZFwiKS52YWwoKTtcclxuXHRcdFx0fSBlbHNlIGlmICggdHlwZSA9PT0gXCJudW1iZXJcIiAmJiB0eXBlb2YgZWxlbWVudC52YWxpZGl0eSAhPT0gXCJ1bmRlZmluZWRcIiApIHtcclxuXHRcdFx0XHRyZXR1cm4gZWxlbWVudC52YWxpZGl0eS5iYWRJbnB1dCA/IGZhbHNlIDogJGVsZW1lbnQudmFsKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhbCA9ICRlbGVtZW50LnZhbCgpO1xyXG5cdFx0XHRpZiAoIHR5cGVvZiB2YWwgPT09IFwic3RyaW5nXCIgKSB7XHJcblx0XHRcdFx0cmV0dXJuIHZhbC5yZXBsYWNlKC9cXHIvZywgXCJcIiApO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB2YWw7XHJcblx0XHR9LFxyXG5cclxuXHRcdGNoZWNrOiBmdW5jdGlvbiggZWxlbWVudCApIHtcclxuXHRcdFx0ZWxlbWVudCA9IHRoaXMudmFsaWRhdGlvblRhcmdldEZvciggdGhpcy5jbGVhbiggZWxlbWVudCApICk7XHJcblxyXG5cdFx0XHR2YXIgcnVsZXMgPSAkKCBlbGVtZW50ICkucnVsZXMoKSxcclxuXHRcdFx0XHRydWxlc0NvdW50ID0gJC5tYXAoIHJ1bGVzLCBmdW5jdGlvbiggbiwgaSApIHtcclxuXHRcdFx0XHRcdHJldHVybiBpO1xyXG5cdFx0XHRcdH0pLmxlbmd0aCxcclxuXHRcdFx0XHRkZXBlbmRlbmN5TWlzbWF0Y2ggPSBmYWxzZSxcclxuXHRcdFx0XHR2YWwgPSB0aGlzLmVsZW1lbnRWYWx1ZSggZWxlbWVudCApLFxyXG5cdFx0XHRcdHJlc3VsdCwgbWV0aG9kLCBydWxlO1xyXG5cclxuXHRcdFx0Zm9yICggbWV0aG9kIGluIHJ1bGVzICkge1xyXG5cdFx0XHRcdHJ1bGUgPSB7IG1ldGhvZDogbWV0aG9kLCBwYXJhbWV0ZXJzOiBydWxlc1sgbWV0aG9kIF0gfTtcclxuXHRcdFx0XHR0cnkge1xyXG5cclxuXHRcdFx0XHRcdHJlc3VsdCA9ICQudmFsaWRhdG9yLm1ldGhvZHNbIG1ldGhvZCBdLmNhbGwoIHRoaXMsIHZhbCwgZWxlbWVudCwgcnVsZS5wYXJhbWV0ZXJzICk7XHJcblxyXG5cdFx0XHRcdFx0Ly8gaWYgYSBtZXRob2QgaW5kaWNhdGVzIHRoYXQgdGhlIGZpZWxkIGlzIG9wdGlvbmFsIGFuZCB0aGVyZWZvcmUgdmFsaWQsXHJcblx0XHRcdFx0XHQvLyBkb24ndCBtYXJrIGl0IGFzIHZhbGlkIHdoZW4gdGhlcmUgYXJlIG5vIG90aGVyIHJ1bGVzXHJcblx0XHRcdFx0XHRpZiAoIHJlc3VsdCA9PT0gXCJkZXBlbmRlbmN5LW1pc21hdGNoXCIgJiYgcnVsZXNDb3VudCA9PT0gMSApIHtcclxuXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeU1pc21hdGNoID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRkZXBlbmRlbmN5TWlzbWF0Y2ggPSBmYWxzZTtcclxuXHJcblx0XHRcdFx0XHRpZiAoIHJlc3VsdCA9PT0gXCJwZW5kaW5nXCIgKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMudG9IaWRlID0gdGhpcy50b0hpZGUubm90KCB0aGlzLmVycm9yc0ZvciggZWxlbWVudCApICk7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAoICFyZXN1bHQgKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZm9ybWF0QW5kQWRkKCBlbGVtZW50LCBydWxlICk7XHJcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGNhdGNoICggZSApIHtcclxuXHRcdFx0XHRcdGlmICggdGhpcy5zZXR0aW5ncy5kZWJ1ZyAmJiB3aW5kb3cuY29uc29sZSApIHtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coIFwiRXhjZXB0aW9uIG9jY3VycmVkIHdoZW4gY2hlY2tpbmcgZWxlbWVudCBcIiArIGVsZW1lbnQuaWQgKyBcIiwgY2hlY2sgdGhlICdcIiArIHJ1bGUubWV0aG9kICsgXCInIG1ldGhvZC5cIiwgZSApO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKCBlIGluc3RhbmNlb2YgVHlwZUVycm9yICkge1xyXG5cdFx0XHRcdFx0XHRlLm1lc3NhZ2UgKz0gXCIuICBFeGNlcHRpb24gb2NjdXJyZWQgd2hlbiBjaGVja2luZyBlbGVtZW50IFwiICsgZWxlbWVudC5pZCArIFwiLCBjaGVjayB0aGUgJ1wiICsgcnVsZS5tZXRob2QgKyBcIicgbWV0aG9kLlwiO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHRocm93IGU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICggZGVwZW5kZW5jeU1pc21hdGNoICkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIHRoaXMub2JqZWN0TGVuZ3RoKCBydWxlcyApICkge1xyXG5cdFx0XHRcdHRoaXMuc3VjY2Vzc0xpc3QucHVzaCggZWxlbWVudCApO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyByZXR1cm4gdGhlIGN1c3RvbSBtZXNzYWdlIGZvciB0aGUgZ2l2ZW4gZWxlbWVudCBhbmQgdmFsaWRhdGlvbiBtZXRob2RcclxuXHRcdC8vIHNwZWNpZmllZCBpbiB0aGUgZWxlbWVudCdzIEhUTUw1IGRhdGEgYXR0cmlidXRlXHJcblx0XHQvLyByZXR1cm4gdGhlIGdlbmVyaWMgbWVzc2FnZSBpZiBwcmVzZW50IGFuZCBubyBtZXRob2Qgc3BlY2lmaWMgbWVzc2FnZSBpcyBwcmVzZW50XHJcblx0XHRjdXN0b21EYXRhTWVzc2FnZTogZnVuY3Rpb24oIGVsZW1lbnQsIG1ldGhvZCApIHtcclxuXHRcdFx0cmV0dXJuICQoIGVsZW1lbnQgKS5kYXRhKCBcIm1zZ1wiICsgbWV0aG9kLmNoYXJBdCggMCApLnRvVXBwZXJDYXNlKCkgK1xyXG5cdFx0XHRcdG1ldGhvZC5zdWJzdHJpbmcoIDEgKS50b0xvd2VyQ2FzZSgpICkgfHwgJCggZWxlbWVudCApLmRhdGEoIFwibXNnXCIgKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gcmV0dXJuIHRoZSBjdXN0b20gbWVzc2FnZSBmb3IgdGhlIGdpdmVuIGVsZW1lbnQgbmFtZSBhbmQgdmFsaWRhdGlvbiBtZXRob2RcclxuXHRcdGN1c3RvbU1lc3NhZ2U6IGZ1bmN0aW9uKCBuYW1lLCBtZXRob2QgKSB7XHJcblx0XHRcdHZhciBtID0gdGhpcy5zZXR0aW5ncy5tZXNzYWdlc1sgbmFtZSBdO1xyXG5cdFx0XHRyZXR1cm4gbSAmJiAoIG0uY29uc3RydWN0b3IgPT09IFN0cmluZyA/IG0gOiBtWyBtZXRob2QgXSk7XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIHJldHVybiB0aGUgZmlyc3QgZGVmaW5lZCBhcmd1bWVudCwgYWxsb3dpbmcgZW1wdHkgc3RyaW5nc1xyXG5cdFx0ZmluZERlZmluZWQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRmb3IgKCB2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRpZiAoIGFyZ3VtZW50c1sgaSBdICE9PSB1bmRlZmluZWQgKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gYXJndW1lbnRzWyBpIF07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB1bmRlZmluZWQ7XHJcblx0XHR9LFxyXG5cclxuXHRcdGRlZmF1bHRNZXNzYWdlOiBmdW5jdGlvbiggZWxlbWVudCwgbWV0aG9kICkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5maW5kRGVmaW5lZChcclxuXHRcdFx0XHR0aGlzLmN1c3RvbU1lc3NhZ2UoIGVsZW1lbnQubmFtZSwgbWV0aG9kICksXHJcblx0XHRcdFx0dGhpcy5jdXN0b21EYXRhTWVzc2FnZSggZWxlbWVudCwgbWV0aG9kICksXHJcblx0XHRcdFx0Ly8gdGl0bGUgaXMgbmV2ZXIgdW5kZWZpbmVkLCBzbyBoYW5kbGUgZW1wdHkgc3RyaW5nIGFzIHVuZGVmaW5lZFxyXG5cdFx0XHRcdCF0aGlzLnNldHRpbmdzLmlnbm9yZVRpdGxlICYmIGVsZW1lbnQudGl0bGUgfHwgdW5kZWZpbmVkLFxyXG5cdFx0XHRcdCQudmFsaWRhdG9yLm1lc3NhZ2VzWyBtZXRob2QgXSxcclxuXHRcdFx0XHRcIjxzdHJvbmc+V2FybmluZzogTm8gbWVzc2FnZSBkZWZpbmVkIGZvciBcIiArIGVsZW1lbnQubmFtZSArIFwiPC9zdHJvbmc+XCJcclxuXHRcdFx0KTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Zm9ybWF0QW5kQWRkOiBmdW5jdGlvbiggZWxlbWVudCwgcnVsZSApIHtcclxuXHRcdFx0dmFyIG1lc3NhZ2UgPSB0aGlzLmRlZmF1bHRNZXNzYWdlKCBlbGVtZW50LCBydWxlLm1ldGhvZCApLFxyXG5cdFx0XHRcdHRoZXJlZ2V4ID0gL1xcJD9cXHsoXFxkKylcXH0vZztcclxuXHRcdFx0aWYgKCB0eXBlb2YgbWVzc2FnZSA9PT0gXCJmdW5jdGlvblwiICkge1xyXG5cdFx0XHRcdG1lc3NhZ2UgPSBtZXNzYWdlLmNhbGwoIHRoaXMsIHJ1bGUucGFyYW1ldGVycywgZWxlbWVudCApO1xyXG5cdFx0XHR9IGVsc2UgaWYgKCB0aGVyZWdleC50ZXN0KCBtZXNzYWdlICkgKSB7XHJcblx0XHRcdFx0bWVzc2FnZSA9ICQudmFsaWRhdG9yLmZvcm1hdCggbWVzc2FnZS5yZXBsYWNlKCB0aGVyZWdleCwgXCJ7JDF9XCIgKSwgcnVsZS5wYXJhbWV0ZXJzICk7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5lcnJvckxpc3QucHVzaCh7XHJcblx0XHRcdFx0bWVzc2FnZTogbWVzc2FnZSxcclxuXHRcdFx0XHRlbGVtZW50OiBlbGVtZW50LFxyXG5cdFx0XHRcdG1ldGhvZDogcnVsZS5tZXRob2RcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR0aGlzLmVycm9yTWFwWyBlbGVtZW50Lm5hbWUgXSA9IG1lc3NhZ2U7XHJcblx0XHRcdHRoaXMuc3VibWl0dGVkWyBlbGVtZW50Lm5hbWUgXSA9IG1lc3NhZ2U7XHJcblx0XHR9LFxyXG5cclxuXHRcdGFkZFdyYXBwZXI6IGZ1bmN0aW9uKCB0b1RvZ2dsZSApIHtcclxuXHRcdFx0aWYgKCB0aGlzLnNldHRpbmdzLndyYXBwZXIgKSB7XHJcblx0XHRcdFx0dG9Ub2dnbGUgPSB0b1RvZ2dsZS5hZGQoIHRvVG9nZ2xlLnBhcmVudCggdGhpcy5zZXR0aW5ncy53cmFwcGVyICkgKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdG9Ub2dnbGU7XHJcblx0XHR9LFxyXG5cclxuXHRcdGRlZmF1bHRTaG93RXJyb3JzOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIGksIGVsZW1lbnRzLCBlcnJvcjtcclxuXHRcdFx0Zm9yICggaSA9IDA7IHRoaXMuZXJyb3JMaXN0WyBpIF07IGkrKyApIHtcclxuXHRcdFx0XHRlcnJvciA9IHRoaXMuZXJyb3JMaXN0WyBpIF07XHJcblx0XHRcdFx0aWYgKCB0aGlzLnNldHRpbmdzLmhpZ2hsaWdodCApIHtcclxuXHRcdFx0XHRcdHRoaXMuc2V0dGluZ3MuaGlnaGxpZ2h0LmNhbGwoIHRoaXMsIGVycm9yLmVsZW1lbnQsIHRoaXMuc2V0dGluZ3MuZXJyb3JDbGFzcywgdGhpcy5zZXR0aW5ncy52YWxpZENsYXNzICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMuc2hvd0xhYmVsKCBlcnJvci5lbGVtZW50LCBlcnJvci5tZXNzYWdlICk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCB0aGlzLmVycm9yTGlzdC5sZW5ndGggKSB7XHJcblx0XHRcdFx0dGhpcy50b1Nob3cgPSB0aGlzLnRvU2hvdy5hZGQoIHRoaXMuY29udGFpbmVycyApO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICggdGhpcy5zZXR0aW5ncy5zdWNjZXNzICkge1xyXG5cdFx0XHRcdGZvciAoIGkgPSAwOyB0aGlzLnN1Y2Nlc3NMaXN0WyBpIF07IGkrKyApIHtcclxuXHRcdFx0XHRcdHRoaXMuc2hvd0xhYmVsKCB0aGlzLnN1Y2Nlc3NMaXN0WyBpIF0gKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCB0aGlzLnNldHRpbmdzLnVuaGlnaGxpZ2h0ICkge1xyXG5cdFx0XHRcdGZvciAoIGkgPSAwLCBlbGVtZW50cyA9IHRoaXMudmFsaWRFbGVtZW50cygpOyBlbGVtZW50c1sgaSBdOyBpKysgKSB7XHJcblx0XHRcdFx0XHR0aGlzLnNldHRpbmdzLnVuaGlnaGxpZ2h0LmNhbGwoIHRoaXMsIGVsZW1lbnRzWyBpIF0sIHRoaXMuc2V0dGluZ3MuZXJyb3JDbGFzcywgdGhpcy5zZXR0aW5ncy52YWxpZENsYXNzICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMudG9IaWRlID0gdGhpcy50b0hpZGUubm90KCB0aGlzLnRvU2hvdyApO1xyXG5cdFx0XHR0aGlzLmhpZGVFcnJvcnMoKTtcclxuXHRcdFx0dGhpcy5hZGRXcmFwcGVyKCB0aGlzLnRvU2hvdyApLnNob3coKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0dmFsaWRFbGVtZW50czogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmN1cnJlbnRFbGVtZW50cy5ub3QoIHRoaXMuaW52YWxpZEVsZW1lbnRzKCkgKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0aW52YWxpZEVsZW1lbnRzOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuICQoIHRoaXMuZXJyb3JMaXN0ICkubWFwKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmVsZW1lbnQ7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHJcblx0XHRzaG93TGFiZWw6IGZ1bmN0aW9uKCBlbGVtZW50LCBtZXNzYWdlICkge1xyXG5cdFx0XHR2YXIgcGxhY2UsIGdyb3VwLCBlcnJvcklELFxyXG5cdFx0XHRcdGVycm9yID0gdGhpcy5lcnJvcnNGb3IoIGVsZW1lbnQgKSxcclxuXHRcdFx0XHRlbGVtZW50SUQgPSB0aGlzLmlkT3JOYW1lKCBlbGVtZW50ICksXHJcblx0XHRcdFx0ZGVzY3JpYmVkQnkgPSAkKCBlbGVtZW50ICkuYXR0ciggXCJhcmlhLWRlc2NyaWJlZGJ5XCIgKTtcclxuXHRcdFx0aWYgKCBlcnJvci5sZW5ndGggKSB7XHJcblx0XHRcdFx0Ly8gcmVmcmVzaCBlcnJvci9zdWNjZXNzIGNsYXNzXHJcblx0XHRcdFx0ZXJyb3IucmVtb3ZlQ2xhc3MoIHRoaXMuc2V0dGluZ3MudmFsaWRDbGFzcyApLmFkZENsYXNzKCB0aGlzLnNldHRpbmdzLmVycm9yQ2xhc3MgKTtcclxuXHRcdFx0XHQvLyByZXBsYWNlIG1lc3NhZ2Ugb24gZXhpc3RpbmcgbGFiZWxcclxuXHRcdFx0XHRlcnJvci5odG1sKCBtZXNzYWdlICk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Ly8gY3JlYXRlIGVycm9yIGVsZW1lbnRcclxuXHRcdFx0XHRlcnJvciA9ICQoIFwiPFwiICsgdGhpcy5zZXR0aW5ncy5lcnJvckVsZW1lbnQgKyBcIj5cIiApXHJcblx0XHRcdFx0XHQuYXR0ciggXCJpZFwiLCBlbGVtZW50SUQgKyBcIi1lcnJvclwiIClcclxuXHRcdFx0XHRcdC5hZGRDbGFzcyggdGhpcy5zZXR0aW5ncy5lcnJvckNsYXNzIClcclxuXHRcdFx0XHRcdC5odG1sKCBtZXNzYWdlIHx8IFwiXCIgKTtcclxuXHJcblx0XHRcdFx0Ly8gTWFpbnRhaW4gcmVmZXJlbmNlIHRvIHRoZSBlbGVtZW50IHRvIGJlIHBsYWNlZCBpbnRvIHRoZSBET01cclxuXHRcdFx0XHRwbGFjZSA9IGVycm9yO1xyXG5cdFx0XHRcdGlmICggdGhpcy5zZXR0aW5ncy53cmFwcGVyICkge1xyXG5cdFx0XHRcdFx0Ly8gbWFrZSBzdXJlIHRoZSBlbGVtZW50IGlzIHZpc2libGUsIGV2ZW4gaW4gSUVcclxuXHRcdFx0XHRcdC8vIGFjdHVhbGx5IHNob3dpbmcgdGhlIHdyYXBwZWQgZWxlbWVudCBpcyBoYW5kbGVkIGVsc2V3aGVyZVxyXG5cdFx0XHRcdFx0cGxhY2UgPSBlcnJvci5oaWRlKCkuc2hvdygpLndyYXAoIFwiPFwiICsgdGhpcy5zZXR0aW5ncy53cmFwcGVyICsgXCIvPlwiICkucGFyZW50KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICggdGhpcy5sYWJlbENvbnRhaW5lci5sZW5ndGggKSB7XHJcblx0XHRcdFx0XHR0aGlzLmxhYmVsQ29udGFpbmVyLmFwcGVuZCggcGxhY2UgKTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKCB0aGlzLnNldHRpbmdzLmVycm9yUGxhY2VtZW50ICkge1xyXG5cdFx0XHRcdFx0dGhpcy5zZXR0aW5ncy5lcnJvclBsYWNlbWVudCggcGxhY2UsICQoIGVsZW1lbnQgKSApO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRwbGFjZS5pbnNlcnRBZnRlciggZWxlbWVudCApO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gTGluayBlcnJvciBiYWNrIHRvIHRoZSBlbGVtZW50XHJcblx0XHRcdFx0aWYgKCBlcnJvci5pcyggXCJsYWJlbFwiICkgKSB7XHJcblx0XHRcdFx0XHQvLyBJZiB0aGUgZXJyb3IgaXMgYSBsYWJlbCwgdGhlbiBhc3NvY2lhdGUgdXNpbmcgJ2ZvcidcclxuXHRcdFx0XHRcdGVycm9yLmF0dHIoIFwiZm9yXCIsIGVsZW1lbnRJRCApO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAoIGVycm9yLnBhcmVudHMoIFwibGFiZWxbZm9yPSdcIiArIGVsZW1lbnRJRCArIFwiJ11cIiApLmxlbmd0aCA9PT0gMCApIHtcclxuXHRcdFx0XHRcdC8vIElmIHRoZSBlbGVtZW50IGlzIG5vdCBhIGNoaWxkIG9mIGFuIGFzc29jaWF0ZWQgbGFiZWwsIHRoZW4gaXQncyBuZWNlc3NhcnlcclxuXHRcdFx0XHRcdC8vIHRvIGV4cGxpY2l0bHkgYXBwbHkgYXJpYS1kZXNjcmliZWRieVxyXG5cclxuXHRcdFx0XHRcdGVycm9ySUQgPSBlcnJvci5hdHRyKCBcImlkXCIgKS5yZXBsYWNlKCAvKDp8XFwufFxcW3xcXF18XFwkKS9nLCBcIlxcXFwkMVwiKTtcclxuXHRcdFx0XHRcdC8vIFJlc3BlY3QgZXhpc3Rpbmcgbm9uLWVycm9yIGFyaWEtZGVzY3JpYmVkYnlcclxuXHRcdFx0XHRcdGlmICggIWRlc2NyaWJlZEJ5ICkge1xyXG5cdFx0XHRcdFx0XHRkZXNjcmliZWRCeSA9IGVycm9ySUQ7XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKCAhZGVzY3JpYmVkQnkubWF0Y2goIG5ldyBSZWdFeHAoIFwiXFxcXGJcIiArIGVycm9ySUQgKyBcIlxcXFxiXCIgKSApICkge1xyXG5cdFx0XHRcdFx0XHQvLyBBZGQgdG8gZW5kIG9mIGxpc3QgaWYgbm90IGFscmVhZHkgcHJlc2VudFxyXG5cdFx0XHRcdFx0XHRkZXNjcmliZWRCeSArPSBcIiBcIiArIGVycm9ySUQ7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQkKCBlbGVtZW50ICkuYXR0ciggXCJhcmlhLWRlc2NyaWJlZGJ5XCIsIGRlc2NyaWJlZEJ5ICk7XHJcblxyXG5cdFx0XHRcdFx0Ly8gSWYgdGhpcyBlbGVtZW50IGlzIGdyb3VwZWQsIHRoZW4gYXNzaWduIHRvIGFsbCBlbGVtZW50cyBpbiB0aGUgc2FtZSBncm91cFxyXG5cdFx0XHRcdFx0Z3JvdXAgPSB0aGlzLmdyb3Vwc1sgZWxlbWVudC5uYW1lIF07XHJcblx0XHRcdFx0XHRpZiAoIGdyb3VwICkge1xyXG5cdFx0XHRcdFx0XHQkLmVhY2goIHRoaXMuZ3JvdXBzLCBmdW5jdGlvbiggbmFtZSwgdGVzdGdyb3VwICkge1xyXG5cdFx0XHRcdFx0XHRcdGlmICggdGVzdGdyb3VwID09PSBncm91cCApIHtcclxuXHRcdFx0XHRcdFx0XHRcdCQoIFwiW25hbWU9J1wiICsgbmFtZSArIFwiJ11cIiwgdGhpcy5jdXJyZW50Rm9ybSApXHJcblx0XHRcdFx0XHRcdFx0XHRcdC5hdHRyKCBcImFyaWEtZGVzY3JpYmVkYnlcIiwgZXJyb3IuYXR0ciggXCJpZFwiICkgKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoICFtZXNzYWdlICYmIHRoaXMuc2V0dGluZ3Muc3VjY2VzcyApIHtcclxuXHRcdFx0XHRlcnJvci50ZXh0KCBcIlwiICk7XHJcblx0XHRcdFx0aWYgKCB0eXBlb2YgdGhpcy5zZXR0aW5ncy5zdWNjZXNzID09PSBcInN0cmluZ1wiICkge1xyXG5cdFx0XHRcdFx0ZXJyb3IuYWRkQ2xhc3MoIHRoaXMuc2V0dGluZ3Muc3VjY2VzcyApO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLnNldHRpbmdzLnN1Y2Nlc3MoIGVycm9yLCBlbGVtZW50ICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMudG9TaG93ID0gdGhpcy50b1Nob3cuYWRkKCBlcnJvciApO1xyXG5cdFx0fSxcclxuXHJcblx0XHRlcnJvcnNGb3I6IGZ1bmN0aW9uKCBlbGVtZW50ICkge1xyXG5cdFx0XHR2YXIgbmFtZSA9IHRoaXMuaWRPck5hbWUoIGVsZW1lbnQgKSxcclxuXHRcdFx0XHRkZXNjcmliZXIgPSAkKCBlbGVtZW50ICkuYXR0ciggXCJhcmlhLWRlc2NyaWJlZGJ5XCIgKSxcclxuXHRcdFx0XHRzZWxlY3RvciA9IFwibGFiZWxbZm9yPSdcIiArIG5hbWUgKyBcIiddLCBsYWJlbFtmb3I9J1wiICsgbmFtZSArIFwiJ10gKlwiO1xyXG5cclxuXHRcdFx0Ly8gYXJpYS1kZXNjcmliZWRieSBzaG91bGQgZGlyZWN0bHkgcmVmZXJlbmNlIHRoZSBlcnJvciBlbGVtZW50XHJcblx0XHRcdGlmICggZGVzY3JpYmVyICkge1xyXG5cdFx0XHRcdHNlbGVjdG9yID0gc2VsZWN0b3IgKyBcIiwgI1wiICsgZGVzY3JpYmVyLnJlcGxhY2UoIC9cXHMrL2csIFwiLCAjXCIgKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdGhpc1xyXG5cdFx0XHRcdC5lcnJvcnMoKVxyXG5cdFx0XHRcdC5maWx0ZXIoIHNlbGVjdG9yICk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGlkT3JOYW1lOiBmdW5jdGlvbiggZWxlbWVudCApIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuZ3JvdXBzWyBlbGVtZW50Lm5hbWUgXSB8fCAoIHRoaXMuY2hlY2thYmxlKCBlbGVtZW50ICkgPyBlbGVtZW50Lm5hbWUgOiBlbGVtZW50LmlkIHx8IGVsZW1lbnQubmFtZSApO1xyXG5cdFx0fSxcclxuXHJcblx0XHR2YWxpZGF0aW9uVGFyZ2V0Rm9yOiBmdW5jdGlvbiggZWxlbWVudCApIHtcclxuXHJcblx0XHRcdC8vIElmIHJhZGlvL2NoZWNrYm94LCB2YWxpZGF0ZSBmaXJzdCBlbGVtZW50IGluIGdyb3VwIGluc3RlYWRcclxuXHRcdFx0aWYgKCB0aGlzLmNoZWNrYWJsZSggZWxlbWVudCApICkge1xyXG5cdFx0XHRcdGVsZW1lbnQgPSB0aGlzLmZpbmRCeU5hbWUoIGVsZW1lbnQubmFtZSApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBBbHdheXMgYXBwbHkgaWdub3JlIGZpbHRlclxyXG5cdFx0XHRyZXR1cm4gJCggZWxlbWVudCApLm5vdCggdGhpcy5zZXR0aW5ncy5pZ25vcmUgKVsgMCBdO1xyXG5cdFx0fSxcclxuXHJcblx0XHRjaGVja2FibGU6IGZ1bmN0aW9uKCBlbGVtZW50ICkge1xyXG5cdFx0XHRyZXR1cm4gKCAvcmFkaW98Y2hlY2tib3gvaSApLnRlc3QoIGVsZW1lbnQudHlwZSApO1xyXG5cdFx0fSxcclxuXHJcblx0XHRmaW5kQnlOYW1lOiBmdW5jdGlvbiggbmFtZSApIHtcclxuXHRcdFx0cmV0dXJuICQoIHRoaXMuY3VycmVudEZvcm0gKS5maW5kKCBcIltuYW1lPSdcIiArIG5hbWUgKyBcIiddXCIgKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Z2V0TGVuZ3RoOiBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQgKSB7XHJcblx0XHRcdHN3aXRjaCAoIGVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSApIHtcclxuXHRcdFx0Y2FzZSBcInNlbGVjdFwiOlxyXG5cdFx0XHRcdHJldHVybiAkKCBcIm9wdGlvbjpzZWxlY3RlZFwiLCBlbGVtZW50ICkubGVuZ3RoO1xyXG5cdFx0XHRjYXNlIFwiaW5wdXRcIjpcclxuXHRcdFx0XHRpZiAoIHRoaXMuY2hlY2thYmxlKCBlbGVtZW50ICkgKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5maW5kQnlOYW1lKCBlbGVtZW50Lm5hbWUgKS5maWx0ZXIoIFwiOmNoZWNrZWRcIiApLmxlbmd0aDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHZhbHVlLmxlbmd0aDtcclxuXHRcdH0sXHJcblxyXG5cdFx0ZGVwZW5kOiBmdW5jdGlvbiggcGFyYW0sIGVsZW1lbnQgKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmRlcGVuZFR5cGVzW3R5cGVvZiBwYXJhbV0gPyB0aGlzLmRlcGVuZFR5cGVzW3R5cGVvZiBwYXJhbV0oIHBhcmFtLCBlbGVtZW50ICkgOiB0cnVlO1xyXG5cdFx0fSxcclxuXHJcblx0XHRkZXBlbmRUeXBlczoge1xyXG5cdFx0XHRcImJvb2xlYW5cIjogZnVuY3Rpb24oIHBhcmFtICkge1xyXG5cdFx0XHRcdHJldHVybiBwYXJhbTtcclxuXHRcdFx0fSxcclxuXHRcdFx0XCJzdHJpbmdcIjogZnVuY3Rpb24oIHBhcmFtLCBlbGVtZW50ICkge1xyXG5cdFx0XHRcdHJldHVybiAhISQoIHBhcmFtLCBlbGVtZW50LmZvcm0gKS5sZW5ndGg7XHJcblx0XHRcdH0sXHJcblx0XHRcdFwiZnVuY3Rpb25cIjogZnVuY3Rpb24oIHBhcmFtLCBlbGVtZW50ICkge1xyXG5cdFx0XHRcdHJldHVybiBwYXJhbSggZWxlbWVudCApO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdG9wdGlvbmFsOiBmdW5jdGlvbiggZWxlbWVudCApIHtcclxuXHRcdFx0dmFyIHZhbCA9IHRoaXMuZWxlbWVudFZhbHVlKCBlbGVtZW50ICk7XHJcblx0XHRcdHJldHVybiAhJC52YWxpZGF0b3IubWV0aG9kcy5yZXF1aXJlZC5jYWxsKCB0aGlzLCB2YWwsIGVsZW1lbnQgKSAmJiBcImRlcGVuZGVuY3ktbWlzbWF0Y2hcIjtcclxuXHRcdH0sXHJcblxyXG5cdFx0c3RhcnRSZXF1ZXN0OiBmdW5jdGlvbiggZWxlbWVudCApIHtcclxuXHRcdFx0aWYgKCAhdGhpcy5wZW5kaW5nWyBlbGVtZW50Lm5hbWUgXSApIHtcclxuXHRcdFx0XHR0aGlzLnBlbmRpbmdSZXF1ZXN0Kys7XHJcblx0XHRcdFx0dGhpcy5wZW5kaW5nWyBlbGVtZW50Lm5hbWUgXSA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0c3RvcFJlcXVlc3Q6IGZ1bmN0aW9uKCBlbGVtZW50LCB2YWxpZCApIHtcclxuXHRcdFx0dGhpcy5wZW5kaW5nUmVxdWVzdC0tO1xyXG5cdFx0XHQvLyBzb21ldGltZXMgc3luY2hyb25pemF0aW9uIGZhaWxzLCBtYWtlIHN1cmUgcGVuZGluZ1JlcXVlc3QgaXMgbmV2ZXIgPCAwXHJcblx0XHRcdGlmICggdGhpcy5wZW5kaW5nUmVxdWVzdCA8IDAgKSB7XHJcblx0XHRcdFx0dGhpcy5wZW5kaW5nUmVxdWVzdCA9IDA7XHJcblx0XHRcdH1cclxuXHRcdFx0ZGVsZXRlIHRoaXMucGVuZGluZ1sgZWxlbWVudC5uYW1lIF07XHJcblx0XHRcdGlmICggdmFsaWQgJiYgdGhpcy5wZW5kaW5nUmVxdWVzdCA9PT0gMCAmJiB0aGlzLmZvcm1TdWJtaXR0ZWQgJiYgdGhpcy5mb3JtKCkgKSB7XHJcblx0XHRcdFx0JCggdGhpcy5jdXJyZW50Rm9ybSApLnN1Ym1pdCgpO1xyXG5cdFx0XHRcdHRoaXMuZm9ybVN1Ym1pdHRlZCA9IGZhbHNlO1xyXG5cdFx0XHR9IGVsc2UgaWYgKCF2YWxpZCAmJiB0aGlzLnBlbmRpbmdSZXF1ZXN0ID09PSAwICYmIHRoaXMuZm9ybVN1Ym1pdHRlZCApIHtcclxuXHRcdFx0XHQkKCB0aGlzLmN1cnJlbnRGb3JtICkudHJpZ2dlckhhbmRsZXIoIFwiaW52YWxpZC1mb3JtXCIsIFsgdGhpcyBdKTtcclxuXHRcdFx0XHR0aGlzLmZvcm1TdWJtaXR0ZWQgPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHRwcmV2aW91c1ZhbHVlOiBmdW5jdGlvbiggZWxlbWVudCApIHtcclxuXHRcdFx0cmV0dXJuICQuZGF0YSggZWxlbWVudCwgXCJwcmV2aW91c1ZhbHVlXCIgKSB8fCAkLmRhdGEoIGVsZW1lbnQsIFwicHJldmlvdXNWYWx1ZVwiLCB7XHJcblx0XHRcdFx0b2xkOiBudWxsLFxyXG5cdFx0XHRcdHZhbGlkOiB0cnVlLFxyXG5cdFx0XHRcdG1lc3NhZ2U6IHRoaXMuZGVmYXVsdE1lc3NhZ2UoIGVsZW1lbnQsIFwicmVtb3RlXCIgKVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0fSxcclxuXHJcblx0Y2xhc3NSdWxlU2V0dGluZ3M6IHtcclxuXHRcdHJlcXVpcmVkOiB7IHJlcXVpcmVkOiB0cnVlIH0sXHJcblx0XHRlbWFpbDogeyBlbWFpbDogdHJ1ZSB9LFxyXG5cdFx0dXJsOiB7IHVybDogdHJ1ZSB9LFxyXG5cdFx0ZGF0ZTogeyBkYXRlOiB0cnVlIH0sXHJcblx0XHRkYXRlSVNPOiB7IGRhdGVJU086IHRydWUgfSxcclxuXHRcdG51bWJlcjogeyBudW1iZXI6IHRydWUgfSxcclxuXHRcdGRpZ2l0czogeyBkaWdpdHM6IHRydWUgfSxcclxuXHRcdGNyZWRpdGNhcmQ6IHsgY3JlZGl0Y2FyZDogdHJ1ZSB9XHJcblx0fSxcclxuXHJcblx0YWRkQ2xhc3NSdWxlczogZnVuY3Rpb24oIGNsYXNzTmFtZSwgcnVsZXMgKSB7XHJcblx0XHRpZiAoIGNsYXNzTmFtZS5jb25zdHJ1Y3RvciA9PT0gU3RyaW5nICkge1xyXG5cdFx0XHR0aGlzLmNsYXNzUnVsZVNldHRpbmdzWyBjbGFzc05hbWUgXSA9IHJ1bGVzO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JC5leHRlbmQoIHRoaXMuY2xhc3NSdWxlU2V0dGluZ3MsIGNsYXNzTmFtZSApO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdGNsYXNzUnVsZXM6IGZ1bmN0aW9uKCBlbGVtZW50ICkge1xyXG5cdFx0dmFyIHJ1bGVzID0ge30sXHJcblx0XHRcdGNsYXNzZXMgPSAkKCBlbGVtZW50ICkuYXR0ciggXCJjbGFzc1wiICk7XHJcblxyXG5cdFx0aWYgKCBjbGFzc2VzICkge1xyXG5cdFx0XHQkLmVhY2goIGNsYXNzZXMuc3BsaXQoIFwiIFwiICksIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGlmICggdGhpcyBpbiAkLnZhbGlkYXRvci5jbGFzc1J1bGVTZXR0aW5ncyApIHtcclxuXHRcdFx0XHRcdCQuZXh0ZW5kKCBydWxlcywgJC52YWxpZGF0b3IuY2xhc3NSdWxlU2V0dGluZ3NbIHRoaXMgXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBydWxlcztcclxuXHR9LFxyXG5cclxuXHRhdHRyaWJ1dGVSdWxlczogZnVuY3Rpb24oIGVsZW1lbnQgKSB7XHJcblx0XHR2YXIgcnVsZXMgPSB7fSxcclxuXHRcdFx0JGVsZW1lbnQgPSAkKCBlbGVtZW50ICksXHJcblx0XHRcdHR5cGUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSggXCJ0eXBlXCIgKSxcclxuXHRcdFx0bWV0aG9kLCB2YWx1ZTtcclxuXHJcblx0XHRmb3IgKCBtZXRob2QgaW4gJC52YWxpZGF0b3IubWV0aG9kcyApIHtcclxuXHJcblx0XHRcdC8vIHN1cHBvcnQgZm9yIDxpbnB1dCByZXF1aXJlZD4gaW4gYm90aCBodG1sNSBhbmQgb2xkZXIgYnJvd3NlcnNcclxuXHRcdFx0aWYgKCBtZXRob2QgPT09IFwicmVxdWlyZWRcIiApIHtcclxuXHRcdFx0XHR2YWx1ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCBtZXRob2QgKTtcclxuXHRcdFx0XHQvLyBTb21lIGJyb3dzZXJzIHJldHVybiBhbiBlbXB0eSBzdHJpbmcgZm9yIHRoZSByZXF1aXJlZCBhdHRyaWJ1dGVcclxuXHRcdFx0XHQvLyBhbmQgbm9uLUhUTUw1IGJyb3dzZXJzIG1pZ2h0IGhhdmUgcmVxdWlyZWQ9XCJcIiBtYXJrdXBcclxuXHRcdFx0XHRpZiAoIHZhbHVlID09PSBcIlwiICkge1xyXG5cdFx0XHRcdFx0dmFsdWUgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBmb3JjZSBub24tSFRNTDUgYnJvd3NlcnMgdG8gcmV0dXJuIGJvb2xcclxuXHRcdFx0XHR2YWx1ZSA9ICEhdmFsdWU7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dmFsdWUgPSAkZWxlbWVudC5hdHRyKCBtZXRob2QgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gY29udmVydCB0aGUgdmFsdWUgdG8gYSBudW1iZXIgZm9yIG51bWJlciBpbnB1dHMsIGFuZCBmb3IgdGV4dCBmb3IgYmFja3dhcmRzIGNvbXBhYmlsaXR5XHJcblx0XHRcdC8vIGFsbG93cyB0eXBlPVwiZGF0ZVwiIGFuZCBvdGhlcnMgdG8gYmUgY29tcGFyZWQgYXMgc3RyaW5nc1xyXG5cdFx0XHRpZiAoIC9taW58bWF4Ly50ZXN0KCBtZXRob2QgKSAmJiAoIHR5cGUgPT09IG51bGwgfHwgL251bWJlcnxyYW5nZXx0ZXh0Ly50ZXN0KCB0eXBlICkgKSApIHtcclxuXHRcdFx0XHR2YWx1ZSA9IE51bWJlciggdmFsdWUgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCB2YWx1ZSB8fCB2YWx1ZSA9PT0gMCApIHtcclxuXHRcdFx0XHRydWxlc1sgbWV0aG9kIF0gPSB2YWx1ZTtcclxuXHRcdFx0fSBlbHNlIGlmICggdHlwZSA9PT0gbWV0aG9kICYmIHR5cGUgIT09IFwicmFuZ2VcIiApIHtcclxuXHRcdFx0XHQvLyBleGNlcHRpb246IHRoZSBqcXVlcnkgdmFsaWRhdGUgJ3JhbmdlJyBtZXRob2RcclxuXHRcdFx0XHQvLyBkb2VzIG5vdCB0ZXN0IGZvciB0aGUgaHRtbDUgJ3JhbmdlJyB0eXBlXHJcblx0XHRcdFx0cnVsZXNbIG1ldGhvZCBdID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIG1heGxlbmd0aCBtYXkgYmUgcmV0dXJuZWQgYXMgLTEsIDIxNDc0ODM2NDcgKCBJRSApIGFuZCA1MjQyODggKCBzYWZhcmkgKSBmb3IgdGV4dCBpbnB1dHNcclxuXHRcdGlmICggcnVsZXMubWF4bGVuZ3RoICYmIC8tMXwyMTQ3NDgzNjQ3fDUyNDI4OC8udGVzdCggcnVsZXMubWF4bGVuZ3RoICkgKSB7XHJcblx0XHRcdGRlbGV0ZSBydWxlcy5tYXhsZW5ndGg7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHJ1bGVzO1xyXG5cdH0sXHJcblxyXG5cdGRhdGFSdWxlczogZnVuY3Rpb24oIGVsZW1lbnQgKSB7XHJcblx0XHR2YXIgbWV0aG9kLCB2YWx1ZSxcclxuXHRcdFx0cnVsZXMgPSB7fSwgJGVsZW1lbnQgPSAkKCBlbGVtZW50ICk7XHJcblx0XHRmb3IgKCBtZXRob2QgaW4gJC52YWxpZGF0b3IubWV0aG9kcyApIHtcclxuXHRcdFx0dmFsdWUgPSAkZWxlbWVudC5kYXRhKCBcInJ1bGVcIiArIG1ldGhvZC5jaGFyQXQoIDAgKS50b1VwcGVyQ2FzZSgpICsgbWV0aG9kLnN1YnN0cmluZyggMSApLnRvTG93ZXJDYXNlKCkgKTtcclxuXHRcdFx0aWYgKCB2YWx1ZSAhPT0gdW5kZWZpbmVkICkge1xyXG5cdFx0XHRcdHJ1bGVzWyBtZXRob2QgXSA9IHZhbHVlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcnVsZXM7XHJcblx0fSxcclxuXHJcblx0c3RhdGljUnVsZXM6IGZ1bmN0aW9uKCBlbGVtZW50ICkge1xyXG5cdFx0dmFyIHJ1bGVzID0ge30sXHJcblx0XHRcdHZhbGlkYXRvciA9ICQuZGF0YSggZWxlbWVudC5mb3JtLCBcInZhbGlkYXRvclwiICk7XHJcblxyXG5cdFx0aWYgKCB2YWxpZGF0b3Iuc2V0dGluZ3MucnVsZXMgKSB7XHJcblx0XHRcdHJ1bGVzID0gJC52YWxpZGF0b3Iubm9ybWFsaXplUnVsZSggdmFsaWRhdG9yLnNldHRpbmdzLnJ1bGVzWyBlbGVtZW50Lm5hbWUgXSApIHx8IHt9O1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJ1bGVzO1xyXG5cdH0sXHJcblxyXG5cdG5vcm1hbGl6ZVJ1bGVzOiBmdW5jdGlvbiggcnVsZXMsIGVsZW1lbnQgKSB7XHJcblx0XHQvLyBoYW5kbGUgZGVwZW5kZW5jeSBjaGVja1xyXG5cdFx0JC5lYWNoKCBydWxlcywgZnVuY3Rpb24oIHByb3AsIHZhbCApIHtcclxuXHRcdFx0Ly8gaWdub3JlIHJ1bGUgd2hlbiBwYXJhbSBpcyBleHBsaWNpdGx5IGZhbHNlLCBlZy4gcmVxdWlyZWQ6ZmFsc2VcclxuXHRcdFx0aWYgKCB2YWwgPT09IGZhbHNlICkge1xyXG5cdFx0XHRcdGRlbGV0ZSBydWxlc1sgcHJvcCBdO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIHZhbC5wYXJhbSB8fCB2YWwuZGVwZW5kcyApIHtcclxuXHRcdFx0XHR2YXIga2VlcFJ1bGUgPSB0cnVlO1xyXG5cdFx0XHRcdHN3aXRjaCAoIHR5cGVvZiB2YWwuZGVwZW5kcyApIHtcclxuXHRcdFx0XHRjYXNlIFwic3RyaW5nXCI6XHJcblx0XHRcdFx0XHRrZWVwUnVsZSA9ICEhJCggdmFsLmRlcGVuZHMsIGVsZW1lbnQuZm9ybSApLmxlbmd0aDtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgXCJmdW5jdGlvblwiOlxyXG5cdFx0XHRcdFx0a2VlcFJ1bGUgPSB2YWwuZGVwZW5kcy5jYWxsKCBlbGVtZW50LCBlbGVtZW50ICk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKCBrZWVwUnVsZSApIHtcclxuXHRcdFx0XHRcdHJ1bGVzWyBwcm9wIF0gPSB2YWwucGFyYW0gIT09IHVuZGVmaW5lZCA/IHZhbC5wYXJhbSA6IHRydWU7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGRlbGV0ZSBydWxlc1sgcHJvcCBdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gZXZhbHVhdGUgcGFyYW1ldGVyc1xyXG5cdFx0JC5lYWNoKCBydWxlcywgZnVuY3Rpb24oIHJ1bGUsIHBhcmFtZXRlciApIHtcclxuXHRcdFx0cnVsZXNbIHJ1bGUgXSA9ICQuaXNGdW5jdGlvbiggcGFyYW1ldGVyICkgPyBwYXJhbWV0ZXIoIGVsZW1lbnQgKSA6IHBhcmFtZXRlcjtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIGNsZWFuIG51bWJlciBwYXJhbWV0ZXJzXHJcblx0XHQkLmVhY2goWyBcIm1pbmxlbmd0aFwiLCBcIm1heGxlbmd0aFwiIF0sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZiAoIHJ1bGVzWyB0aGlzIF0gKSB7XHJcblx0XHRcdFx0cnVsZXNbIHRoaXMgXSA9IE51bWJlciggcnVsZXNbIHRoaXMgXSApO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdCQuZWFjaChbIFwicmFuZ2VsZW5ndGhcIiwgXCJyYW5nZVwiIF0sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgcGFydHM7XHJcblx0XHRcdGlmICggcnVsZXNbIHRoaXMgXSApIHtcclxuXHRcdFx0XHRpZiAoICQuaXNBcnJheSggcnVsZXNbIHRoaXMgXSApICkge1xyXG5cdFx0XHRcdFx0cnVsZXNbIHRoaXMgXSA9IFsgTnVtYmVyKCBydWxlc1sgdGhpcyBdWyAwIF0pLCBOdW1iZXIoIHJ1bGVzWyB0aGlzIF1bIDEgXSApIF07XHJcblx0XHRcdFx0fSBlbHNlIGlmICggdHlwZW9mIHJ1bGVzWyB0aGlzIF0gPT09IFwic3RyaW5nXCIgKSB7XHJcblx0XHRcdFx0XHRwYXJ0cyA9IHJ1bGVzWyB0aGlzIF0ucmVwbGFjZSgvW1xcW1xcXV0vZywgXCJcIiApLnNwbGl0KCAvW1xccyxdKy8gKTtcclxuXHRcdFx0XHRcdHJ1bGVzWyB0aGlzIF0gPSBbIE51bWJlciggcGFydHNbIDAgXSksIE51bWJlciggcGFydHNbIDEgXSApIF07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHRpZiAoICQudmFsaWRhdG9yLmF1dG9DcmVhdGVSYW5nZXMgKSB7XHJcblx0XHRcdC8vIGF1dG8tY3JlYXRlIHJhbmdlc1xyXG5cdFx0XHRpZiAoIHJ1bGVzLm1pbiAhPSBudWxsICYmIHJ1bGVzLm1heCAhPSBudWxsICkge1xyXG5cdFx0XHRcdHJ1bGVzLnJhbmdlID0gWyBydWxlcy5taW4sIHJ1bGVzLm1heCBdO1xyXG5cdFx0XHRcdGRlbGV0ZSBydWxlcy5taW47XHJcblx0XHRcdFx0ZGVsZXRlIHJ1bGVzLm1heDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIHJ1bGVzLm1pbmxlbmd0aCAhPSBudWxsICYmIHJ1bGVzLm1heGxlbmd0aCAhPSBudWxsICkge1xyXG5cdFx0XHRcdHJ1bGVzLnJhbmdlbGVuZ3RoID0gWyBydWxlcy5taW5sZW5ndGgsIHJ1bGVzLm1heGxlbmd0aCBdO1xyXG5cdFx0XHRcdGRlbGV0ZSBydWxlcy5taW5sZW5ndGg7XHJcblx0XHRcdFx0ZGVsZXRlIHJ1bGVzLm1heGxlbmd0aDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBydWxlcztcclxuXHR9LFxyXG5cclxuXHQvLyBDb252ZXJ0cyBhIHNpbXBsZSBzdHJpbmcgdG8gYSB7c3RyaW5nOiB0cnVlfSBydWxlLCBlLmcuLCBcInJlcXVpcmVkXCIgdG8ge3JlcXVpcmVkOnRydWV9XHJcblx0bm9ybWFsaXplUnVsZTogZnVuY3Rpb24oIGRhdGEgKSB7XHJcblx0XHRpZiAoIHR5cGVvZiBkYXRhID09PSBcInN0cmluZ1wiICkge1xyXG5cdFx0XHR2YXIgdHJhbnNmb3JtZWQgPSB7fTtcclxuXHRcdFx0JC5lYWNoKCBkYXRhLnNwbGl0KCAvXFxzLyApLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR0cmFuc2Zvcm1lZFsgdGhpcyBdID0gdHJ1ZTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdGRhdGEgPSB0cmFuc2Zvcm1lZDtcclxuXHRcdH1cclxuXHRcdHJldHVybiBkYXRhO1xyXG5cdH0sXHJcblxyXG5cdC8vIGh0dHA6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9qUXVlcnkudmFsaWRhdG9yLmFkZE1ldGhvZC9cclxuXHRhZGRNZXRob2Q6IGZ1bmN0aW9uKCBuYW1lLCBtZXRob2QsIG1lc3NhZ2UgKSB7XHJcblx0XHQkLnZhbGlkYXRvci5tZXRob2RzWyBuYW1lIF0gPSBtZXRob2Q7XHJcblx0XHQkLnZhbGlkYXRvci5tZXNzYWdlc1sgbmFtZSBdID0gbWVzc2FnZSAhPT0gdW5kZWZpbmVkID8gbWVzc2FnZSA6ICQudmFsaWRhdG9yLm1lc3NhZ2VzWyBuYW1lIF07XHJcblx0XHRpZiAoIG1ldGhvZC5sZW5ndGggPCAzICkge1xyXG5cdFx0XHQkLnZhbGlkYXRvci5hZGRDbGFzc1J1bGVzKCBuYW1lLCAkLnZhbGlkYXRvci5ub3JtYWxpemVSdWxlKCBuYW1lICkgKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRtZXRob2RzOiB7XHJcblxyXG5cdFx0Ly8gaHR0cDovL2pxdWVyeXZhbGlkYXRpb24ub3JnL3JlcXVpcmVkLW1ldGhvZC9cclxuXHRcdHJlcXVpcmVkOiBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIHBhcmFtICkge1xyXG5cdFx0XHQvLyBjaGVjayBpZiBkZXBlbmRlbmN5IGlzIG1ldFxyXG5cdFx0XHRpZiAoICF0aGlzLmRlcGVuZCggcGFyYW0sIGVsZW1lbnQgKSApIHtcclxuXHRcdFx0XHRyZXR1cm4gXCJkZXBlbmRlbmN5LW1pc21hdGNoXCI7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCBlbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwic2VsZWN0XCIgKSB7XHJcblx0XHRcdFx0Ly8gY291bGQgYmUgYW4gYXJyYXkgZm9yIHNlbGVjdC1tdWx0aXBsZSBvciBhIHN0cmluZywgYm90aCBhcmUgZmluZSB0aGlzIHdheVxyXG5cdFx0XHRcdHZhciB2YWwgPSAkKCBlbGVtZW50ICkudmFsKCk7XHJcblx0XHRcdFx0cmV0dXJuIHZhbCAmJiB2YWwubGVuZ3RoID4gMDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIHRoaXMuY2hlY2thYmxlKCBlbGVtZW50ICkgKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuZ2V0TGVuZ3RoKCB2YWx1ZSwgZWxlbWVudCApID4gMDtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gJC50cmltKCB2YWx1ZSApLmxlbmd0aCA+IDA7XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIGh0dHA6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9lbWFpbC1tZXRob2QvXHJcblx0XHRlbWFpbDogZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xyXG5cdFx0XHQvLyBGcm9tIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2Zvcm1zLmh0bWwjdmFsaWQtZS1tYWlsLWFkZHJlc3NcclxuXHRcdFx0Ly8gUmV0cmlldmVkIDIwMTQtMDEtMTRcclxuXHRcdFx0Ly8gSWYgeW91IGhhdmUgYSBwcm9ibGVtIHdpdGggdGhpcyBpbXBsZW1lbnRhdGlvbiwgcmVwb3J0IGEgYnVnIGFnYWluc3QgdGhlIGFib3ZlIHNwZWNcclxuXHRcdFx0Ly8gT3IgdXNlIGN1c3RvbSBtZXRob2RzIHRvIGltcGxlbWVudCB5b3VyIG93biBlbWFpbCB2YWxpZGF0aW9uXHJcblx0XHRcdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgL15bYS16QS1aMC05LiEjJCUmJyorXFwvPT9eX2B7fH1+LV0rQFthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPyg/OlxcLlthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPykqJC8udGVzdCggdmFsdWUgKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gaHR0cDovL2pxdWVyeXZhbGlkYXRpb24ub3JnL3VybC1tZXRob2QvXHJcblx0XHR1cmw6IGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCApIHtcclxuXHRcdFx0Ly8gY29udHJpYnV0ZWQgYnkgU2NvdHQgR29uemFsZXo6IGh0dHA6Ly9wcm9qZWN0cy5zY290dHNwbGF5Z3JvdW5kLmNvbS9pcmkvXHJcblx0XHRcdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgL14oaHR0cHM/fHM/ZnRwKTpcXC9cXC8oKCgoW2Etel18XFxkfC18XFwufF98fnxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSl8KCVbXFxkYS1mXXsyfSl8WyFcXCQmJ1xcKFxcKVxcKlxcKyw7PV18OikqQCk/KCgoXFxkfFsxLTldXFxkfDFcXGRcXGR8MlswLTRdXFxkfDI1WzAtNV0pXFwuKFxcZHxbMS05XVxcZHwxXFxkXFxkfDJbMC00XVxcZHwyNVswLTVdKVxcLihcXGR8WzEtOV1cXGR8MVxcZFxcZHwyWzAtNF1cXGR8MjVbMC01XSlcXC4oXFxkfFsxLTldXFxkfDFcXGRcXGR8MlswLTRdXFxkfDI1WzAtNV0pKXwoKChbYS16XXxcXGR8W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pfCgoW2Etel18XFxkfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKShbYS16XXxcXGR8LXxcXC58X3x+fFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSooW2Etel18XFxkfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSkpXFwuKSsoKFthLXpdfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKXwoKFthLXpdfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKShbYS16XXxcXGR8LXxcXC58X3x+fFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSooW2Etel18W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pKSlcXC4/KSg6XFxkKik/KShcXC8oKChbYS16XXxcXGR8LXxcXC58X3x+fFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKXwoJVtcXGRhLWZdezJ9KXxbIVxcJCYnXFwoXFwpXFwqXFwrLDs9XXw6fEApKyhcXC8oKFthLXpdfFxcZHwtfFxcLnxffH58W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pfCglW1xcZGEtZl17Mn0pfFshXFwkJidcXChcXClcXCpcXCssOz1dfDp8QCkqKSopPyk/KFxcPygoKFthLXpdfFxcZHwtfFxcLnxffH58W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pfCglW1xcZGEtZl17Mn0pfFshXFwkJidcXChcXClcXCpcXCssOz1dfDp8QCl8W1xcdUUwMDAtXFx1RjhGRl18XFwvfFxcPykqKT8oIygoKFthLXpdfFxcZHwtfFxcLnxffH58W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pfCglW1xcZGEtZl17Mn0pfFshXFwkJidcXChcXClcXCpcXCssOz1dfDp8QCl8XFwvfFxcPykqKT8kL2kudGVzdCggdmFsdWUgKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gaHR0cDovL2pxdWVyeXZhbGlkYXRpb24ub3JnL2RhdGUtbWV0aG9kL1xyXG5cdFx0ZGF0ZTogZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8ICEvSW52YWxpZHxOYU4vLnRlc3QoIG5ldyBEYXRlKCB2YWx1ZSApLnRvU3RyaW5nKCkgKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gaHR0cDovL2pxdWVyeXZhbGlkYXRpb24ub3JnL2RhdGVJU08tbWV0aG9kL1xyXG5cdFx0ZGF0ZUlTTzogZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IC9eXFxkezR9W1xcL1xcLV0oMD9bMS05XXwxWzAxMl0pW1xcL1xcLV0oMD9bMS05XXxbMTJdWzAtOV18M1swMV0pJC8udGVzdCggdmFsdWUgKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gaHR0cDovL2pxdWVyeXZhbGlkYXRpb24ub3JnL251bWJlci1tZXRob2QvXHJcblx0XHRudW1iZXI6IGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCApIHtcclxuXHRcdCAgICByZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IC9eKD86LT9cXGQrfC0/XFxkezEsM30oPzosXFxkezN9KSspPyg/OlxcLlxcZCspPyQvLnRlc3QoIHZhbHVlICk7XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIGh0dHA6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9kaWdpdHMtbWV0aG9kL1xyXG5cdFx0ZGlnaXRzOiBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQgKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgL15cXGQrJC8udGVzdCggdmFsdWUgKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gaHR0cDovL2pxdWVyeXZhbGlkYXRpb24ub3JnL2NyZWRpdGNhcmQtbWV0aG9kL1xyXG5cdFx0Ly8gYmFzZWQgb24gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9MdWhuX2FsZ29yaXRobVxyXG5cdFx0Y3JlZGl0Y2FyZDogZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xyXG5cdFx0XHRpZiAoIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSApIHtcclxuXHRcdFx0XHRyZXR1cm4gXCJkZXBlbmRlbmN5LW1pc21hdGNoXCI7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gYWNjZXB0IG9ubHkgc3BhY2VzLCBkaWdpdHMgYW5kIGRhc2hlc1xyXG5cdFx0XHRpZiAoIC9bXjAtOSBcXC1dKy8udGVzdCggdmFsdWUgKSApIHtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIG5DaGVjayA9IDAsXHJcblx0XHRcdFx0bkRpZ2l0ID0gMCxcclxuXHRcdFx0XHRiRXZlbiA9IGZhbHNlLFxyXG5cdFx0XHRcdG4sIGNEaWdpdDtcclxuXHJcblx0XHRcdHZhbHVlID0gdmFsdWUucmVwbGFjZSggL1xcRC9nLCBcIlwiICk7XHJcblxyXG5cdFx0XHQvLyBCYXNpbmcgbWluIGFuZCBtYXggbGVuZ3RoIG9uXHJcblx0XHRcdC8vIGh0dHA6Ly9kZXZlbG9wZXIuZWFuLmNvbS9nZW5lcmFsX2luZm8vVmFsaWRfQ3JlZGl0X0NhcmRfVHlwZXNcclxuXHRcdFx0aWYgKCB2YWx1ZS5sZW5ndGggPCAxMyB8fCB2YWx1ZS5sZW5ndGggPiAxOSApIHtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZvciAoIG4gPSB2YWx1ZS5sZW5ndGggLSAxOyBuID49IDA7IG4tLSkge1xyXG5cdFx0XHRcdGNEaWdpdCA9IHZhbHVlLmNoYXJBdCggbiApO1xyXG5cdFx0XHRcdG5EaWdpdCA9IHBhcnNlSW50KCBjRGlnaXQsIDEwICk7XHJcblx0XHRcdFx0aWYgKCBiRXZlbiApIHtcclxuXHRcdFx0XHRcdGlmICggKCBuRGlnaXQgKj0gMiApID4gOSApIHtcclxuXHRcdFx0XHRcdFx0bkRpZ2l0IC09IDk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5DaGVjayArPSBuRGlnaXQ7XHJcblx0XHRcdFx0YkV2ZW4gPSAhYkV2ZW47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiAoIG5DaGVjayAlIDEwICkgPT09IDA7XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIGh0dHA6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9taW5sZW5ndGgtbWV0aG9kL1xyXG5cdFx0bWlubGVuZ3RoOiBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIHBhcmFtICkge1xyXG5cdFx0XHR2YXIgbGVuZ3RoID0gJC5pc0FycmF5KCB2YWx1ZSApID8gdmFsdWUubGVuZ3RoIDogdGhpcy5nZXRMZW5ndGgoIHZhbHVlLCBlbGVtZW50ICk7XHJcblx0XHRcdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgbGVuZ3RoID49IHBhcmFtO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBodHRwOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvbWF4bGVuZ3RoLW1ldGhvZC9cclxuXHRcdG1heGxlbmd0aDogZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50LCBwYXJhbSApIHtcclxuXHRcdFx0dmFyIGxlbmd0aCA9ICQuaXNBcnJheSggdmFsdWUgKSA/IHZhbHVlLmxlbmd0aCA6IHRoaXMuZ2V0TGVuZ3RoKCB2YWx1ZSwgZWxlbWVudCApO1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IGxlbmd0aCA8PSBwYXJhbTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gaHR0cDovL2pxdWVyeXZhbGlkYXRpb24ub3JnL3JhbmdlbGVuZ3RoLW1ldGhvZC9cclxuXHRcdHJhbmdlbGVuZ3RoOiBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIHBhcmFtICkge1xyXG5cdFx0XHR2YXIgbGVuZ3RoID0gJC5pc0FycmF5KCB2YWx1ZSApID8gdmFsdWUubGVuZ3RoIDogdGhpcy5nZXRMZW5ndGgoIHZhbHVlLCBlbGVtZW50ICk7XHJcblx0XHRcdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgKCBsZW5ndGggPj0gcGFyYW1bIDAgXSAmJiBsZW5ndGggPD0gcGFyYW1bIDEgXSApO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBodHRwOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvbWluLW1ldGhvZC9cclxuXHRcdG1pbjogZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50LCBwYXJhbSApIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCB2YWx1ZSA+PSBwYXJhbTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gaHR0cDovL2pxdWVyeXZhbGlkYXRpb24ub3JnL21heC1tZXRob2QvXHJcblx0XHRtYXg6IGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCwgcGFyYW0gKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgdmFsdWUgPD0gcGFyYW07XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIGh0dHA6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9yYW5nZS1tZXRob2QvXHJcblx0XHRyYW5nZTogZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50LCBwYXJhbSApIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCAoIHZhbHVlID49IHBhcmFtWyAwIF0gJiYgdmFsdWUgPD0gcGFyYW1bIDEgXSApO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBodHRwOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvZXF1YWxUby1tZXRob2QvXHJcblx0XHRlcXVhbFRvOiBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIHBhcmFtICkge1xyXG5cdFx0XHQvLyBiaW5kIHRvIHRoZSBibHVyIGV2ZW50IG9mIHRoZSB0YXJnZXQgaW4gb3JkZXIgdG8gcmV2YWxpZGF0ZSB3aGVuZXZlciB0aGUgdGFyZ2V0IGZpZWxkIGlzIHVwZGF0ZWRcclxuXHRcdFx0Ly8gVE9ETyBmaW5kIGEgd2F5IHRvIGJpbmQgdGhlIGV2ZW50IGp1c3Qgb25jZSwgYXZvaWRpbmcgdGhlIHVuYmluZC1yZWJpbmQgb3ZlcmhlYWRcclxuXHRcdFx0dmFyIHRhcmdldCA9ICQoIHBhcmFtICk7XHJcblx0XHRcdGlmICggdGhpcy5zZXR0aW5ncy5vbmZvY3Vzb3V0ICkge1xyXG5cdFx0XHRcdHRhcmdldC51bmJpbmQoIFwiLnZhbGlkYXRlLWVxdWFsVG9cIiApLmJpbmQoIFwiYmx1ci52YWxpZGF0ZS1lcXVhbFRvXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0JCggZWxlbWVudCApLnZhbGlkKCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHZhbHVlID09PSB0YXJnZXQudmFsKCk7XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIGh0dHA6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9yZW1vdGUtbWV0aG9kL1xyXG5cdFx0cmVtb3RlOiBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIHBhcmFtICkge1xyXG5cdFx0XHRpZiAoIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSApIHtcclxuXHRcdFx0XHRyZXR1cm4gXCJkZXBlbmRlbmN5LW1pc21hdGNoXCI7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBwcmV2aW91cyA9IHRoaXMucHJldmlvdXNWYWx1ZSggZWxlbWVudCApLFxyXG5cdFx0XHRcdHZhbGlkYXRvciwgZGF0YTtcclxuXHJcblx0XHRcdGlmICghdGhpcy5zZXR0aW5ncy5tZXNzYWdlc1sgZWxlbWVudC5uYW1lIF0gKSB7XHJcblx0XHRcdFx0dGhpcy5zZXR0aW5ncy5tZXNzYWdlc1sgZWxlbWVudC5uYW1lIF0gPSB7fTtcclxuXHRcdFx0fVxyXG5cdFx0XHRwcmV2aW91cy5vcmlnaW5hbE1lc3NhZ2UgPSB0aGlzLnNldHRpbmdzLm1lc3NhZ2VzWyBlbGVtZW50Lm5hbWUgXS5yZW1vdGU7XHJcblx0XHRcdHRoaXMuc2V0dGluZ3MubWVzc2FnZXNbIGVsZW1lbnQubmFtZSBdLnJlbW90ZSA9IHByZXZpb3VzLm1lc3NhZ2U7XHJcblxyXG5cdFx0XHRwYXJhbSA9IHR5cGVvZiBwYXJhbSA9PT0gXCJzdHJpbmdcIiAmJiB7IHVybDogcGFyYW0gfSB8fCBwYXJhbTtcclxuXHJcblx0XHRcdGlmICggcHJldmlvdXMub2xkID09PSB2YWx1ZSApIHtcclxuXHRcdFx0XHRyZXR1cm4gcHJldmlvdXMudmFsaWQ7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHByZXZpb3VzLm9sZCA9IHZhbHVlO1xyXG5cdFx0XHR2YWxpZGF0b3IgPSB0aGlzO1xyXG5cdFx0XHR0aGlzLnN0YXJ0UmVxdWVzdCggZWxlbWVudCApO1xyXG5cdFx0XHRkYXRhID0ge307XHJcblx0XHRcdGRhdGFbIGVsZW1lbnQubmFtZSBdID0gdmFsdWU7XHJcblx0XHRcdCQuYWpheCggJC5leHRlbmQoIHRydWUsIHtcclxuXHRcdFx0XHR1cmw6IHBhcmFtLFxyXG5cdFx0XHRcdG1vZGU6IFwiYWJvcnRcIixcclxuXHRcdFx0XHRwb3J0OiBcInZhbGlkYXRlXCIgKyBlbGVtZW50Lm5hbWUsXHJcblx0XHRcdFx0ZGF0YVR5cGU6IFwianNvblwiLFxyXG5cdFx0XHRcdGRhdGE6IGRhdGEsXHJcblx0XHRcdFx0Y29udGV4dDogdmFsaWRhdG9yLmN1cnJlbnRGb3JtLFxyXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKCByZXNwb25zZSApIHtcclxuXHRcdFx0XHRcdHZhciB2YWxpZCA9IHJlc3BvbnNlID09PSB0cnVlIHx8IHJlc3BvbnNlID09PSBcInRydWVcIixcclxuXHRcdFx0XHRcdFx0ZXJyb3JzLCBtZXNzYWdlLCBzdWJtaXR0ZWQ7XHJcblxyXG5cdFx0XHRcdFx0dmFsaWRhdG9yLnNldHRpbmdzLm1lc3NhZ2VzWyBlbGVtZW50Lm5hbWUgXS5yZW1vdGUgPSBwcmV2aW91cy5vcmlnaW5hbE1lc3NhZ2U7XHJcblx0XHRcdFx0XHRpZiAoIHZhbGlkICkge1xyXG5cdFx0XHRcdFx0XHRzdWJtaXR0ZWQgPSB2YWxpZGF0b3IuZm9ybVN1Ym1pdHRlZDtcclxuXHRcdFx0XHRcdFx0dmFsaWRhdG9yLnByZXBhcmVFbGVtZW50KCBlbGVtZW50ICk7XHJcblx0XHRcdFx0XHRcdHZhbGlkYXRvci5mb3JtU3VibWl0dGVkID0gc3VibWl0dGVkO1xyXG5cdFx0XHRcdFx0XHR2YWxpZGF0b3Iuc3VjY2Vzc0xpc3QucHVzaCggZWxlbWVudCApO1xyXG5cdFx0XHRcdFx0XHRkZWxldGUgdmFsaWRhdG9yLmludmFsaWRbIGVsZW1lbnQubmFtZSBdO1xyXG5cdFx0XHRcdFx0XHR2YWxpZGF0b3Iuc2hvd0Vycm9ycygpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0ZXJyb3JzID0ge307XHJcblx0XHRcdFx0XHRcdG1lc3NhZ2UgPSByZXNwb25zZSB8fCB2YWxpZGF0b3IuZGVmYXVsdE1lc3NhZ2UoIGVsZW1lbnQsIFwicmVtb3RlXCIgKTtcclxuXHRcdFx0XHRcdFx0ZXJyb3JzWyBlbGVtZW50Lm5hbWUgXSA9IHByZXZpb3VzLm1lc3NhZ2UgPSAkLmlzRnVuY3Rpb24oIG1lc3NhZ2UgKSA/IG1lc3NhZ2UoIHZhbHVlICkgOiBtZXNzYWdlO1xyXG5cdFx0XHRcdFx0XHR2YWxpZGF0b3IuaW52YWxpZFsgZWxlbWVudC5uYW1lIF0gPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHR2YWxpZGF0b3Iuc2hvd0Vycm9ycyggZXJyb3JzICk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRwcmV2aW91cy52YWxpZCA9IHZhbGlkO1xyXG5cdFx0XHRcdFx0dmFsaWRhdG9yLnN0b3BSZXF1ZXN0KCBlbGVtZW50LCB2YWxpZCApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwgcGFyYW0gKSApO1xyXG5cdFx0XHRyZXR1cm4gXCJwZW5kaW5nXCI7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcbn0pO1xyXG5cclxuJC5mb3JtYXQgPSBmdW5jdGlvbiBkZXByZWNhdGVkKCkge1xyXG5cdHRocm93IFwiJC5mb3JtYXQgaGFzIGJlZW4gZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSAkLnZhbGlkYXRvci5mb3JtYXQgaW5zdGVhZC5cIjtcclxufTtcclxuXHJcbi8vIGFqYXggbW9kZTogYWJvcnRcclxuLy8gdXNhZ2U6ICQuYWpheCh7IG1vZGU6IFwiYWJvcnRcIlssIHBvcnQ6IFwidW5pcXVlcG9ydFwiXX0pO1xyXG4vLyBpZiBtb2RlOlwiYWJvcnRcIiBpcyB1c2VkLCB0aGUgcHJldmlvdXMgcmVxdWVzdCBvbiB0aGF0IHBvcnQgKHBvcnQgY2FuIGJlIHVuZGVmaW5lZCkgaXMgYWJvcnRlZCB2aWEgWE1MSHR0cFJlcXVlc3QuYWJvcnQoKVxyXG5cclxudmFyIHBlbmRpbmdSZXF1ZXN0cyA9IHt9LFxyXG5cdGFqYXg7XHJcbi8vIFVzZSBhIHByZWZpbHRlciBpZiBhdmFpbGFibGUgKDEuNSspXHJcbmlmICggJC5hamF4UHJlZmlsdGVyICkge1xyXG5cdCQuYWpheFByZWZpbHRlcihmdW5jdGlvbiggc2V0dGluZ3MsIF8sIHhociApIHtcclxuXHRcdHZhciBwb3J0ID0gc2V0dGluZ3MucG9ydDtcclxuXHRcdGlmICggc2V0dGluZ3MubW9kZSA9PT0gXCJhYm9ydFwiICkge1xyXG5cdFx0XHRpZiAoIHBlbmRpbmdSZXF1ZXN0c1twb3J0XSApIHtcclxuXHRcdFx0XHRwZW5kaW5nUmVxdWVzdHNbcG9ydF0uYWJvcnQoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRwZW5kaW5nUmVxdWVzdHNbcG9ydF0gPSB4aHI7XHJcblx0XHR9XHJcblx0fSk7XHJcbn0gZWxzZSB7XHJcblx0Ly8gUHJveHkgYWpheFxyXG5cdGFqYXggPSAkLmFqYXg7XHJcblx0JC5hamF4ID0gZnVuY3Rpb24oIHNldHRpbmdzICkge1xyXG5cdFx0dmFyIG1vZGUgPSAoIFwibW9kZVwiIGluIHNldHRpbmdzID8gc2V0dGluZ3MgOiAkLmFqYXhTZXR0aW5ncyApLm1vZGUsXHJcblx0XHRcdHBvcnQgPSAoIFwicG9ydFwiIGluIHNldHRpbmdzID8gc2V0dGluZ3MgOiAkLmFqYXhTZXR0aW5ncyApLnBvcnQ7XHJcblx0XHRpZiAoIG1vZGUgPT09IFwiYWJvcnRcIiApIHtcclxuXHRcdFx0aWYgKCBwZW5kaW5nUmVxdWVzdHNbcG9ydF0gKSB7XHJcblx0XHRcdFx0cGVuZGluZ1JlcXVlc3RzW3BvcnRdLmFib3J0KCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cGVuZGluZ1JlcXVlc3RzW3BvcnRdID0gYWpheC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG5cdFx0XHRyZXR1cm4gcGVuZGluZ1JlcXVlc3RzW3BvcnRdO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGFqYXguYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuXHR9O1xyXG59XHJcblxyXG4vLyBwcm92aWRlcyBkZWxlZ2F0ZSh0eXBlOiBTdHJpbmcsIGRlbGVnYXRlOiBTZWxlY3RvciwgaGFuZGxlcjogQ2FsbGJhY2spIHBsdWdpbiBmb3IgZWFzaWVyIGV2ZW50IGRlbGVnYXRpb25cclxuLy8gaGFuZGxlciBpcyBvbmx5IGNhbGxlZCB3aGVuICQoZXZlbnQudGFyZ2V0KS5pcyhkZWxlZ2F0ZSksIGluIHRoZSBzY29wZSBvZiB0aGUganF1ZXJ5LW9iamVjdCBmb3IgZXZlbnQudGFyZ2V0XHJcblxyXG4kLmV4dGVuZCgkLmZuLCB7XHJcblx0dmFsaWRhdGVEZWxlZ2F0ZTogZnVuY3Rpb24oIGRlbGVnYXRlLCB0eXBlLCBoYW5kbGVyICkge1xyXG5cdFx0cmV0dXJuIHRoaXMuYmluZCh0eXBlLCBmdW5jdGlvbiggZXZlbnQgKSB7XHJcblx0XHRcdHZhciB0YXJnZXQgPSAkKGV2ZW50LnRhcmdldCk7XHJcblx0XHRcdGlmICggdGFyZ2V0LmlzKGRlbGVnYXRlKSApIHtcclxuXHRcdFx0XHRyZXR1cm4gaGFuZGxlci5hcHBseSh0YXJnZXQsIGFyZ3VtZW50cyk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxufSk7XHJcblxyXG59KSk7IiwiLyohXHJcbiAqIGpRdWVyeSBWYWxpZGF0aW9uIFBsdWdpbiB2MS4xMy4yLXByZVxyXG4gKlxyXG4gKiBodHRwOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvXHJcbiAqXHJcbiAqIENvcHlyaWdodCAoYykgMjAxNSBKw7ZybiBaYWVmZmVyZXJcclxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXHJcbiAqL1xyXG4oZnVuY3Rpb24oIGZhY3RvcnkgKSB7XHJcblx0aWYgKCB0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCApIHtcclxuXHRcdGRlZmluZShcImpxdWVyeS52YWxpZGF0ZVwiLFtcImpxdWVyeVwiLCBcImpxdWVyeS52YWxpZGF0ZS5jb3JlXCJdLCBmYWN0b3J5ICk7XHJcblx0fSBlbHNlIHtcclxuXHRcdGZhY3RvcnkoIGpRdWVyeSApO1xyXG5cdH1cclxufShmdW5jdGlvbiggJCApIHtcclxuXHJcbiAgLyoqXHJcbiAgICog6Iux5paH5ZKM56m65qC8XHJcbiAgICovXHJcbiAgJC52YWxpZGF0b3IuYWRkTWV0aG9kKCdlbkNvZGUnLGZ1bmN0aW9uKHZhbHVlLGVsZW1lbnQscGFyYW0pe1xyXG4gICAgcmV0dXJuIHRoaXMub3B0aW9uYWwoZWxlbWVudCkgfHwgIS9bXmEtekEtWlxcc10vLnRlc3QodmFsdWUpO1xyXG4gIH0sJC52YWxpZGF0b3IuZm9ybWF0KFwi6K+36L6T5YWl6Iux5paH5a2X56ymXCIpKTtcclxuXHJcbiAgLyoqXHJcbiAgICog5Lit5paH5ZKM56m65qC8XHJcbiAgICovXHJcblxyXG4gICQudmFsaWRhdG9yLmFkZE1ldGhvZCgnemhDb2RlJyxmdW5jdGlvbih2YWx1ZSxlbGVtZW50LHBhcmFtKXtcclxuICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKGVsZW1lbnQpIHx8IC9eW1xcdTJFODAtXFx1OUZGRlxcc10rJC8udGVzdCh2YWx1ZSk7XHJcbiAgfSwkLnZhbGlkYXRvci5mb3JtYXQoXCLor7fovpPlhaXkuK3mloflrZfnrKZcIikpO1xyXG5cclxuICAvKipcclxuICAgKiDmiYvmnLrlj7fnoIFcclxuICAgKi9cclxuICAkLnZhbGlkYXRvci5hZGRNZXRob2QoJ21vYmlsZScsZnVuY3Rpb24odmFsdWUsZWxlbWVudCxwYXJhbSl7XHJcbiAgICByZXR1cm4gdGhpcy5vcHRpb25hbChlbGVtZW50KSB8fCAvXlxcKz8oODYpPy0/MVxcZHsxMH0kLy50ZXN0KHZhbHVlKTtcclxuICB9LCQudmFsaWRhdG9yLmZvcm1hdChcIuivt+i+k+WFpeato+ehrueahOaJi+acuuWPt+eggVwiKSk7XHJcblxyXG4gIC8qKlxyXG4gICAqIOWbuuWumueUteivnSjliqDljLrlj7cpXHJcbiAgICovXHJcbiAgJC52YWxpZGF0b3IuYWRkTWV0aG9kKCdwaG9uZScsZnVuY3Rpb24odmFsdWUsZWxlbWVudCxwYXJhbSl7XHJcbiAgICByZXR1cm4gdGhpcy5vcHRpb25hbChlbGVtZW50KSB8fCAvXihcXGR7Myw0fS0/KT9cXGR7OH0kLy50ZXN0KHZhbHVlKTtcclxuICB9LCQudmFsaWRhdG9yLmZvcm1hdChcIuivt+i+k+WFpeWbuuWumueUteivneWPt+eggVwiKSk7XHJcblxyXG4gIC8qKlxyXG4gICAqIOaJi+acuuaIluWbuuivnVxyXG4gICAqL1xyXG4gICQudmFsaWRhdG9yLmFkZE1ldGhvZCgnbW9iaWxlUGhvbmUnLGZ1bmN0aW9uKHZhbHVlLGVsZW1lbnQscGFyYW0pe1xyXG4gICAgcmV0dXJuIHRoaXMub3B0aW9uYWwoZWxlbWVudCkgfHwgL15cXCs/KDg2KT8tPzFcXGR7MTB9JC8udGVzdCh2YWx1ZSkgfHwgL14oXFxkezMsNH0tPyk/XFxkezh9JC8udGVzdCh2YWx1ZSk7XHJcbiAgfSwkLnZhbGlkYXRvci5mb3JtYXQoXCLor7fovpPlhaXmiYvmnLrmiJblm7rlrprnlLXor53lj7fnoIFcIikpO1xyXG5cclxuICAvKipcclxuICAgKiBDU0HnvJblj7dcclxuICAgKi9cclxuICAkLnZhbGlkYXRvci5hZGRNZXRob2QoJ2Nhc0NvZGUnLGZ1bmN0aW9uKHZhbHVlLGVsZW1lbnQscGFyYW0pe1xyXG4gICAgcmV0dXJuIHRoaXMub3B0aW9uYWwoZWxlbWVudCkgfHwgL15cXGQrXFwtXFxkK1xcLVxcZCskLy50ZXN0KHZhbHVlKTtcclxuICB9LCQudmFsaWRhdG9yLmZvcm1hdChcIuivt+i+k+WFpeato+ehrueahENTQee8luWPt1wiKSk7XHJcblxyXG5cclxuICAvKiDkuK3mlocgXHJcbiAgICogVHJhbnNsYXRlZCBkZWZhdWx0IG1lc3NhZ2VzIGZvciB0aGUgalF1ZXJ5IHZhbGlkYXRpb24gcGx1Z2luLlxyXG4gICAqIExvY2FsZTogWkggKENoaW5lc2UsIOS4reaWhyAoWmjFjW5nd8OpbiksIOaxieivrSwg5ryi6KqeKVxyXG4gICAqL1xyXG4gICQuZXh0ZW5kKCQudmFsaWRhdG9yLm1lc3NhZ2VzLCB7XHJcbiAgICByZXF1aXJlZDogXCLov5nmmK/lv4XloavlrZfmrrVcIixcclxuICAgIHJlbW90ZTogXCLor7fkv67mraPmraTlrZfmrrVcIixcclxuICAgIGVtYWlsOiBcIuivt+i+k+WFpeacieaViOeahOeUteWtkOmCruS7tuWcsOWdgFwiLFxyXG4gICAgdXJsOiBcIuivt+i+k+WFpeacieaViOeahOe9keWdgFwiLFxyXG4gICAgZGF0ZTogXCLor7fovpPlhaXmnInmlYjnmoTml6XmnJ9cIixcclxuICAgIGRhdGVJU086IFwi6K+36L6T5YWl5pyJ5pWI55qE5pel5pyfIChZWVlZLU1NLUREKVwiLFxyXG4gICAgbnVtYmVyOiBcIuivt+i+k+WFpeacieaViOeahOaVsOWtl1wiLFxyXG4gICAgZGlnaXRzOiBcIuWPquiDvei+k+WFpeaVsOWtl1wiLFxyXG4gICAgY3JlZGl0Y2FyZDogXCLor7fovpPlhaXmnInmlYjnmoTkv6HnlKjljaHlj7fnoIFcIixcclxuICAgIGVxdWFsVG86IFwi5L2g55qE6L6T5YWl5LiN55u45ZCMXCIsXHJcbiAgICBleHRlbnNpb246IFwi6K+36L6T5YWl5pyJ5pWI55qE5ZCO57yAXCIsXHJcbiAgICBtYXhsZW5ndGg6ICQudmFsaWRhdG9yLmZvcm1hdChcIuacgOWkmuWPr+S7pei+k+WFpSB7MH0g5Liq5a2X56ymXCIpLFxyXG4gICAgbWlubGVuZ3RoOiAkLnZhbGlkYXRvci5mb3JtYXQoXCLmnIDlsJHopoHovpPlhaUgezB9IOS4quWtl+esplwiKSxcclxuICAgIHJhbmdlbGVuZ3RoOiAkLnZhbGlkYXRvci5mb3JtYXQoXCLor7fovpPlhaXplb/luqblnKggezB9IOWIsCB7MX0g5LmL6Ze055qE5a2X56ym5LiyXCIpLFxyXG4gICAgcmFuZ2U6ICQudmFsaWRhdG9yLmZvcm1hdChcIuivt+i+k+WFpeiMg+WbtOWcqCB7MH0g5YiwIHsxfSDkuYvpl7TnmoTmlbDlgLxcIiksXHJcbiAgICBtYXg6ICQudmFsaWRhdG9yLmZvcm1hdChcIuivt+i+k+WFpeS4jeWkp+S6jiB7MH0g55qE5pWw5YC8XCIpLFxyXG4gICAgbWluOiAkLnZhbGlkYXRvci5mb3JtYXQoXCLor7fovpPlhaXkuI3lsI/kuo4gezB9IOeahOaVsOWAvFwiKVxyXG4gIH0pO1xyXG5cclxuICAvKipcclxuICAgKiDorr7nva7pu5jorqTlgLxcclxuICAgKi9cclxuICB2YXIgZGVmYXVsdHNIaWdobGlnaHQgPSAkLnZhbGlkYXRvci5kZWZhdWx0cy5oaWdobGlnaHQ7XHJcbiAgJC52YWxpZGF0b3Iuc2V0RGVmYXVsdHMoe1xyXG4gICAgaWdub3JlIDogXCIuaWdub3JlXCIsXHJcbiAgICBlcnJvckNsYXNzIDogXCJ2YWxpZGF0ZS1lcnJvclwiLFxyXG4gICAgc3VjY2VzcyA6IGZ1bmN0aW9uKGxhYmVsKXtcclxuICAgICAgLy/pqozor4HmiJDlip/orr7nva5jbGFzc+W5tua3u+WKoGZhLWNoZWNr5Zu+5qCHXHJcbiAgICAgIGxhYmVsLmFkZENsYXNzKCd2YWxpZGF0ZS1zdWNjZXNzJyk7XHJcbiAgICB9LFxyXG4gICAgZXJyb3JQbGFjZW1lbnQgOiBmdW5jdGlvbihlcnJvcixlbGVtZW50KXtcclxuICAgICAgZWxlbWVudC5wYXJlbnQoKS5hcHBlbmQoZXJyb3IpO1xyXG4gICAgfSxcclxuICAgIGhpZ2hsaWdodCA6IGZ1bmN0aW9uKGVsLGVycm9yQ2xhc3Mpe1xyXG4gICAgICB2YXIgJGVsID0gJChlbCk7XHJcbiAgICAgICRlbC5zaWJsaW5ncyhcIi5cIitlcnJvckNsYXNzKS5yZW1vdmVDbGFzcygndmFsaWRhdGUtc3VjY2VzcycpO1xyXG4gICAgICBkZWZhdWx0c0hpZ2hsaWdodC5hcHBseSh0aGlzLGFyZ3VtZW50cyk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgcmV0dXJuICQ7XHJcbn0pKTsiLCIvKipcclxuICog5rua5Yqo5YWD57SgXHJcbiAqIG5ldyBNYXJxdWVlKG9wdGlvbnMpO1xyXG4gKiBlbCA6IC8v5Li75YWD57SgXHJcbiAqIGRpcmVjdGlvbiA6ICd1cCcsLy/mlrnlkJEsdXAsbGVmdFxyXG4gKiBzcGVlZCA6IDMwLC8v6YCf5bqmXHJcbiAqIHN0ZXAgOiAxLC8v5q2l6ZW/XHJcbiAqIHZpc2libGUgOiAxLC8v5pi+56S65YWD57Sg5Liq5pWwXHJcblxyXG4gKi9cclxuXHJcbmRlZmluZSgnanF1ZXJ5Lm1hcnF1ZWUnLFsnanF1ZXJ5J10sZnVuY3Rpb24oJCl7XHJcblxyXG4gIGZ1bmN0aW9uIE1hcnF1ZWUob3B0KXtcclxuICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUse30sYXJndW1lbnRzLmNhbGxlZS5vcHRpb25zLG9wdCk7XHJcbiAgICB0aGlzLiRlbCA9ICQob3B0LmVsKS5hZGRDbGFzcygndWktbWFycXVlZScpO1xyXG4gICAgdGhpcy5pbml0KCk7XHJcbiAgfVxyXG4gICQuZXh0ZW5kKE1hcnF1ZWUucHJvdG90eXBlLHtcclxuICAgIGluaXQgOiBmdW5jdGlvbigpe1xyXG4gICAgICB2YXIgd2lkdGgsXHJcbiAgICAgICAgICBoZWlnaHQsXHJcbiAgICAgICAgICBsZW5ndGgsXHJcbiAgICAgICAgICB0aW1lcixcclxuICAgICAgICAgIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXHJcbiAgICAgICAgICBfdGhpcyAgID0gdGhpcztcclxuXHJcbiAgICAgIHRoaXMuJGl0ZW1zID0gdGhpcy4kZWwuY2hpbGRyZW4oKS5hZGRDbGFzcygndWktbWFycXVlZS1saScpO1xyXG4gICAgICBpZih0aGlzLm9wdGlvbnMuZGlyZWN0aW9uID09IFwibGVmdFwiKSB0aGlzLiRpdGVtcy5jc3Moe2Zsb2F0OlwibGVmdFwifSk7XHJcbiAgICAgIHdpZHRoID0gdGhpcy4kaXRlbXMuaW5uZXJXaWR0aCgpLGhlaWdodCA9IHRoaXMuJGl0ZW1zLmlubmVySGVpZ2h0KCk7XHJcbiAgICAgICQuZXh0ZW5kKHRoaXMub3B0aW9ucyx7XHJcbiAgICAgICAgd2lkdGggOiB3aWR0aCxcclxuICAgICAgICBoZWlnaHQgOiBoZWlnaHQsXHJcbiAgICAgICAgc2hvd1dpZHRoIDogd2lkdGgqdGhpcy4kaXRlbXMubGVuZ3RoLFxyXG4gICAgICAgIHNob3dIZWlnaHQgOiBoZWlnaHQqdGhpcy4kaXRlbXMubGVuZ3RoXHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLiRpdGVtcy5kZXRhY2goKTtcclxuICAgICAgaWYodGhpcy4kaXRlbXMubGVuZ3RoID49IG9wdGlvbnMudmlzaWJsZSl7Ly/lpKfkuo52aXNpYmxl5Liq5YWD57Sg5YiZ6L+b6KGM5rua5YqoXHJcbiAgICAgICAgdGhpcy4kaXRlbXMgPSB0aGlzLiRpdGVtcy5hZGQodGhpcy4kaXRlbXMuc2xpY2UoMCxvcHRpb25zLnZpc2libGUpLmNsb25lKCkpOy8v5aSN5Yi25YmNdmlzaWJsZeS4qmxp77yM5bm25re75Yqg5YiwdWzlkI5cclxuICAgICAgICBsZW5ndGggPSB0aGlzLiRpdGVtcy5sZW5ndGg7XHJcbiAgICAgICAgdGhpcy4kaXRlbUJveCA9ICQoJzxkaXYgY2xhc3M9XCJ1aS1tYXJxdWVlLWxpc3RcIj48L2Rpdj4nKS5hcHBlbmQodGhpcy4kaXRlbXMpLmFwcGVuZFRvKHRoaXMuJGVsKTtcclxuICAgICAgICB0aGlzLiRlbC5jc3Moe292ZXJmbG93OidoaWRkZW4nLHpvb206MX0pO1xyXG4gICAgICAgIHRoaXMuJGl0ZW1Cb3guY3NzKHtvdmVyZmxvdzonaGlkZGVuJyx6b29tOjF9KTtcclxuICAgICAgICBzd2l0Y2gob3B0aW9ucy5kaXJlY3Rpb24pe1xyXG4gICAgICAgICAgY2FzZSBcImxlZnRcIjp7XHJcbiAgICAgICAgICAgIHRoaXMuJGl0ZW1zLmNzcyh7d2lkdGg6b3B0aW9ucy53aWR0aH0pO1xyXG4gICAgICAgICAgICB0aGlzLiRlbC5jc3Moe3dpZHRoOm9wdGlvbnMudmlzaWJsZSpvcHRpb25zLndpZHRofSk7XHJcbiAgICAgICAgICAgIHRoaXMuJGl0ZW1Cb3guY3NzKHt3aWR0aDpsZW5ndGgqb3B0aW9ucy53aWR0aH0pO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNhc2UgXCJ1cFwiOntcclxuICAgICAgICAgICAgdGhpcy4kaXRlbXMuY3NzKHtoZWlnaHQ6b3B0aW9ucy5oZWlnaHR9KTtcclxuICAgICAgICAgICAgdGhpcy4kZWwuY3NzKHtoZWlnaHQ6b3B0aW9ucy52aXNpYmxlKm9wdGlvbnMuaGVpZ2h0fSk7XHJcbiAgICAgICAgICAgIHRoaXMuJGl0ZW1Cb3guY3NzKHtoZWlnaHQ6bGVuZ3RoKm9wdGlvbnMuaGVpZ2h0fSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy4kaXRlbUJveC5ob3ZlcigkLnByb3h5KHRoaXMuc3RvcCx0aGlzKSwkLnByb3h5KHRoaXMuc3RhcnQsdGhpcykpO1xyXG4gICAgICB0aGlzLnN0YXJ0KCk7XHJcbiAgICB9LFxyXG4gICAgcm9sbCA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zLFxyXG4gICAgICAkZWwgPSB0aGlzLiRlbDtcclxuXHJcbiAgICAgIGlmKG9wdGlvbnMuZGlyZWN0aW9uID09IFwibGVmdFwiKXtcclxuICAgICAgICBpZigkZWwuc2Nyb2xsTGVmdCgpID49IG9wdGlvbnMuc2hvd1dpZHRoKXtcclxuICAgICAgICAgICRlbC5zY3JvbGxMZWZ0KDApO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgJGVsLnNjcm9sbExlZnQoJGVsLnNjcm9sbExlZnQoKStvcHRpb25zLnN0ZXApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgaWYob3B0aW9ucy5kaXJlY3Rpb24gPT0gXCJ1cFwiKXtcclxuICAgICAgICBpZigkZWwuc2Nyb2xsVG9wKCkgPj0gb3B0aW9ucy5zaG93SGVpZ2h0KXtcclxuICAgICAgICAgICRlbC5zY3JvbGxUb3AoMCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAkZWwuc2Nyb2xsVG9wKCRlbC5zY3JvbGxUb3AoKStvcHRpb25zLnN0ZXApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHN0YXJ0IDogZnVuY3Rpb24oKXtcclxuICAgICAgdGhpcy50aW1lciA9IHNldEludGVydmFsKCQucHJveHkodGhpcy5yb2xsLHRoaXMpLHRoaXMub3B0aW9ucy5zcGVlZCk7XHJcbiAgICB9LFxyXG4gICAgc3RvcCA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcik7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgJC5leHRlbmQoTWFycXVlZSx7XHJcbiAgICBvcHRpb25zIDoge1xyXG4gICAgICBkaXJlY3Rpb24gOiAndXAnLFxyXG4gICAgICBzcGVlZCA6IDMwLFxyXG4gICAgICBzdGVwIDogMSxcclxuICAgICAgdmlzaWJsZSA6IDFcclxuICAgIH1cclxuICB9KTtcclxuICAkLmV4dGVuZCgkLmZuLHtcclxuICAgIG1hcnF1ZWUgOiBmdW5jdGlvbihvcHQpe1xyXG4gICAgICBvcHQgPSBvcHQgfHwge307XHJcbiAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGFyZ3VtZW50cyk7XHJcbiAgICAgIGFyZ3Muc2hpZnQoKTtcclxuICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XHJcbiAgICAgICAgdmFyIGRhdGEgPSAkdGhpcy5kYXRhKCdtYXJxdWVlJyk7XHJcblxyXG4gICAgICAgIGlmKCQudHlwZShvcHQpID09ICdvYmplY3QnKXtcclxuICAgICAgICAgIG9wdCA9ICQuZXh0ZW5kKHt9LG9wdCx7ZWw6JHRoaXN9KTtcclxuICAgICAgICAgIGRhdGEgPSBuZXcgTWFycXVlZShvcHQpO1xyXG4gICAgICAgICAgJHRoaXMuZGF0YSgnbWFycXVlZScsZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCQudHlwZShvcHQpID09ICdzdHJpbmcnKSBkYXRhW29wdF0uYXBwbHkoZGF0YSxhcmdzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gTWFycXVlZTtcclxuXHJcbn0pO1xyXG4gICAiLCJkZWZpbmUoJ2pxdWVyeS5wYWdpbmF0aW9uJyxbJ2pxdWVyeScsJ3VuZGVyc2NvcmUnXSxmdW5jdGlvbigkLF8pe1xyXG4gIGZ1bmN0aW9uIFBhZ2luYXRpb24ob3B0KXtcclxuICAgIHRoaXMuJGVsID0gJChvcHQuZWwpO1xyXG4gICAgdmFyIF9kYXRhID0gdGhpcy4kZWwuZGF0YSgpLGRhdGEgPSB7fTtcclxuICAgIF8ubWFwT2JqZWN0KF9kYXRhLGZ1bmN0aW9uKHYsayl7XHJcbiAgICAgIHN3aXRjaChrKXtcclxuICAgICAgICBjYXNlICdwYWdlJzoge1xyXG4gICAgICAgICAgZGF0YS5jdXJyZW50UGFnZSA9IHY7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSAnc2l6ZSc6IHtcclxuICAgICAgICAgIGRhdGEucGFnZVNpemUgPSB2O1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRlZmF1bHQ6IHtcclxuICAgICAgICAgIGRhdGFba10gPSB2O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh0aGlzLGFyZ3VtZW50cy5jYWxsZWUub3B0aW9ucyxkYXRhLG9wdCk7XHJcbiAgICB0aGlzLmluaXQoKTtcclxuICB9XHJcblxyXG4gICQuZXh0ZW5kKFBhZ2luYXRpb24ucHJvdG90eXBlLHtcclxuICAgIGluaXQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdwYWdpbmF0aW9uJyk7XHJcbiAgICAgIHRoaXMuX2V2ZW50cygpO1xyXG4gICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfSxcclxuICAgIHNldE9wdGlvbnM6IGZ1bmN0aW9uKG9wdCl7XHJcbiAgICAgICQuZXh0ZW5kKHRoaXMsb3B0KTtcclxuICAgICAgdmFyIHBhZ2VDaGFuZ2UgPSAkLkV2ZW50KCdwYWdlQ2hhbmdlJyx7cGFnZSA6IHRoaXMuY3VycmVudFBhZ2V9KTtcclxuICAgICAgdGhpcy4kZWwudHJpZ2dlcihwYWdlQ2hhbmdlKTtcclxuICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH0sXHJcbiAgICBzZXRQYWdlOiBmdW5jdGlvbihudW1iZXIpe1xyXG4gICAgICB0aGlzLnNldE9wdGlvbnMoe2N1cnJlbnRQYWdlOm51bWJlcn0pO1xyXG4gICAgfSxcclxuICAgIHNldFBhZ2VTaXplOiBmdW5jdGlvbihudW1iZXIpe1xyXG4gICAgICB0aGlzLnNldE9wdGlvbnMoe3BhZ2VTaXplOm51bWJlcn0pO1xyXG4gICAgfSxcclxuICAgIHJlbmRlcjogZnVuY3Rpb24oKXtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICB2YXIgdG90YWxQYWdlID0gTWF0aC5jZWlsKHRoaXMudG90YWwvdGhpcy5wYWdlU2l6ZSk7XHJcbiAgICAgIHZhciBpdGVtcyA9IFtdO1xyXG4gICAgICB0aGlzLiRlbC5lbXB0eSgpO1xyXG4gICAgICBpZih0b3RhbFBhZ2UgPD0gMSkgcmV0dXJuO1xyXG4gICAgICAvL+a3u+WKoOW9k+WJjemhtVxyXG4gICAgICBpdGVtcy5wdXNoKHtwYWdlOiB0aGlzLmN1cnJlbnRQYWdlLGh0bWw6IHRoaXMuY3VycmVudFBhZ2Usc3R5bGU6J2N1cnJlbnQnfSk7XHJcblxyXG4gICAgICAvL+a3u+WKoOaYvuekuuadoeaVsFxyXG4gICAgICBfLnRpbWVzKHRoaXMuZGlzcGxheUVkZ2VzLF8uYmluZChmdW5jdGlvbihpbmRleCl7XHJcbiAgICAgICAgaW5kZXggPSBpbmRleCsxO1xyXG4gICAgICAgIHZhciBwcmV2ID0gdGhpcy5jdXJyZW50UGFnZS1pbmRleCxcclxuICAgICAgICAgICAgbmV4dCA9IHRoaXMuY3VycmVudFBhZ2UraW5kZXg7XHJcbiAgICAgICAgaWYocHJldiA+IDApe1xyXG4gICAgICAgICAgaXRlbXMudW5zaGlmdCh7cGFnZTogcHJldixodG1sOiBwcmV2fSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKG5leHQgPCB0b3RhbFBhZ2UrMSl7XHJcbiAgICAgICAgICBpdGVtcy5wdXNoKHtwYWdlOiBuZXh0LGh0bWw6IG5leHR9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sdGhpcykpO1xyXG4gICAgICBcclxuICAgICAgLy/mt7vliqDovrnnvJhcclxuICAgICAgXy50aW1lcyh0aGlzLmVkZ2VzLF8uYmluZChmdW5jdGlvbihpbmRleCl7XHJcbiAgICAgICAgaW5kZXggPSB0aGlzLmVkZ2VzLWluZGV4O1xyXG4gICAgICAgIHZhciBwcmV2U3RhcnQgPSB0aGlzLmN1cnJlbnRQYWdlLXRoaXMuZGlzcGxheUVkZ2VzO1xyXG4gICAgICAgIHZhciBuZXh0U3RhcnQgPSB0aGlzLmN1cnJlbnRQYWdlK3RoaXMuZGlzcGxheUVkZ2VzO1xyXG4gICAgICAgIHZhciBwcmV2ID0gaW5kZXgsXHJcbiAgICAgICAgICAgIG5leHQgPSB0b3RhbFBhZ2UrMS1pbmRleDtcclxuXHJcbiAgICAgICAgaWYocHJldjxwcmV2U3RhcnQpe1xyXG4gICAgICAgICAgLy/mt7vliqDnnIHnlaVcclxuICAgICAgICAgIGlmKGluZGV4ID09IHRoaXMuZWRnZXMgJiYgKHByZXZTdGFydD4xK2luZGV4KSl7XHJcbiAgICAgICAgICAgIGl0ZW1zLnVuc2hpZnQoe3BhZ2U6IDAsaHRtbDogdGhpcy5lbGxpcHNlVGV4dCxzdHlsZTonZWxsaXBzZSd9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGl0ZW1zLnVuc2hpZnQoe3BhZ2U6IHByZXYsaHRtbDogcHJldn0pO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKG5leHQ+bmV4dFN0YXJ0KXtcclxuICAgICAgICAgIC8v5re75Yqg55yB55WlXHJcbiAgICAgICAgICBpZihpbmRleCA9PSB0aGlzLmVkZ2VzICYmKG5leHRTdGFydDx0b3RhbFBhZ2UtaW5kZXgpKXtcclxuICAgICAgICAgICAgaXRlbXMucHVzaCh7cGFnZTogMCxodG1sOiB0aGlzLmVsbGlwc2VUZXh0LHN0eWxlOidlbGxpcHNlJ30pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaXRlbXMucHVzaCh7cGFnZTogbmV4dCxodG1sOiBuZXh0fSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfSx0aGlzKSk7XHJcbiAgICAgIC8v5LiK5LiA6aG1XHJcbiAgICAgIGlmKHRoaXMuY3VycmVudFBhZ2UhPTEpe1xyXG4gICAgICAgIGl0ZW1zLnVuc2hpZnQoe3BhZ2U6IHRoaXMuY3VycmVudFBhZ2UtMSxodG1sOiB0aGlzLnByZXZIdG1sfSk7XHJcbiAgICAgIH1cclxuICAgICAgLy/kuIvkuIDpobVcclxuICAgICAgaWYodGhpcy5jdXJyZW50UGFnZSE9dG90YWxQYWdlKXtcclxuICAgICAgICBpdGVtcy5wdXNoKHtwYWdlOiB0aGlzLmN1cnJlbnRQYWdlKzEsaHRtbDogdGhpcy5uZXh0SHRtbH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvL+S9v+eUqGl0ZW1z5YiX6KGo55Sf5oiQ6IqC54K5XHJcbiAgICAgIHZhciAkZWxzID0gdGhpcy5fY3JlYXRlRWxlbWVudHMoaXRlbXMpO1xyXG4gICAgICB0aGlzLiRlbC5hcHBlbmQoJGVscyk7XHJcblxyXG4gICAgICAvL+mZhOWKoOWKn+iDvVxyXG4gICAgICB0aGlzLnNob3dUb3RhbCAmJiB0aGlzLiRlbC5hcHBlbmQoJzxzcGFuIGNsYXNzPVwidG90YWwtcGFnZVwiPuWFsSAnK3RvdGFsUGFnZSsnIOmhtTwvc3Bhbj4nKTtcclxuICAgICAgdGhpcy5za2lwUGFnZSAmJiB0aGlzLl9za2lwUGFnZSgpO1xyXG4gICAgICB0aGlzLnBhZ2VTaXplU2VsZWN0ICYmIHRoaXMuX3BhZ2VTaXplU2VsZWN0KCk7XHJcbiAgICB9LFxyXG4gICAgX2V2ZW50czogZnVuY3Rpb24oKXtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICB0aGlzLiRlbC5vbignY2xpY2snLCcucGFnZScsZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG4gICAgICAgIGlmKCR0aGlzLmhhc0NsYXNzKCdlbGxpcHNlJykpIHJldHVybjtcclxuICAgICAgICBpZigkdGhpcy5oYXNDbGFzcygnY3VycmVudCcpKSByZXR1cm47XHJcbiAgICAgICAgc2VsZi5zZXRQYWdlKCR0aGlzLmRhdGEoJ3BhZ2UnKSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLiRlbC5vbigna2V5ZG93bicsJy5za2lwJyxmdW5jdGlvbihlKXtcclxuICAgICAgICB2YXIgdG90YWxQYWdlID0gTWF0aC5jZWlsKHNlbGYudG90YWwvc2VsZi5wYWdlU2l6ZSk7XHJcbiAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcclxuICAgICAgICBpZihlLmtleUNvZGUgPT0gMTMpe1xyXG4gICAgICAgICAgdmFyIHZhbCA9IHBhcnNlSW50KCR0aGlzLnZhbCgpKTtcclxuICAgICAgICAgIGlmKCFpc05hTih2YWwpICYmIHZhbDw9dG90YWxQYWdlKXtcclxuICAgICAgICAgICAgdmFyIGhyZWYgPSBfLnRlbXBsYXRlKHNlbGYuaHJlZikoe3BhZ2U6dmFsfSk7XHJcbiAgICAgICAgICAgIC8v5aSE55CGaGFzaOWFvOWuuVxyXG4gICAgICAgICAgICBpZihocmVmLnNlYXJjaChcIiNcIikgPT0gMCl7XHJcbiAgICAgICAgICAgICAgbG9jYXRpb24uaGFzaCA9IGhyZWYuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNlbGYuc2V0UGFnZSh2YWwpO1xyXG4gICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICR0aGlzLnZhbCgnJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy4kZWwub24oJ2NoYW5nZScsJy5wYWdlLXNpemUnLGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgc2VsZi5zZXRQYWdlU2l6ZSgkKHRoaXMpLnZhbCgpKTtcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgX2NyZWF0ZUVsZW1lbnRzOiBmdW5jdGlvbihpdGVtcyl7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcywkZWxzID0gJCgpO1xyXG4gICAgICAoJC50eXBlKGl0ZW1zKSA9PSBcIm9iamVjdFwiKSAmJiAoaXRlbXMgPSBbaXRlbXNdKTtcclxuICAgICAgJC5lYWNoKGl0ZW1zLGZ1bmN0aW9uKGluZGV4LGl0ZW0pe1xyXG4gICAgICAgIGl0ZW0uaHJlZiA9IGl0ZW0ucGFnZSA/IF8udGVtcGxhdGUoc2VsZi5ocmVmKSh7cGFnZTppdGVtLnBhZ2V9KSA6IFwiamF2YXNjcmlwdDo7XCI7XHJcbiAgICAgICAgdmFyIG9wdCA9ICQuZXh0ZW5kKHtzdHlsZTonJyxocmVmOlwiamF2YXNjcmlwdDo7XCJ9LGl0ZW0pO1xyXG4gICAgICAgIHZhciAkZWwgPSAkKHNlbGYuX2VsZW1lbnRUZW1wKG9wdCkpO1xyXG4gICAgICAgICRlbHMgPSAkZWxzLmFkZCgkZWwpO1xyXG4gICAgICAgICRlbC5kYXRhKCdwYWdlJyxvcHQucGFnZSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gJGVscztcclxuICAgIH0sXHJcbiAgICBfc2tpcFBhZ2U6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHZhciAkZWwgPSAkKHRoaXMuX3NraXBQYWdlVGVtcCh7XHJcbiAgICAgICAgaXRlbXM6IHRoaXMucGFnZVNpemVBcnJheSxcclxuICAgICAgICBwYWdlU2l6ZTogdGhpcy5wYWdlU2l6ZVxyXG4gICAgICB9KSk7XHJcbiAgICAgIHRoaXMuJGVsLmFwcGVuZCgkZWwpO1xyXG4gICAgfSxcclxuICAgIF9wYWdlU2l6ZVNlbGVjdDogZnVuY3Rpb24oKXtcclxuICAgICAgdmFyICRlbCA9ICQodGhpcy5fcGFnZVNpemVTZWxlY3RUZW1wKHtcclxuICAgICAgICBpdGVtczogdGhpcy5wYWdlU2l6ZUFycmF5LFxyXG4gICAgICAgIHBhZ2VTaXplOiB0aGlzLnBhZ2VTaXplXHJcbiAgICAgIH0pKTtcclxuICAgICAgdGhpcy4kZWwuYXBwZW5kKCRlbCk7XHJcbiAgICB9LFxyXG4gICAgX3NraXBQYWdlVGVtcDogXy50ZW1wbGF0ZShbXHJcbiAgICAgICc8c3BhbiBjbGFzcz1cInNraXAtcGFnZVwiPui3s+i9rOWIsCA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cInNraXBcIiB2YWx1ZT1cIlwiIC8+IOmhtTwvc3Bhbj4nXHJcbiAgICBdLmpvaW4oJycpKSxcclxuICAgIF9wYWdlU2l6ZVNlbGVjdFRlbXA6IF8udGVtcGxhdGUoW1xyXG4gICAgICAnPHNlbGVjdCBjbGFzcz1cInBhZ2Utc2l6ZVwiPicsXHJcbiAgICAgICAgJzwlIF8uZWFjaChpdGVtcyxmdW5jdGlvbihpdGVtLGluZGV4KXsgJT4nLFxyXG4gICAgICAgICc8b3B0aW9uIHZhbHVlPVwiPCU9IGl0ZW0gJT5cIiA8JSBpZihpdGVtID09IHBhZ2VTaXplKXsgJT5zZWxlY3RlZD1cInNlbGVjdGVkXCI8JX0lPiA+PCU9IGl0ZW0gJT48L29wdGlvbj4nLFxyXG4gICAgICAgICc8JSB9KTsgJT4nLFxyXG4gICAgICAnPC9zZWxlY3Q+J1xyXG4gICAgXS5qb2luKCcnKSksXHJcbiAgICBfZWxlbWVudFRlbXA6IF8udGVtcGxhdGUoW1xyXG4gICAgICAnPGEgaHJlZj1cIjwlPSBocmVmJT5cIiBjbGFzcz1cInBhZ2UgPCU9IHN0eWxlICU+XCI+PCU9IGh0bWwgJT48L2E+J1xyXG4gICAgXS5qb2luKCcnKSlcclxuICB9KTtcclxuXHJcbiAgJC5leHRlbmQoUGFnaW5hdGlvbix7XHJcbiAgICBvcHRpb25zIDoge1xyXG4gICAgICBjdXJyZW50UGFnZTogMSxcclxuICAgICAgcGFnZVNpemU6IDEwLFxyXG4gICAgICB0b3RhbDogMCxcclxuICAgICAgZWRnZXM6IDEsXHJcbiAgICAgIGRpc3BsYXlFZGdlczogMixcclxuICAgICAgcHJldkh0bWw6IFwi5LiK5LiA6aG1XCIsXHJcbiAgICAgIG5leHRIdG1sOiBcIuS4i+S4gOmhtVwiLFxyXG4gICAgICBocmVmOiBcIiNwYWdlLTwlPSBwYWdlICU+XCIsXHJcbiAgICAgIGVsbGlwc2VUZXh0OiBcIiZoZWxsaXA7XCIsXHJcbiAgICAgIHBhZ2VTaXplU2VsZWN0OiBmYWxzZSwvL+aYr+WQpuWFgeiuuOmAieaLqeavj+mhteaVsOmHj1xyXG4gICAgICBwYWdlU2l6ZUFycmF5OiBbMTAsMjAsNTAsMTAwXSwvL+WIhumhtemAieaLqeaOp+WItlxyXG4gICAgICBza2lwUGFnZTogZmFsc2UsLy/mmK/lkKblhYHorrjot7PovazliLDmjIflrprpobVcclxuICAgICAgc2hvd1RvdGFsOiBmYWxzZSwvL+aYr+WQpuaYvuekuuaAu+mhteaVsFxyXG4gICAgICBvbkNoYW5nZTogJC5ub29wXHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcclxuICAgIG9wdGlvbiA9IG9wdGlvbiB8fCB7fVxyXG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcylcclxuICAgICAgdmFyIGRhdGEgID0gJHRoaXMuZGF0YSgnYnMucGFnaW5hdGlvbicpXHJcbiAgICAgIG9wdGlvbi5lbCA9ICR0aGlzO1xyXG5cclxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5wYWdpbmF0aW9uJywgKGRhdGEgPSBuZXcgUGFnaW5hdGlvbihvcHRpb24pKSlcclxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXS5jYWxsKCR0aGlzKVxyXG4gICAgfSlcclxuICB9XHJcbiAgJC5mbi5wYWdpbmF0aW9uID0gUGx1Z2luO1xyXG4gICQuZm4ucGFnaW5hdGlvbi5Db25zdHJ1Y3RvciA9IFBhZ2luYXRpb247XHJcblxyXG59KTtcclxuIiwiZGVmaW5lKCdqcXVlcnkucGxhY2Vob2xkZXInLFsnanF1ZXJ5JywnbW9kZXJuaXpyJ10sZnVuY3Rpb24oJCxtb2Rlcm5penIpe1xyXG4gIGZ1bmN0aW9uIFBsYWNlaG9sZGVyKG9wdCl7XHJcbiAgICBQbGFjZWhvbGRlci5vcHRpb25zLmlkKys7XHJcbiAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLHt9LFBsYWNlaG9sZGVyLm9wdGlvbnMsb3B0KTtcclxuICAgIHRoaXMuJGVsID0gJChvcHQuZWwpO1xyXG4gICAgdGhpcy5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAkLmV4dGVuZChQbGFjZWhvbGRlci5wcm90b3R5cGUse1xyXG4gICAgaW5pdCA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIGlmKG1vZGVybml6ci5pbnB1dC5wbGFjZWhvbGRlcil7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xyXG4gICAgICBvcHRpb25zLmhlaWdodCA9IHRoaXMuJGVsLmhlaWdodCgpO1xyXG4gICAgICB2YXIgaGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHQ7XHJcbiAgICAgIHZhciBib3JkZXJXaWR0aCA9IHBhcnNlSW50KHRoaXMuJGVsLmNzcygnYm9yZGVyVG9wV2lkdGgnKSkgfHwgMDtcclxuICAgICAgdmFyIGlkID0gdGhpcy4kZWwuYXR0cignaWQnKTtcclxuICAgICAgaWYoIWlkKXtcclxuICAgICAgICBpZCA9ICdwbGFjZWhvbGRlcl8nK29wdGlvbnMuaWQ7XHJcbiAgICAgICAgdGhpcy4kZWwuYXR0cignaWQnLGlkKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLiRsYWJlbCA9ICQoJzxsYWJlbCBmb3I9XCInK2lkKydcIj4nK29wdGlvbnMucGxhY2Vob2xkZXIrJzwvbGFiZWw+JylcclxuICAgICAgICAuY3NzKHtcclxuICAgICAgICAgIHBvc2l0aW9uIDogJ2Fic29sdXRlJyxcclxuICAgICAgICAgIGN1cnNvciA6ICd0ZXh0JyxcclxuICAgICAgICAgIGNvbG9yIDogXCJncmF5dGV4dFwiLFxyXG4gICAgICAgICAgZm9udFNpemUgOiB0aGlzLiRlbC5jc3MoJ2ZvbnRTaXplJyksXHJcbiAgICAgICAgICBwYWRkaW5nVG9wIDogcGFyc2VJbnQodGhpcy4kZWwuY3NzKCdwYWRkaW5nVG9wJykpK2JvcmRlcldpZHRoLFxyXG4gICAgICAgICAgcGFkZGluZ0xlZnQgOiBwYXJzZUludCh0aGlzLiRlbC5jc3MoJ3BhZGRpbmdMZWZ0JykpK2JvcmRlcldpZHRoLFxyXG4gICAgICAgICAgbGluZUhlaWdodCA6IGhlaWdodCsncHgnXHJcbiAgICAgICAgfSkuaW5zZXJ0QmVmb3JlKHRoaXMuJGVsKTtcclxuICAgICAgdGhpcy4kZWwub24oJ2tleXVwIGZvY3VzIGlucHV0IHByb3BlcnR5Y2hhbmdlJyxmdW5jdGlvbigpe1xyXG4gICAgICAgIGlmKF90aGlzLiRlbC52YWwoKSA9PSBcIlwiKXtcclxuICAgICAgICAgIF90aGlzLiRsYWJlbC50ZXh0KG9wdGlvbnMucGxhY2Vob2xkZXIpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgX3RoaXMuJGxhYmVsLnRleHQoXCJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy4kZWwudHJpZ2dlcignaW5wdXQnKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgJC5leHRlbmQoUGxhY2Vob2xkZXIse1xyXG4gICAgb3B0aW9ucyA6IHtcclxuICAgICAgcGxhY2Vob2xkZXIgOiAn6K+36L6T5YWl5YaF5a65JyxcclxuICAgICAgaWQgOiAxXHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gICQuZm4uZXh0ZW5kKHtcclxuICAgIHBsYWNlaG9sZGVyIDogZnVuY3Rpb24ob3B0KXtcclxuICAgICAgb3B0ID0gb3B0IHx8IHt9O1xyXG4gICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhcmd1bWVudHMpO1xyXG4gICAgICBhcmdzLnNoaWZ0KCk7XHJcbiAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG4gICAgICAgIHZhciBkYXRhID0gJHRoaXMuZGF0YSgncGxhY2Vob2xkZXInKTtcclxuXHJcbiAgICAgICAgaWYoJC50eXBlKG9wdCkgPT0gJ29iamVjdCcpe1xyXG4gICAgICAgICAgb3B0ID0gJC5leHRlbmQoe30sb3B0LHtcclxuICAgICAgICAgICAgZWw6JHRoaXMsXHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOiR0aGlzLmF0dHIoJ3BsYWNlaG9sZGVyJylcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgZGF0YSA9IG5ldyBQbGFjZWhvbGRlcihvcHQpO1xyXG4gICAgICAgICAgJHRoaXMuZGF0YSgncGxhY2Vob2xkZXInLGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZigkLnR5cGUob3B0KSA9PSAnc3RyaW5nJykgZGF0YVtvcHRdLmFwcGx5KGRhdGEsYXJncyk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIFBsYWNlaG9sZGVyO1xyXG5cclxufSk7XHJcbiIsIi8qIFBsYXggdmVyc2lvbiAxLjQuMSAqL1xyXG5cclxuLypcclxuICBDb3B5cmlnaHQgKGMpIDIwMTEgQ2FtZXJvbiBNY0VmZWVcclxuXHJcbiAgUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nXHJcbiAgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXHJcbiAgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXHJcbiAgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxyXG4gIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xyXG4gIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0b1xyXG4gIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcclxuXHJcbiAgVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmVcclxuICBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cclxuXHJcbiAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcclxuICBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0ZcclxuICBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxyXG4gIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcclxuICBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OXHJcbiAgT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXHJcbiAgV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vL+WumOaWuSAoZnVuY3Rpb24gKCQpIHtcclxuZGVmaW5lKCdqcXVlcnkucGxheCcsWydqcXVlcnknXSxmdW5jdGlvbigkKXtcclxuICB2YXIgbWF4ZnBzICAgICAgICAgICAgID0gMjUsXHJcbiAgICAgIGRlbGF5ICAgICAgICAgICAgICA9IDEgLyBtYXhmcHMgKiAxMDAwLFxyXG4gICAgICBsYXN0UmVuZGVyICAgICAgICAgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSxcclxuICAgICAgbGF5ZXJzICAgICAgICAgICAgID0gW10sXHJcbiAgICAgIHBsYXhBY3Rpdml0eVRhcmdldCA9ICQod2luZG93KSxcclxuICAgICAgbW90aW9uRGVncmVlcyAgICAgID0gMzAsXHJcbiAgICAgIG1vdGlvbk1heCAgICAgICAgICA9IDEsXHJcbiAgICAgIG1vdGlvbk1pbiAgICAgICAgICA9IC0xLFxyXG4gICAgICBtb3Rpb25TdGFydFggICAgICAgPSBudWxsLFxyXG4gICAgICBtb3Rpb25TdGFydFkgICAgICAgPSBudWxsLFxyXG4gICAgICBpZ25vcmVNb3ZlYWJsZSAgICAgPSBmYWxzZSxcclxuICAgICAgb3B0aW9ucyAgICAgICAgICAgID0gbnVsbDtcclxuXHJcbiAgdmFyIGRlZmF1bHRzID0ge1xyXG4gICAgdXNlVHJhbnNmb3JtIDogdHJ1ZVxyXG4gIH07XHJcblxyXG4gIC8vIFB1YmxpYyBNZXRob2RzXHJcbiAgJC5mbi5wbGF4aWZ5ID0gZnVuY3Rpb24gKHBhcmFtcyl7XHJcbiAgICBvcHRpb25zID0gJC5leHRlbmQoe30sIGRlZmF1bHRzLCBwYXJhbXMpO1xyXG4gICAgb3B0aW9ucy51c2VUcmFuc2Zvcm0gPSAob3B0aW9ucy51c2VUcmFuc2Zvcm0gPyBzdXBwb3J0czNkVHJhbnNmb3JtKCkgOiBmYWxzZSk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICB2YXIgbGF5ZXJFeGlzdHNBdCA9IC0xO1xyXG4gICAgICB2YXIgbGF5ZXIgICAgICAgICA9IHtcclxuICAgICAgICBcInhSYW5nZVwiOiAkKHRoaXMpLmRhdGEoJ3hyYW5nZScpIHx8IDAsXHJcbiAgICAgICAgXCJ5UmFuZ2VcIjogJCh0aGlzKS5kYXRhKCd5cmFuZ2UnKSB8fCAwLFxyXG4gICAgICAgIFwielJhbmdlXCI6ICQodGhpcykuZGF0YSgnenJhbmdlJykgfHwgMCxcclxuICAgICAgICBcImludmVydFwiOiAkKHRoaXMpLmRhdGEoJ2ludmVydCcpIHx8IGZhbHNlLFxyXG4gICAgICAgIFwiYmFja2dyb3VuZFwiOiAkKHRoaXMpLmRhdGEoJ2JhY2tncm91bmQnKSB8fCBmYWxzZVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgZm9yICh2YXIgaT0wO2k8bGF5ZXJzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgIGlmICh0aGlzID09PSBsYXllcnNbaV0ub2JqLmdldCgwKSl7XHJcbiAgICAgICAgICBsYXllckV4aXN0c0F0ID0gaTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZvciAodmFyIHBhcmFtIGluIHBhcmFtcykge1xyXG4gICAgICAgIGlmIChsYXllcltwYXJhbV0gPT0gMCkge1xyXG4gICAgICAgICAgbGF5ZXJbcGFyYW1dID0gcGFyYW1zW3BhcmFtXTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxheWVyLmludmVyc2lvbkZhY3RvciA9IChsYXllci5pbnZlcnQgPyAtMSA6IDEpOyAvLyBpbnZlcnNpb24gZmFjdG9yIGZvciBjYWxjdWxhdGlvbnNcclxuXHJcbiAgICAgIC8vIEFkZCBhbiBvYmplY3QgdG8gdGhlIGxpc3Qgb2YgdGhpbmdzIHRvIHBhcmFsbGF4XHJcbiAgICAgIGxheWVyLm9iaiAgICA9ICQodGhpcyk7XHJcbiAgICAgIGlmKGxheWVyLmJhY2tncm91bmQpIHtcclxuICAgICAgICAvLyBhbmltYXRlIHVzaW5nIHRoZSBlbGVtZW50J3MgYmFja2dyb3VuZFxyXG4gICAgICAgIHBvcyA9IChsYXllci5vYmouY3NzKCdiYWNrZ3JvdW5kLXBvc2l0aW9uJykgfHwgXCIwcHggMHB4XCIpLnNwbGl0KC8gLyk7XHJcbiAgICAgICAgaWYocG9zLmxlbmd0aCAhPSAyKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHggPSBwb3NbMF0ubWF0Y2goL14oKC0/XFxkKylcXHMqcHh8MCtcXHMqJXxsZWZ0KSQvKTtcclxuICAgICAgICB5ID0gcG9zWzFdLm1hdGNoKC9eKCgtP1xcZCspXFxzKnB4fDArXFxzKiV8dG9wKSQvKTtcclxuICAgICAgICBpZigheCB8fCAheSkge1xyXG4gICAgICAgICAgLy8gbm8gY2FuLWRvZXN2aWxsZSwgYmFieWRvbGwsIHdlIG5lZWQgcGl4ZWxzIG9yIHRvcC9sZWZ0IGFzIGluaXRpYWwgdmFsdWVzIChpdCBtaWdodGJlIHBvc3NpYmxlIHRvIGNvbnN0cnVjdCBhIHRlbXBvcmFyeSBpbWFnZSBmcm9tIHRoZSBiYWNrZ3JvdW5kLWltYWdlIHByb3BlcnR5IGFuZCBnZXQgdGhlIGRpbWVuc2lvbnMgYW5kIHJ1biBzb21lIG51bWJlcnMsIGJ1dCB0aGF0J2xsIGFsbW9zdCBkZWZpbml0ZWx5IGJlIHNsb3cpXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxheWVyLm9yaWdpblggPSBsYXllci5zdGFydFggPSB4WzJdIHx8IDA7XHJcbiAgICAgICAgbGF5ZXIub3JpZ2luWSA9IGxheWVyLnN0YXJ0WSA9IHlbMl0gfHwgMDtcclxuICAgICAgICBsYXllci50cmFuc2Zvcm1PcmlnaW5YID0gbGF5ZXIudHJhbnNmb3JtU3RhcnRYID0gMDtcclxuICAgICAgICBsYXllci50cmFuc2Zvcm1PcmlnaW5ZID0gbGF5ZXIudHJhbnNmb3JtU3RhcnRZID0gMDtcclxuICAgICAgICBsYXllci50cmFuc2Zvcm1PcmlnaW5aID0gbGF5ZXIudHJhbnNmb3JtU3RhcnRaID0gMDtcclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIC8vIEZpZ3VyZSBvdXQgd2hlcmUgdGhlIGVsZW1lbnQgaXMgcG9zaXRpb25lZCwgdGhlbiByZXBvc2l0aW9uIGl0IGZyb20gdGhlIHRvcC9sZWZ0LCBzYW1lIGZvciB0cmFuc2Zvcm0gaWYgdXNpbmcgdHJhbnNsYXRlM2RcclxuICAgICAgICB2YXIgcG9zaXRpb24gICAgICAgICAgID0gbGF5ZXIub2JqLnBvc2l0aW9uKCksXHJcbiAgICAgICAgICAgIHRyYW5zZm9ybVRyYW5zbGF0ZSA9IGdldDNkVHJhbnNsYXRpb24obGF5ZXIub2JqKTtcclxuXHJcbiAgICAgICAgbGF5ZXIub2JqLmNzcyh7XHJcbiAgICAgICAgICAndHJhbnNmb3JtJyA6IHRyYW5zZm9ybVRyYW5zbGF0ZS5qb2luKCkgKyAncHgnLFxyXG4gICAgICAgICAgJ3RvcCcgICA6IHBvc2l0aW9uLnRvcCxcclxuICAgICAgICAgICdsZWZ0JyAgOiBwb3NpdGlvbi5sZWZ0LFxyXG4gICAgICAgICAgJ3JpZ2h0JyA6JycsXHJcbiAgICAgICAgICAnYm90dG9tJzonJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxheWVyLm9yaWdpblggPSBsYXllci5zdGFydFggPSBwb3NpdGlvbi5sZWZ0O1xyXG4gICAgICAgIGxheWVyLm9yaWdpblkgPSBsYXllci5zdGFydFkgPSBwb3NpdGlvbi50b3A7XHJcbiAgICAgICAgbGF5ZXIudHJhbnNmb3JtT3JpZ2luWCA9IGxheWVyLnRyYW5zZm9ybVN0YXJ0WCA9IHRyYW5zZm9ybVRyYW5zbGF0ZVswXTtcclxuICAgICAgICBsYXllci50cmFuc2Zvcm1PcmlnaW5ZID0gbGF5ZXIudHJhbnNmb3JtU3RhcnRZID0gdHJhbnNmb3JtVHJhbnNsYXRlWzFdO1xyXG4gICAgICAgIGxheWVyLnRyYW5zZm9ybU9yaWdpblogPSBsYXllci50cmFuc2Zvcm1TdGFydFogPSB0cmFuc2Zvcm1UcmFuc2xhdGVbMl07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxheWVyLnN0YXJ0WCAtPSBsYXllci5pbnZlcnNpb25GYWN0b3IgKiBNYXRoLmZsb29yKGxheWVyLnhSYW5nZS8yKTtcclxuICAgICAgbGF5ZXIuc3RhcnRZIC09IGxheWVyLmludmVyc2lvbkZhY3RvciAqIE1hdGguZmxvb3IobGF5ZXIueVJhbmdlLzIpO1xyXG5cclxuICAgICAgbGF5ZXIudHJhbnNmb3JtU3RhcnRYIC09IGxheWVyLmludmVyc2lvbkZhY3RvciAqIE1hdGguZmxvb3IobGF5ZXIueFJhbmdlLzIpO1xyXG4gICAgICBsYXllci50cmFuc2Zvcm1TdGFydFkgLT0gbGF5ZXIuaW52ZXJzaW9uRmFjdG9yICogTWF0aC5mbG9vcihsYXllci55UmFuZ2UvMik7XHJcbiAgICAgIGxheWVyLnRyYW5zZm9ybVN0YXJ0WiAtPSBsYXllci5pbnZlcnNpb25GYWN0b3IgKiBNYXRoLmZsb29yKGxheWVyLnpSYW5nZS8yKTtcclxuXHJcbiAgICAgIGlmKGxheWVyRXhpc3RzQXQgPj0gMCl7XHJcbiAgICAgICAgbGF5ZXJzLnNwbGljZShsYXllckV4aXN0c0F0LDEsbGF5ZXIpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxheWVycy5wdXNoKGxheWVyKTtcclxuICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIC8vIEdldCB0aGUgdHJhbnNsYXRlIHBvc2l0aW9uIG9mIHRoZSBlbGVtZW50XHJcbiAgLy9cclxuICAvLyByZXR1cm4gMyBlbGVtZW50IGFycmF5IGZvciB0cmFuc2xhdGUzZFxyXG4gIGZ1bmN0aW9uIGdldDNkVHJhbnNsYXRpb24ob2JqKSB7XHJcbiAgICB2YXIgdHJhbnNsYXRlID0gWzAsMCwwXSxcclxuICAgICAgICBtYXRyaXggICAgPSBvYmouY3NzKFwiLXdlYmtpdC10cmFuc2Zvcm1cIikgfHxcclxuICAgICAgICAgICAgICAgICAgICBvYmouY3NzKFwiLW1vei10cmFuc2Zvcm1cIikgICAgfHxcclxuICAgICAgICAgICAgICAgICAgICBvYmouY3NzKFwiLW1zLXRyYW5zZm9ybVwiKSAgICAgfHxcclxuICAgICAgICAgICAgICAgICAgICBvYmouY3NzKFwiLW8tdHJhbnNmb3JtXCIpICAgICAgfHxcclxuICAgICAgICAgICAgICAgICAgICBvYmouY3NzKFwidHJhbnNmb3JtXCIpO1xyXG5cclxuICAgIGlmKG1hdHJpeCAhPT0gJ25vbmUnKSB7XHJcbiAgICAgIHZhciB2YWx1ZXMgPSBtYXRyaXguc3BsaXQoJygnKVsxXS5zcGxpdCgnKScpWzBdLnNwbGl0KCcsJyk7XHJcbiAgICAgIHZhciB4ID0gMCxcclxuICAgICAgICAgIHkgPSAwLFxyXG4gICAgICAgICAgeiA9IDA7XHJcbiAgICAgIGlmKHZhbHVlcy5sZW5ndGggPT0gMTYpe1xyXG4gICAgICAgIC8vIDNkIG1hdHJpeFxyXG4gICAgICAgIHggPSAocGFyc2VGbG9hdCh2YWx1ZXNbdmFsdWVzLmxlbmd0aCAtIDRdKSk7XHJcbiAgICAgICAgeSA9IChwYXJzZUZsb2F0KHZhbHVlc1t2YWx1ZXMubGVuZ3RoIC0gM10pKTtcclxuICAgICAgICB6ID0gKHBhcnNlRmxvYXQodmFsdWVzW3ZhbHVlcy5sZW5ndGggLSAyXSkpO1xyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICAvLyB6IGlzIG5vdCB0cmFuc2Zvcm1lZCBhcyBpcyBub3QgYSAzZCBtYXRyaXhcclxuICAgICAgICB4ID0gKHBhcnNlRmxvYXQodmFsdWVzW3ZhbHVlcy5sZW5ndGggLSAyXSkpO1xyXG4gICAgICAgIHkgPSAocGFyc2VGbG9hdCh2YWx1ZXNbdmFsdWVzLmxlbmd0aCAtIDFdKSk7XHJcbiAgICAgICAgeiA9IDA7XHJcbiAgICAgIH1cclxuICAgICAgdHJhbnNsYXRlID0gW3gseSx6XTtcclxuICAgIH1cclxuICAgIHJldHVybiB0cmFuc2xhdGU7XHJcbiAgfVxyXG5cclxuICAvLyBDaGVjayBpZiBlbGVtZW50IGlzIGluIHZpZXdwb3J0IGFyZWFcclxuICAvL1xyXG4gIC8vIFJldHVybnMgYm9vbGVhblxyXG4gIGZ1bmN0aW9uIGluVmlld3BvcnQoZWxlbWVudCkge1xyXG4gICAgaWYgKGVsZW1lbnQub2Zmc2V0V2lkdGggPT09IDAgfHwgZWxlbWVudC5vZmZzZXRIZWlnaHQgPT09IDApIHJldHVybiBmYWxzZTtcclxuXHJcblx0dmFyIGhlaWdodCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQsXHJcbiAgICAgIHJlY3RzICA9IGVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKTtcclxuXHJcblx0Zm9yICh2YXIgaSA9IDAsIGwgPSByZWN0cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuXHJcbiAgICB2YXIgciAgICAgICAgICAgPSByZWN0c1tpXSxcclxuICAgICAgICBpbl92aWV3cG9ydCA9IHIudG9wID4gMCA/IHIudG9wIDw9IGhlaWdodCA6IChyLmJvdHRvbSA+IDAgJiYgci5ib3R0b20gPD0gaGVpZ2h0KTtcclxuXHJcbiAgICBpZiAoaW5fdmlld3BvcnQpIHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHRyZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICAvLyBDaGVjayBzdXBwb3J0IGZvciAzZFRyYW5zZm9ybVxyXG4gIC8vXHJcbiAgLy8gUmV0dXJucyBib29sZWFuXHJcbiAgZnVuY3Rpb24gc3VwcG9ydHMzZFRyYW5zZm9ybSgpIHtcclxuICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKSxcclxuICAgICAgICBoYXMzZCxcclxuICAgICAgICB0cmFuc2Zvcm1zID0ge1xyXG4gICAgICAgICAgJ3dlYmtpdFRyYW5zZm9ybSc6Jy13ZWJraXQtdHJhbnNmb3JtJyxcclxuICAgICAgICAgICdPVHJhbnNmb3JtJzonLW8tdHJhbnNmb3JtJyxcclxuICAgICAgICAgICdtc1RyYW5zZm9ybSc6Jy1tcy10cmFuc2Zvcm0nLFxyXG4gICAgICAgICAgJ01velRyYW5zZm9ybSc6Jy1tb3otdHJhbnNmb3JtJyxcclxuICAgICAgICAgICd0cmFuc2Zvcm0nOid0cmFuc2Zvcm0nXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICBkb2N1bWVudC5ib2R5Lmluc2VydEJlZm9yZShlbCwgbnVsbCk7XHJcblxyXG4gICAgZm9yICh2YXIgdCBpbiB0cmFuc2Zvcm1zKSB7XHJcbiAgICAgIGlmIChlbC5zdHlsZVt0XSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgZWwuc3R5bGVbdF0gPSBcInRyYW5zbGF0ZTNkKDFweCwxcHgsMXB4KVwiO1xyXG4gICAgICAgIGhhczNkID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpLmdldFByb3BlcnR5VmFsdWUodHJhbnNmb3Jtc1t0XSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGVsKTtcclxuICAgIHJldHVybiAoaGFzM2QgIT09IHVuZGVmaW5lZCAmJiBoYXMzZC5sZW5ndGggPiAwICYmIGhhczNkICE9PSBcIm5vbmVcIik7XHJcbiAgfVxyXG5cclxuICAvLyBEZXRlcm1pbmUgaWYgdGhlIGRldmljZSBoYXMgYW4gYWNjZWxlcm9tZXRlclxyXG4gIC8vXHJcbiAgLy8gcmV0dXJucyB0cnVlIGlmIHRoZSBicm93c2VyIGhhcyB3aW5kb3cuRGV2aWNlTW90aW9uRXZlbnQgKG1vYmlsZSlcclxuICBmdW5jdGlvbiBtb3ZlYWJsZSgpe1xyXG4gICAgcmV0dXJuIChpZ25vcmVNb3ZlYWJsZT09PXRydWUpID8gZmFsc2UgOiB3aW5kb3cuRGV2aWNlT3JpZW50YXRpb25FdmVudCAhPT0gdW5kZWZpbmVkO1xyXG4gIH1cclxuXHJcbiAgLy8gVGhlIHZhbHVlcyBwdWxsZWQgZnJvbSB0aGUgZ3lyb3Njb3BlIG9mIGEgbW90aW9uIGRldmljZS5cclxuICAvL1xyXG4gIC8vIFJldHVybnMgYW4gb2JqZWN0IGxpdGVyYWwgd2l0aCB4IGFuZCB5IGFzIG9wdGlvbnMuXHJcbiAgZnVuY3Rpb24gdmFsdWVzRnJvbU1vdGlvbihlKSB7XHJcbiAgICB4ID0gZS5nYW1tYTtcclxuICAgIHkgPSBlLmJldGE7XHJcblxyXG4gICAgLy8gU3dhcCB4IGFuZCB5IGluIExhbmRzY2FwZSBvcmllbnRhdGlvblxyXG4gICAgaWYgKE1hdGguYWJzKHdpbmRvdy5vcmllbnRhdGlvbikgPT09IDkwKSB7XHJcbiAgICAgIHZhciBhID0geDtcclxuICAgICAgeCA9IHk7XHJcbiAgICAgIHkgPSBhO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEludmVydCB4IGFuZCB5IGluIHVwc2lkZWRvd24gb3JpZW50YXRpb25zXHJcbiAgICBpZiAod2luZG93Lm9yaWVudGF0aW9uIDwgMCkge1xyXG4gICAgICB4ID0gLXg7XHJcbiAgICAgIHkgPSAteTtcclxuICAgIH1cclxuXHJcbiAgICBtb3Rpb25TdGFydFggPSAobW90aW9uU3RhcnRYID09PSBudWxsKSA/IHggOiBtb3Rpb25TdGFydFg7XHJcbiAgICBtb3Rpb25TdGFydFkgPSAobW90aW9uU3RhcnRZID09PSBudWxsKSA/IHkgOiBtb3Rpb25TdGFydFk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogeCAtIG1vdGlvblN0YXJ0WCxcclxuICAgICAgeTogeSAtIG1vdGlvblN0YXJ0WVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8vIE1vdmUgdGhlIGVsZW1lbnRzIGluIHRoZSBgbGF5ZXJzYCBhcnJheSB3aXRoaW4gdGhlaXIgcmFuZ2VzLFxyXG4gIC8vIGJhc2VkIG9uIG1vdXNlIG9yIG1vdGlvbiBpbnB1dFxyXG4gIC8vXHJcbiAgLy8gUGFyYW1ldGVyc1xyXG4gIC8vXHJcbiAgLy8gIGUgLSBtb3VzZW1vdmUgb3IgZGV2aWNlbW90aW9uIGV2ZW50XHJcbiAgLy9cclxuICAvLyByZXR1cm5zIG5vdGhpbmdcclxuICBmdW5jdGlvbiBwbGF4aWZpZXIoZSkge1xyXG4gICAgaWYgKG5ldyBEYXRlKCkuZ2V0VGltZSgpIDwgbGFzdFJlbmRlciArIGRlbGF5KSByZXR1cm47XHJcbiAgICAgIGxhc3RSZW5kZXIgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuXHJcbiAgICB2YXIgbGVmdE9mZnNldCA9IChwbGF4QWN0aXZpdHlUYXJnZXQub2Zmc2V0KCkgIT0gbnVsbCkgPyBwbGF4QWN0aXZpdHlUYXJnZXQub2Zmc2V0KCkubGVmdCA6IDAsXHJcbiAgICAgICAgdG9wT2Zmc2V0ICA9IChwbGF4QWN0aXZpdHlUYXJnZXQub2Zmc2V0KCkgIT0gbnVsbCkgPyBwbGF4QWN0aXZpdHlUYXJnZXQub2Zmc2V0KCkudG9wIDogMCxcclxuICAgICAgICB4ICAgICAgICAgID0gZS5wYWdlWC1sZWZ0T2Zmc2V0LFxyXG4gICAgICAgIHkgICAgICAgICAgPSBlLnBhZ2VZLXRvcE9mZnNldDtcclxuXHJcbiAgICBpZiAoIWluVmlld3BvcnQobGF5ZXJzWzBdLm9ialswXS5wYXJlbnROb2RlKSkgcmV0dXJuO1xyXG5cclxuICAgIGlmKG1vdmVhYmxlKCkpe1xyXG4gICAgICBpZihlLmdhbW1hID09PSB1bmRlZmluZWQpe1xyXG4gICAgICAgIGlnbm9yZU1vdmVhYmxlID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgdmFsdWVzID0gdmFsdWVzRnJvbU1vdGlvbihlKTtcclxuXHJcbiAgICAgIC8vIEFkbWl0dGVkbHkgZnV6enkgbWVhc3VyZW1lbnRzXHJcbiAgICAgIHggPSB2YWx1ZXMueCAvIG1vdGlvbkRlZ3JlZXM7XHJcbiAgICAgIHkgPSB2YWx1ZXMueSAvIG1vdGlvbkRlZ3JlZXM7XHJcbiAgICAgIC8vIEVuc3VyZSBub3Qgb3V0c2lkZSBvZiBleHBlY3RlZCByYW5nZSwgLTEgdG8gMVxyXG4gICAgICB4ID0geCA8IG1vdGlvbk1pbiA/IG1vdGlvbk1pbiA6ICh4ID4gbW90aW9uTWF4ID8gbW90aW9uTWF4IDogeCk7XHJcbiAgICAgIHkgPSB5IDwgbW90aW9uTWluID8gbW90aW9uTWluIDogKHkgPiBtb3Rpb25NYXggPyBtb3Rpb25NYXggOiB5KTtcclxuICAgICAgLy8gTm9ybWFsaXplIGZyb20gLTEgdG8gMSA9PiAwIHRvIDFcclxuICAgICAgeCA9ICh4ICsgMSkgLyAyO1xyXG4gICAgICB5ID0gKHkgKyAxKSAvIDI7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGhSYXRpbyA9IHgvKChtb3ZlYWJsZSgpID09PSB0cnVlKSA/IG1vdGlvbk1heCA6IHBsYXhBY3Rpdml0eVRhcmdldC53aWR0aCgpKSxcclxuICAgICAgICB2UmF0aW8gPSB5LygobW92ZWFibGUoKSA9PT0gdHJ1ZSkgPyBtb3Rpb25NYXggOiBwbGF4QWN0aXZpdHlUYXJnZXQuaGVpZ2h0KCkpLFxyXG4gICAgICAgIGxheWVyLCBpO1xyXG5cclxuICAgIGZvciAoaSA9IGxheWVycy5sZW5ndGg7IGktLTspIHtcclxuICAgICAgbGF5ZXIgPSBsYXllcnNbaV07XHJcbiAgICAgIGlmKG9wdGlvbnMudXNlVHJhbnNmb3JtICYmICFsYXllci5iYWNrZ3JvdW5kKXtcclxuICAgICAgICBuZXdYID0gbGF5ZXIudHJhbnNmb3JtU3RhcnRYICsgbGF5ZXIuaW52ZXJzaW9uRmFjdG9yKihsYXllci54UmFuZ2UqaFJhdGlvKTtcclxuICAgICAgICBuZXdZID0gbGF5ZXIudHJhbnNmb3JtU3RhcnRZICsgbGF5ZXIuaW52ZXJzaW9uRmFjdG9yKihsYXllci55UmFuZ2UqdlJhdGlvKTtcclxuICAgICAgICBuZXdaID0gbGF5ZXIudHJhbnNmb3JtU3RhcnRaO1xyXG4gICAgICAgIGxheWVyLm9ialxyXG4gICAgICAgICAgICAuY3NzKHsndHJhbnNmb3JtJzondHJhbnNsYXRlM2QoJytuZXdYKydweCwnK25ld1krJ3B4LCcrbmV3WisncHgpJ30pO1xyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICBuZXdYID0gbGF5ZXIuc3RhcnRYICsgbGF5ZXIuaW52ZXJzaW9uRmFjdG9yKihsYXllci54UmFuZ2UqaFJhdGlvKTtcclxuICAgICAgICBuZXdZID0gbGF5ZXIuc3RhcnRZICsgbGF5ZXIuaW52ZXJzaW9uRmFjdG9yKihsYXllci55UmFuZ2UqdlJhdGlvKTtcclxuICAgICAgICBpZihsYXllci5iYWNrZ3JvdW5kKSB7XHJcbiAgICAgICAgICBsYXllci5vYmpcclxuICAgICAgICAgICAgLmNzcygnYmFja2dyb3VuZC1wb3NpdGlvbicsIG5ld1grJ3B4ICcrbmV3WSsncHgnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGF5ZXIub2JqXHJcbiAgICAgICAgICAgIC5jc3MoJ2xlZnQnLCBuZXdYKVxyXG4gICAgICAgICAgICAuY3NzKCd0b3AnLCBuZXdZKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gICQucGxheCA9IHtcclxuICAgIC8vIEJlZ2luIHBhcmFsbGF4aW5nXHJcbiAgICAvL1xyXG4gICAgLy8gUGFyYW1ldGVyc1xyXG4gICAgLy9cclxuICAgIC8vICBvcHRzIC0gb3B0aW9ucyBmb3IgcGxheFxyXG4gICAgLy8gICAgYWN0aXZpdHlUYXJnZXQgLSBvcHRpb25hbDsgcGxheCB3aWxsIG9ubHkgd29yayB3aXRoaW4gdGhlIGJvdW5kcyBvZiB0aGlzIGVsZW1lbnQsIGlmIHN1cHBsaWVkLlxyXG4gICAgLy9cclxuICAgIC8vICBFeGFtcGxlc1xyXG4gICAgLy9cclxuICAgIC8vICAgICQucGxheC5lbmFibGUoeyBcImFjdGl2aXR5VGFyZ2V0XCI6ICQoJyNteVBsYXhEaXYnKX0pXHJcbiAgICAvLyAgICAjIHBsYXggb25seSBoYXBwZW5zIHdoZW4gdGhlIG1vdXNlIGlzIG92ZXIgI215UGxheERpdlxyXG4gICAgLy9cclxuICAgIC8vIHJldHVybnMgbm90aGluZ1xyXG4gICAgZW5hYmxlOiBmdW5jdGlvbihvcHRzKXtcclxuICAgICAgaWYgKG9wdHMpIHtcclxuICAgICAgICBpZiAob3B0cy5hY3Rpdml0eVRhcmdldCkgcGxheEFjdGl2aXR5VGFyZ2V0ID0gb3B0cy5hY3Rpdml0eVRhcmdldCB8fCAkKHdpbmRvdyk7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRzLmd5cm9SYW5nZSA9PT0gJ251bWJlcicgJiYgb3B0cy5neXJvUmFuZ2UgPiAwKSBtb3Rpb25EZWdyZWVzID0gb3B0cy5neXJvUmFuZ2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHBsYXhBY3Rpdml0eVRhcmdldC5iaW5kKCdtb3VzZW1vdmUucGxheCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgcGxheGlmaWVyKGUpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlmKG1vdmVhYmxlKCkpe1xyXG4gICAgICAgIHdpbmRvdy5vbmRldmljZW9yaWVudGF0aW9uID0gZnVuY3Rpb24oZSl7cGxheGlmaWVyKGUpO307XHJcbiAgICAgIH1cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIFN0b3AgcGFyYWxsYXhpbmdcclxuICAgIC8vXHJcbiAgICAvLyAgRXhhbXBsZXNcclxuICAgIC8vXHJcbiAgICAvLyAgICAkLnBsYXguZGlzYWJsZSgpXHJcbiAgICAvLyAgICAjIHBsYXggbm8gbG9uZ2VyIHJ1bnNcclxuICAgIC8vXHJcbiAgICAvLyAgICAkLnBsYXguZGlzYWJsZSh7IFwiY2xlYXJMYXllcnNcIjogdHJ1ZSB9KVxyXG4gICAgLy8gICAgIyBwbGF4IG5vIGxvbmdlciBydW5zIGFuZCBhbGwgbGF5ZXJzIGFyZSBmb3Jnb3R0ZW5cclxuICAgIC8vXHJcbiAgICAvLyByZXR1cm5zIG5vdGhpbmdcclxuICAgIGRpc2FibGU6IGZ1bmN0aW9uKG9wdHMpe1xyXG4gICAgICAkKGRvY3VtZW50KS51bmJpbmQoJ21vdXNlbW92ZS5wbGF4Jyk7XHJcbiAgICAgIHdpbmRvdy5vbmRldmljZW9yaWVudGF0aW9uID0gdW5kZWZpbmVkO1xyXG4gICAgICBpZiAob3B0cyAmJiB0eXBlb2Ygb3B0cy5yZXN0b3JlUG9zaXRpb25zID09PSAnYm9vbGVhbicgJiYgb3B0cy5yZXN0b3JlUG9zaXRpb25zKSB7XHJcbiAgICAgICAgZm9yKHZhciBpID0gbGF5ZXJzLmxlbmd0aDsgaS0tOykge1xyXG4gICAgICAgICAgbGF5ZXIgPSBsYXllcnNbaV07XHJcbiAgICAgICAgICBpZihvcHRpb25zLnVzZVRyYW5zZm9ybSAmJiAhbGF5ZXIuYmFja2dyb3VuZCl7XHJcbiAgICAgICAgICAgIGxheWVyLm9ialxyXG4gICAgICAgICAgICAgICAgLmNzcygndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZTNkKCcrbGF5ZXIudHJhbnNmb3JtT3JpZ2luWCsncHgsJytsYXllci50cmFuc2Zvcm1PcmlnaW5ZKydweCwnK2xheWVyLnRyYW5zZm9ybU9yaWdpblorJ3B4KScpXHJcbiAgICAgICAgICAgICAgICAuY3NzKCd0b3AnLCBsYXllci5vcmlnaW5ZKTtcclxuICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBpZihsYXllcnNbaV0uYmFja2dyb3VuZCkge1xyXG4gICAgICAgICAgICAgIGxheWVyLm9iai5jc3MoJ2JhY2tncm91bmQtcG9zaXRpb24nLCBsYXllci5vcmlnaW5YKydweCAnK2xheWVyLm9yaWdpblkrJ3B4Jyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgbGF5ZXIub2JqXHJcbiAgICAgICAgICAgICAgICAuY3NzKCdsZWZ0JywgbGF5ZXIub3JpZ2luWClcclxuICAgICAgICAgICAgICAgIC5jc3MoJ3RvcCcsIGxheWVyLm9yaWdpblkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmIChvcHRzICYmIHR5cGVvZiBvcHRzLmNsZWFyTGF5ZXJzID09PSAnYm9vbGVhbicgJiYgb3B0cy5jbGVhckxheWVycykgbGF5ZXJzID0gW107XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgaWYgKHR5cGVvZiBlbmRlciAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICQuZW5kZXIoJC5mbiwgdHJ1ZSk7XHJcbiAgfVxyXG5cclxufSkvKihmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIHR5cGVvZiBqUXVlcnkgIT09ICd1bmRlZmluZWQnID8galF1ZXJ5IDogZW5kZXI7XHJcbn0oKSkqLztcclxuIiwiZGVmaW5lKCdqcXVlcnkuc2xpZGVyYm94JyxbJ2pxdWVyeScsJ3VuZGVyc2NvcmUnLFxyXG4gICdqcXVlcnkuZWFzaW5nJ10sZnVuY3Rpb24oJCxfKXtcclxuICAvL+a7keWKqOaYvuekuuS4gOS4quWIl+ihqFxyXG4gIHZhciBTbGlkZXJCb3ggPSBmdW5jdGlvbihvcHQpe1xyXG4gICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQodHJ1ZSx7fSxhcmd1bWVudHMuY2FsbGVlLm9wdGlvbnMsb3B0KTtcclxuICAgIHRoaXMuJGVsID0gJChvcHQuZWwpO1xyXG4gICAgdGhpcy5pbml0KCk7XHJcbiAgfVxyXG4gICQuZXh0ZW5kKFNsaWRlckJveC5wcm90b3R5cGUse1xyXG4gICAgaW5pdCA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgIHRoaXMuJGVsLmNzcyh7XHJcbiAgICAgICAgcG9zaXRpb246J3JlbGF0aXZlJyxcclxuICAgICAgICBvdmVyZmxvdzonaGlkZGVuJ1xyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy4kaXRlbXMgPSB0aGlzLiRlbC5jaGlsZHJlbigpLmRldGFjaCgpLmFkZENsYXNzKCd1aS1zbGlkZXJib3gtaXRlbScpO1xyXG4gICAgICBpZih0aGlzLm9wdGlvbnMuZGlyZWN0aW9uID09IFwidmVydGljYWxcIikgdGhpcy4kaXRlbXMuY3NzKHtmbG9hdDonbGVmdCd9KTtcclxuICAgICAgdGhpcy4kaXRlbUJveCA9ICQoJzxkaXYgY2xhc3M9XCJ1aS1zbGlkZXJib3gtYm94XCI+PC9kaXY+JykuY3NzKHtcclxuICAgICAgICBwb3NpdGlvbjonYWJzb2x1dGUnLGxlZnQ6MCx0b3A6MFxyXG4gICAgICB9KS5hcHBlbmQodGhpcy4kaXRlbXMpLmFwcGVuZFRvKHRoaXMuJGVsKTtcclxuXHJcbiAgICAgIGlmKHRoaXMub3B0aW9ucy5kaXJlY3Rpb24gPT0gXCJob3Jpem9udGFsXCIpIHRoaXMuJGl0ZW1Cb3guY3NzKHt3aWR0aDonMTAwJSd9KTtcclxuXHJcbiAgICAgIHRoaXMuY3VycmVudCA9IDA7XHJcbiAgICAgIHZhciB3aWR0aCA9IHRoaXMuJGl0ZW1zLmVxKDApLm91dGVyV2lkdGgodHJ1ZSksXHJcbiAgICAgICAgICBoZWlnaHQgPSB0aGlzLiRpdGVtcy5lcSgwKS5vdXRlckhlaWdodCh0cnVlKTtcclxuICAgICAgdGhpcy5vcHRpb25zLml0ZW0gPSB7XHJcbiAgICAgICAgd2lkdGggOiB3aWR0aCxcclxuICAgICAgICBoZWlnaHQgOiBoZWlnaHRcclxuICAgICAgfVxyXG4gICAgICBpZih0aGlzLm9wdGlvbnMuZGlyZWN0aW9uID09IFwiaG9yaXpvbnRhbFwiKXtcclxuICAgICAgICB0aGlzLiRpdGVtQm94LmNzcyh7aGVpZ2h0OmhlaWdodCp0aGlzLiRpdGVtcy5sZW5ndGh9KTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgdGhpcy4kaXRlbUJveC5jc3Moe3dpZHRoOndpZHRoKnRoaXMuJGl0ZW1zLmxlbmd0aH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLiRlbC5jc3Moe1xyXG4gICAgICAgIHdpZHRoIDogd2lkdGgsXHJcbiAgICAgICAgaGVpZ2h0IDogaGVpZ2h0XHJcbiAgICAgIH0pLmFkZENsYXNzKCd1aS1zbGlkZXJib3gnKTtcclxuICAgICAgdGhpcy5pbml0Q29udHJvbCgpO1xyXG4gICAgICB0aGlzLnNsaWRlcigwKTtcclxuICAgICAgaWYodGhpcy5vcHRpb25zLmF1dG8pe1xyXG4gICAgICAgIGlmKHRoaXMub3B0aW9ucy5ob3ZlclBhdXNlKXtcclxuICAgICAgICAgIHRoaXMuJGVsLmhvdmVyKCQucHJveHkodGhpcy5jbG9zZUF1dG8sdGhpcyksJC5wcm94eSh0aGlzLm9wZW5BdXRvLHRoaXMpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5vcGVuQXV0bygpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgaW5pdENvbnRyb2wgOiBmdW5jdGlvbigpe1xyXG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICBpZighdGhpcy5vcHRpb25zLmNvbnRyb2wpe1xyXG4gICAgICAgIHRoaXMuJGNvbnRyb2xCb3ggPSAkKCc8ZGl2PicpO1xyXG4gICAgICAgIHJldHVybiA7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy4kY29udHJvbEJveCA9ICQoJzxkaXYgY2xhc3M9XCJ1aS1zbGlkZXJib3gtY29udHJvbFwiPjwvZGl2PicpLmFwcGVuZFRvKHRoaXMuJGVsKTtcclxuICAgICAgdGhpcy4kY29udHJvbEJveC5jc3Moe1xyXG4gICAgICAgIHBvc2l0aW9uOidhYnNvbHV0ZSdcclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMuJGl0ZW1zLmVhY2goZnVuY3Rpb24oaSl7XHJcbiAgICAgICAgdmFyICRjdDtcclxuICAgICAgICBpZighIV90aGlzLm9wdGlvbnMuY3JlYXRlQ29udHJvbCl7XHJcbiAgICAgICAgICAkY3QgPSBfdGhpcy5vcHRpb25zLmNyZWF0ZUNvbnRyb2woJCh0aGlzKSxpKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICRjdCA9ICQoJzxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj4nK2krJzwvYT4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgX3RoaXMuJGNvbnRyb2xCb3guYXBwZW5kKCRjdCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLiRjb250cm9sQm94Lm9uKHRoaXMub3B0aW9ucy5ldmVudFR5cGUsJ2EnLGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcclxuICAgICAgICBfdGhpcy5zbGlkZXIoJHRoaXMuaW5kZXgoKSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLiRlbC5vbignc2xpZGVyJyxmdW5jdGlvbihlKXtcclxuICAgICAgICBfdGhpcy4kY29udHJvbEJveC5jaGlsZHJlbigpLmVxKGUuaW5kZXgpLmFkZENsYXNzKCdhY3RpdmUnKVxyXG4gICAgICAgIC5zaWJsaW5ncygnLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgc2xpZGVyIDogZnVuY3Rpb24oaW5kZXgsZGlyZWN0aW9uKXtcclxuICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgdmFyIGZ4ID0gdGhpcy5vcHRpb25zLmZ4O1xyXG5cclxuICAgICAgaW5kZXggPSAodGhpcy4kaXRlbXMubGVuZ3RoK2luZGV4KSAlIHRoaXMuJGl0ZW1zLmxlbmd0aFxyXG4gICAgICBcclxuICAgICAgaWYodGhpcy5vcHRpb25zLmRpcmVjdGlvbiA9PSBcImhvcml6b250YWxcIil7XHJcbiAgICAgICAgZW5kQ3NzID0ge3RvcDotdGhpcy5vcHRpb25zLml0ZW0uaGVpZ2h0KmluZGV4fVxyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICBlbmRDc3MgPSB7bGVmdDotdGhpcy5vcHRpb25zLml0ZW0ud2lkdGgqaW5kZXh9XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy4kaXRlbUJveC5zdG9wKHRydWUpLmFuaW1hdGUoZW5kQ3NzLHtcclxuICAgICAgICBkdXJhdGlvbiA6IGZ4LmR1cmF0aW9uLFxyXG4gICAgICAgIGVhc2luZyA6IGZ4LmVhc2luZ1xyXG4gICAgICB9KTtcclxuICAgICAgdmFyIGV2ZW50ID0gJC5FdmVudCgnc2xpZGVyJyx7aW5kZXggOiBpbmRleH0pO1xyXG4gICAgICB0aGlzLiRlbC50cmlnZ2VyKGV2ZW50KTtcclxuICAgICAgdGhpcy5jdXJyZW50ID0gaW5kZXg7XHJcbiAgICB9LFxyXG4gICAgcHJldiA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHRoaXMuc2xpZGVyKHRoaXMuY3VycmVudC0xKTtcclxuICAgIH0sXHJcbiAgICBuZXh0IDogZnVuY3Rpb24oKXtcclxuICAgICAgdGhpcy5zbGlkZXIodGhpcy5jdXJyZW50KzEpO1xyXG4gICAgfSxcclxuICAgIG9wZW5BdXRvOiBmdW5jdGlvbigpe1xyXG4gICAgICBjbGVhckludGVydmFsKHRoaXMudGltZXIpO1xyXG4gICAgICB0aGlzLnRpbWVyID0gc2V0SW50ZXJ2YWwoJC5wcm94eSh0aGlzLm5leHQsdGhpcyksdGhpcy5vcHRpb25zLmRlbGF5KTtcclxuICAgIH0sXHJcbiAgICBjbG9zZUF1dG86IGZ1bmN0aW9uKCl7XHJcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcik7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgJC5leHRlbmQoU2xpZGVyQm94LHtcclxuICAgIG9wdGlvbnMgOiB7XHJcbiAgICAgIGRpcmVjdGlvbiA6ICd2ZXJ0aWNhbCcsLy9ob3Jpem9udGFsLHZlcnRpY2FsXHJcbiAgICAgIGV2ZW50VHlwZSA6ICdjbGljaycsXHJcbiAgICAgIGRpc3BsYXlOdW1iZXIgOiAxLFxyXG4gICAgICBjb250cm9sIDogdHJ1ZSxcclxuICAgICAgYXV0byA6IHRydWUsXHJcbiAgICAgIGhvdmVyUGF1c2U6IHRydWUsXHJcbiAgICAgIGRlbGF5IDogMzAwMCxcclxuICAgICAgZnggOiB7XHJcbiAgICAgICAgZHVyYXRpb24gOiA0MDAsXHJcbiAgICAgICAgZWFzaW5nIDogJ2Vhc2VPdXRFeHBvJ1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gICQuZm4uZXh0ZW5kKHtcclxuICAgIHNsaWRlcmJveCA6IGZ1bmN0aW9uKG9wdCl7XHJcbiAgICAgIG9wdCA9IG9wdCB8fCB7fTtcclxuICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYXJndW1lbnRzKTtcclxuICAgICAgYXJncy5zaGlmdCgpO1xyXG4gICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcclxuICAgICAgICB2YXIgZGF0YSA9ICR0aGlzLmRhdGEoJ3NsaWRlcmJveCcpO1xyXG5cclxuICAgICAgICBpZigkLnR5cGUob3B0KSA9PSAnb2JqZWN0Jyl7XHJcbiAgICAgICAgICBvcHQgPSAkLmV4dGVuZCh7fSxvcHQse2VsOiR0aGlzfSk7XHJcbiAgICAgICAgICBkYXRhID0gbmV3IFNsaWRlckJveChvcHQpO1xyXG4gICAgICAgICAgJHRoaXMuZGF0YSgnc2xpZGVyYm94JyxkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoJC50eXBlKG9wdCkgPT0gJ3N0cmluZycpIGRhdGFbb3B0XS5hcHBseShkYXRhLGFyZ3MpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBTbGlkZXJCb3hcclxuXHJcbn0pOyIsImRlZmluZSgnanF1ZXJ5LndhdGVyZmFsbCcsWydqcXVlcnknLCd1bmRlcnNjb3JlJyxcclxuICAnanF1ZXJ5LmVhc2luZyddLGZ1bmN0aW9uKCQsXyl7XHJcbiAgLy/nroDljZXngJHluIPmtYHlrp7njrBcclxuICB2YXIgV2F0ZXJmYWxsID0gZnVuY3Rpb24ob3B0KXtcclxuICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUse30sV2F0ZXJmYWxsLm9wdGlvbnMsb3B0KTtcclxuICAgIHRoaXMuJGVsID0gJChvcHQuZWwpLmNzcyh7cG9zaXRpb246J3JlbGF0aXZlJ30pO1xyXG4gICAgdmFyIF9oZWlnaHRzID0gW107XHJcbiAgICAkLmV4dGVuZCh0aGlzLHtcclxuICAgICAgY3JlYXRlSGVpZ2h0IDogZnVuY3Rpb24oKXtcclxuICAgICAgICBfaGVpZ2h0cyA9IG5ldyBBcnJheSgpO1xyXG4gICAgICAgICQuZWFjaChfLnJhbmdlKHRoaXMub3B0aW9ucy5jb2x1bW4pLGZ1bmN0aW9uKGluZGV4LGFyKXtcclxuICAgICAgICAgIF9oZWlnaHRzLnB1c2goMClcclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuICAgICAgZ2V0SGVpZ2h0IDogZnVuY3Rpb24oaW5kZXgpe1xyXG4gICAgICAgIHJldHVybiBfaGVpZ2h0c1tpbmRleF0gfHwgX2hlaWdodHM7XHJcbiAgICAgIH0sXHJcbiAgICAgIHNldEhlaWdodCA6IGZ1bmN0aW9uKGluZGV4LGhlaWdodCl7XHJcbiAgICAgICAgX2hlaWdodHNbaW5kZXhdID0gaGVpZ2h0O1xyXG4gICAgICB9LFxyXG4gICAgICBnZXRNaW5IZWlnaHQgOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHJldHVybiBNYXRoLm1pbi5hcHBseShudWxsLF9oZWlnaHRzKTtcclxuICAgICAgfSxcclxuICAgICAgZ2V0TWF4SGVpZ2h0IDogZnVuY3Rpb24oKXtcclxuICAgICAgICByZXR1cm4gTWF0aC5tYXguYXBwbHkobnVsbCxfaGVpZ2h0cyk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGdldE1pbkluZGV4IDogZnVuY3Rpb24oKXtcclxuICAgICAgICByZXR1cm4gXyhfaGVpZ2h0cykuaW5kZXhPZih0aGlzLmdldE1pbkhlaWdodCgpKSB8fCAwO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmNyZWF0ZUhlaWdodCgpO1xyXG4gICAgdGhpcy5pbml0KCk7XHJcbiAgfVxyXG4gICQuZXh0ZW5kKFdhdGVyZmFsbC5wcm90b3R5cGUse1xyXG4gICAgaW5pdCA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgIGxpc3QgPSB0aGlzLiRlbC5jaGlsZHJlbigpLmRldGFjaCgpLnRvQXJyYXkoKTtcclxuICAgICAgX3RoaXMuYXBwZW5kKGxpc3QpO1xyXG4gICAgfSxcclxuICAgIGFwcGVuZCA6IGZ1bmN0aW9uKGxpc3Qpe1xyXG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICBpZihsaXN0IGluc3RhbmNlb2YgJCl7XHJcbiAgICAgICAgbGlzdCA9IGxpc3QudG9BcnJheSgpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKCEkLmlzQXJyYXkobGlzdCkpe1xyXG4gICAgICAgIGxpc3QgPSBbbGlzdF07XHJcbiAgICAgIH1cclxuICAgICAgJC5lYWNoKGxpc3QsZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgJGl0ZW0gPSAkKHRoaXMpLmNzcyh7dmlzaWJpbGl0eTonaGlkZGVuJ30pLmFwcGVuZFRvKF90aGlzLiRlbCk7XHJcbiAgICAgICAgdmFyIGl0ZW1BdHRyID0ge1xyXG4gICAgICAgICAgd2lkdGggOiAkaXRlbS5vdXRlcldpZHRoKHRydWUpLFxyXG4gICAgICAgICAgaGVpZ2h0IDogJGl0ZW0ub3V0ZXJIZWlnaHQodHJ1ZSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBpbmRleCA9IF90aGlzLmdldE1pbkluZGV4KCk7XHJcbiAgICAgICAgdmFyIG1pbkhlaWdodCA9IF90aGlzLmdldE1pbkhlaWdodCgpO1xyXG5cclxuICAgICAgICAkaXRlbS5jc3Moe1xyXG4gICAgICAgICAgcG9zaXRpb24gOiAnYWJzb2x1dGUnLFxyXG4gICAgICAgICAgbGVmdCA6IGluZGV4Kml0ZW1BdHRyLndpZHRoLFxyXG4gICAgICAgICAgdG9wIDogbWluSGVpZ2h0LFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIF90aGlzLnNldEhlaWdodChpbmRleCxtaW5IZWlnaHQraXRlbUF0dHIuaGVpZ2h0KTtcclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMuJGVsLmhlaWdodCh0aGlzLmdldE1heEhlaWdodCgpKTtcclxuICAgICAgdGhpcy5zaG93KGxpc3QpO1xyXG4gICAgfSxcclxuICAgIHNob3cgOiBmdW5jdGlvbihsaXN0KXtcclxuICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgdmFyIGZ4ID0gX3RoaXMub3B0aW9ucy5meDtcclxuICAgICAgJC5lYWNoKF90aGlzLm9wdGlvbnMuc29ydChsaXN0KSxmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciAkaXRlbSA9ICQodGhpcyk7XHJcbiAgICAgICAgX3RoaXMuJGVsLmRlbGF5KGZ4LmRlbGF5KS5xdWV1ZShmdW5jdGlvbigpe1xyXG4gICAgICAgICAgdmFyIHBvc2l0aW9uID0gJGl0ZW0ucG9zaXRpb24oKTtcclxuICAgICAgICAgIHZhciBmcm9tQ3NzID0gJC5leHRlbmQoe3Zpc2liaWxpdHk6J3Zpc2libGUnfSxwb3NpdGlvbixfdGhpcy5vcHRpb25zLmZyb20ocG9zaXRpb24sJGl0ZW0pKTtcclxuICAgICAgICAgIHZhciB0b0NzcyA9ICQuZXh0ZW5kKHBvc2l0aW9uLF90aGlzLm9wdGlvbnMudG8ocG9zaXRpb24sJGl0ZW0pKTtcclxuICAgICAgICAgICRpdGVtLmNzcyhmcm9tQ3NzKS5hbmltYXRlKHRvQ3NzLHtcclxuICAgICAgICAgICAgZHVyYXRpb24gOiBmeC5kdXJhdGlvbixcclxuICAgICAgICAgICAgZWFzaW5nIDogZnguZWFzaW5nXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgICQoX3RoaXMuJGVsKS5kZXF1ZXVlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIHJlZnJlc2ggOiBmdW5jdGlvbigpe1xyXG4gICAgICB0aGlzLmNyZWF0ZUhlaWdodCgpO1xyXG4gICAgICB0aGlzLmFwcGVuZCh0aGlzLiRlbC5jc3Moe2hlaWdodDowfSkuc3RvcCh0cnVlLHRydWUpLmNoaWxkcmVuKCkuZGV0YWNoKCkuc3RvcCh0cnVlLHRydWUpKTtcclxuICAgIH1cclxuICB9KTtcclxuICAkLmV4dGVuZChXYXRlcmZhbGwse1xyXG4gICAgb3B0aW9ucyA6IHtcclxuICAgICAgY29sdW1uIDogMixcclxuICAgICAgZnggOiB7XHJcbiAgICAgICAgZGVsYXkgOiAxMDAsXHJcbiAgICAgICAgZHVyYXRpb24gOiAyMDAsXHJcbiAgICAgICAgZWFzaW5nIDogJ2xpbmVhcidcclxuICAgICAgfSxcclxuICAgICAgZnJvbSA6IGZ1bmN0aW9uKHBvc2l0aW9uLCRpdGVtKXtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgbGVmdCA6IDMwMCxcclxuICAgICAgICAgIHRvcCA6IDAsXHJcbiAgICAgICAgICBvcGFjaXR5IDogMFxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgdG8gOiBmdW5jdGlvbihwb3NpdGlvbiwkaXRlbSl7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIGxlZnQgOiBwb3NpdGlvbi5sZWZ0LFxyXG4gICAgICAgICAgdG9wIDogcG9zaXRpb24udG9wLFxyXG4gICAgICAgICAgb3BhY2l0eSA6IDFcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHNvcnQgOiBmdW5jdGlvbihsaXN0KXtcclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAkLmZuLmV4dGVuZCh7XHJcbiAgICB3YXRlcmZhbGwgOiBmdW5jdGlvbihvcHQpe1xyXG4gICAgICBvcHQgPSBvcHQgfHwge307XHJcbiAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGFyZ3VtZW50cyk7XHJcbiAgICAgIGFyZ3Muc2hpZnQoKTtcclxuICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XHJcbiAgICAgICAgdmFyIGRhdGEgPSAkdGhpcy5kYXRhKCd3YXRlcmZhbGwnKTtcclxuXHJcbiAgICAgICAgaWYoJC50eXBlKG9wdCkgPT0gJ29iamVjdCcpe1xyXG4gICAgICAgICAgb3B0ID0gJC5leHRlbmQoe30sb3B0LHtlbDokdGhpc30pO1xyXG4gICAgICAgICAgZGF0YSA9IG5ldyBXYXRlcmZhbGwob3B0KTtcclxuICAgICAgICAgICR0aGlzLmRhdGEoJ3dhdGVyZmFsbCcsZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCQudHlwZShvcHQpID09ICdzdHJpbmcnKSBkYXRhW29wdF0uYXBwbHkoZGF0YSxhcmdzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gV2F0ZXJmYWxsXHJcblxyXG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
