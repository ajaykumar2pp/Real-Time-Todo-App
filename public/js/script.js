const socket = io();

// Handle task submission
const taskForm = document.querySelector('form');
const submitButton = document.querySelector('#submit-button');

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

    // Clear form field
    taskForm.reset();
})