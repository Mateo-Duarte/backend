import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);  // Ruta para registrar un usuario
router.post('/login', loginUser);  // Ruta para iniciar sesión

export default router;
