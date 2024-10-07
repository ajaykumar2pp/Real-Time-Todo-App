const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        default: Date.now
    },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
