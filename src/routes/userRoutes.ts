import express from 'express';

import { signup, login, checkIfUserIsLoggedIn } from '../controllers/authController';

const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.get('/checkForUser', checkIfUserIsLoggedIn);

export default router;
