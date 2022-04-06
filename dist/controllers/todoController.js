"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserTodosByCategory = exports.getAllUserTodos = exports.getTodoById = exports.createTodo = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const sendErrorJson_1 = __importDefault(require("../utils/sendErrorJson"));
const todoModel_1 = __importDefault(require("../models/todoModel"));
exports.createTodo = (0, catchAsync_1.default)(async (req, res, _next) => {
    const todo = await todoModel_1.default.create({ ...req.body, user: req.user });
    res.status(201).json({ status: 'success', data: todo });
});
exports.getTodoById = (0, catchAsync_1.default)(async (req, res, next) => {
    const todo = await todoModel_1.default.findById(req.params.id);
    if (!todo)
        return next((0, sendErrorJson_1.default)(res, 'No todo found with that id', 400));
    res.status(200).json({ status: 'success', data: todo });
});
exports.getAllUserTodos = (0, catchAsync_1.default)(async (req, res, _next) => {
    const todos = await todoModel_1.default.find({ user: req.user });
    res.status(200).json({ status: 'success', data: todos });
});
exports.getUserTodosByCategory = (0, catchAsync_1.default)(async (req, res, _next) => {
    const todos = await todoModel_1.default.find({ user: req.user });
});
