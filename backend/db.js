const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "amanda",        // ou "root", se preferir
  password: "Lara2019*", // senha definida no MySQL
  database: "controle_chamados"
});

module.exports = pool;
