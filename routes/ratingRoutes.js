import express from 'express';
import { addRating } from '../controllers/ratingController.js';

const router = express.Router();

router.post('/', addRating); // Ruta para guardar la calificación

export default router;