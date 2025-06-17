const express = require('express');
const router = express.Router();
const fs = require('fs')
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Chance = require('chance');
const chance = new Chance();
const pool = require('../pool');

const fileDados = path.join(__dirname, '..', 'public', 'data.json');

/* GET home page. */
router.get('/', async function(req, res, next) {
  
  try {

    const pessoa = await pool.query('SELECT id, nome, email, dt_cadastro FROM dummy_data')
      
    if (pessoa) {
      res.json(pessoa.rows);
    } else {
        res.status(404).json({ message: 'Nome não encontrado' });
    }

  } catch (err) {
    console.error('Erro ao ler data.json:', err);
    res.status(500).json({ erro: 'Erro ao acessar os dados' });
  }
});

router.get('/nome/:pNome', async function(req, res, next) {
  
  try {
        
    const name = req.params.pNome.toLowerCase(); // Se for usar o LIKE excluir o toLowerCase();  
         
    //$1::text                                                           // O ILIKE ele não se importa se esta minuscula ou maiscula 
    const pessoa = await pool.query('SELECT id, nome, email, dt_cadastro FROM dummy_data WHERE nome ILIKE $1::text', [`%${name}%`]);
    console.log("pessoa ", pessoa);                                             

    if (pessoa) {
      res.json(pessoa.rows);
    } else {
        res.status(404).json({ message: 'Nome não encontrado' });
    }

  } catch (error) {
    console.error('Erro ao buscar nome:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.get('/email/:pEmail', async function(req, res, next) {
  
    try {
        
        const email = req.params.pEmail.toLowerCase();

        const pessoa = await pool.query('SELECT id, nome, email, dt_cadastro FROM dummy_data WHERE email ILIKE $1::text', [`%${email}%`]);
        console.log("pessoa ", pessoa);                                             

          if (pessoa) {
            res.json(pessoa.rows);
          } else {
            res.status(404).json({ message: 'Nome não encontrado' });
          }

        if (pessoa) {
            res.json(pessoa);
        } else {
            res.status(404).json({ message: 'Email não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao buscar nome:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }

});

/* POST home page. */
router.post('/', async function(req, res, next) {
    
  try {
        
    const dadosNovo = {
      id: uuidv4(),
      nome: chance.name(),
      email: chance.email(),
      dt_cadastro: new Date().toISOString()
    };

    await pool.query(
      'INSERT INTO dummy_data (id, nome, email, dt_cadastro) VALUES ($1, $2, $3, $4)',
      [dadosNovo.id, dadosNovo.nome, dadosNovo.email, dadosNovo.dt_cadastro]
    );

    res.status(201).json(dadosNovo);

    } catch (err) {
      console.error('Erro ao processar POST /:', err);
      res.status(500).json({ erro: 'Erro interno no servidor' });
    }

});

router.delete('/delete/:pId', async function(req, res, next) {
  
  try {
    
    const id = req.params.pId.toLowerCase();

    const dataStr = await fs.promises.readFile(fileDados, 'utf-8');
    let dados = JSON.parse(dataStr);

    const index = dados.findIndex(d => d.id.toLowerCase() === id);

    if (index !== -1) {
      
      const pessoaDeletada = dados.splice(index, 1)[0];

      await fs.promises.writeFile(fileDados, JSON.stringify(dados, null, 2));

      res.json({ message: 'Usuário deletado com sucesso', pessoa: pessoaDeletada });
    } else {
      res.status(404).json({ message: 'Usuário não encontrado' });
    }

  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.put('/edita/:pId', async function(req, res, next) {
  
  try {

    const id = req.params.pId.toLowerCase();
    
    const { nome, email } = req.body; 

    const dataStr = await fs.promises.readFile(fileDados, 'utf-8');
    let dados = JSON.parse(dataStr);

    const index = dados.findIndex(d => d.id.toLowerCase() === id);

    if (index !== -1) {

      if (nome) dados[index].nome = nome;
      if (email) dados[index].email = email;

      await fs.promises.writeFile(fileDados, JSON.stringify(dados, null, 2));

      res.json({ message: 'Usuário atualizado com sucesso', usuario: dados[index] });
    } else {
      res.status(404).json({ message: 'Usuário não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao editar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;
