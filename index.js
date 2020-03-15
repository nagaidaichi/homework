$(document).on('click','#add',function() {

  //入力内容があるかどうかのチェック
  if($('#inputTodo').val().length === 0) {
    return;
  };

  // タスクを追加
  $('#listItem').append(
      '<p class="task"><button type="button" class="delButton">-</button>' + $('#inputTodo').val() + '</p>'
    );
  
  //入力内容を空白にする
  $('#inputTodo').val("");

});

// タスクを削除する
$(document).on('click','.delButton',function() {
  $(this).closest('p').slideUp('slow');
});

//全削除
$(document).on('click','#reset',function(){
  $('.task').fadeOut(500);
});

