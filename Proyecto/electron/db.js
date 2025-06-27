import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log(`[db.js] Creado directorio de base de datos local: ${dataDir}`);
}

const dbPath = path.join(dataDir, 'fitapp.db'); // Ruta corregida
const db = new Database(dbPath, { verbose: console.log }); // Añadido verbose
console.log(`[db.js] Base de datos conectada en: ${dbPath}`);

// Crear tablas
db.prepare(`
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
    )
`).run();
// ... el resto de tus tablas ...
db.prepare(`
    CREATE TABLE IF NOT EXISTS alimento (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre_alimento VARCHAR NOT NULL,
        gramos REAL NOT NULL,
        calorias REAL NOT NULL
    )
`).run();
db.prepare(`
    CREATE TABLE IF NOT EXISTS registro_dieta (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        alimento_id INTEGER NOT NULL,
        cantidad REAL NOT NULL,
        calorias REAL NOT NULL,
        tiempo_registro DATETIME NOT NULL,
        FOREIGN KEY(usuario_id) REFERENCES usuarios(usuario_id),
        FOREIGN KEY(alimento_id) REFERENCES alimento(alimento_id)
    )
`).run();
db.prepare(`
    CREATE TABLE IF NOT EXISTS historial_peso (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        numero_registros INTEGER NOT NULL,
        peso REAL NOT NULL,
        imc REAL NOT NULL,
        tiempo_registro DATETIME NOT NULL,
        FOREIGN KEY(usuario_id) REFERENCES usuarios(usuario_id)
    )
`).run();
db.prepare(`
    CREATE TABLE IF NOT EXISTS objetivos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        numero_objetivo INTEGER NOT NULL,
        objetivo VARCHAR NOT NULL,
        peso_meta REAL NOT NULL,
        calorias_meta VARCHAR NOT NULL,
        fecha_inicio DATE NOT NULL,
        fecha_objetivo DATE NOT NULL,
        FOREIGN KEY(usuario_id) REFERENCES usuarios(usuario_id)
    )
`).run();
db.prepare(`
    CREATE TABLE IF NOT EXISTS alimentos_favoritos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        alimento_id INTEGER NOT NULL,
        fecha_registro DATETIME NOT NULL,
        FOREIGN KEY(usuario_id) REFERENCES usuarios(usuario_id),
        FOREIGN KEY(alimento_id) REFERENCES alimento(alimento_id)
    )
`).run();
console.log('[db.js] Tablas verificadas/creadas.');


// Verificar si ya hay datos (y eliminar el process.exit(0))
const existeUsuario = db.prepare(`SELECT COUNT(*) AS count FROM usuarios`).get().count;
if (existeUsuario > 0) {
    console.log('ℹ️  La base de datos ya está inicializada. No se insertan datos de ejemplo.');
} else {
    console.log('✅ Base de datos vacía, lista para registrar usuarios.');
    // Puedes agregar aquí la inserción de datos de ejemplo si no existen usuarios
    // db.prepare(`INSERT INTO usuarios ...`).run();
}


// Función para guardar el esquema SQL (tal cual tu la tenias)
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

    // Asegúrate de que la ruta sea correcta desde la raíz del proyecto
    // Asumiendo que electron/ está en la raíz, y Documentación también
    const ruta = path.join(__dirname, '../../Documentación/Proyecto', 'script_implementacion.sql');
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

guardarEsquemaSQL();

console.log('✅ Inicialización de DB completada.');

// Funciones para ejecutar consultas
function run(query, params = []) {
    return db.prepare(query).run(params);
}

function get(query, params = []) {
    return db.prepare(query).get(params);
}

// Si planeas cerrar la DB al salir, puedes añadir esto
export function closeDb() {
    if (db && db.open) { // Check if db is open
        try {
            db.close();
            console.log('[db.js] Conexión a la base de datos cerrada.');
        } catch (error) {
            console.error('[db.js] Error al cerrar la base de datos:', error.message);
        }
    }
}

export { db, run, get };
// No es necesario exportar 'db' si solo vas a usar las funciones 'run', 'get', 'all'
//export default  db; // Si no la vas a usar directamente, no la exportes.