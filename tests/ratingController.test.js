import request from 'supertest';
import express from 'express';
import { addRating } from '../controllers/ratingControllers.js';
import pool from '../config/database';


// Crear una instancia de la aplicación Express
const app = express();
app.use(express.json());

// Agregar la ruta del controlador
app.post('/ratings', addRating);

// Mockear la base de datos
jest.mock('../config/database');

describe('ratingController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addRating', () => {
    it('should return 400 if any field is missing', async () => {
      const res = await request(app)
        .post('/ratings')
        .send({ userId: '123', entityId: null }); // Falta el campo rating

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Datos incompletos para guardar la calificación.' });
    });

    it('should return 201 if rating is added successfully', async () => {
      pool.query.mockResolvedValueOnce();

      const res = await request(app)
        .post('/ratings')
        .send({ userId: '123', entityId: '456', rating: 4 });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ message: 'Calificación guardada exitosamente.' });
    });

    it('should return 500 if there is an error adding the rating', async () => {
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      const res = await request(app)
        .post('/ratings')
        .send({ userId: '123', entityId: '456', rating: 4 });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Error al guardar la calificación' });
    });
  });
});
