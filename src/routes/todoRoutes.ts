import { Router } from 'express';

import { createTodo, getAllUserTodos, getTodoById } from '../controllers/todoController';
import { protectRoute } from '../controllers/authController';

const router = Router();

router.post('/', protectRoute, createTodo);

router.get('/', protectRoute, getAllUserTodos);

router.route('/:id').get(protectRoute, getTodoById);

export default router;
