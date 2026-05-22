import express from 'express';
import { signup, login } from '../controllers/authController.js';

const router = express.Router();

// Route d'inscription : POST /api/auth/signup
router.post('/signup', signup);

// Route de connexion : POST /api/auth/login
router.post('/login', login);

export default router;
