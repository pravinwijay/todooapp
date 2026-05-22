import express from 'express';
import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} from '../controllers/todoController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

// Appliquer le middleware d'authentification sur toutes les routes Todos
router.use(authenticateJWT);

// Récupérer toutes les tâches : GET /api/todos
router.get('/', getTodos);

// Récupérer une tâche par son ID : GET /api/todos/:id
router.get('/:id', getTodoById);

// Créer une tâche : POST /api/todos
router.post('/', createTodo);

// Mettre à jour une tâche : PUT /api/todos/:id
router.put('/:id', updateTodo);

// Supprimer une tâche : DELETE /api/todos/:id
router.delete('/:id', deleteTodo);

export default router;
