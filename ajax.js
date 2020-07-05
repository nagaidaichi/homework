function postTask(content, status) {
  $.ajax({
    url: 'http://localhost:8000/api/task',
    type: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    data: {
      content: content,
      status_id: status,
    },
  })
  .done(function(data){
    console.log(data);
    $('#taskList').empty();

    viewRendering(data);
    
  })
  .fail(function(err){
    console.log(err);
  });
}

function addTask(e) {
  var status = $('#select').val();
  var content = $('#inputTodo').val();
  if (!content || !status) {
      return;
  };

  postTask(content, status);

  $('#inputTodo').val("");
  $('#select').val("");
  $('#inputTodo').focus();
}

function viewRendering(data) {
  data.map(function(item) {
    var taskContent = item.content;
    var status = item.status.status;;
    var id = item.id;
    var taskElement = 
    task_Element(id, taskContent, status);
    $('#taskList').append(taskElement);
  });
}

function updateTask(id, content, status_id) {
  $.ajax({
    url: `http://localhost:8000/api/task/${id}`,
    type: 'PUT',
    contentType: 'application/x-www-form-urlencoded',
    data: {
      content: content,
      status_id: status_id,
    },
  })
  .fail(function(err){
    console.log(err);
  });
}

function editForm(e) {
  var listItem = $(e.target).parent();
  var id = $(listItem).attr('id');
  var content = $(listItem).children('.taskContent').text();
  var editElement = 
  editFormElement(id, content);
  $(listItem).after(editElement);
  $(listItem).remove();
  $('.updateTodo').focus();
}

function editConfirm(e) {
  var listItem = $(e.target).parent();
  var id = $(listItem).attr('id');
  var taskContent = listItem.children('.updateTodo').val();
  var status_id = listItem.children().children('.chooseStatus').val();
  if (!taskContent || !status_id) {
    return;
  };

  updateTask(id, taskContent, status_id);

  var status = doneOrWip(status_id);
  var taskElement = 
  task_Element(id, taskContent, status);

  $(listItem).after(taskElement);
  $(listItem).remove();
}

function deleteTask(e) {
  var listItem = $(e.target).parent();
  var id = $(listItem).attr('id');

  $.ajax({
    url: `http://localhost:8000/api/task/${id}`,
    type: 'DELETE',
  })
  .done(function(){
    $(listItem).remove();
  })
  .fail(function(err){
    console.log(err);
  });
}

function initialize() {
  $.ajax({
    url: 'http://localhost:8000/api/task',
    type: 'GET',
  })
  .done(function(data){
    console.log(data);

    viewRendering(data);

  })
  .fail(function(err){
    console.log(err);
  });
}

$(function(){
  initialize();
});
