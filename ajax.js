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

    data.map(function(item) {
      var taskContent = item.content;
      var status = getStatus(item);
      var taskElement = 
       `<li class="task">
          ${taskContent}
          ${status}
        </li>`;
      $('#taskList').append(taskElement);
    });
  })
  .fail(function(err){
    console.log(err);
  });
}

function selectData() {
  var value = $('#select').val();
  return value;
}

function addTask(e) {
  var status = selectData();
  var content = $('#inputTodo').val();
  if (!content || !status) {
      return;
  };

  postTask(content, status);

  $('#inputTodo').val("");
  $('#select').val("");
  $('#inputTodo').focus();
}


function getStatus(data) {
  var status = data.status.status;
  return status;
}

$(function(){
  $.ajax({
    url: 'http://localhost:8000/api/task',
    type: 'GET',
  })
  .done(function(data){
    console.log(data);

    data.map(function(item) {
      var taskContent = item.content;
      var status = getStatus(item);
      var taskElement = 
       `<li class="task">
           ${taskContent}
          ${status}
        </li>`;
      $('#taskList').append(taskElement);
    });
  })
  .fail(function(err){
    console.log(err);
  });
});
