$(function(){
  $('.delete-btn').click(function(e){
      var target = $(e.target);
      var id = target.data('id');
      $.ajax({
          type:"DELETE",
          url:'/admin/delete?id='+ id
      }).done(function(result){

          if(result.success === 1){
              console.log('del succeed!');
              location.reload();
          }

      });
  });
});
