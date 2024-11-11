import request from 'supertest';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pool from '../config/database.js';  // Ajusta la ruta según la ubicación de tu archivo de configuración
import lugarRoutes from '../routes/lugar.js';
import userRoutes from '../routes/user.js';
import comentarioRoutes from '../routes/comentarioRoutes.js';

// Configuración inicial para el servidor de pruebas
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/lugares', lugarRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comentarios', comentarioRoutes);

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM users WHERE id_usuario = ? AND contraseña = ?";
    const VALUES = [req.body.id_usuario, req.body.contraseña];

    pool.query(sql, VALUES, (err, data) => {
        if (err) return res.status(500).json("login error");
        return res.json(data);
    });
});

app.get('/test-db', async (req, res) => {
    try {
        const [rows, fields] = await pool.query('SELECT 1 + 1 AS solution');
        res.json({ solution: rows[0].solution });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Pruebas para `server.js`
describe('Rutas del servidor', () => {
    // Prueba de conexión a la base de datos
    it('debería conectarse a la base de datos en /test-db', async () => {
        const response = await request(app).get('/test-db');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('solution', 2); // Verificamos que la solución sea 2
    });

    // Prueba para la ruta de login
    describe('POST /login', () => {
        it('debería devolver datos del usuario para un login exitoso', async () => {
            const userCredentials = {
                id_usuario: 'testuser', // Usa un id_usuario válido para pruebas o simula
                contraseña: 'testpassword'
            };

            const response = await request(app).post('/login').send(userCredentials);
            expect(response.statusCode).toBe(200);
            expect(response.body).toBeInstanceOf(Array); // Verifica que devuelva un array con los datos del usuario
        });

        it('debería devolver un error para login fallido', async () => {
            const invalidCredentials = {
                id_usuario: 'wronguser',
                contraseña: 'wrongpassword'
            };

            const response = await request(app).post('/login').send(invalidCredentials);
            expect(response.statusCode).toBe(500); // Ajusta el código si usas otro para errores de autenticación
            expect(response.body).toBe("login error"); // Verifica el mensaje de error
        });
    });

    // Prueba para las rutas de comentarios
    describe('Rutas de comentarios', () => {
        it('debería devolver todos los comentarios en GET /api/comentarios', async () => {
            const response = await request(app).get('/api/comentarios');
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBe(true); // Verifica que devuelva un arreglo de comentarios
        });
    });
});
