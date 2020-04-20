var STORAGE_KEY = 'TODO_APP';

function taskContentRenderer(content) {
  var dragAndDropIvent = 
   `ondragstart="dragStarted(event)"
    ondragenter="dragEnterd(event)"
    ondragover="draggingOver(event)"
    ondrop="dropped(event)"`;

  var taskContent =
    `<span class="editTask" draggable="true" ${dragAndDropIvent}> 
      ${content}
    </span>` 

  var taskElement =
  `<p class="task">
    <input type="button" class="delButton" value="削除" >
    ${taskContent}
    <input type="button" class="edit" value="編集">
  </p>`

  // タスクを追加、編集ボタン追加
  $('#listItem').append(taskElement);
}


function setTodoItemToLocalStorage(content) {
  var storageItem = localStorage.getItem(STORAGE_KEY);
  var nextStorageItem = storageItem ? `${storageItem},${content}` : content;
  localStorage.setItem(STORAGE_KEY,nextStorageItem);
}

$(document).on('click','#add',function() {
  //入力内容があるかどうかのチェック
  var content = $('#inputTodo').val();
  if(content.length === 0) {
    return;
  };

  taskContentRenderer(content);

  setTodoItemToLocalStorage(content)

  //入力内容を空白にする
  $('#inputTodo').val("");
  $('#inputTodo').focus();
});

// タスクを削除する

$(document).on('click','.delButton',function() {
  var taskItem = $(this).parent('p');
  taskItem.remove();
});

//全削除
$(document).on('click','#reset',function(){
  localStorage.removeItem(STORAGE_KEY);
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
  src = null;
  console.log("ok");
}

$(function(){
  if(localStorage.getItem(STORAGE_KEY)) {
    var storageItem = localStorage.getItem(STORAGE_KEY).split(',');
    storageItem.forEach(function(item){
    taskContentRenderer(item);
    });
  }
});