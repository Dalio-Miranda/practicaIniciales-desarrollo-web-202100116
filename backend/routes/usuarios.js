const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener perfil de un usuario por registro académico
router.get('/:registro', (req, res) => {
    const sql = 'SELECT id, registro_academico, nombres, apellidos, correo FROM usuarios WHERE registro_academico = ?';
    db.query(sql, [req.params.registro], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(results[0]);
    });
});

// Editar perfil
router.put('/:id', (req, res) => {
    const { nombres, apellidos, correo } = req.body;
    const sql = 'UPDATE usuarios SET nombres=?, apellidos=?, correo=? WHERE id=?';
    db.query(sql, [nombres, apellidos, correo, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: 'Perfil actualizado correctamente' });
    });
});

// Obtener cursos aprobados de un usuario
router.get('/:id/cursos-aprobados', (req, res) => {
    const sql = `
        SELECT c.id, c.nombre, c.creditos
        FROM cursos_aprobados ca
        JOIN cursos c ON ca.curso_id = c.id
        WHERE ca.usuario_id = ?
    `;
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Agregar curso aprobado
router.post('/:id/cursos-aprobados', (req, res) => {
    const { curso_id } = req.body;
    const sql = 'INSERT INTO cursos_aprobados (usuario_id, curso_id) VALUES (?, ?)';
    db.query(sql, [req.params.id, curso_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: 'Curso aprobado agregado' });
    });
});

module.exports = router;