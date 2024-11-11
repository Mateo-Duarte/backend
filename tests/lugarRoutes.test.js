import request from 'supertest';
import express from 'express';
import lugarRoutes from '../routes/lugar.js'; // Ajusta la ruta según la ubicación de tu archivo

// Configura una instancia de la aplicación de Express para las pruebas
const app = express();
app.use(express.json()); // Permite que la app interprete JSON en las solicitudes
app.use('/api/lugares', lugarRoutes); // Monta las rutas de lugar en una ruta base

// Pruebas para la ruta GET /api/lugares
describe('GET /api/lugares', () => {
    it('debería obtener la lista de lugares', async () => {
        const response = await request(app).get('/api/lugares');

        expect(response.statusCode).toBe(200); // Asegúrate de que el controlador responda con 200
        expect(Array.isArray(response.body)).toBe(true); // Verifica que devuelva una lista
    });
});

// Pruebas para la ruta POST /api/lugares
describe('POST /api/lugares', () => {
    it('debería crear un nuevo lugar', async () => {
        const newLugar = {
            nombre: 'Parque Natural',
            descripcion: 'Un lugar hermoso para disfrutar de la naturaleza',
            ubicacion: 'Medellín',
            precio: 10000
        };

        const response = await request(app).post('/api/lugares').send(newLugar);

        expect(response.statusCode).toBe(201); // Código de estado para creación exitosa
        expect(response.body).toHaveProperty('id'); // Verifica que se devuelva un id para el lugar creado
        expect(response.body.nombre).toBe(newLugar.nombre); // Verifica que el nombre coincida
    });
});

// Pruebas para la ruta PUT /api/lugares/:id
describe('PUT /api/lugares/:id', () => {
    it('debería actualizar un lugar existente', async () => {
        const lugarId = 1; // Ajusta con un id válido o usa mocks en controladores
        const updateData = {
            nombre: 'Parque Actualizado',
            descripcion: 'Descripción actualizada del lugar'
        };

        const response = await request(app).put(`/api/lugares/${lugarId}`).send(updateData);

        expect(response.statusCode).toBe(200); // Código de estado para actualización exitosa
        expect(response.body).toHaveProperty('nombre', updateData.nombre); // Verifica que el nombre se haya actualizado
    });

    it('debería devolver un error si el lugar no existe', async () => {
        const invalidId = 9999; // Id de lugar no existente
        const updateData = { nombre: 'Lugar Inexistente' };

        const response = await request(app).put(`/api/lugares/${invalidId}`).send(updateData);

        expect(response.statusCode).toBe(404); // Ajusta el código de estado para un recurso no encontrado
        expect(response.body).toHaveProperty('error'); // Verifica que contenga un mensaje de error
    });
});

// Pruebas para la ruta DELETE /api/lugares/:id
describe('DELETE /api/lugares/:id', () => {
    it('debería eliminar un lugar existente', async () => {
        const lugarId = 1; // Ajusta con un id válido o usa mocks en controladores

        const response = await request(app).delete(`/api/lugares/${lugarId}`);

        expect(response.statusCode).toBe(200); // Código de estado para eliminación exitosa
        expect(response.body).toHaveProperty('message'); // Verifica que haya un mensaje de confirmación
    });

    it('debería devolver un error si el lugar no existe', async () => {
        const invalidId = 9999; // Id de lugar no existente

        const response = await request(app).delete(`/api/lugares/${invalidId}`);

        expect(response.statusCode).toBe(404); // Código de estado para recurso no encontrado
        expect(response.body).toHaveProperty('error'); // Verifica que contenga un mensaje de error
    });
});
