import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';
import { addRating } from '../controllers/ratingController.js';

const router = express.Router();

router.post('/register', registerUser);  // Ruta para registrar un usuario
router.post('/login', loginUser);  // Ruta para iniciar sesión
router.post('/api/ratings', addRating);

export default router;

