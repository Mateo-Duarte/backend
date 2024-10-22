import pool from '../config/database.js'; // Asegúrate de que la ruta de tu archivo de configuración sea correcta
import bcrypt from 'bcrypt';

// Controlador para registrar usuarios
export const registerUser = async (req, res) => {
  const { id_usuario, first_name, last_name, country, contraseña } = req.body;

  try {
    // Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Insertar el nuevo usuario en la base de datos
    await pool.query(
      'INSERT INTO users (id_usuario, first_name, last_name, country, contraseña) VALUES (?, ?, ?, ?, ?)',
      [id_usuario, first_name, last_name, country, hashedPassword]
    );

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
};

// Controlador para iniciar sesión
export const loginUser = async (req, res) => {
  const { id_usuario, contraseña } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id_usuario = ?', [id_usuario]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = rows[0];
    // Comparar la contraseña con la hasheada
    const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);

    if (isPasswordValid) {
      return res.status(200).json({ message: 'Inicio de sesión exitoso' });
    }

    // Si no es válida, comprobar si es una contraseña en texto plano
    if (contraseña === user.contraseña) {
      // Hasheamos la contraseña en texto plano para actualizarla en la base de datos
      const hashedPassword = await bcrypt.hash(contraseña, 10);
      await pool.query('UPDATE users SET contraseña = ? WHERE id_usuario = ?', [hashedPassword, id_usuario]);

      return res.json({ message: 'Inicio de sesión exitoso y contraseña actualizada' });
    }
    
    // Si ninguna verificación es correcta
    return res.status(401).json({ error: 'Contraseña inválida' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};
