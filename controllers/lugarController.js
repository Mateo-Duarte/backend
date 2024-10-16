import pool from '../config/database.js';

export const getLugares = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM lugar');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createLugar = async (req, res) => {
    const { nombre, location, precio_entrada, descripcion } = req.body;
    try {
        const result = await pool.query('INSERT INTO lugar (nombre, location, precio_entrada, descripcion) VALUES (?, ?, ?, ?)', [nombre, location, precio_entrada, descripcion]);
        res.json({ message: 'Lugar creado', id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateLugar = async (req, res) => {
    const { id } = req.params;
    const { nombre, location, precio_entrada, descripcion } = req.body;
    try {
        await pool.query('UPDATE lugar SET nombre = ?, location = ?, precio_entrada = ?, descripcion = ? WHERE id_lugar = ?', [nombre, location, precio_entrada, descripcion, id]);
        res.json({ message: 'Lugar updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteLugar = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM lugar WHERE id_lugar = ?', [id]);
        res.json({ message: 'Lugar deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};






