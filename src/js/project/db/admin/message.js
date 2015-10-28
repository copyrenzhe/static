define(['jquery','underscore','jquery.ui'],function($,_){
  function ztCategoryModuleList(){
    var checkModule;
    $('#makeSure').on('click',function(){
        checkModule = [];
        $('input[type=checkbox]:checked').each(function(index, el) {
            checkModule.push($(el).attr('data-obj'));
        });
        window.sendDialogMessage('ztCategoryModuleList',{data:checkModule});
        window.closeDialog();
    })
  }

  function ztAdd(obj){
    var base_link = "./ztCategoryModuleList";
    $('select[name=cid]').on('change',function(){
      if($(this).val()=='0'){
        $('#addModule').attr('href','javascript:void(0);');
      }else{
        $('#addModule').attr('href',base_link+'/id/'+$(this).val());
      }
    });
    window.onDialogMessage('ztCategoryModuleList',function(data){
        
    })
  }

  function noticeCategoryIndex(){
    var temp = _.template([
        '<tr>',
          '<td></td>',
          '<td>',
            '<% if(!!pid){ %>|——<% } %>', 
            '<input type="text" class="form-control half" name="new[name][<%= id %>][]" />',
          '</td>',
          '<td>',
            '<% if(!!pid){ %>|——<% } %>',
            '<input type="text" class="form-control half" name="new[url][<%= id %>][]" />',
          '</td>',
          '<td>',
            '<% if(!!pid){ %>|——<% } %>',
            '<input type="text" class="form-control half" name="new[remark][<%= id %>][]" />',
          '</td>',
          '<td>',
            '<% if(!!pid){ %>|——<% } %>',
            '<select name="new[status][<%= id %>][]" id="" class="form-control valid" aria-invalid="false">',
              '<option value="1">启用</option>',
              '<option value="0">禁用</option>',
            '</select>',
          '</td>',
          '<td>',
            '<% if(!pid){ %>',
            '<a href="javascript:void(0);" class="btn-sm btn-blue childItem">添加子分类</a></td>',
            '<% } %>',
        '</tr>'
      ].join(""));
    $('body').on('click','#addCate',function(){
      var data = temp({id:0,pid:false});
      $('.sub-tr').before(data);
    });
    $('body').on('click','.childItem',function(){
      var id = $(this).parent().siblings().eq(0).find('input').val();
      var data = temp({id:id,pid:true});
      $(this).parents('tr').after(data);
    })
  }

  return {
    ztCategoryModuleList: ztCategoryModuleList,
    ztAdd:ztAdd,
    noticeCategoryIndex:noticeCategoryIndex
  }

});