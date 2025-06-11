const express = require('express');
const router = express.Router();
const fs = require('fs')
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Chance = require('chance');
const chance = new Chance();

const fileDados = path.join(__dirname, '..', 'public', 'data.json');

/* GET home page. */
router.get('/', async function(req, res, next) {
  
  try {
      
    if (fs.existsSync(fileDados)) {
      const fileData = await fs.promises.readFile(fileDados, 'utf-8');
      const dados = JSON.parse(fileData);
      res.json(dados);
    } else {
      res.status(404).json({ erro: 'Arquivo data.json não encontrado' });
    }

  } catch (err) {
    console.error('Erro ao ler data.json:', err);
    res.status(500).json({ erro: 'Erro ao acessar os dados' });
  }
});

router.get('/nome/:pNome', async function(req, res, next) {
  
  try {
        
    const name = req.params.pNome.toLowerCase();

    const dataStr = await fs.promises.readFile(fileDados, 'utf-8');
    const dados = JSON.parse(dataStr);

    const pessoa = dados.find(d => d.nome.toLowerCase().includes(name));

    if (pessoa) {
      res.json(pessoa);
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

        const dataStr = await fs.promises.readFile(fileDados, 'utf-8');
        const dados = JSON.parse(dataStr);

        const pessoa = dados.find(d => d.email.toLowerCase().includes(email));

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

        
    let dados = [];
    if (fs.existsSync(fileDados)) {
      const fileData = await fs.promises.readFile(fileDados, 'utf-8');
      dados = JSON.parse(fileData);
    }

    dados.push(dadosNovo);

    await fs.promises.writeFile(fileDados, JSON.stringify(dados, null, 2));

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
