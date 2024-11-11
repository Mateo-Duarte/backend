import request from 'supertest';
import express from 'express';
import comentarioRoutes from '../routes/comentarioRoutes';
import { addComment, getComments } from '../controllers/comentarioController';
import pool from '../config/database';

// Crear una instancia de la aplicación Express
const app = express();
app.use(express.json());
app.use('/comentarios', comentarioRoutes);

// Mockear la base de datos y los controladores
jest.mock('../config/database');
jest.mock('../controllers/comentarioController');

describe('comentarioRoutes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /comentarios/addComment', () => {
    it('should call addComment controller', async () => {
      const mockAddComment = jest.fn((req, res) => res.status(201).json({ message: 'Comentario agregado exitosamente' }));
      addComment.mockImplementationOnce(mockAddComment);

      const res = await request(app)
        .post('/comentarios/addComment')
        .send({ nombre: 'Test', correo_electronico: 'test@test.com', mensaje: 'Test message' });

      expect(mockAddComment).toHaveBeenCalled();
      expect(res.status).toBe(201);
      expect(res.body).toEqual({ message: 'Comentario agregado exitosamente' });
    });

    it('should return 400 if fields are missing', async () => {
      const mockAddComment = jest.fn((req, res) => res.status(400).json({ error: 'Todos los campos son obligatorios' }));
      addComment.mockImplementationOnce(mockAddComment);

      const res = await request(app)
        .post('/comentarios/addComment')
        .send({ nombre: 'Test' });

      expect(mockAddComment).toHaveBeenCalled();
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Todos los campos son obligatorios' });
    });
  });

  describe('GET /comentarios', () => {
    it('should call getComments controller', async () => {
      const mockGetComments = jest.fn((req, res) => res.status(200).json([{ id: 1, nombre: 'Test', mensaje: 'Test message' }]));
      getComments.mockImplementationOnce(mockGetComments);

      const res = await request(app).get('/comentarios');

      expect(mockGetComments).toHaveBeenCalled();
      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ id: 1, nombre: 'Test', mensaje: 'Test message' }]);
    });
  });
});
