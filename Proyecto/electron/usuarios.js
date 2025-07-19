import { get, db } from './db.js';
import bcrypt from 'bcrypt';

export async function registrarUsuario(usuario) {
    // Validaciones básicas del usuario
    try {
        const usuarioExistente = db.prepare('SELECT id FROM usuarios WHERE username = ?').get(usuario.username);
        
        if (usuarioExistente) {
            return { success: false, mensaje: 'El nombre de usuario ya está en uso.' };
        }
    } catch (error) {
        console.error('[usuarios.js] Error al verificar unicidad del usuario:', error);
        return { success: false, mensaje: 'Error interno al verificar el nombre de usuario.' };
    }

    // Si todas las validaciones pasan, procede con el registro
    try {
        const hashedPassword = bcrypt.hashSync(usuario.password, 10); 
        const fechaRegistro = new Date().toISOString();

        const info = db.prepare(`
            INSERT INTO usuarios (nombre, sexo, username, password, edad, peso, altura, objetivo, intensidad, calorias_sugeridas, fecha_registro)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
            usuario.nombre,
            usuario.sexo,
            usuario.username,
            hashedPassword,
            usuario.edad,
            usuario.peso,
            usuario.altura,
            usuario.objetivo,
            usuario.intensidad,
            usuario.calorias_sugeridas,
            fechaRegistro
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

export function registrarPeso(usuarioId, peso, imc) {
  try {
    // Obtén el número de registros previos
    const row = db.prepare(`SELECT COUNT(*) as total FROM historial_peso WHERE usuario_id = ?`).get(usuarioId);
    const numero_registros = row.total + 1;

    db.prepare(`
      INSERT INTO historial_peso (usuario_id, numero_registros, peso, imc, tiempo_registro)
      VALUES (?, ?, ?, ?, datetime('now'))
    `).run(usuarioId, numero_registros, peso, imc);

    db.prepare(`UPDATE usuarios SET peso = ? WHERE id = ?`).run(peso, usuarioId);

    return { success: true };
  } catch (error) {
    console.error('[usuarios.js] Error al registrar peso:', error);
    return { success: false, mensaje: error.message };
  }
}

export function obtenerHistorialPeso(usuarioId) {
  try {
    const rows = db.prepare(`
      SELECT peso, imc, tiempo_registro
      FROM historial_peso
      WHERE usuario_id = ?
      ORDER BY tiempo_registro ASC
    `).all(usuarioId);
    return rows;
  } catch (error) {
    console.error('[usuarios.js] Error al obtener historial de peso:', error);
    return [];
  }
}

export function guardarAlimentosFavoritos(usuarioId, alimentosIds) {
  try {
    const fecha = new Date().toISOString();

    const placeholders = alimentosIds.map(() => `(?, ?, ?)`).join(', ');
    const values = alimentosIds.flatMap(id => [usuarioId, id, fecha]);

    const sql = `
      INSERT INTO alimentos_favoritos (usuario_id, alimento_id, fecha_registro)
      VALUES ${placeholders}
    `;

    db.prepare(sql).run(...values);

    console.log(`[usuarios.js] Alimentos favoritos guardados para el usuario ${usuarioId}`);
    return { success: true };
  } catch (error) {
    console.error('[usuarios.js] Error al guardar alimentos favoritos:', error);
    return { success: false, mensaje: error.message };
  }
}

// Verifica si el usuario ya tiene preferencias registradas
export function tienePreferenciasRegistradas(usuarioId) {
  try {
    const row = db.prepare(`
      SELECT COUNT(*) as total FROM alimentos_favoritos WHERE usuario_id = ?
    `).get(usuarioId);
    return row.total > 0;
  } catch (error) {
    console.error('[usuarios.js] Error al verificar preferencias:', error);
    return false;
  }
}

export function registrarComidaDiaria(usuarioId, nombreAlimento, gramos, calorias, seccion) {
  try {
    let alimento = db.prepare(`
      SELECT id FROM alimento WHERE nombre_alimento = ?
    `).get(nombreAlimento);

    let alimentoId;

    if (!alimento) {
      const insert = db.prepare(`
        INSERT INTO alimento (nombre_alimento, gramos, calorias)
        VALUES (?, ?, ?)
      `);
      const result = insert.run(nombreAlimento, 100, calorias);
      alimentoId = result.lastInsertRowid;
    } else {
      alimentoId = alimento.id;
    }

    if (!seccion) {
      throw new Error('Sección no especificada');
    }

    db.prepare(`
      INSERT INTO registro_dieta (usuario_id, alimento_id, cantidad, gramos, calorias, seccion, tiempo_registro)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `).run(usuarioId, alimentoId, 1, gramos, calorias, seccion);

    return { success: true };
  } catch (error) {
    console.error("[usuarios.js] Error al registrar comida diaria:", error);
    return { success: false, mensaje: error.message };
  }
}

export function obtenerAlimentosFavoritos(usuarioId) {
  try {
    const stmt = db.prepare(`
      SELECT alimento.id, alimento.nombre_alimento AS nombre, alimento.calorias
      FROM alimentos_favoritos
      JOIN alimento ON alimento.id = alimentos_favoritos.alimento_id
      WHERE alimentos_favoritos.usuario_id = ?
      ORDER BY alimentos_favoritos.fecha_registro DESC
    `);
    return stmt.all(usuarioId);
  } catch (error) {
    console.error("[usuarios.js] Error al obtener alimentos favoritos:", error);
    return [];
  }
}

export function obtenerAlimentosPorSeccion(usuarioId, seccion) {
  const stmt = db.prepare(`
    SELECT registro_dieta.id, alimento.nombre_alimento, registro_dieta.cantidad, 
           registro_dieta.calorias, registro_dieta.seccion, 
           registro_dieta.tiempo_registro, registro_dieta.gramos
    FROM registro_dieta
    JOIN alimento ON registro_dieta.alimento_id = alimento.id
    WHERE registro_dieta.usuario_id = ?
      AND registro_dieta.seccion = ?
    ORDER BY registro_dieta.tiempo_registro DESC
  `);
  return stmt.all(usuarioId, seccion);
}

export function editarRegistroDieta(registroId, gramos, seccion) {
  try {
    let caloriasAlimento = db.prepare(`
      SELECT calorias FROM alimento WHERE alimento.id = (SELECT alimento_id FROM registro_dieta WHERE registro_dieta.id = ?);
    `).get(registroId);

    if (!caloriasAlimento) {
      throw new Error('Alimento no encontrado');
    }

    const calorias = Math.round((caloriasAlimento.calorias * gramos) / 100);
    console.log(caloriasAlimento, calorias, seccion);

    db.prepare(`
      UPDATE registro_dieta
      SET calorias = ?, seccion = ?, gramos = ?
      WHERE id = ?
    `).run(calorias, seccion, gramos, registroId);
  }
  catch (error) {
    console.error("[usuarios.js] Error al editar registro de dieta:", error);
    return { success: false, mensaje: error.message };
  }
  return { success: true };
}

export function eliminarRegistroDieta(registroId) {
  try {
    db.prepare(`
      DELETE FROM registro_dieta WHERE id = ?
    `).run(registroId);
    return { success: true };
  } catch (error) {
    console.error("[usuarios.js] Error al eliminar registro de dieta:", error);
    return { success: false, mensaje: error.message };
  }
}