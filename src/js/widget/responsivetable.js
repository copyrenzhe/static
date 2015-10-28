define('widget.responsivetable',['jquery','underscore','browser','jquery.ui','jquery.dropdown'],function($,_,browser){
  $.widget( "custom.responsivetable", {
		options: {
			stickyHeaderOffset: 0
		},
		_create: function() {
			this.element.addClass( "responsive-table" ).wrap('<div class="responsive-table-wrapper"/>');
			this.$wrap = this.element.parent();
			this.$table = this.$tables = this.element.find('>table');
			this.$head = this.$table.find('thead');
			this.$body = this.$table.find('tbody');
			this.initColumn();
			this.createToolbar();

			this.createStickyHeader();
			this.events();
			this.updateCheckState();
		},
		events: function(){
			var _this = this;
			this.$toolbar.on('change','input[type=checkbox]',function(){
				var $this = $(this);
				var checked = $this.prop('checked');
				var value = parseInt($this.val())+1;
				var $cells = _this.$tables.find('tr>:nth-child('+value+')')
				$cells.toggleClass('show',checked).toggleClass('hide',!checked);
			});
			$(window).on('resize',function(e){
				_.delay(function(){
					_this.$sticky.css({width:_this.element.width()});
				},0);
				_this.windowResize();
			});
			this.element.on('scroll',function(){
				_this.$sticky.scrollLeft(_this.element.scrollLeft());
			});
			this.$checkGroup.on('click',function(e){
				e.stopPropagation();
			});
			this.$toolbar.on('click','button[data-action=show-all]',function(){
				_this.$checkGroup.find('input[type=checkbox]:not(:checked)').prop('checked',true).trigger('change');
			});
		},
		initColumn: function(){
			var _this = this;
			this.$head.find('th').each(function(index){
				var $this = $(this);
				var data = $this.data();
				data.priority = data.priority || 1;
			});
			this.$body.children().each(function(){
				var idStart = 0;
				$(this).children().each(function(index){
					var $cell = $(this);
					var data = _this.$head.find('th').eq(index).data();
					$cell.addClass('priority'+data.priority);
				});
			});
		},
		createToolbar: function(){
			var _this = this;
			this.$toolbar = $(this._tollbarTemp());
			this.element.before(this.$toolbar);
			
			this.createCheckGroup();
		},
		createCheckGroup: function(){
			var _this = this;
			this.$checkGroup = $('<ul class="dropdown-menu">').appendTo(this.$toolbar.find('.dropdown'));
			this.$head.find('th').each(function(index){
				var $this = $(this);
				var data = $this.data();
				$this.data('priority',data.priority || 1);
				data = $this.data();
				$this.addClass('priority'+data.priority);
				_.extend(data,{_text:$this.text(),_index:index});
				var $li = $(_this._liTemp(data));
				_this.$checkGroup.append($li);
			});
		},
		updateCheckState: function(){
			var _this = this;
			this.$checkGroup.children().each(function(index){
				var $this = $(this);
				var $checkbox = $this.find('input[type=checkbox]');
				var $th = _this.$head.find('th:eq('+$checkbox.val()+')');
				$checkbox.prop('checked',$th.css('display') != "none");
			});
		},
		createStickyHeader: function(){
			//ie6及以下浏览器不支持fixed定位，所以不创建stickyHeader
			if(browser < 7){
				this.$sticky = $('<div>');
				return;
			}
			var _this = this;
			var $table = this.$table.clone();
			this.$tables = this.$tables.add($table);
			this.$sticky = $('<div class="sticky-table-header">').append($table);
			this.$table.before(this.$sticky);
			this.$sticky.css({
				height:this.$head.height()+1,
				width:this.element.width(),
				top: this.options.stickyHeaderOffset,
				visibility: 'hidden'
			});
			require(['jquery.waypoints'],function(){
				_this.element.waypoint({
					offset: _this.options.stickyHeaderOffset,
					handler: function(direction){
						if(direction == 'down'){
							_this.$sticky.css({
								visibility: 'visible',
								position: 'fixed'
							});
						}else{
							_this.$sticky.css({
								visibility: 'hidden'
							});
						}
					}
				});

			});
		},
		windowResize: _.debounce(function(){
			//ie 6,7,8修改列导致window resize修改列产生冲突,导致修改列失败，所以去除resize修改列功能
			if(browser > 8){
				this.$table.find('tr>.show').removeClass('show');
				this.$table.find('tr>.hide').removeClass('hide');
			}
			this.updateCheckState();
		},200),
		widget: function(){
			return this.$wrap;
		},
		_liTemp: _.template([
			'<li><label><input type="checkbox" name="column" value="<%=_index%>" /> <%= _text %></label></li>'
		].join('')),
		_tollbarTemp: _.template([
			'<div class="responsive-table-toolbar">',
				'<div class="btn-group dropdown">',
					'<button class="btn" data-action="show-all">显示全部</button>',
					' <button class="btn dropdown-toggle" data-toggle="dropdown">显示 <i class="fa"></i></button>',
				'</div>',
			'</div>'
		].join(''))
  });
	return $;
});