$(document).on('click','#add',function() {
  //入力内容があるかどうかのチェック
  if($('#inputTodo').val().length === 0) {
    return;
  };
  // タスクを追加、編集ボタン追加
  $('#listItem').append(
      '<p class="task"><input type="button" class="delButton" value="削除" >' + 
        '<span class="editTask">' + $('#inputTodo').val()  + '</span>' + '<input type="button" class="edit" value="編集">' + '</p>'
    );
  //入力内容を空白にする
  $('#inputTodo').val("");
  $('#inputTodo').focus();
});

// タスクを削除する
$(document).on('click','.delButton',function() {
  $(this).parent('p').remove();
});

//全削除
$(document).on('click','#reset',function(){
  $('.task').remove();
  $('#inputTodo').focus();
});
var f = false;
// 編集フォーム出現
$(document).on('click','.edit',function() {
  var index = $('.task').index($(this).parent());
  var todoContent = $(this).prev();
  var inputVal = todoContent.text();
  todoContent.hide();
  var editForm = `<div id="editForm_${index}"><input type="text" id="inputValue_${index}"><input type="button" id="confirm" value="確定" onclick="submitTodo(event)"></div>`;
  $(this).prev().prev().after(editForm);
  var editFormInput = $(`#inputValue_${index}`);
  $(editFormInput).focus();
  $(editFormInput).val(inputVal);
});

// 編集したTODOを確定させる
function submitTodo(e) {
  var target = e.target;
  var value = $(target).prev().val();
  if(value.length === 0) {
    return;
  };

  var editTask = $(target).parent().next();
  $(editTask).text(value);
  $(target).parent().remove();
  $(editTask).show();
};


