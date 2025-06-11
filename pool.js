const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME, 
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});
module.exports = pool;

// O pool ele é uma maneira rapido e acessivel para acessar os dados de
// um banco de dados, seja para pegar dados ou procurar, uma forma 
// melhor junto usando com RESTAPI