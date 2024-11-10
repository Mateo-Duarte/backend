import express from 'express';
import { addComment } from '../controllers/comentarioController.js';

const router = express.Router();

router.post('/addComment', addComment);

export default router;
