import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'node:path';
import fs from 'node:fs';

let db;
const DB_NAME = 'fitapp.db';

function initializeDb() {
    try {
        const userDataPath = app.getPath('userData');
        if (!fs.existsSync(userDataPath)) {
            fs.mkdirSync(userDataPath, { recursive: true });
            console.log(`[db.js] Creado directorio de datos del usuario: ${userDataPath}`);
        }

        const dbPath = path.join(userDataPath, DB_NAME);
        console.log(`[db.js] Intentando conectar/crear base de datos en: ${dbPath}`);

        db = new Database(dbPath, { verbose: console.log });
        console.log('[db.js] Conexión a la base de datos establecida.');

        // Crear tablas
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

            CREATE TABLE IF NOT EXISTS alimento (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre_alimento VARCHAR NOT NULL,
                gramos REAL NOT NULL,
                calorias REAL NOT NULL
            );

            CREATE TABLE IF NOT EXISTS registro_dieta (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                alimento_id INTEGER NOT NULL,
                cantidad REAL NOT NULL,
                calorias REAL NOT NULL,
                seccion INTEGER NOT NULL,
                tiempo_registro DATETIME NOT NULL,
                FOREIGN KEY(usuario_id) REFERENCES usuarios(id),
                FOREIGN KEY(alimento_id) REFERENCES alimento(id)
            );

            CREATE TABLE IF NOT EXISTS historial_peso (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                numero_registros INTEGER NOT NULL,
                peso REAL NOT NULL,
                imc REAL NOT NULL,
                tiempo_registro DATETIME NOT NULL,
                FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
            );

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

            CREATE TABLE IF NOT EXISTS alimentos_favoritos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                alimento_id INTEGER NOT NULL,
                fecha_registro DATETIME NOT NULL,
                FOREIGN KEY(usuario_id) REFERENCES usuarios(id),
                FOREIGN KEY(alimento_id) REFERENCES alimento(id)
            );
        `);

        // Verifica si la tabla alimento está vacía y la prellena
        const alimentosExistentes = db.prepare(`SELECT COUNT(*) AS total FROM alimento`).get().total;
        if (alimentosExistentes === 0) {
            const alimentos = [
                ["🍎 Manzana", 100, 52], ["🍌 Banano", 100, 89], ["🍓 Fresa", 100, 33], ["🍇 Uvas", 100, 69],
                ["🍍 Piña", 100, 50], ["🥭 Mango", 100, 60], ["🍊 Naranja", 100, 47], ["🍉 Sandía", 100, 30],
                ["🥛 Leche", 100, 42], ["🍶 Yogur", 100, 59], ["🧀 Queso", 100, 402], ["🧈 Mantequilla", 100, 717],
                ["🍨 Helado", 100, 207], ["🥤 Batido", 100, 150], ["🍫 Chocolate", 100, 546], ["☕ Café con leche", 100, 42],
                ["🥚 Huevo", 100, 155], ["🍗 Pollo", 100, 165], ["🥩 Carne", 100, 250], ["🐟 Pescado", 100, 206],
                ["🧈 Tofu", 100, 76], ["🐖 Cerdo", 100, 242], ["🍲 Lentejas", 100, 116], ["🫘 Frijoles", 100, 127],
                ["🍚 Arroz", 100, 130], ["🍞 Pan", 100, 265], ["🍝 Pasta", 100, 131], ["🌽 Maíz", 100, 86],
                ["🥔 Papa", 100, 77], ["🫚 Yuca", 100, 160], ["🌾 Avena", 100, 389], ["🫓 Arepa", 100, 227],
                ["🥑 Aguacate", 100, 160], ["🫙 Mantequilla de maní", 100, 588], ["🥜 Maní", 100, 567],
                ["🌰 Almendras", 100, 579], ["🍿 Palomitas", 100, 536]
            ];

            const insert = db.prepare(`INSERT INTO alimento (nombre_alimento, gramos, calorias) VALUES (?, ?, ?)`);
            const insertMany = db.transaction((alimentos) => {
                for (const alimento of alimentos) insert.run(...alimento);
            });

            insertMany(alimentos);
            console.log("[db.js] Tabla 'alimento' prellenada con alimentos predeterminados.");
        }

        // Mensaje de control para usuarios
        const usuarios = db.prepare(`SELECT COUNT(*) AS count FROM usuarios`).get().count;
        if (usuarios > 0) {
            console.log('ℹ️  Base de datos ya tiene usuarios registrados.');
        } else {
            console.log('✅ Base de datos lista para registrar nuevos usuarios.');
        }

    } catch (error) {
        console.error('[db.js] Error al inicializar la base de datos:', error.message);
        app.quit();
    }
}

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

    const ruta = path.join(app.getAppPath(), '..','Documentación', 'Proyecto', 'script_implementacion.sql');
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

app.whenReady().then(() => {
    initializeDb();
    guardarEsquemaSQL(); // Solo en desarrollo
}).catch(error => {
    console.error('[db.js] Error durante la inicialización de la DB:', error);
    app.quit();
});

export function run(query, params = []) {
    if (!db || db.closed) {
        throw new Error("Base de datos no disponible.");
    }
    return db.prepare(query).run(params);
}

export function get(query, params = []) {
    if (!db || db.closed) {
        throw new Error("Base de datos no disponible.");
    }
    return db.prepare(query).get(params);
}

export function closeDb() {
    if (db && !db.closed) {
        try {
            db.close();
            console.log('[db.js] Conexión a la base de datos cerrada.');
        } catch (error) {
            console.error('[db.js] Error al cerrar la base de datos:', error.message);
        }
    }
}

export {
    db
};
