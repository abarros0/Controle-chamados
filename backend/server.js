const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Rotas de chamados
const chamadosRoutes = require('./routes/chamados');
app.use('/chamados', chamadosRoutes);

// Servir arquivos do frontend (index.html, style.css, script.js)
app.use(express.static(path.join(__dirname, '../frontend')));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  // abre automaticamente o navegador no Windows
  exec(`start http://localhost:${PORT}/index.html`);
});
