const client = require('./client');
const pool = require('./pool');
require('dotenv').config();

async function inicializacao() {
  await createDatabaseIfNotExists();
  await createTableIfNotExists();
}

async function createDatabaseIfNotExists() {
  
    try {

        await client.connect();

        const hm16 = process.env.DB_NAME;

        const res = await client.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`,
          [hm16]
        );

    if (res.rowCount === 0) {

      await client.query(`CREATE DATABASE "${hm16}"`);
      console.log(`Banco de dados '${hm16}' criado com sucesso!`);
    
    } else {

      console.log(`Banco de dados '${hm16}' já existe.`);
    
    }

  } catch (err) {
    console.error('Erro ao verificar/criar o banco de dados:', err);
  } finally {
    await client.end(); 
  }
}


async function createTableIfNotExists() {
  
  try {
        
    const res = await pool.query(`
       SELECT to_regclass('public.dummy_data') AS table
    `);

    if (!res.rows[0].table) {
            
      await pool.query(`
        CREATE TABLE dummy_data (
          id VARCHAR(48) PRIMARY KEY,
          nome VARCHAR(50) NOT NULL,
          email VARCHAR(50) UNIQUE NOT NULL,
          dt_cadastro TIMESTAMP NOT NULL
        );
      `);

      console.log(`Tabela 'dummy_data' criada com sucesso!`);

      // Inserir Dados
      await inputTable();
    } else {
      console.log(`Tabela 'dummy_data' já existe.`);
    }

  } catch (err) {
    console.error('Erro ao verificar/criar a tabela:', err);
  }

}

async function inputTable() {

  try {
    const dados = `
      INSERT INTO dummy_data (id, nome, email, dt_cadastro) VALUES
      ('479accf4-39bd-4853-b0ed-f64f47a1a7cd','Fulano de Tal','fulano@gmail.com',NOW()),
      ('35ae1696-2fe4-42e1-8da3-f2f3851a4f92','Marcos Mion','marcos@gmail.com',NOW()),
      ('7593d791-4588-4c7e-af42-453fdbba2be5','Marcelo Tas','marcelo@gmail.com',NOW()),
      ('a31d2462-3d6b-4632-a29b-7841e25ae6bf','Douglas de Oliveira','douglas@gmail.com',NOW()),
      ('a6ade770-ff1d-4bc4-920f-615ab217969a','Cícero da Silva','cicero@gmail.com',NOW()),
      ('bbbfbb12-c4e9-43df-9cac-2320d327fa13','Eusébio Chagas','eusebio@gmail.com',NOW()),
      ('515e0395-8754-4bed-8ba4-82951be130f3','Tomas Souza','tomas@gmail.com',NOW()),
      ('39d1fc26-983b-4222-8ab5-9898e9c723fb','Geraldo Soares','geraldo@gmail.com',NOW()),
      ('ce8fa478-858b-43dd-ad6e-59cdbda44e15','Adilson Soares','adilson@gmail.com',NOW()),
      ('bebcb7ee-fb9a-4569-a006-cc4e54977887','Roberto Lima','roberto@gmail.com',NOW())
      ON CONFLICT (id) DO NOTHING;  -- evita inserir duplicado pelo id
    `;

    await pool.query(dados);

    console.log('Dados inseridos com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir dados:', error);
  }
}

async function getAllUsers() {
  try {
    const result = await pool.query('SELECT * FROM dummy_data');
    return result.rows;
  } catch (err) {
    console.error('Erro ao buscar dados:', err);
    throw err;
  }
}

module.exports = { inicializacao, getAllUsers };