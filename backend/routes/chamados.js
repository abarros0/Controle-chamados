const express = require('express');
const router = express.Router();
const pool = require('../db');

// Criar chamado
router.post('/', async (req, res) => {
  const { titulo, descricao } = req.body;

  try {
    const [result] = await pool.query(
      'INSERT INTO chamados (titulo, descricao, status) VALUES (?, ?, ?)',
      [titulo, descricao, 'Aberto']
    );

    res.status(201).json({
      id: result.insertId,
      titulo,
      descricao,
      status: 'Aberto'
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Listar chamados
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM chamados');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Atualizar status do chamado
router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await pool.query(
      'UPDATE chamados SET status = ? WHERE id = ?',
      [status, id]
    );

    res.json({ mensagem: 'Status atualizado com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
``