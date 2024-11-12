// tests/ratingRoutes.test.js
import request from 'supertest';
import express from 'express';
import ratingRouter from '../routes/ratingRoutes.js'; // Asegúrate de que la ruta es correcta

const app = express();

// Usamos el middleware json para manejar las solicitudes con body
app.use(express.json());
app.use('/rating', ratingRouter);

describe('POST /rating', () => {
  it('debería devolver un 200 y guardar la calificación correctamente', async () => {
    const ratingData = {
      userId: 1, // Si tienes campos como userId, inclúyelos
      rating: 5,
      comment: 'Excelente lugar!',
    };

    const response = await request(app)
      .post('/rating')
      .send(ratingData)
      .expect(200); // Esperamos un 200 como respuesta

    expect(response.body).toHaveProperty('message', 'Calificación agregada correctamente');
    expect(response.body).toHaveProperty('rating');
  });

  it('debería devolver un 400 si los datos son inválidos', async () => {
    const invalidRatingData = {
      userId: 1,
      rating: 6, // Suponiendo que solo se permiten valores entre 1 y 5
      comment: '',
    };

    const response = await request(app)
      .post('/rating')
      .send(invalidRatingData)
      .expect(400); // Esperamos un 400 si los datos son inválidos

    expect(response.body).toHaveProperty('error');
  });
});
