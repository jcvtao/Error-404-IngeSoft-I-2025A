//Comentario aleatorio
/**
 * db.js
 * Configuración y creación de la base de datos SQLite para el gestor de salud y comidas.
 * Requiere: npm install better-sqlite3
 */

const Database = require('better-sqlite3');
const path = require('path');

// Ruta de la base de datos local
const dbPath = path.join(__dirname, 'salud_app.db');
const db = new Database(dbPath);


// Crear tabla de usuarios
db.prepare(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        peso_inicial REAL NOT NULL,
        altura REAL NOT NULL,
        objetivo TEXT NOT NULL, -- 'perder', 'mantener', 'ganar'
        fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`).run();

// Crear tabla de alimentos
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

// Crear tabla de registros de comidas
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

// Crear tabla de historial de peso
db.prepare(`
    CREATE TABLE IF NOT EXISTS historial_peso (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        peso REAL NOT NULL,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
    )
`).run();
// Poblar tabla usuarios
const usuarios = [
    { nombre: 'Ana', email: 'ana@email.com', peso_inicial: 65, altura: 1.65, objetivo: 'perder' },
    { nombre: 'Luis', email: 'luis@email.com', peso_inicial: 80, altura: 1.80, objetivo: 'mantener' },
    { nombre: 'Marta', email: 'marta@email.com', peso_inicial: 55, altura: 1.60, objetivo: 'ganar' },
    { nombre: 'Carlos', email: 'carlos@email.com', peso_inicial: 90, altura: 1.75, objetivo: 'perder' },
    { nombre: 'Lucía', email: 'lucia@email.com', peso_inicial: 70, altura: 1.68, objetivo: 'mantener' },
    { nombre: 'Pedro', email: 'pedro@email.com', peso_inicial: 85, altura: 1.85, objetivo: 'perder' },
    { nombre: 'Sofía', email: 'sofia@email.com', peso_inicial: 60, altura: 1.62, objetivo: 'ganar' },
    { nombre: 'Miguel', email: 'miguel@email.com', peso_inicial: 75, altura: 1.78, objetivo: 'mantener' },
    { nombre: 'Elena', email: 'elena@email.com', peso_inicial: 68, altura: 1.70, objetivo: 'perder' },
    { nombre: 'Javier', email: 'javier@email.com', peso_inicial: 95, altura: 1.90, objetivo: 'mantener' }
];
const insertUsuario = db.prepare(`
    INSERT OR IGNORE INTO usuarios (nombre, email, peso_inicial, altura, objetivo)
    VALUES (@nombre, @email, @peso_inicial, @altura, @objetivo)
`);
usuarios.forEach(u => insertUsuario.run(u));

// Poblar tabla alimentos
const alimentos = [
    { nombre: 'Manzana', calorias: 52, proteinas: 0.3, grasas: 0.2, carbohidratos: 14 },
    { nombre: 'Pollo', calorias: 165, proteinas: 31, grasas: 3.6, carbohidratos: 0 },
    { nombre: 'Arroz', calorias: 130, proteinas: 2.7, grasas: 0.3, carbohidratos: 28 },
    { nombre: 'Huevo', calorias: 155, proteinas: 13, grasas: 11, carbohidratos: 1.1 },
    { nombre: 'Leche', calorias: 42, proteinas: 3.4, grasas: 1, carbohidratos: 5 },
    { nombre: 'Pan', calorias: 265, proteinas: 9, grasas: 3.2, carbohidratos: 49 },
    { nombre: 'Plátano', calorias: 89, proteinas: 1.1, grasas: 0.3, carbohidratos: 23 },
    { nombre: 'Atún', calorias: 132, proteinas: 28, grasas: 1, carbohidratos: 0 },
    { nombre: 'Queso', calorias: 402, proteinas: 25, grasas: 33, carbohidratos: 1.3 },
    { nombre: 'Tomate', calorias: 18, proteinas: 0.9, grasas: 0.2, carbohidratos: 3.9 }
];
const insertAlimento = db.prepare(`
    INSERT OR IGNORE INTO alimentos (nombre, calorias, proteinas, grasas, carbohidratos)
    VALUES (@nombre, @calorias, @proteinas, @grasas, @carbohidratos)
`);
alimentos.forEach(a => insertAlimento.run(a));

// Poblar tabla comidas
const comidas = [
    { usuario_id: 1, alimento_id: 1, cantidad: 2 },
    { usuario_id: 2, alimento_id: 2, cantidad: 1 },
    { usuario_id: 3, alimento_id: 3, cantidad: 1.5 },
    { usuario_id: 4, alimento_id: 4, cantidad: 2 },
    { usuario_id: 5, alimento_id: 5, cantidad: 1 },
    { usuario_id: 6, alimento_id: 6, cantidad: 1 },
    { usuario_id: 7, alimento_id: 7, cantidad: 2 },
    { usuario_id: 8, alimento_id: 8, cantidad: 1 },
    { usuario_id: 9, alimento_id: 9, cantidad: 0.5 },
    { usuario_id: 10, alimento_id: 10, cantidad: 3 }
];
const insertComida = db.prepare(`
    INSERT INTO comidas (usuario_id, alimento_id, cantidad)
    VALUES (@usuario_id, @alimento_id, @cantidad)
`);
comidas.forEach(c => insertComida.run(c));

// Poblar tabla historial_peso
const historial = [
    { usuario_id: 1, peso: 65 },
    { usuario_id: 2, peso: 80 },
    { usuario_id: 3, peso: 55 },
    { usuario_id: 4, peso: 90 },
    { usuario_id: 5, peso: 70 },
    { usuario_id: 6, peso: 85 },
    { usuario_id: 7, peso: 60 },
    { usuario_id: 8, peso: 75 },
    { usuario_id: 9, peso: 68 },
    { usuario_id: 10, peso: 95 }
];
const insertHistorial = db.prepare(`
    INSERT INTO historial_peso (usuario_id, peso)
    VALUES (@usuario_id, @peso)
`);
historial.forEach(h => insertHistorial.run(h));

module.exports = db;
