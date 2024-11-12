import pool from '../config/database.js'; // Asegúrate de que la ruta de tu archivo de configuración sea correcta
import bcrypt from 'bcryptjs';

// Controlador para registrar usuarios
export const registerUser = async (req, res) => {
  const { id_usuario, first_name, last_name, country, email, password, security_question1, security_answer1, security_question2, security_answer2 } = req.body; 

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
      'INSERT INTO users (id_usuario, first_name, last_name, country, email, contraseña, security_question1, security_answer1, security_question2, security_answer2) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
      [id_usuario, first_name, last_name, country, email, hashedPassword, security_question1, security_answer1, security_question2, security_answer2]
    );

    res.status(200).json({ message: 'Usuario registrado exitosamente' });
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

const verifySecurityQuestions = async (req, res) => {
  const { id_usuario, answer_1, answer_2 } = req.body;

  try {
    const [user] = await pool.query(
      'SELECT answer_1, answer_2 FROM users WHERE id_usuario = ?',
      [id_usuario]
    );

    if (user.length > 0 && user[0].answer_1 === answer_1 && user[0].answer_2 === answer_2) {
      res.status(200).json({ success: true, message: 'Verificación exitosa' });
    } else {
      res.status(400).json({ success: false, message: 'Respuestas incorrectas' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
};
// En tu archivo userController.js o similar
const getSecurityQuestion = (req, res) => {
  const { id_usuario } = req.body;
  
  // Asegúrate de que esta consulta obtenga la pregunta de seguridad desde tu base de datos
  db.query('SELECT security_question FROM users WHERE id_usuario = ?', [id_usuario], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error al obtener la pregunta de seguridad' });
    }

    if (results.length > 0) {
      return res.status(200).json({ success: true, question: results[0].security_question });
    } else {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
  });
};
