function postTask(content) {
  $.ajax({
    url: 'http://localhost:8000/api/task',
    type: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    data: {
      content: content,
      status_id: 1,
    },
  })
  .done(function(data){
    console.log(data);
    $('#taskList').empty();

    data.map(function(item) {
      var taskContent = item.content;
      var taskElement = 
        `<li class="task">
          ${taskContent}
        </li>`;
      $('#taskList').append(taskElement);
    });
  })
  .fail(function(err){
    console.log(err);
  });
}

function addTask(e) {
    var event = e.target;
    var content = $('#inputTodo').val();
    if (!content.length) {
        return;
    };

    postTask(content);

    $('#inputTodo').val("");
    $('#inputTodo').focus();
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
      var status = item.status.status;
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
