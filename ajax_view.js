function task_Element(id, Content, status) {
  var taskElement = 
  `<li class="task" id=${id}>
     <span class="text taskContent">${Content}</span>
     <span class="text taskStatus">${status}</span>
     <button class="edit"  onclick="editForm(event)"></button>
     <button class="delete reset"  onclick="deleteTask(event)"></button>
   </li>`;
   return taskElement;
}

function editFormElement(id, content) {
  var taskEditElement = 
    `<li class="task" id=${id}>
        <input type="text" class="updateTodo" placeholder="${content}">
        <div class="cp_ipselect cp_sl01">
          <select class="chooseStatus" required>
            <option value="" selected>--Please choose the status--</option>
            <option value="1">DONE</option>
            <option value="2">WIP</option>
          </select>
        </div>
        <button class="confirm" onclick="editConfirm(event)"></button>
    </li>`
  return taskEditElement;
}



function doneOrWip(id) {
  if (id == 1) {
    var status = 'DONE';
    return status;
  }else if (id == 2) {
    var status = 'WIP';
    return status;
  }
}

