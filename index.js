var STORAGE_KEY = 'TODO_APP';

function taskContentRenderer(content,event,childTaskBox) {
  var dragAndDropIvent = 
   `ondragstart="dragStarted(event)"
    ondragenter="dragEnterd(event)"
    ondragover="draggingOver(event)"
    ondrop="dropped(event)"
    `;

  var taskContent =
    `<span class="editTask text"> 
      ${content}
    </span>` ;

  var showChildTaskButton = '<button name="blank" class="showChildTaskButton_style" onclick="inputFormForAddingChildTask(event)">▽</button>';

  var taskElement =
  `<li class="task" draggable="true" ${dragAndDropIvent}>
    ${showChildTaskButton}
    ${taskContent}
    <input name="blank" type="button" class="editButton edit" value="編集">
    <input name="blank" type="button" class="delButton delete" value="削除">
    <ul class="childTaskBox"></ul>
  </li>`;

  // タスクを追加、編集ボタン追加
  addTask(event,taskElement,childTaskBox);

}

function addTask(event,taskElement,childTaskBox) {
  if(!$(event).attr('onclick')) {
    $('#taskList').append(taskElement);
  } else if($(event).attr('onclick') ) {
    console.log(childTaskBox);

    $(childTaskBox).append(taskElement);
  }
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
  var event = this;
  var content = $('#inputTodo').val();
  if(!content.length) {
    return;
  };

  taskContentRenderer(content,event);

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
  var taskItem = $(this).parent('li');
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
$(document).on('click','.editButton',function() {
  var index = $('.task').index($(this).parent());
  var todoContent = $(this).prev();
  var inputVal = todoContent.text().trim();
  todoContent.hide();
  var editForm = `
    <div id="editForm_${index}" class="editFormDisplay">
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

    //ローカルストレージ
  var parent = $(target).parent();
  var sourceIndex = $('.task').index($(src).parent()); // 移動元のTODOのインデックス
  var destinationIndex = $('.task').index(parent); // 移動先のTODOのインデックス
  var sourceValue = src.textContent.trim();
  var destinationValue = target.textContent.trim();
  var storageItem = localStorage.getItem(STORAGE_KEY).split(',');
  var parsedItem = JSON.parse(storageItem);
  sortInLocalStorage(parsedItem,sourceIndex,destinationIndex,sourceValue,destinationValue);
  
  // TODO: valueだけを書き換える  view
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
function inputFormForAddingChildTask(event) {
  var e = event.target;
  var itemBox = $(e).parent('.task').children('.childTaskBox');
  var inputForm = `
  <li class='addChildTaskContent'>
    <input id='addChildTask' type="text" placeholder="子タスク">
    <button onclick="buttonForAddingChildTask(event)">追加</button>
  </li>`
  $(itemBox).append(inputForm);
  $('#addChildTask').focus();
};

function buttonForAddingChildTask(event) {
  var e = event.target;
  console.log(e);//button
  var content = $(e).parent();
  console.log(content);//子タスク入力画面
  var value = $('#addChildTask').val();
  console.log(value);//テキスト
  if(!value.length) {
    $(content).remove();
  };

  var index = $('.task').index($(content).parent().parent('.task'));
  console.log(index);

  addChildTaskInLocalStorage(index,value);

  var childTaskBox = $(content).parent();
  console.log(childTaskBox);
  taskContentRenderer(value,e,childTaskBox)
  $(content).remove();
}

function addChildTaskInLocalStorage(index,todoName) {
  var storageItem = localStorage.getItem(STORAGE_KEY).split(',');
  var parsedItem = JSON.parse(storageItem);
  console.log(parsedItem);
  var furtherParsedItem = JSON.parse(parsedItem[index]);
  console.log(furtherParsedItem);
  var id = Math.random().toString(32).substring(2);
  var content = JSON.stringify({
    id: id,
    name: todoName,
    parent: null,
  });
  console.log(content);
  if(!furtherParsedItem.parent){
    furtherParsedItem.parent = [content];
    var stringifiedItem = JSON.stringify(furtherParsedItem);
    parsedItem.splice(index,1,stringifiedItem);
    localStorage.setItem(STORAGE_KEY,JSON.stringify(parsedItem));
  } else {
    furtherParsedItem.parent.push(content);
    var stringifiedItem = JSON.stringify(furtherParsedItem);
    parsedItem.splice(index,1,stringifiedItem);
    localStorage.setItem(STORAGE_KEY,JSON.stringify(parsedItem));
  }
 
}

$(function(){
  if(localStorage.getItem(STORAGE_KEY)) {
    var storageItem = JSON.parse(localStorage.getItem(STORAGE_KEY));
    // console.log(storageItem.length);
    storageItem.forEach(function(item){
      var parsedItem = JSON.parse(item);
      // console.log(parsedItem);
      taskContentRenderer(parsedItem.name);
      if(parsedItem.parent){
        var childName = JSON.parse(parsedItem.parent);
        // console.log(childName);
        taskContentRenderer(childName.name);
      }

    });

  }
});


 