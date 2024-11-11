import request from 'supertest';
import express from 'express';
import { addComment, getComments } from '../controllers/comentarioController';
import pool from '../config/database';

// Crear una instancia de la aplicación Express
const app = express();
app.use(express.json());

// Agregar las rutas del controlador
app.post('/comments', addComment);
app.get('/comments', getComments);

// Mockear la base de datos
jest.mock('../config/database');

describe('comentarioController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addComment', () => {
    it('should return 400 if any field is missing', async () => {
      const res = await request(app)
        .post('/comments')
        .send({ nombre: 'Test', correo_electronico: 'test@test.com' });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Todos los campos son obligatorios' });
    });

    it('should return 201 if comment is added successfully', async () => {
      pool.query.mockResolvedValueOnce();

      const res = await request(app)
        .post('/comments')
        .send({ nombre: 'Test', correo_electronico: 'test@test.com', mensaje: 'Test message' });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ message: 'Comentario agregado exitosamente' });
    });

    it('should return 500 if there is an error adding the comment', async () => {
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      const res = await request(app)
        .post('/comments')
        .send({ nombre: 'Test', correo_electronico: 'test@test.com', mensaje: 'Test message' });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Error al agregar el comentario' });
    });
  });

  describe('getComments', () => {
    it('should return all comments', async () => {
      const mockComments = [
        { id: 1, nombre: 'Test', correo_electronico: 'test@test.com', mensaje: 'Test message' },
      ];
      pool.query.mockResolvedValueOnce([mockComments]);

      const res = await request(app).get('/comments');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockComments);
    });

    it('should return 500 if there is an error getting the comments', async () => {
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      const res = await request(app).get('/comments');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Error al obtener los comentarios' });
    });
  });
});
