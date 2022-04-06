import { Router } from 'express';

import {
  createTodo,
  deleteTodo,
  getTodosByUser,
  getTodoById,
  updateTodo,
} from '../controllers/todoController';
import { protectRoute } from '../controllers/authController';

const router = Router();

router.post('/', protectRoute, createTodo);

router.get('/', protectRoute, getTodosByUser);

router
  .route('/:id')
  .get(protectRoute, getTodoById)
  .delete(protectRoute, deleteTodo)
  .patch(protectRoute, updateTodo);

export default router;
