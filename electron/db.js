const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'data', 'fitapp.db');

// Si no existe, crear archivo y estructura
if (!fs.existsSync(dbPath)) {
  console.log('Creando base de datos...');
  const db = new sqlite3.Database(dbPath);

  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        correo TEXT UNIQUE NOT NULL,
        contraseña TEXT NOT NULL
      )
    `);

    // Aquí puedes agregar más tablas (alimentos, registros, etc.)
  });

  db.close();
}
