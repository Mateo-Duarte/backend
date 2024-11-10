import pool from '../config/database.js'; // Asegúrate de que la ruta de tu archivo de configuración sea correcta
import bcrypt from 'bcryptjs';

// Controlador para registrar usuarios
export const registerUser = async (req, res) => {
  const { id_usuario, first_name, last_name, country, email, password } = req.body; // Añadir email aquí

  // Verificar si la contraseña está siendo recibida correctamente
  console.log('Contraseña recibida:', password);  // Esto te permitirá ver si la contraseña está llegando bien

  if (!password || password === '') {
    return res.status(400).json({ error: 'La contraseña es requerida' });
  }

  try {
    // Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario en la base de datos
    await pool.query(
      'INSERT INTO users (id_usuario, first_name, last_name, country, email, contraseña) VALUES (?, ?, ?, ?, ?, ?)', // Añadir email aquí
      [id_usuario, first_name, last_name, country, email, hashedPassword]
    );

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
};

// Función para validar usuario y contraseña
function validateUser(password, user) {
  return new Promise((resolve, reject) => {
    // Verificar si el usuario existe
    if (!user) {
      return reject(new Error('Usuario no encontrado'));
    }

    console.log('Contraseña ingresada:', password);
    console.log('Contraseña almacenada (hash):', user.contraseña);
    
    // Comparar la contraseña ingresada con la almacenada en la base de datos
    bcrypt.compare(password, user.contraseña, (err, isMatch) => {
      if (err) {
        console.error('Error en bcrypt al comparar la contraseña:', err);
        return reject(new Error('Error en la comparación de la contraseña'));
      }
      
      if (isMatch) {
        console.log('Autenticación exitosa para el usuario:', user.id_usuario);
        return resolve(user);
      } else {
        console.error('Contraseña inválida para el usuario:', user.id_usuario);
        return reject(new Error('Contraseña inválida'));
      }
    });
  });
}

// Controlador para iniciar sesión
export const loginUser = async (req, res) => {
  const { id_usuario, password } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id_usuario = ?', [id_usuario]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = rows[0];

    // Llamar a la función validateUser para verificar la contraseña
    validateUser(password, user)
      .then(() => {
        res.status(200).json({ message: 'Inicio de sesión exitoso' });
      })
      .catch((error) => {
        res.status(401).json({ error: error.message });
      });
  } catch (err) {
    console.error('Error en el inicio de sesión:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};
