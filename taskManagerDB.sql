-- Crear y usar base de datos
create database taskManagerDB;
use taskManagerDB;

-- Crear tablas
CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE dashboard (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    contenido JSON NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE usuario_dashboard (
    user_id INT NOT NULL,
    dashboard_id INT NOT NULL,
    rol ENUM('owner', 'editor', 'viewer') DEFAULT 'viewer',

    PRIMARY KEY (user_id, dashboard_id),

    FOREIGN KEY (user_id) REFERENCES usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (dashboard_id) REFERENCES dashboard(id) ON DELETE CASCADE
);
-- Mostrar contenido de las tablas
select *  from usuario;
select * from dashboard;
select * from usuario_dashboard;

-- Crear dashboard
INSERT INTO dashboard (nombre, contenido) VALUES ('Gestor de tareas', '{ "paneles": [] }');

-- Asignar propietario
INSERT INTO usuario_dashboard (user_id, dashboard_id, rol) VALUES (1, 1, 'owner');