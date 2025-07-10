CREATE TABLE usuarios (
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

CREATE TABLE alimento (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre_alimento VARCHAR NOT NULL,
                gramos REAL NOT NULL,
                calorias REAL NOT NULL
            );

CREATE TABLE registro_dieta (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                alimento_id INTEGER NOT NULL,
                cantidad REAL NOT NULL,
                calorias REAL NOT NULL,
                tiempo_registro DATETIME NOT NULL,
                FOREIGN KEY(usuario_id) REFERENCES usuarios(id),
                FOREIGN KEY(alimento_id) REFERENCES alimento(id)
            );

CREATE TABLE historial_peso (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                numero_registros INTEGER NOT NULL,
                peso REAL NOT NULL,
                imc REAL NOT NULL,
                tiempo_registro DATETIME NOT NULL,
                FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
            );

CREATE TABLE objetivos (
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

CREATE TABLE alimentos_favoritos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                alimento_id INTEGER NOT NULL,
                fecha_registro DATETIME NOT NULL,
                FOREIGN KEY(usuario_id) REFERENCES usuarios(id),
                FOREIGN KEY(alimento_id) REFERENCES alimento(id)
            );

