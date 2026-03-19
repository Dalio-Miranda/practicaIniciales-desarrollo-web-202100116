CREATE DATABASE IF NOT EXISTS practica_web;
USE practica_web;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registro_academico VARCHAR(20) UNIQUE NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de catedráticos
CREATE TABLE catedraticos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL
);

-- Tabla de cursos
CREATE TABLE cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    creditos INT NOT NULL
);

-- Tabla de publicaciones
CREATE TABLE publicaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    catedratico_id INT,
    curso_id INT,
    mensaje TEXT NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (catedratico_id) REFERENCES catedraticos(id),
    FOREIGN KEY (curso_id) REFERENCES cursos(id)
);

-- Tabla de comentarios
CREATE TABLE comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    publicacion_id INT NOT NULL,
    usuario_id INT NOT NULL,
    mensaje TEXT NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabla de cursos aprobados
CREATE TABLE cursos_aprobados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    curso_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (curso_id) REFERENCES cursos(id)
);

-- Datos de prueba
INSERT INTO cursos (nombre, creditos) VALUES
('Organización de Lenguajes y Compiladores 1', 5),
('Sistemas Operativos 1', 5),
('Redes de Computadoras 1', 4),
('Base de Datos 1', 5),
('Análisis y Diseño de Sistemas 1', 4);

INSERT INTO catedraticos (nombres, apellidos) VALUES
('Juan Carlos', 'López García'),
('María José', 'Pérez Rodríguez'),
('Roberto', 'Morales Castro'),
('Ana Lucía', 'González Fuentes');

--------------------------------------------------------
-- Consultas SQL - CaterdrApp
--------------------------------------------------------
-- Consulta 1: Obtener todas las publicaciones con nombre de usuario y catedratico
SELECT 
    p.id,
    p.mensaje,
    p.fecha_creacion,
    CONCAT(u.nombres, ' ', u.apellidos) AS nombre_usuario,
    CONCAT(cat.nombres, ' ', cat.apellidos) AS nombre_catedratico,
    c.nombre AS nombre_curso
FROM publicaciones p
JOIN usuarios u ON p.usuario_id = u.id
LEFT JOIN catedraticos cat ON p.catedratico_id = cat.id
LEFT JOIN cursos c ON p.curso_id = c.id
ORDER BY p.fecha_creacion DESC;

-- Consulta 2: Obtener los cursos aprobados de un usuario con total de creditos
SELECT 
    u.nombres,
    u.apellidos,
    u.registro_academico,
    c.nombre AS curso,
    c.creditos,
    SUM(c.creditos) OVER (PARTITION BY u.id) AS total_creditos
FROM cursos_aprobados ca
JOIN usuarios u ON ca.usuario_id = u.id
JOIN cursos c ON ca.curso_id = c.id
ORDER BY u.id;

-- Consulta 3: Obtener comentarios de una publicacion con datos del usuario
SELECT 
    com.id,
    com.mensaje,
    com.fecha_creacion,
    CONCAT(u.nombres, ' ', u.apellidos) AS nombre_usuario,
    p.mensaje AS publicacion_original
FROM comentarios com
JOIN usuarios u ON com.usuario_id = u.id
JOIN publicaciones p ON com.publicacion_id = p.id
ORDER BY com.fecha_creacion ASC;

-- Consulta 4: Contar publicaciones por catedratico
SELECT 
    CONCAT(cat.nombres, ' ', cat.apellidos) AS catedratico,
    COUNT(p.id) AS total_publicaciones
FROM catedraticos cat
LEFT JOIN publicaciones p ON cat.id = p.catedratico_id
GROUP BY cat.id
ORDER BY total_publicaciones DESC;

-- Consulta 5: Obtener todos los usuarios registrados
SELECT 
    id,
    registro_academico,
    CONCAT(nombres, ' ', apellidos) AS nombre_completo,
    correo,
    fecha_registro
FROM usuarios
ORDER BY fecha_registro DESC;