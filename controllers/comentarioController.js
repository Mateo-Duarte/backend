import pool from '../config/database.js';

// Controlador para agregar un comentario
export const addComment = async (req, res) => {
  const { nombre, correo_electronico, mensaje } = req.body;

  // Verificar que todos los campos estén presentes
  if (!nombre || !correo_electronico || !mensaje) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    await pool.query(
      'INSERT INTO comentario (nombre, correo_electronico, mensaje) VALUES (?, ?, ?)',
      [nombre, correo_electronico, mensaje]
    );
    res.status(201).json({ message: 'Comentario agregado exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al agregar el comentario' });
  }
};
