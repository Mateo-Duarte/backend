import request from 'supertest';
import express from 'express';
import { registerUser, loginUser } from '../controllers/userController';
import pool from '../config/database';
import bcrypt from 'bcryptjs';

// Crear una instancia de la aplicación Express
const app = express();
app.use(express.json());

// Agregar las rutas del controlador
app.post('/register', registerUser);
app.post('/login', loginUser);

// Mockear la base de datos y bcrypt
jest.mock('../config/database');
jest.mock('bcryptjs');

describe('userController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should return 400 if password is missing', async () => {
      const res = await request(app)
        .post('/register')
        .send({ id_usuario: '1', first_name: 'Test', last_name: 'User', country: 'Testland' });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'La contraseña es requerida' });
    });

    it('should return 201 if user is registered successfully', async () => {
      const hashedPassword = 'hashedPassword';
      bcrypt.hash.mockResolvedValueOnce(hashedPassword);
      pool.query.mockResolvedValueOnce();

      const res = await request(app)
        .post('/register')
        .send({ id_usuario: '1', first_name: 'Test', last_name: 'User', country: 'Testland', password: 'password' });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ message: 'Usuario registrado exitosamente' });
    });

    it('should return 500 if there is an error registering the user', async () => {
      bcrypt.hash.mockRejectedValueOnce(new Error('Hashing error'));

      const res = await request(app)
        .post('/register')
        .send({ id_usuario: '1', first_name: 'Test', last_name: 'User', country: 'Testland', password: 'password' });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Error al registrar el usuario' });
    });
  });

  describe('loginUser', () => {
    it('should return 404 if user is not found', async () => {
      pool.query.mockResolvedValueOnce([[]]);

      const res = await request(app)
        .post('/login')
        .send({ id_usuario: '1', password: 'password' });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Usuario no encontrado' });
    });

    it('should return 401 if password is incorrect', async () => {
      const user = { id_usuario: '1', contraseña: 'hashedPassword' };
      pool.query.mockResolvedValueOnce([[user]]);
      bcrypt.compare.mockResolvedValueOnce(false);

      const res = await request(app)
        .post('/login')
        .send({ id_usuario: '1', password: 'wrongPassword' });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: 'Contraseña incorrecta' });
    });

    it('should return 200 if user is authenticated successfully', async () => {
      const user = { id_usuario: '1', contraseña: 'hashedPassword' };
      pool.query.mockResolvedValueOnce([[user]]);
      bcrypt.compare.mockResolvedValueOnce(true);

      const res = await request(app)
        .post('/login')
        .send({ id_usuario: '1', password: 'password' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Usuario autenticado exitosamente' });
    });

    it('should return 500 if there is an error during login', async () => {
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      const res = await request(app)
        .post('/login')
        .send({ id_usuario: '1', password: 'password' });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Error al iniciar sesión' });
    });
  });
});
