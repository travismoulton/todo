import { Router } from 'express';

import {
  createTodo,
  deleteTodo,
  getTodosByUser,
  getTodoById,
  updateTodo,
  getTodosDueToday,
  getOverdueTodos,
} from '../controllers/todoController';
import { protectRoute } from '../controllers/authController';

const router = Router();

router.post('/', protectRoute, createTodo);

router.get('/', protectRoute, getTodosByUser);

router.get('/due-today', protectRoute, getTodosDueToday);

router.get('/overdue', protectRoute, getOverdueTodos);

router
  .route('/:id')
  .get(protectRoute, getTodoById)
  .delete(protectRoute, deleteTodo)
  .patch(protectRoute, updateTodo);

export default router;
