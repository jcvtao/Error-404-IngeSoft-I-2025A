import Database from 'better-sqlite3';
import { app } from 'electron'; // Importamos 'app' de Electron para rutas de sistema
import path from 'node:path';
import fs from 'node:fs'; // Necesario para verificar y crear directorios

let db;
const DB_NAME = 'fitapp.db'; // Nombre de tu archivo de base de datos

/**
 * Inicializa y conecta a la base de datos SQLite.
 * Utiliza el directorio de datos del usuario de la aplicación para almacenar el archivo DB,
 * lo que garantiza que sea persistente y escribible en entornos empaquetados.
 */
function initializeDb() {
    try {
        const userDataPath = app.getPath('userData'); // Ruta de datos del usuario (escribible)
        // Crea el directorio de datos del usuario si no existe
        if (!fs.existsSync(userDataPath)) {
            fs.mkdirSync(userDataPath, { recursive: true });
            console.log(`[db.js] Creado directorio de datos del usuario: ${userDataPath}`);
        }

        const dbPath = path.join(userDataPath, DB_NAME);
        console.log(`[db.js] Intentando conectar/crear base de datos en: ${dbPath}`);

        // Conecta a la base de datos. Si el archivo no existe, lo crea.
        db = new Database(dbPath, { verbose: console.log }); // 'verbose' para ver logs de sqlite en consola
        console.log('[db.js] Conexión a la base de datos establecida.');

        // --- Crear/Verificar tablas ---
        db.exec(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre VARCHAR NOT NULL,
                sexo VARCHAR NOT NULL,
                edad INTEGER NOT NULL,
                username VARCHAR UNIQUE NOT NULL,
                password VARCHAR NOT NULL,
                peso REAL NOT NULL,
                altura REAL NOT NULL,
                objetivo VARCHAR NOT NULL,
                intensidad VARCHAR NOT NULL,
                fecha_registro DATE NOT NULL
            );
        `);
        console.log('[db.js] Tabla "usuarios" verificada/creada.');

        db.exec(`
            CREATE TABLE IF NOT EXISTS alimento (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre_alimento VARCHAR NOT NULL,
                gramos REAL NOT NULL,
                calorias REAL NOT NULL
            );
        `);
        console.log('[db.js] Tabla "alimento" verificada/creada.');

        db.exec(`
            CREATE TABLE IF NOT EXISTS registro_dieta (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                alimento_id INTEGER NOT NULL,
                cantidad REAL NOT NULL,
                calorias REAL NOT NULL,
                tiempo_registro DATETIME NOT NULL,
                FOREIGN KEY(usuario_id) REFERENCES usuarios(id),
                FOREIGN KEY(alimento_id) REFERENCES alimento(id)
            );
        `);
        console.log('[db.js] Tabla "registro_dieta" verificada/creada.');

        db.exec(`
            CREATE TABLE IF NOT EXISTS historial_peso (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                numero_registros INTEGER NOT NULL,
                peso REAL NOT NULL,
                imc REAL NOT NULL,
                tiempo_registro DATETIME NOT NULL,
                FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
            );
        `);
        console.log('[db.js] Tabla "historial_peso" verificada/creada.');

        db.exec(`
            CREATE TABLE IF NOT EXISTS objetivos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                numero_objetivo INTEGER NOT NULL,
                objetivo VARCHAR NOT NULL,
                peso_meta REAL NOT NULL,
                calorias_meta VARCHAR NOT NULL,
                fecha_inicio DATE NOT NULL,
                fecha_objetivo DATE NOT NULL,
                FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
            );
        `);
        console.log('[db.js] Tabla "objetivos" verificada/creada.');

        db.exec(`
            CREATE TABLE IF NOT EXISTS alimentos_favoritos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                alimento_id INTEGER NOT NULL,
                fecha_registro DATETIME NOT NULL,
                FOREIGN KEY(usuario_id) REFERENCES usuarios(id),
                FOREIGN KEY(alimento_id) REFERENCES alimento(id)
            );
        `);
        console.log('[db.js] Tabla "alimentos_favoritos" verificada/creada.');

        // Verificar si ya hay datos (y eliminar el process.exit(0))
        const existeUsuario = db.prepare(`SELECT COUNT(*) AS count FROM usuarios`).get().count;
        if (existeUsuario > 0) {
            console.log('ℹ️  La base de datos ya está inicializada. No se insertan datos de ejemplo.');
        } else {
            console.log('✅ Base de datos vacía, lista para registrar usuarios.');
            // Puedes agregar aquí la inserción de datos de ejemplo si no existen usuarios
            // db.prepare(`INSERT INTO usuarios ...`).run();
        }

    } catch (error) {
        console.error('[db.js] Error al inicializar/conectar la base de datos:', error.message);
        // Es crucial manejar este error, ya que la aplicación no puede funcionar sin DB
        app.quit(); // Cierra la aplicación si la base de datos no se puede inicializar
    }
}

/**
 * Función para guardar el esquema SQL en un archivo.
 * NOTA: Esta función está pensada para propósitos de desarrollo/documentación.
 * Su llamada automática podría no ser deseable en la aplicación empaquetada
 * debido a restricciones de escritura en el bundle.
 */
function guardarEsquemaSQL() {
    const tablas = db.prepare(`
        SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE 'sqlite_sequence'
    `).all();

    let esquemaSQL = '';
    tablas.forEach(tabla => {
        const createStmt = db.prepare(`
            SELECT sql FROM sqlite_master WHERE type='table' AND name=?
        `).get(tabla.name);
        if (createStmt?.sql) {
            esquemaSQL += createStmt.sql + ';\n\n';
        }
    });

    // La ruta debe ser absoluta y fuera del paquete de la aplicación para evitar problemas de permisos.
    // Aquí se asume una ruta para fines de desarrollo/documentación.
    // Ajusta la ruta según donde quieras tu documentación REAL.
    // Por ejemplo, para guardarla en el directorio raíz del proyecto:
    const ruta = path.join(app.getAppPath(), '..','Documentacion', 'Proyecto', 'script_implementacion.sql');
    const docDir = path.dirname(ruta);

    try {
        if (!fs.existsSync(docDir)) {
            fs.mkdirSync(docDir, { recursive: true });
            console.log(`[db.js] Creado directorio para esquema SQL: ${docDir}`);
        }
        fs.writeFileSync(ruta, esquemaSQL, 'utf8');
        console.log(`[db.js] Esquema SQL guardado en: ${ruta}`);
    } catch (error) {
        console.error('[db.js] Error al guardar el esquema SQL:', error.message);
    }
}

// Llama a initializeDb cuando la aplicación Electron esté lista.
// Esto es CRUCIAL porque 'app.getPath()' y otras APIs de 'app'
// solo funcionan después de que el evento 'ready' de Electron ha sido disparado.
app.whenReady().then(() => {
    initializeDb();
    guardarEsquemaSQL(); // Puedes llamar esto aquí si quieres que se ejecute en desarrollo después de la DB
}).catch(error => {
    console.error('[db.js] Error durante la inicialización de la DB al app.whenReady:', error);
    app.quit(); // Cierra la aplicación si hay un error crítico
});


// Funciones para ejecutar consultas
export function run(query, params = []) {
    if (!db || db.closed) {
        console.error('[db.js] Intento de ejecutar "run" con la base de datos no inicializada o cerrada.');
        // Considera lanzar un error o retornar algo que indique el fallo
        throw new Error("Base de datos no disponible.");
    }
    return db.prepare(query).run(params);
}

export function get(query, params = []) {
    if (!db || db.closed) {
        console.error('[db.js] Intento de ejecutar "get" con la base de datos no inicializada o cerrada.');
        throw new Error("Base de datos no disponible.");
    }
    return db.prepare(query).get(params);
}

/**
 * Cierra la conexión a la base de datos si está abierta.
 */
export function closeDb() {
    if (db && !db.closed) { // Verificar si 'db' existe y no está cerrada
        try {
            db.close();
            console.log('[db.js] Conexión a la base de datos cerrada.');
        } catch (error) {
            console.error('[db.js] Error al cerrar la base de datos:', error.message);
        }
    }
}

export {
    db // Exporta la instancia de la base de datos para uso directo si es necesario
};
// No es necesario exportar 'db' si solo vas a usar las funciones 'run', 'get', 'all'
//export default  db; // Si no la vas a usar directamente, no la exportes.