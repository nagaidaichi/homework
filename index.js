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

  var showChildTaskButton = '<button name="blank" onclick="inputFormForAddingChildTasksAppears(event)">▽</button>';

  var taskElement =
  `<p class="task" draggable="true" ${dragAndDropIvent}>
    ${showChildTaskButton}
    ${taskContent}
    <input name="blank" type="button" class="edit" value="編集">
    <input name="blank" type="button" class="delButton" value="削除">
    <ul>
      <li></li>
    </ul>
  </p>`

  // タスクを追加、編集ボタン追加
  $('#listItem').append(taskElement);
}

function setTodoItemToLocalStorage(todoName) {
  var storageItem = localStorage.getItem(STORAGE_KEY);
  // 乱数でid生成
  var id = Math.random().toString(32).substring(2);
  var content = JSON.stringify({
    id: id,
    name: todoName,
    parent: null,
  });

  var nextStorageItem;
  if (storageItem) {
    var parsedStorageItem = JSON.parse(storageItem);
    parsedStorageItem.push(content);
    nextStorageItem = parsedStorageItem;
  } else {
    nextStorageItem = [content];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextStorageItem));
}

$(document).on('click','#add',function() {
  var content = $('#inputTodo').val();
  if(!content.length) {
    return;
  };

  taskContentRenderer(content);

  setTodoItemToLocalStorage(content)

  $('#inputTodo').val("");
  $('#inputTodo').focus();
});

function removeTodoItemFromLocalStorage(index){
  var storageItem = localStorage.getItem(STORAGE_KEY).split(',');
  if (!storageItem) {
    return;
  }

  var parsedItem = JSON.parse(storageItem);
  parsedItem.splice(index, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedItem));

  if (!parsedItem.length) {
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

//全削除する
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
  var parsedItem = JSON.parse(storageItem);

  if (value) {
  furtherParsedItem = JSON.parse(parsedItem[index]);
    var furtherParsedItem = JSON.parse(parsedItem[index]);
    furtherParsedItem.name = value;
    var stringifiedItem = JSON.stringify(furtherParsedItem);
    parsedItem.splice(index, 1, stringifiedItem);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedItem));

  } else {
    parsedItem.splice(index, 1,);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedItem));
  }
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
    if($(target).attr('name')) { //input要素の上にドロップしたとき
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
  
  // ドラッグアンドドロップのローカルストレージ
  var storageItem = localStorage.getItem(STORAGE_KEY).split(',');
  var parsedItem = JSON.parse(storageItem);
  sortInLocalStorage(parsedItem,sourceIndex,destinationIndex,sourceValue,destinationValue);
  
  // TODO: valueだけを書き換える
  src.textContent = target.textContent.trim();
  target.textContent = e.dataTransfer.getData("text");
  src = null;
}

function sortInLocalStorage(parsedItem,sourceIndex,destinationIndex,sourceValue,destinationValue) {

  var parsedSourceItem = JSON.parse(parsedItem[sourceIndex]);
  parsedSourceItem.name = destinationValue;
  var stringifiedSourceItem = JSON.stringify(parsedSourceItem);
  parsedItem.splice(sourceIndex, 1, stringifiedSourceItem);

  var parsedDestinationItem = JSON.parse(parsedItem[destinationIndex]);
  parsedDestinationItem.name = sourceValue;
  var stringifiedDistinationItem = JSON.stringify(parsedDestinationItem);
  parsedItem.splice(destinationIndex, 1, stringifiedDistinationItem);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedItem));
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

// 子タスク入力フォーム出現
function inputFormForAddingChildTaskAppears(event) {
  console.log(event.target);
  var e = event.target;
  console.log(e);
  var taskItem = $(e).parent('.task');
  console.log(taskItem);
  var inputForm = `
  <p class='addChildTaskBox'>
  <input id='addChildTask' type="text" placeholder="子タスク">
  <button>追加</button>
  </p>`
  $(taskItem).append(inputForm);
  $('#addChildTask').focus();
};

$(function(){
  if(localStorage.getItem(STORAGE_KEY)) {
    var storageItem = JSON.parse(localStorage.getItem(STORAGE_KEY));
    storageItem.forEach(function(item){
      var parsedItem = JSON.parse(item);

      taskContentRenderer(parsedItem.name);
    });
  }
});