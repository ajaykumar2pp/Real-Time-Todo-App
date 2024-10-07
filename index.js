require('dotenv').config()
const express = require('express');
const cors = require('cors')
const http = require('http');
const path = require('path');
const moment = require('moment');
const { Server } = require('socket.io');
const dbConfig = require('./src/config/db.config')
const Task = require('./src/models/task.model')

// Initialize Express app
const app = express();

// *********  Database Connection ************//
dbConfig.connectMongoDB();

//********* Middleware   ***********/ 
app.use(express.json());

//*********** Enable CORS for all routes **************// 
app.use(cors());

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with the server
const io = new Server(server);

// Serve static files (like HTML, CSS, JS) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// **********  Socket.io connection handling *************//
io.on("connection", (socket) => {
    console.log(`New user connected : ${socket.id}`);

    // Add new task 
    socket.on("addTask", async (taskData) => {
        try {
            // Create a new task 
            const taskToAdd = new Task({
                title: taskData.title,
                category: taskData.category,
                date: taskData.date,
                createdAt: moment().format('MMMM Do YYYY, h:mm:ss a')

            }); 

            // Save the new task to the database
            const savedTask = await taskToAdd.save();
            console.log(savedTask)
            
            // Broadcast the newly saved task to all connected clients
            io.emit('taskAdded', savedTask);
        } catch (error) {
            console.error('Error saving task:', error);
        }
    })






    //   Handle built-in 'disconnect' event
    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
    })
});



const PORT = process.env.PORT || 5000
server.listen(PORT, (err) => {
    if (err) {
        console.error("Server not connected", err)
    } else {
        console.log(`Server starting on port : ${PORT}`)
    }

})