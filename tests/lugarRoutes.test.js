import request from 'supertest';
import express from 'express';
import lugarRoutes from '../routes/lugarRoutes';
import { getLugares, createLugar, updateLugar, deleteLugar } from '../controllers/lugarController';
import pool from '../config/database';

// Crear una instancia de la aplicación Express
const app = express();
app.use(express.json());
app.use('/lugares', lugarRoutes);

// Mockear la base de datos y los controladores
jest.mock('../config/database');
jest.mock('../controllers/lugarController');

describe('lugarRoutes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /lugares', () => {
    it('should call getLugares controller', async () => {
      const mockGetLugares = jest.fn((req, res) => res.status(200).json([{ id_lugar: 1, nombre: 'Lugar 1', location: 'Ubicación 1', precio_entrada: 10, descripcion: 'Descripción 1' }]));
      getLugares.mockImplementationOnce(mockGetLugares);

      const res = await request(app).get('/lugares');

      expect(mockGetLugares).toHaveBeenCalled();
      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ id_lugar: 1, nombre: 'Lugar 1', location: 'Ubicación 1', precio_entrada: 10, descripcion: 'Descripción 1' }]);
    });

    it('should return 500 if there is an error getting lugares', async () => {
      const mockGetLugares = jest.fn((req, res) => res.status(500).json({ error: 'Error al obtener los lugares' }));
      getLugares.mockImplementationOnce(mockGetLugares);

      const res = await request(app).get('/lugares');

      expect(mockGetLugares).toHaveBeenCalled();
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Error al obtener los lugares' });
    });
  });

  describe('POST /lugares', () => {
    it('should call createLugar controller', async () => {
      const mockCreateLugar = jest.fn((req, res) => res.status(201).json({ message: 'Lugar creado', id: 1 }));
      createLugar.mockImplementationOnce(mockCreateLugar);

      const res = await request(app)
        .post('/lugares')
        .send({ nombre: 'Lugar 1', location: 'Ubicación 1', precio_entrada: 10, descripcion: 'Descripción 1' });

      expect(mockCreateLugar).toHaveBeenCalled();
      expect(res.status).toBe(201);
      expect(res.body).toEqual({ message: 'Lugar creado', id: 1 });
    });

    it('should return 500 if there is an error creating lugar', async () => {
      const mockCreateLugar = jest.fn((req, res) => res.status(500).json({ error: 'Error al crear el lugar' }));
      createLugar.mockImplementationOnce(mockCreateLugar);

      const res = await request(app)
        .post('/lugares')
        .send({ nombre: 'Lugar 1', location: 'Ubicación 1', precio_entrada: 10, descripcion: 'Descripción 1' });

      expect(mockCreateLugar).toHaveBeenCalled();
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Error al crear el lugar' });
    });
  });

  describe('PUT /lugares/:id', () => {
    it('should call updateLugar controller', async () => {
      const mockUpdateLugar = jest.fn((req, res) => res.status(200).json({ message: 'Lugar updated' }));
      updateLugar.mockImplementationOnce(mockUpdateLugar);

      const res = await request(app)
        .put('/lugares/1')
        .send({ nombre: 'Lugar 1', location: 'Ubicación 1', precio_entrada: 10, descripcion: 'Descripción actualizada' });

      expect(mockUpdateLugar).toHaveBeenCalled();
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Lugar updated' });
    });

    it('should return 500 if there is an error updating lugar', async () => {
      const mockUpdateLugar = jest.fn((req, res) => res.status(500).json({ error: 'Error al actualizar el lugar' }));
      updateLugar.mockImplementationOnce(mockUpdateLugar);

      const res = await request(app)
        .put('/lugares/1')
        .send({ nombre: 'Lugar 1', location: 'Ubicación 1', precio_entrada: 10, descripcion: 'Descripción actualizada' });

      expect(mockUpdateLugar).toHaveBeenCalled();
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Error al actualizar el lugar' });
    });
  });

  describe('DELETE /lugares/:id', () => {
    it('should call deleteLugar controller', async () => {
      const mockDeleteLugar = jest.fn((req, res) => res.status(200).json({ message: 'Lugar deleted' }));
      deleteLugar.mockImplementationOnce(mockDeleteLugar);

      const res = await request(app).delete('/lugares/1');

      expect(mockDeleteLugar).toHaveBeenCalled();
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Lugar deleted' });
    });

    it('should return 500 if there is an error deleting lugar', async () => {
      const mockDeleteLugar = jest.fn((req, res) => res.status(500).json({ error: 'Error al eliminar el lugar' }));
      deleteLugar.mockImplementationOnce(mockDeleteLugar);

      const res = await request(app).delete('/lugares/1');

      expect(mockDeleteLugar).toHaveBeenCalled();
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Error al eliminar el lugar' });
    });
  });
});
