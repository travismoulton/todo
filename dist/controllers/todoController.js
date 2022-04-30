"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTodosDueToday = exports.updateTodo = exports.deleteTodo = exports.getTodosByUser = exports.getTodoById = exports.createTodo = void 0;
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
exports.getTodosByUser = (0, catchAsync_1.default)(async (req, res, _next) => {
    // If any query paramaters are passed in, filter them
    const todos = await todoModel_1.default.find({ user: req.user, ...req.query });
    res.status(200).json({ status: 'success', data: todos });
});
exports.deleteTodo = (0, catchAsync_1.default)(async (req, res, next) => {
    if (!(await todoModel_1.default.findById(req.params.id)))
        return next((0, sendErrorJson_1.default)(res, 'No todo with that ID exists', 400));
    await todoModel_1.default.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success' });
});
exports.updateTodo = (0, catchAsync_1.default)(async (req, res, next) => {
    const reqBody = { ...req.body };
    // Do not allow the user and id field to be updated
    ['user', '_id', '__v'].forEach((prop) => delete reqBody[prop]);
    const todo = await todoModel_1.default.findByIdAndUpdate(req.params.id, reqBody, {
        new: true,
        runValidators: true,
    });
    if (!todo)
        return next((0, sendErrorJson_1.default)(res, 'No todo with that ID exists', 401));
    res.status(200).json({ status: 'success', data: todo });
});
exports.getTodosDueToday = (0, catchAsync_1.default)(async (req, res) => {
    const today = new Date();
    const todayDateStr = [today.getFullYear(), today.getMonth(), today.getDate()].join('-');
    console.log(todayDateStr);
    const todos = await todoModel_1.default.find({ user: req.user, dueDate: { $eq: todayDateStr } });
    console.log(todos);
    res.status(200).json({ status: 'success', data: todos });
});
