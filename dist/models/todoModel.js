"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const todoSchema = new mongoose_1.Schema({
    title: { type: String, maxlength: [30, 'Title must be less than 30 characters'] },
    content: { type: String, required: [true, 'Todo content may not be empty'] },
    dueDate: Date,
    category: String,
    isFinished: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    priority: { type: String, enum: ['1', '2', '3'] },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
});
const Todo = (0, mongoose_1.model)('Todo', todoSchema);
exports.default = Todo;
