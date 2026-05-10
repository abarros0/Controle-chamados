const express = require('express');
const router = express.Router();
const pool = require('../db');

// Criar chamado
router.post('/', async (req, res) => {
  const { titulo, descricao } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO chamados (titulo, descricao, status, data_abertura) VALUES (?, ?, ?, NOW())",
      [titulo, descricao, "Aberto"]
    );

    res.status(201).json({
      id: result.insertId,
      titulo,
      descricao,
      status: 'Aberto'
    });
  } catch (err) {
    console.error("Erro ao abrir chamado:", err);
    res.status(500).json({ erro: err.message });
  }
});

// Listar chamados (com filtro opcional por status)
router.get('/', async (req, res) => {
  const { status } = req.query;

  try {
    let query = 'SELECT * FROM chamados';
    const params = [];

    if (status && status !== 'Todos') {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY data_abertura DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error("Erro ao listar chamados:", err);
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
    console.error("Erro ao atualizar status:", err);
    res.status(500).json({ erro: err.message });
  }
});

// Excluir chamado
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      'DELETE FROM chamados WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Chamado não encontrado' });
    }

    res.json({ mensagem: 'Chamado excluído com sucesso' });
  } catch (err) {
    console.error("Erro ao excluir chamado:", err);
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
