import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pool from './config/database.js';
import lugarRoutes from './routes/lugar.js';
import userRoutes from './routes/user.js';
import comentarioRoutes from './routes/comentarioRoutes.js'; 
import ratingRoutes from './routes/ratingRoutes.js';

dotenv.config();  // El dotenv debe estar antes de cualquier otra cosa

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());  // Habilitar CORS para todas las rutas
app.use(express.json());  // Esto es importante para que el servidor pueda entender JSON

// Verificar variables de entorno
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);
// Rutas
app.use('/api/lugares', lugarRoutes);
app.use('/api/users', userRoutes);  
app.use('/api/comentarios', comentarioRoutes);
app.use('/api/ratings', ratingRoutes); 

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM users WHERE id_usuario = ? AND contraseña = ?";
    const VALUES = [req.body.id_usuario, req.body.contraseña];

    pool.query(sql, VALUES, (err, data) => {
        if (err) return res.json("login error");
        return res.json(data);
    });
});

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
