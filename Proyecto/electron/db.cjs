const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'data', 'fitapp.db');
const db = new Database(dbPath);

// Crear tablas
db.prepare(`
    CREATE TABLE IF NOT EXISTS usuarios (
        usuario_id INTEGER PRIMARY KEY AUTOINCREMENT,
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

db.prepare(`
    CREATE TABLE IF NOT EXISTS alimento (
        alimento_id INTEGER PRIMARY KEY AUTOINCREMENT,
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

// Verificar si ya hay datos
const existeUsuario = db.prepare(`SELECT COUNT(*) AS count FROM usuarios`).get().count;
if (existeUsuario > 0) {
    console.log('ℹ️  La base de datos ya está inicializada. No se insertan datos.');
    module.exports = db;
    process.exit(0);
}

// Guardar esquema en Documentacion/Proyecto/script_implementacion.sql
function guardarEsquemaSQL() {
    const tablas = db.prepare(`
        SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `).all();

    let esquemaSQL = '';
    tablas.forEach(tabla => {
        const createStmt = db.prepare(`
            SELECT sql FROM sqlite_master WHERE type='table' AND name=?
        `).get(tabla.name);
        if (createStmt && createStmt.sql) {
            esquemaSQL += createStmt.sql + ';\n\n';
        }
    });

    const ruta = path.join(__dirname, '../../Documentación/Proyecto', 'script_implementacion.sql');
    fs.writeFileSync(ruta, esquemaSQL, 'utf8');
}

guardarEsquemaSQL();

console.log('✅ Base de datos creada y datos insertados correctamente.');

module.exports = db;
