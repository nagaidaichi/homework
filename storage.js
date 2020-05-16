function addTask(event, taskElement, childTaskBox) {
    if (!$(event).attr('onclick')) {
        $('#taskList').append(taskElement);
    } else if ($(event).attr('onclick')) {

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

function removeTodoItemFromLocalStorage(index, parentIndex) {
    var storageItem = localStorage.getItem(STORAGE_KEY).split(',');
    if (!storageItem) {
        return;
    } else if(parentIndex == -1) {
        var parsedItem = JSON.parse(storageItem);
        parsedItem.splice(index, 1);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedItem));
            if (!parsedItem.length) {
                localStorage.removeItem(STORAGE_KEY);
            }
        } else if(parentIndex > -1) {
        var parsedItem = JSON.parse(storageItem);
        var secondParsed = JSON.parse(parsedItem[parentIndex]);
            if(secondParsed.parent.length > 1) {
                secondParsed.parent.splice(index, 1);
            } else if(secondParsed.parent.length === 1) {
                secondParsed.parent = null;
            }
        var stringified = JSON.stringify(secondParsed);
        parsedItem.splice(parentIndex, 1, stringified);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedItem));
        if (!parsedItem.length) {
            localStorage.removeItem(STORAGE_KEY);
        }
    }
   
};

function editTaskInLocalStorage(index, value) {
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
        parsedItem.splice(index, 1, );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedItem));
    }
}

function sortInLocalStorage(parsedItem, sourceIndex, destinationIndex, sourceValue, destinationValue) {

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

function addChildTaskInLocalStorage(index, todoName) {
    if(!todoName) {
        return;
    }
    var storageItem = localStorage.getItem(STORAGE_KEY);
    var parsedItem = JSON.parse(storageItem);

    var furtherParsedItem = JSON.parse(parsedItem[index]);

    var id = Math.random().toString(32).substring(2);
    var content = JSON.stringify({
        id: id,
        name: todoName,
        parent: null,
    });
    if (!furtherParsedItem.parent) {
        furtherParsedItem.parent = [content];
        var stringifiedItem = JSON.stringify(furtherParsedItem);
        parsedItem.splice(index, 1, stringifiedItem);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedItem));
    } else {
        furtherParsedItem.parent.push(content);
        var stringifiedItem = JSON.stringify(furtherParsedItem);
        parsedItem.splice(index, 1, stringifiedItem);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedItem));
    }
}

function initialRenderingFromStorage() {
    if (localStorage.getItem(STORAGE_KEY)) {
        var storageItem = JSON.parse(localStorage.getItem(STORAGE_KEY));
        var parsedItemList = storageItem.map(function (item) {
            var parsedItem = JSON.parse(item);
            if (parsedItem.parent && parsedItem.parent.length > 0) {
                var parsedParentTaskList = parsedItem.parent.map(function (parentItem) {
                    var item = JSON.parse(parentItem);
                    return item.name;
                });
                parsedItem.parent = parsedParentTaskList;
            }
            return parsedItem;
        });
        parsedItemList.forEach(function (item) {
            var task = taskContentRenderer(item.name, item.parent);
            $('#taskList').append(task);
        });

    }
}