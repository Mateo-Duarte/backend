import pool from '../config/database.js';
import bcrypt from 'bcrypt';

// Registrarse
export const registerUser = async (req, res) => {
    const { id_usuario, first_name, last_name, country, contraseña } = req.body;
    try {
        // Hashear la contraseña antes de guardarla en la base de datos
        const hashedPassword = await bcrypt.hash(contraseña, 10);

        await pool.query('INSERT INTO users (id_usuario, first_name, last_name, country, contraseña) VALUES (?, ?, ?, ?, ?)', [id_usuario, first_name, last_name, country, hashedPassword]);

        res.json({ message: 'Usuario registrado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Iniciar sesión
export const loginUser = async (req, res) => {
    const { id_usuario, contraseña } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE id_usuario = ?', [id_usuario]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const user = rows[0];

        const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Contraseña inválida' });
        }

        res.json({ message: 'Inicio de sesión exitoso' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
