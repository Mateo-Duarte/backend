import request from 'supertest';
import express from 'express';
import userRoutes from '../routes/user.js'; // Ajusta la ruta según la ubicación de tu archivo

// Configura una instancia de la aplicación de Express para las pruebas
const app = express();
app.use(express.json()); // Permite que la app pueda interpretar JSON en las solicitudes
app.use('/api/users', userRoutes); // Monta las rutas de usuario en una ruta base

// Pruebas para la ruta de registro de usuario
describe('POST /api/users/register', () => {
    it('debería registrar un nuevo usuario', async () => {
        const newUser = {
            nombre: 'John Doe',
            correo: 'johndoe@example.com',
            password: 'password123'
        };
        
        const response = await request(app).post('/api/users/register').send(newUser);

        // Asegúrate de que el controlador responda con el código de estado esperado
        expect(response.statusCode).toBe(201); // Ajusta este código según lo que devuelva tu controlador
        expect(response.body).toHaveProperty('message'); // Verifica que contenga un mensaje
    });

    it('debería devolver un error si falta algún campo obligatorio', async () => {
        const newUser = {
            nombre: 'John Doe',
            // Falta correo y password
        };
        
        const response = await request(app).post('/api/users/register').send(newUser);

        expect(response.statusCode).toBe(400); // Ajusta el código de estado en función del error esperado
        expect(response.body).toHaveProperty('error'); // Verifica que haya un mensaje de error
    });
});

// Pruebas para la ruta de login de usuario
describe('POST /api/users/login', () => {
    it('debería iniciar sesión con credenciales válidas', async () => {
        const userCredentials = {
            correo: 'johndoe@example.com',
            password: 'password123'
        };

        const response = await request(app).post('/api/users/login').send(userCredentials);

        expect(response.statusCode).toBe(200); // Ajusta según el código de éxito que definas
        expect(response.body).toHaveProperty('token'); // Verifica que devuelva un token u otra información de sesión
    });

    it('debería devolver un error con credenciales incorrectas', async () => {
        const userCredentials = {
            correo: 'johndoe@example.com',
            password: 'wrongpassword'
        };

        const response = await request(app).post('/api/users/login').send(userCredentials);

        expect(response.statusCode).toBe(401); // Ajusta el código según el tipo de error
        expect(response.body).toHaveProperty('error'); // Verifica que contenga un mensaje de error
    });
});
