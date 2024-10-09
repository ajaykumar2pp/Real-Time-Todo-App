const socket = io();

// Handle task submission
const taskForm = document.querySelector('form');
const tasksList = document.getElementById('tasks-list')
const updateTaskForm = document.getElementById('updateTaskForm')

// Add event Listner
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const task = {
    title: taskForm.title.value,
    category: taskForm.category.value,
    date: taskForm.date.value,
  }
  console.log(task)

  // Emit the task data to the server
  socket.emit("addTask", task)
  alert(`New task added: ${task.title}`);

  // Clear form field
  taskForm.reset();
})

//  add tasks to the DOM
const addTaskToDOM = (task) => {
  const li = document.createElement('li')
  li.id = task._id;
  li.className = 'list-group-item d-flex justify-content-between align-items-center mt-2 mb-2';
  li.innerHTML = `
      <span>
      ${task.title} - <span class="badge bg-primary">${task.category}</span>
      </span>
      <div class="ms-auto">
        <button class="btn btn-outline-secondary btn-sm me-2" data-bs-toggle="modal" onclick="updateTask('${task._id}', '${task.title}', '${task.category}', '${task.date}')">
          <i class="bi bi-pencil-square"></i>
        </button>  
        <button class="btn btn-outline-danger btn-sm" onclick="deleteTask('${task._id}')">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `;

  tasksList.appendChild(li)
}

// Delete a task 
const deleteTask = (taskId) => {
  // Emit the task ID to the server for deletion
  socket.emit('deleteTask', taskId)
}

// Update Task modal
const updateTask = (id, title, category, date) => {
  document.getElementById('taskId').value = id;
  document.getElementById('updateTitle').value = title;
  document.getElementById('updateCategory').value = category;
  document.getElementById('updateDate').value = date;

  const todoTaskModal = new bootstrap.Modal(document.getElementById('todoTaskModal'));
  todoTaskModal.show();
}

// Handle task update
updateTaskForm.addEventListener('submit', (e) => {
  // console.log(e)
  e.preventDefault();
  const taskId = document.getElementById('taskId').value;
  const title = document.getElementById('updateTitle').value;
  const category = document.getElementById('updateCategory').value;
  const date = document.getElementById('updateDate').value;

  const updatedTask = {
    _id: taskId,
    title,
    category,
    date
  };

  // Emit updated task to server
  socket.emit('updateTask', updatedTask);

  // close the modal
  const todoTaskModal = bootstrap.Modal.getInstance(document.getElementById('todoTaskModal'));
  todoTaskModal.hide();
})

// Display all tasks list from the server
socket.on('getTasks', (tasks) => {
  console.log(tasks)
  tasks.forEach(task => addTaskToDOM(task));
})


 // Listen for new tasks from the server
socket.on('taskAdded', (task) => {
  addTaskToDOM(task);
})

// Listen for task update
socket.on('taskUpdated', (updatedTask) => {
  const taskElement = document.getElementById(updatedTask._id);
  taskElement.querySelector('span').innerHTML = `${updatedTask.title} - <span class="badge bg-primary">${updatedTask.category}</span>`;
});



// Listen for task deletions from the server
socket.on('taskDeleted', (taskId) => {
  alert(`Task with ID: ${taskId} has been deleted`);
  
  // Remove the task from The UI
  const taskItem = document.getElementById(taskId);
  if (taskItem) {
    taskItem.remove();
  }
})