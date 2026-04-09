const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'amanda',       // 
  password: '', // configurar localmente
  database: 'controle_chamados'
});

module.exports = pool;
