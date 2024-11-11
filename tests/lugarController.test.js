import request from 'supertest';
import express from 'express';
import { getLugares, createLugar, updateLugar, deleteLugar } from '../controllers/lugarController';
import pool from '../config/database';

// Crear una instancia de la aplicación Express
const app = express();
app.use(express.json());

// Agregar las rutas del controlador
app.get('/lugares', getLugares);
app.post('/lugares', createLugar);
app.put('/lugares/:id', updateLugar);
app.delete('/lugares/:id', deleteLugar);

// Mockear la base de datos
jest.mock('../config/database');

describe('lugarController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getLugares', () => {
    it('should return all lugares', async () => {
      const mockLugares = [
        { id_lugar: 1, nombre: 'Lugar 1', location: 'Ubicación 1', precio_entrada: 10, descripcion: 'Descripción 1' },
      ];
      pool.query.mockResolvedValueOnce([mockLugares]);

      const res = await request(app).get('/lugares');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockLugares);
    });

    it('should return 500 if there is an error getting the lugares', async () => {
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      const res = await request(app).get('/lugares');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Database error' });
    });
  });

  describe('createLugar', () => {
    it('should create a new lugar', async () => {
      const newLugar = { nombre: 'Lugar 1', location: 'Ubicación 1', precio_entrada: 10, descripcion: 'Descripción 1' };
      pool.query.mockResolvedValueOnce({ insertId: 1 });

      const res = await request(app).post('/lugares').send(newLugar);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Lugar creado', id: 1 });
    });

    it('should return 500 if there is an error creating the lugar', async () => {
      const newLugar = { nombre: 'Lugar 1', location: 'Ubicación 1', precio_entrada: 10, descripcion: 'Descripción 1' };
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      const res = await request(app).post('/lugares').send(newLugar);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Database error' });
    });
  });

  describe('updateLugar', () => {
    it('should update an existing lugar', async () => {
      const updatedLugar = { nombre: 'Lugar 1', location: 'Ubicación 1', precio_entrada: 10, descripcion: 'Descripción actualizada' };
      pool.query.mockResolvedValueOnce();

      const res = await request(app).put('/lugares/1').send(updatedLugar);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Lugar updated' });
    });

    it('should return 500 if there is an error updating the lugar', async () => {
      const updatedLugar = { nombre: 'Lugar 1', location: 'Ubicación 1', precio_entrada: 10, descripcion: 'Descripción actualizada' };
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      const res = await request(app).put('/lugares/1').send(updatedLugar);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Database error' });
    });
  });

  describe('deleteLugar', () => {
    it('should delete an existing lugar', async () => {
      pool.query.mockResolvedValueOnce();

      const res = await request(app).delete('/lugares/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Lugar deleted' });
    });

    it('should return 500 if there is an error deleting the lugar', async () => {
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      const res = await request(app).delete('/lugares/1');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Database error' });
    });
  });
});
