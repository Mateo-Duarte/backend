import request from 'supertest';
import express from 'express';
import userRoutes from '../routes/userRoutes';
import { registerUser, loginUser } from '../controllers/userController';
import pool from '../config/database';
import bcrypt from 'bcryptjs';

// Crear una instancia de la aplicación Express
const app = express();
app.use(express.json());
app.use('/usuarios', userRoutes);

// Mockear la base de datos y los controladores
jest.mock('../config/database');
jest.mock('../controllers/userController');

describe('userRoutes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /usuarios/register', () => {
    it('should call registerUser controller', async () => {
      const mockRegisterUser = jest.fn((req, res) => res.status(201).json({ message: 'Usuario registrado exitosamente' }));
      registerUser.mockImplementationOnce(mockRegisterUser);

      const res = await request(app)
        .post('/usuarios/register')
        .send({ id_usuario: '1', first_name: 'Test', last_name: 'User', country: 'Testland', password: 'password' });

      expect(mockRegisterUser).toHaveBeenCalled();
      expect(res.status).toBe(201);
      expect(res.body).toEqual({ message: 'Usuario registrado exitosamente' });
    });

    it('should return 400 if password is missing', async () => {
      const mockRegisterUser = jest.fn((req, res) => res.status(400).json({ error: 'La contraseña es requerida' }));
      registerUser.mockImplementationOnce(mockRegisterUser);

      const res = await request(app)
        .post('/usuarios/register')
        .send({ id_usuario: '1', first_name: 'Test', last_name: 'User', country: 'Testland' });

      expect(mockRegisterUser).toHaveBeenCalled();
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'La contraseña es requerida' });
    });
  });

  describe('POST /usuarios/login', () => {
    it('should call loginUser controller', async () => {
      const mockLoginUser = jest.fn((req, res) => res.status(200).json({ message: 'Inicio de sesión exitoso' }));
      loginUser.mockImplementationOnce(mockLoginUser);

      const res = await request(app)
        .post('/usuarios/login')
        .send({ id_usuario: '1', password: 'password' });

      expect(mockLoginUser).toHaveBeenCalled();
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Inicio de sesión exitoso' });
    });

    it('should return 404 if user is not found', async () => {
      const mockLoginUser = jest.fn((req, res) => res.status(404).json({ error: 'Usuario no encontrado' }));
      loginUser.mockImplementationOnce(mockLoginUser);

      const res = await request(app)
        .post('/usuarios/login')
        .send({ id_usuario: '1', password: 'password' });

      expect(mockLoginUser).toHaveBeenCalled();
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Usuario no encontrado' });
    });

    it('should return 401 if password is incorrect', async () => {
      const mockLoginUser = jest.fn((req, res) => res.status(401).json({ error: 'Contraseña inválida' }));
      loginUser.mockImplementationOnce(mockLoginUser);

      const res = await request(app)
        .post('/usuarios/login')
        .send({ id_usuario: '1', password: 'wrongpassword' });

      expect(mockLoginUser).toHaveBeenCalled();
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: 'Contraseña inválida' });
    });
  });
});
