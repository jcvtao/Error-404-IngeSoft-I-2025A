/**
 * Base.js
 * Configuración y creación de la base de datos SQLite para el gestor de salud y comidas.
 * Requiere: npm install better-sqlite3
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ruta de la base de datos local
const dbPath = path.join(__dirname, 'salud_app.db');
const db = new Database(dbPath);


// Crear tablas
db.prepare(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        peso_inicial REAL NOT NULL,
        altura REAL NOT NULL,
        objetivo TEXT NOT NULL,
        fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS alimentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        calorias REAL NOT NULL,
        proteinas REAL,
        grasas REAL,
        carbohidratos REAL
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS comidas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        alimento_id INTEGER NOT NULL,
        cantidad REAL NOT NULL,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(usuario_id) REFERENCES usuarios(id),
        FOREIGN KEY(alimento_id) REFERENCES alimentos(id)
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS historial_peso (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        peso REAL NOT NULL,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS actividad_fisica (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
        tiempo DATETIME,
        fecha_registro DATE,
        intensidad TEXT,
        FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS objetivos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
        objetivo TEXT,
        peso_meta REAL,
        calorias_meta INTEGER,
        fecha_inicio DATE,
        fecha_objetivo DATE,
        FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS favoritos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
        alimento_id INTEGER,
        fecha_registro DATE,
        FOREIGN KEY(usuario_id) REFERENCES usuarios(id),
        FOREIGN KEY(alimento_id) REFERENCES alimentos(id)
    )
`).run();

// Guardar esquema en archivo
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
            esquemaSQL += createStmt.sql + ';\n';
        }
    });

    const ruta = path.join(__dirname, 'esquema_db.sql');
    fs.writeFileSync(ruta, esquemaSQL, 'utf8');
}
guardarEsquemaSQL();

// Insertar usuarios
const usuarios = [
    { nombre: 'Ana', email: 'ana@email.com', peso_inicial: 65, altura: 1.65, objetivo: 'perder' },
    { nombre: 'Luis', email: 'luis@email.com', peso_inicial: 80, altura: 1.80, objetivo: 'mantener' }
];
const insertUsuario = db.prepare(`
    INSERT INTO usuarios (nombre, email, peso_inicial, altura, objetivo)
    VALUES (@nombre, @email, @peso_inicial, @altura, @objetivo)
`);
usuarios.forEach(u => insertUsuario.run(u));

// Insertar alimentos
const alimentos = [
    { nombre: 'Manzana', calorias: 52, proteinas: 0.3, grasas: 0.2, carbohidratos: 14 },
    { nombre: 'Pollo', calorias: 165, proteinas: 31, grasas: 3.6, carbohidratos: 0 }
];
const insertAlimento = db.prepare(`
    INSERT INTO alimentos (nombre, calorias, proteinas, grasas, carbohidratos)
    VALUES (@nombre, @calorias, @proteinas, @grasas, @carbohidratos)
`);
alimentos.forEach(a => insertAlimento.run(a));

// Insertar comidas
const comidas = [
    { usuario_id: 1, alimento_id: 1, cantidad: 2 },
    { usuario_id: 2, alimento_id: 2, cantidad: 1 }
];
const insertComida = db.prepare(`
    INSERT INTO comidas (usuario_id, alimento_id, cantidad)
    VALUES (@usuario_id, @alimento_id, @cantidad)
`);
comidas.forEach(c => insertComida.run(c));

// Insertar historial de peso
const historial = [
    { usuario_id: 1, peso: 65 },
    { usuario_id: 2, peso: 80 }
];
const insertHistorial = db.prepare(`
    INSERT INTO historial_peso (usuario_id, peso)
    VALUES (@usuario_id, @peso)
`);
historial.forEach(h => insertHistorial.run(h));

// Insertar actividad física
const actividades = [
    { usuario_id: 1, tiempo: '00:45:00', fecha_registro: '2025-06-18', intensidad: 'Moderada' },
    { usuario_id: 2, tiempo: '01:15:00', fecha_registro: '2025-06-19', intensidad: 'Alta' }
];
const insertActividad = db.prepare(`
    INSERT INTO actividad_fisica (usuario_id, tiempo, fecha_registro, intensidad)
    VALUES (@usuario_id, @tiempo, @fecha_registro, @intensidad)
`);
actividades.forEach(a => insertActividad.run(a));

// Insertar favoritos
const favoritos = [
    { usuario_id: 1, alimento_id: 1, fecha_registro: '2025-06-19' },
    { usuario_id: 2, alimento_id: 2, fecha_registro: '2025-06-20' }
];
const insertFavorito = db.prepare(`
    INSERT INTO favoritos (usuario_id, alimento_id, fecha_registro)
    VALUES (@usuario_id, @alimento_id, @fecha_registro)
`);
favoritos.forEach(f => insertFavorito.run(f));

// Insertar objetivos
const objetivos = [
    {
        usuario_id: 1,
        objetivo: 'perder',
        peso_meta: 58,
        calorias_meta: 1500,
        fecha_inicio: '2025-06-01',
        fecha_objetivo: '2025-08-01'
    },
    {
        usuario_id: 2,
        objetivo: 'mantener',
        peso_meta: 80,
        calorias_meta: 2200,
        fecha_inicio: '2025-06-10',
        fecha_objetivo: '2025-09-10'
    }
];
const insertObjetivo = db.prepare(`
    INSERT INTO objetivos (usuario_id, objetivo, peso_meta, calorias_meta, fecha_inicio, fecha_objetivo)
    VALUES (@usuario_id, @objetivo, @peso_meta, @calorias_meta, @fecha_inicio, @fecha_objetivo)
`);
objetivos.forEach(o => insertObjetivo.run(o));

console.log('✅ Datos insertados correctamente.');

module.exports = db;

`);
historial.forEach(h => insertHistorial.run(h));

module.exports = db;
