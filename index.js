var STORAGE_KEY = 'TODO_APP';

function taskContentRenderer(content) {
  var dragAndDropIvent = 
   `ondragstart="dragStarted(event)"
    ondragenter="dragEnterd(event)"
    ondragover="draggingOver(event)"
    ondrop="dropped(event)"
    `;

  var taskContent =
    `<span class="editTask"> 
      ${content}
    </span>` 

  var taskElement =
  `<p class="task" draggable="true" ${dragAndDropIvent}>
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
  localStorage.setItem(STORAGE_KEY, nextStorageItem);
}

$(document).on('click','#add',function() {
  var content = $('#inputTodo').val();
  if(content.length === 0) {
    return;
  };

  taskContentRenderer(content);

  setTodoItemToLocalStorage(content)

  $('#inputTodo').val("");
  $('#inputTodo').focus();
});

function removeTodoItemFromLocalStorage(index){
  var storageItem = localStorage.getItem(STORAGE_KEY).split(',');

  storageItem.splice(index, 1);
  localStorage.setItem(STORAGE_KEY, storageItem);

  if (!storageItem.length) {
    localStorage.removeItem(STORAGE_KEY);
  }
};

// タスクを削除する
$(document).on('click','.delButton',function() {
  var taskItem = $(this).parent('p');
  var index = $('.task').index(taskItem);
  removeTodoItemFromLocalStorage(index);
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
  var inputVal = todoContent.text().trim();
  todoContent.hide();
  var editForm = `
    <div id="editForm_${index}">
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
  // console.log(e.target);
  var target = e.target;
  var editFormValue = $(target).prev().val();
  var taskItem = $(target).parent().parent('.task');
  var editTaskClassElement = $(target).parent().next();
  var index = $('.task').index(taskItem);
  if(!editFormValue.length) {
    editTaskInLocalStorage(index,editFormValue);
    editTaskInView(editTaskClassElement,editFormValue,target);
    taskItem.remove();
  } else {
    editTaskInLocalStorage(index,editFormValue);
    editTaskInView(editTaskClassElement,editFormValue,target);
  }

};

function editTaskInLocalStorage(index,value) {
  var storageItem = localStorage.getItem(STORAGE_KEY).split(',');
  if (value) {
    storageItem.splice(index, 1, value);
    localStorage.setItem(STORAGE_KEY, storageItem);
  } else {
    storageItem.splice(index, 1);
    localStorage.setItem(STORAGE_KEY, storageItem);
  }

  return;
}

function editTaskInView(editTask,value,target) {
  $(editTask).text(value);
  $(target).parent().remove();
  $(editTask).show();
}

// ドラッグアンドドロップ
function dragStarted(e) { //e.targetは'.task'
  src = e.target.querySelector('span');
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text",src.textContent.trim());
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
  var target = e.target;
  if(!$(target).text()) { //input要素の上にドロップしたとき
    src = null;
    return;
  } else if(target.querySelector('span')) { //p要素（右側の空白部分）にドロップしたとき
    src = null;
    return;
  }
  var parent = $(target).parent();
  var sourceIndex = $('.task').index($(src).parent()); // 移動元のTODOのインデックス
  var destinationIndex = $('.task').index(parent); // 移動先のTODOのインデックス
  var sourceValue = src.textContent.trim();
  var destinationValue = target.textContent.trim();
  var storageItem = localStorage.getItem(STORAGE_KEY).split(',');

  sortInLocalStorage(storageItem,sourceIndex,destinationIndex,sourceValue,destinationValue);
  
  // TODO: valueだけを書き換えるようにしたい
  src.textContent = target.textContent.trim();
  target.textContent = e.dataTransfer.getData("text");
  src = null;
}

function sortInLocalStorage(storageItem,sourceIndex,destinationIndex,sourceValue,destinationValue) {
  storageItem.splice(sourceIndex, 1, destinationValue);
  storageItem.splice(destinationIndex, 1, sourceValue);
  localStorage.setItem(STORAGE_KEY, storageItem);
}

// 検索(TODO絞り込み)
$('#searchForm').keyup(function(){
  var searchValue = $(this).val();
  $('.task .editTask').each(function(){
    var todoValue = $(this).text();
    if (todoValue.indexOf(searchValue) !== -1){
      // 検索にヒットした場合の処理
      $(this).parent().show();

    } else {
      // 検索にヒットしなかった場合の処理
      $(this).parent().hide();
    }

  });
});


$(function(){
  if(localStorage.getItem(STORAGE_KEY)) {
    var storageItem = localStorage.getItem(STORAGE_KEY).split(',');
    storageItem.forEach(function(item){
      taskContentRenderer(item);
    });
  }
});