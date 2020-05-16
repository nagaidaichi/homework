function taskContentRenderer(content, childNameList) {
    var dragAndDropIvent =
        `ondragstart="dragStarted(event)"
      ondragenter="dragEnterd(event)"
      ondragover="draggingOver(event)"
      ondrop="dropped(event)"
      `;

    var taskContent =
        `<span class="editTask text"> 
        ${content}
      </span>`;

    var showChildTaskButton = '<button name="blank" onclick="inputFormForAddingChildTask(event)">▽</button>';

    var childTaskBoxElement = '';
    if (childNameList && childNameList.length > 0) {
        var childTask = "";
        childNameList.forEach(function (child) {
            childTask += `<li class="task">
          ${showChildTaskButton}
          <span class="editTask text">${child}</span>
          <button class="editButton edit"></button>
          <button class="delButton delete" onclick="deleteTask(event)"></button>
        </li>`;
        });
        childTaskBoxElement = `<ul class="childTaskBox">${childTask}</ul>`;
        var taskElement = element(dragAndDropIvent, taskContent, showChildTaskButton, childTaskBoxElement);
    } else if(!childNameList && !childTaskBoxElement) {
        childTaskBoxElement = `<ul class="childTaskBox"></ul>`
        var taskElement = element(dragAndDropIvent, taskContent, showChildTaskButton, childTaskBoxElement);
    }
    return taskElement;
}

function element(dragAndDropIvent, taskContent, showChildTaskButton, childTaskBoxElement) {
    var taskElement =
    `<li class="task" draggable="true" ${dragAndDropIvent}>
    ${showChildTaskButton}
    ${taskContent}
    <button class="editButton edit">></button>
    <button class="delButton delete" onclick="deleteTask(event)"></button>
    ${childTaskBoxElement}
    </li>`;
    return taskElement;
}

function addTask(e) {
    var event = e.target;
    var content = $('#inputTodo').val();
    if (!content.length) {
        return;
    };

    var task = taskContentRenderer(content, null); 
    $('#taskList').append(task);

    setTodoItemToLocalStorage(content);

    $('#inputTodo').val("");
    $('#inputTodo').focus();
}

// タスクを削除する
function deleteTask(e) {
        var taskItem = $(e.target).parent('.task');
        var parent = $(taskItem).parent().parent('.task');
        var parentIndex = $(parent).index();

        var index = $(taskItem).index();

        removeTodoItemFromLocalStorage(index, parentIndex);
        taskItem.remove();
}

//全削除する
$(document).on('click', '#reset', function () {

    localStorage.removeItem(STORAGE_KEY);

    $('.task').remove();
    $('#inputTodo').focus();
});

// 編集フォーム出現
$(document).on('click', '.editButton', function () {
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
    var index = $(taskItem).index();
    if (!editFormValue.length) {
        editTaskInLocalStorage(index, editFormValue);
        editTaskInView(editTaskClassElement, editFormValue, target);
        taskItem.remove();
    } else {
        editTaskInLocalStorage(index, editFormValue);
        editTaskInView(editTaskClassElement, editFormValue, target);
    }
};

function editTaskInView(editTask, value, target) {
    $(editTask).text(value);
    $(target).parent().remove();
    $(editTask).show();
}

// ドラッグアンドドロップ
function dragStarted(e) { 
    src = e.target.querySelector('span');
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text", src.textContent.trim());
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
    if ($(target).attr('name')) { 
        src = null;
        return;
    } else if (target.querySelector('span')) { 
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
    sortInLocalStorage(parsedItem, sourceIndex, destinationIndex, sourceValue, destinationValue);

    // TODO: valueだけを書き換える  view
    src.textContent = target.textContent.trim();
    target.textContent = e.dataTransfer.getData("text");
    src = null;
}

// 検索(TODO絞り込み)
$('#searchForm').keyup(function () {
    var searchValue = $(this).val();
    $('.task .editTask').each(function () {
        var todoValue = $(this).text();
        if (todoValue.indexOf(searchValue) !== -1) {
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

    var itemBox = $(e).parent('.task');

    var inputForm = `
    <div class='addChildTaskContent'>
      <input id='addChildTask' type="text" placeholder="子タスク">
      <button onclick="buttonForAddingChildTask(event)">追加</button>
    </div>`
    $(itemBox).append(inputForm);
    $('#addChildTask').focus();
};

function buttonForAddingChildTask(event) {
    var e = event.target;
    var parent = $(e).parent();

    var value = $('#addChildTask').val();

    if (!value.length) {
        $(parent).remove();
    };

    var index = $(parent).parent().index();
    addChildTaskInLocalStorage(index, value);

    var taskBox = $(parent).parent().children('.childTaskBox');
    var task = taskContentRenderer(value, null);
    $(taskBox).append(task);
    $(parent).remove();
}