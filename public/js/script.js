const socket = io();

// Handle task submission
const taskForm = document.querySelector('form');
const submitButton = document.querySelector('#submit-button');
const tasksList = document.getElementById('tasks-list')

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

// Display all tasks
socket.on('getTasks', (tasks) => {
    console.log(tasks)
    tasks.forEach((task) => {
        addTaskToDOM(task)
    })
})

socket.on('taskAdded', (task) => {
    addTaskToDOM(task)
})

// Helper fucntion to add tasks to the DOM
const addTaskToDOM = (task) => {
    const li = document.createElement('li')
    li.id = task._id;
    li.className = 'list-group-item d-flex justify-content-between align-items-center mt-2 mb-2';
    li.innerHTML = `
      <span>
      ${task.title} - <span class="badge bg-primary">${task.category}</span>
      </span>
      <div class="ms-auto">
        <button class="btn btn-outline-secondary btn-sm me-2">
          <i class="bi bi-pencil-square"></i>
        </button>  
        <button class="btn btn-outline-danger btn-sm">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `;

    tasksList.appendChild(li)
}