"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const todoController_1 = require("../controllers/todoController");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
router.post('/', authController_1.protectRoute, todoController_1.createTodo);
router.get('/', authController_1.protectRoute, todoController_1.getTodosByUser);
router.get('/due-today', authController_1.protectRoute, todoController_1.getTodosDueToday);
router
    .route('/:id')
    .get(authController_1.protectRoute, todoController_1.getTodoById)
    .delete(authController_1.protectRoute, todoController_1.deleteTodo)
    .patch(authController_1.protectRoute, todoController_1.updateTodo);
exports.default = router;
