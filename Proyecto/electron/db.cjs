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

// Insertar datos simulados
const usuarios = Array.from({ length: 10 }, (_, i) => ({
    nombre: `Usuario${i + 1}`,
    sexo: i % 2 === 0 ? 'Masculino' : 'Femenino',
    edad: 20 + i,
    username: `user${i + 1}`,
    password: `pass${i + 1}`,
    peso: 60 + i * 2,
    altura: 1.60 + i * 0.01,
    objetivo: i % 3 === 0 ? 'perder' : i % 3 === 1 ? 'mantener' : 'ganar',
    intensidad: ['Baja', 'Moderada', 'Alta'][i % 3],
    fecha_registro: `2025-06-${10 + i}`
}));

const alimentos = Array.from({ length: 10 }, (_, i) => ({
    nombre_alimento: `Alimento${i + 1}`,
    gramos: 100,
    calorias: 50 + i * 10
}));

const insertUsuario = db.prepare(`
    INSERT INTO usuarios (
        nombre, sexo, edad, username, password, peso, altura, objetivo, intensidad, fecha_registro
    ) VALUES (
        @nombre, @sexo, @edad, @username, @password, @peso, @altura, @objetivo, @intensidad, @fecha_registro
    )
`);

const insertAlimento = db.prepare(`
    INSERT INTO alimento (nombre_alimento, gramos, calorias)
    VALUES (@nombre_alimento, @gramos, @calorias)
`);

usuarios.forEach(u => insertUsuario.run(u));
alimentos.forEach(a => insertAlimento.run(a));

const usuariosDB = db.prepare(`SELECT usuario_id, peso, altura, objetivo FROM usuarios`).all();
const alimentosDB = db.prepare(`SELECT alimento_id, calorias FROM alimento`).all();

// Insertar registro_dieta
const insertComida = db.prepare(`
    INSERT INTO registro_dieta (usuario_id, alimento_id, cantidad, calorias, tiempo_registro)
    VALUES (@usuario_id, @alimento_id, @cantidad, @calorias, @tiempo_registro)
`);
for (let i = 0; i < 10; i++) {
    const alimento = alimentosDB[i % alimentosDB.length];
    insertComida.run({
        usuario_id: usuariosDB[i % usuariosDB.length].usuario_id,
        alimento_id: alimento.alimento_id,
        cantidad: 1 + i * 0.5,
        calorias: alimento.calorias,
        tiempo_registro: `2025-06-${10 + i}`
    });
}

// Insertar historial_peso
const insertHistorial = db.prepare(`
    INSERT INTO historial_peso (usuario_id, numero_registros, peso, imc, tiempo_registro)
    VALUES (@usuario_id, @numero_registros, @peso, @imc, @tiempo_registro)
`);
for (let i = 0; i < 10; i++) {
    const usuario = usuariosDB[i % usuariosDB.length];
    const peso = usuario.peso + i * 0.5;
    const imc = peso / (usuario.altura * usuario.altura);
    insertHistorial.run({
        usuario_id: usuario.usuario_id,
        numero_registros: i + 1,
        peso,
        imc: parseFloat(imc.toFixed(2)),
        tiempo_registro: `2025-06-${11 + i}`
    });
}

// Insertar objetivos
const insertObjetivo = db.prepare(`
    INSERT INTO objetivos (usuario_id, numero_objetivo, objetivo, peso_meta, calorias_meta, fecha_inicio, fecha_objetivo)
    VALUES (@usuario_id, @numero_objetivo, @objetivo, @peso_meta, @calorias_meta, @fecha_inicio, @fecha_objetivo)
`);
for (let i = 0; i < 10; i++) {
    const usuario = usuariosDB[i % usuariosDB.length];
    insertObjetivo.run({
        usuario_id: usuario.usuario_id,
        numero_objetivo: i + 1,
        objetivo: usuario.objetivo,
        peso_meta: usuario.peso - 5 + i,
        calorias_meta: `${1800 + i * 100}`,
        fecha_inicio: `2025-06-${10 + i}`,
        fecha_objetivo: `2025-08-${10 + i}`
    });
}

// Insertar alimentos_favoritos
const insertFavorito = db.prepare(`
    INSERT INTO alimentos_favoritos (usuario_id, alimento_id, fecha_registro)
    VALUES (@usuario_id, @alimento_id, @fecha_registro)
`);
for (let i = 0; i < 10; i++) {
    insertFavorito.run({
        usuario_id: usuariosDB[i % usuariosDB.length].usuario_id,
        alimento_id: alimentosDB[i % alimentosDB.length].alimento_id,
        fecha_registro: `2025-06-${15 + i}`
    });
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
