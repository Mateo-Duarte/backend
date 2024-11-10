import express from 'express';
import { addComment, getComments } from '../controllers/comentarioController.js'; // Importar ambas funciones

const router = express.Router();

// Ruta para agregar un comentario
router.post('/addComment', addComment);

// Ruta para obtener todos los comentarios
router.get('/', getComments); // Ruta para obtener todos los comentarios

export default router;
