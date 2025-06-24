const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'salud_app.db');
const db = new Database(dbPath);

// Crear tablas
db.prepare(`
    CREATE TABLE IF NOT EXISTS usuarios (
        usuario_id INTEGER PRIMARY KEY,
        nombre VARCHAR NOT NULL,
        sexo VARCHAR,
        edad INTEGER,
        username VARCHAR UNIQUE NOT NULL,
        peso REAL NOT NULL,
        altura REAL NOT NULL,
        objetivo VARCHAR NOT NULL,
        fecha_registro DATE
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS valor_nutricional (
        alimento_id INTEGER PRIMARY KEY,
        nombre_alimento VARCHAR NOT NULL,
        calorias REAL NOT NULL,
        proteinas REAL,
        grasas REAL,
        carbohidratos REAL
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS comidas (
        id INTEGER PRIMARY KEY,
        usuario_id INTEGER NOT NULL,
        alimento_id INTEGER NOT NULL,
        cantidad REAL NOT NULL,
        fecha DATETIME,
        FOREIGN KEY(usuario_id) REFERENCES usuarios(usuario_id),
        FOREIGN KEY(alimento_id) REFERENCES valor_nutricional(alimento_id)
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS historial_peso (
        id INTEGER PRIMARY KEY,
        usuario_id INTEGER NOT NULL,
        cantidad_registros INTEGER,
        peso REAL NOT NULL,
        imc REAL,
        fecha DATETIME,
        FOREIGN KEY(usuario_id) REFERENCES usuarios(usuario_id)
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS actividad_fisica (
        id INTEGER PRIMARY KEY,
        usuario_id INTEGER,
        tiempo VARCHAR,
        fecha_registro DATETIME,
        intensidad VARCHAR,
        FOREIGN KEY(usuario_id) REFERENCES usuarios(usuario_id)
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS objetivos (
        id INTEGER PRIMARY KEY,
        usuario_id INTEGER,
        objetivo VARCHAR,
        peso_meta REAL,
        calorias_meta VARCHAR,
        fecha_inicio DATE,
        fecha_objetivo DATE,
        FOREIGN KEY(usuario_id) REFERENCES usuarios(usuario_id)
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS favoritos (
        id INTEGER PRIMARY KEY,
        usuario_id INTEGER,
        alimento_id INTEGER,
        fecha_registro DATETIME,
        FOREIGN KEY(usuario_id) REFERENCES usuarios(usuario_id),
        FOREIGN KEY(alimento_id) REFERENCES valor_nutricional(alimento_id)
    )
`).run();

// Verificar si ya hay datos
const existeUsuario = db.prepare(`SELECT COUNT(*) AS count FROM usuarios`).get().count;
if (existeUsuario > 0) {
    console.log('ℹ️  La base de datos ya está inicializada. No se insertan datos.');
    module.exports = db;
    return;
}

// Insertar datos simulados
const usuarios = Array.from({ length: 10 }, (_, i) => ({
    usuario_id: `${i + 1}`,
    nombre: `Usuario${i + 1}`,
    sexo: i % 2 === 0 ? 'Masculino' : 'Femenino',
    edad: 20 + i,
    username: `user${i + 1}`,
    peso: 60 + i * 2,
    altura: 1.60 + i * 0.01,
    objetivo: i % 3 === 0 ? 'perder' : i % 3 === 1 ? 'mantener' : 'ganar',
    fecha_registro: `2025-06-${10 + i}`
}));

const alimentos = Array.from({ length: 10 }, (_, i) => ({
    alimento_id: `${i + 1}`,
    nombre_alimento: `Alimento${i + 1}`,
    calorias: 50 + i * 10,
    proteinas: 1 + i * 0.5,
    grasas: 0.5 + i * 0.3,
    carbohidratos: 5 + i * 2
}));

const insertUsuario = db.prepare(`
    INSERT INTO usuarios (usuario_id, nombre, sexo, edad, username, peso, altura, objetivo, fecha_registro)
    VALUES (@usuario_id, @nombre, @sexo, @edad, @username, @peso, @altura, @objetivo, @fecha_registro)
`);

const insertAlimento = db.prepare(`
    INSERT INTO valor_nutricional (alimento_id, nombre_alimento, calorias, proteinas, grasas, carbohidratos)
    VALUES (@alimento_id, @nombre_alimento, @calorias, @proteinas, @grasas, @carbohidratos)
`);

usuarios.forEach(u => insertUsuario.run(u));
alimentos.forEach(a => insertAlimento.run(a));

// Insertar comidas
const insertComida = db.prepare(`
    INSERT INTO comidas (id, usuario_id, alimento_id, cantidad, fecha)
    VALUES (@id, @usuario_id, @alimento_id, @cantidad, @fecha)
`);
for (let i = 0; i < 10; i++) {
    insertComida.run({
        id: `${i + 1}`,
        usuario_id: `${(i % usuarios.length) + 1}`,
        alimento_id: `${(i % alimentos.length) + 1}`,
        cantidad: 1 + i * 0.5,
        fecha: `2025-06-${10 + i}`
    });
}

// Insertar historial_peso
const insertHistorial = db.prepare(`
    INSERT INTO historial_peso (id, usuario_id, cantidad_registros, peso, imc, fecha)
    VALUES (@id, @usuario_id, @cantidad_registros, @peso, @imc, @fecha)
`);
for (let i = 0; i < 10; i++) {
    const usuario = usuarios[i % usuarios.length];
    const peso = usuario.peso + i * 0.5;
    const imc = peso / (usuario.altura * usuario.altura);
    insertHistorial.run({
        id: `${i + 1}`,
        usuario_id: usuario.usuario_id,
        cantidad_registros: i + 1,
        peso,
        imc: parseFloat(imc.toFixed(2)),
        fecha: `2025-06-${11 + i}`
    });
}

// Insertar actividad física
const insertActividad = db.prepare(`
    INSERT INTO actividad_fisica (id, usuario_id, tiempo, fecha_registro, intensidad)
    VALUES (@id, @usuario_id, @tiempo, @fecha_registro, @intensidad)
`);
for (let i = 0; i < 10; i++) {
    insertActividad.run({
        id: `${i + 1}`,
        usuario_id: `${(i % usuarios.length) + 1}`,
        tiempo: `00:${30 + i}:00`,
        fecha_registro: `2025-06-${12 + i}`,
        intensidad: ['Baja', 'Moderada', 'Alta'][i % 3]
    });
}

// Insertar objetivos
const insertObjetivo = db.prepare(`
    INSERT INTO objetivos (id, usuario_id, objetivo, peso_meta, calorias_meta, fecha_inicio, fecha_objetivo)
    VALUES (@id, @usuario_id, @objetivo, @peso_meta, @calorias_meta, @fecha_inicio, @fecha_objetivo)
`);
for (let i = 0; i < 10; i++) {
    const usuario = usuarios[i % usuarios.length];
    insertObjetivo.run({
        id: `${i + 1}`,
        usuario_id: usuario.usuario_id,
        objetivo: usuario.objetivo,
        peso_meta: usuario.peso - 5 + i,
        calorias_meta: `${1800 + i * 100}`,
        fecha_inicio: `2025-06-${10 + i}`,
        fecha_objetivo: `2025-08-${10 + i}`
    });
}

// Insertar favoritos
const insertFavorito = db.prepare(`
    INSERT INTO favoritos (id, usuario_id, alimento_id, fecha_registro)
    VALUES (@id, @usuario_id, @alimento_id, @fecha_registro)
`);
for (let i = 0; i < 10; i++) {
    insertFavorito.run({
        id: `${i + 1}`,
        usuario_id: `${(i % usuarios.length) + 1}`,
        alimento_id: `${(i % alimentos.length) + 1}`,
        fecha_registro: `2025-06-${15 + i}`
    });
}

// Guardar esquema
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

    const ruta = path.join(__dirname, 'esquema_db.sql');
    fs.writeFileSync(ruta, esquemaSQL, 'utf8');
}

guardarEsquemaSQL();

console.log('✅ Tablas creadas e información insertada correctamente.');

module.exports = db;
