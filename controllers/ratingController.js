import database from '../config/database.js';

export async function addRating(req, res) {
    const { userId, entityId, rating } = req.body;

    try {
        await database.query(
            'INSERT INTO ratings (user_id, entity_id, rating) VALUES (?, ?, ?)',
            [userId, entityId, rating]
        );
        res.status(201).json({ message: 'Calificación guardada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al guardar la calificación', error });
    }
}
