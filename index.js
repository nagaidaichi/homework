$(document).on('click','#add',function() {
  //入力内容があるかどうかのチェック
  if($('#inputTodo').val().length === 0) {
    return;
  };
  // タスクを追加、編集ボタン追加
  $('#listItem').append(
      '<div id="display"><p class="task"><input type="button" class="delButton" value="削除" >' + 
        '<span class="editTask">' + $('#inputTodo').val()  + '</span>' + '<input type="button" class="editTask" value="編集">' + '</p></div>'
    );
  //入力内容を空白にする
  $('#inputTodo').val("");
  $('#inputTodo').focus();
});

// タスクを削除する
$(document).on('click','.delButton',function() {
    $(this).parent('p').fadeOut();
  
});
//全削除
$(document).on('click','#reset',function(){
  $('.task').fadeOut();
  $('#inputTodo').focus();
});

// 編集フォーム出現
$(document).on('click','.editTask',function() {
  if(!$(this).parent('p').attr('id')) {
    $(this).parent('p').attr('id','on');
    $('#on').parent('div').append('<div id="editForm"><input type="text" id="inputValue"><input type="button" id="confirm" value="確定"></div>');
    $('#inputValue').focus();
    var inputVal = $('#on').text();
    $('#inputValue').val(inputVal);
    $('#on').hide();
    
    // カーソルが外れたら、確定
    $('#inputValue').blur(function(){
      if($('#inputValue').val().length === 0) {
        return;
      };
      var value = $('#inputValue').val();
      $('#editForm').remove();
      $('#on').show();
      $('#on > span').text(value);
      $('p').removeAttr('id');
    });
  }
});
// 確定ボタンを押すと上書きされる
$(document).on('click','#confirm' ,function(){
  if($('#inputValue').val().length === 0) {
    return;
  };
  var value = $('#inputValue').val();
  $('#editForm').remove();
  $('#on').show();
  $('#on > span').text(value);
  $('p').removeAttr('id');
});

