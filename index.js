$(document).on('click','#add',function() {
  //入力内容があるかどうかのチェック
  if($('#inputTodo').val().length === 0) {
    return;
  };
  // タスクを追加、編集ボタン追加
  var dragAndDropIvent = 
    'ondragstart="dragStarted(event)" ' + 
    'ondragenter="dragEnterd(event)" ' + 
    'ondragover="draggingOver(event)" ' + 
    'ondragleave="dragLeaved(event)" ' + 
    'ondrop="dropped(event)" ' + 
    'ondragend="dragFinish(event)" '
  $('#listItem').append(
    '<p class="task">' + 
      '<input type="button" class="delButton" value="削除" >' + 
      '<span class="editTask" draggable="true"' + dragAndDropIvent + '>' + $('#inputTodo').val()  + '</span>' + 
      '<input type="button" class="edit" value="編集">' + 
    '</p>'
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

// 編集フォーム出現
$(document).on('click','.edit',function() {
  var index = $('.task').index($(this).parent());
  var todoContent = $(this).prev();
  var inputVal = todoContent.text();
  todoContent.hide();
  var editForm = 
    `<div id="editForm_${index}">
      <input type="text" id="inputValue_${index}">
      <input type="button" id="confirm" value="確定" onclick="submitTodo(event)">
    </div>`;
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


// ドラッグアンドドロップ
var src = null;
function dragStarted(e) {
  src = e.target;
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/html",e.target.innerHTML);
}
function dragLeaved(e) {

}
function dragEnterd(e) {
  e.preventDefault();
}
function draggingOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}
function dropped(e) {
  e.preventDefault();
  e.stopPropagation();
  src.innerHTML = e.target.innerHTML;
  e.target.innerHTML = e.dataTransfer.getData("text/html");
  console.log("ok");
}
function dragFinish(e) {

}