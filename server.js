import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Importar CORS

dotenv.config();  // Asegúrate de que esto esté antes de cualquier otra cosa

import pool from './config/database.js';
import lugarRoutes from './routes/lugar.js';
import userRoutes from './routes/user.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());  // Habilitar CORS para todas las rutas
app.use(express.json());  // Esto es importante para que el servidor pueda entender JSON

// Verificar variables de entorno
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);

app.use('/api/lugares', lugarRoutes);
app.use('/api/users', userRoutes);  // Asegúrate de que esto está configurado

// Ruta de prueba para verificar la conexión con la base de datos
app.get('/test-db', async (req, res) => {
    try {
        const [rows, fields] = await pool.query('SELECT 1 + 1 AS solution');
        res.json({ solution: rows[0].solution });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});