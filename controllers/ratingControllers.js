import database from '../config/database.js';
import pool from '../config/database.js';

export const addRating = async (req, res) => {
    const { userId, entityId, rating } = req.body;

    if (!userId || !entityId || rating == null) {
        return res.status(400).json({ error: 'Datos incompletos para guardar la calificación.' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO ratings (user_id, entity_id, rating) VALUES (?, ?, ?)',
            [userId, entityId, rating]
        );
        res.status(201).json({ message: 'Calificación guardada exitosamente.' });
    } catch (error) {
        console.error('Error al guardar la calificación:', error);
        res.status(500).json({ error: 'Error al guardar la calificación' });
    }
};