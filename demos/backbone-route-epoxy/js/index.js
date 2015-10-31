require(['jquery','underscore','backbone','backbone.epoxy','backbone.queryparams','jquery.clearInput'],
function($,underscore,Backbone,epoxy){
  if(window.browser>9){
    require(['prism'],$.noop);
  }
  /**
   * Epoxy.binding
   */

  var defaults = {
    firstName: "",
    lastName: "",
    email:"",
    fontSize:16,
    love:[],
    sex:0,
    year:1991,
    month:1,
    day:1
  }

  var Router = Backbone.Router.extend({
    controller : {
      "api" : {
        "search" : function(params){
          bindModel.set(params,{validate:true});
        }
      }
    }
  })
  window.router = new Router();
  router.route(/^([^\/]+)\/([^\/]+)\/?(\?.*)?$/,'all',function(controller,page,params){
    this.controller[controller] && 
    this.controller[controller][page] && 
    this.controller[controller][page](params);

  });
  var BindModel = Backbone.Epoxy.Model.extend({
    initialize : function(){
      this.on('invalid',function(model,msg,options){
        this.set(options.errorAttr,defaults[options.errorAttr]);
      });
      this.on('change',this.modelChange);
    },
    modelChange : _.throttle(function(){
      var params = this.toJSON();
      router.navigate(router.toFragment('api/search/',params));
      //console.log(decodeURIComponent($.param(params)));
    },1000),
    validate : function(attrs,options){
      if(!_.isArray(attrs.love)){
        options.errorAttr = "love";
        return "love is an Array";
      }
    },
    computeds : {
      fullName : function(){
        return this.get("firstName") +" "+ this.get("lastName");
      }
    }
  });
  window.bindModel = new BindModel(defaults);

  window.viewModel = new Backbone.Model({
    yearList : [
      {value:1991,label:"1991"},
      {value:1992,label:"1992"},
      {value:1993,label:"1993"}
    ],
    monthList : [
      {value:1,label:"1月"},
      {value:2,label:"2月"},
      {value:11,label:"11月"},
      {value:12,label:"12月"}
    ],
    dayList : []
  });

  bindModel.on('change:month',function(){
    var days = new Date(this.get('year'),this.get('month'),0).getDate();
    var dayList = [];

    _(days).times(function(index){
      var day = index+1;
      dayList.push({value:day,label:day+"日"});
    });
    viewModel.set('dayList',dayList);
  });

  var BindingView = Backbone.Epoxy.View.extend({
    el: "#app-luke",
    bindingFilters : {
      isEmail : function(email){
        return !/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test( email )
      }
    },
    bindingHandlers : {
      listLoves : function( $element, value ) {
        $element.text( value.join(", ") );
      }
    }
  });

  var view = new BindingView({
    model: bindModel,
    viewModel:viewModel
  });




  /**
   * list
   */
  var ajaxDatas = (function(){
    var list = [];
    _.each(_.range(97,123),function(code){
      var obj = {}
      var charval = String.fromCharCode(code);

      obj.charval = charval
      obj.chars = charval+charval+charval+charval+charval
      obj.phone = _.random(10000000,99999999);
      obj.mobile = '1'+_.random(1000000000,9999999999);
      obj.test1 = 'a'+_.random(1000000000,9999999999);
      obj.test2 = 'b'+_.random(1000000000,9999999999);
      obj.test3 = 'c'+_.random(1000000000,9999999999);
      obj.test4 = 'd'+_.random(1000000000,9999999999);
      obj.test5 = 'e'+_.random(1000000000,9999999999);
      obj.test6 = 'f'+_.random(1000000000,9999999999);
      list.push(obj);
    });
    return list;
  })();

  window.head = [
    {
      name:'字符',
      width:200,
      sort:true,
      template:'<%=charval%>'
    },
    {
      name:'字符串',
      width:200,
      sort:true,
      template:'<%=chars%>'
    },
    {
      name:'电话',
      width:200,
      sort:true,
      template:'<%=phone%>'
    },
    {
      name:'手机',
      width:200,
      sort:true,
      template:'<%=mobile%>'
    },
    {
      name:'测试1',
      width:200,
      sort:true,
      template:'<%=test1%>'
    },
    {
      name:'测试2',
      width:200,
      sort:true,
      template:'<%=test2%>'
    },
    {
      name:'测试3',
      width:200,
      sort:true,
      template:'<%=test3%>'
    },
    {
      name:'测试4',
      width:200,
      sort:true,
      template:'<%=test4%>'
    },
    {
      name:'测试5',
      width:200,
      sort:true,
      template:'<%=test5%>'
    },
    {
      name:'测试6',
      width:200,
      sort:true,
      template:'<%=test6%>'
    }
  ];


  Backbone.history.start({root:'api/search'});


});
