import { get, db } from './db.js';
import bcrypt from 'bcrypt';

export async function registrarUsuario(usuario) {
    // Validaciones básicas del usuario
    try {
        const usuarioExistente = db.prepare('SELECT id FROM usuarios WHERE username = ?').get(usuario.username);
        console.log(usuarioExistente);
        
        if (usuarioExistente) {
            return { success: false, mensaje: 'El nombre de usuario ya está en uso.' };
        }
    } catch (error) {
        console.error('[usuarios.js] Error al verificar unicidad del usuario:', error);
        return { success: false, mensaje: 'Error interno al verificar el nombre de usuario.' };
    }

    // Si todas las validaciones pasan, procede con el registro
    try {
        // Genera un hash de la contraseña antes de guardarla
        const hashedPassword = bcrypt.hashSync(usuario.password, 10); // 10 es el costo del salt, puedes ajustarlo

        const info = db.prepare(`
            INSERT INTO usuarios (nombre, sexo, username, password, edad, peso, altura, objetivo, intensidad, fecha_registro)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            usuario.nombre,
            usuario.sexo,
            usuario.username,
            hashedPassword,
            usuario.edad,
            usuario.peso,
            usuario.altura,
            usuario.objetivo,
            usuario.intensidad,
            new Date().toISOString()
        );

        console.log(`[usuarios.js] Usuario registrado con ID: ${info.lastInsertRowid}`);
        return { success: true, mensaje: 'Usuario registrado con éxito', userId: info.lastInsertRowid };
    } catch (error) {
        console.error('[usuarios.js] Error en registrarUsuario:', error);
        return { success: false, mensaje: 'Error interno al registrar el usuario.' };
    }
}


export async function loginUsuario(username, password) {
    try {
        const user = get(`SELECT * FROM usuarios WHERE username = ?`, [username]);

        if (!user) {
            return { success: false, mensaje: 'Usuario no encontrado.' };
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return { success: false, mensaje: 'Contraseña incorrecta.' };
        }

        const { password: _, ...userWithoutPassword } = user;
        console.log(`[usuarios.js] Credenciales válidas para usuario: ${user.username}`);
        return { success: true, user: userWithoutPassword };

    } catch (error) {
        console.error('[usuarios.js] Error en validarCredenciales:', error.mensaje);
        throw error;
    }
}



