const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const db = require('../db'); 

/* GET home page. */
router.get('/', async function (req, res, next) {
  
  try {
    
    await db.inicializacao(); 

    const dados = await db.getAllUsers(); 

    const publicDir = path.join(__dirname, '..', 'public');

    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true }); 
      console.log('Pasta "public" criada.');
    }

    const filePath = path.join(publicDir, 'data.json');

    if (!fs.existsSync(filePath)) {
      await fs.promises.writeFile(filePath, JSON.stringify(dados, null, 2));
      console.log('Arquivo data.json criado com sucesso em /public');
    } else {
      console.log('O arquivo data.json já existe. Nenhuma alteração feita.');
    }

    res.render('index', { title: 'Express' });

  } catch (error) {
    console.error('Erro no GET /:', error);
    res.status(500).send('Erro interno no servidor');
  }
});

module.exports = router;