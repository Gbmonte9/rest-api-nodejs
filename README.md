# 📦 NodeJS - Aula 16 - REST API

## 📝 Descrição

Este projeto é uma API RESTful desenvolvida durante a Aula 16 do curso de Node.js, com o objetivo de praticar o consumo e a manipulação de dados utilizando rotas HTTP e integração com banco de dados PostgreSQL. A API permite **buscar, criar, editar e deletar registros** de forma segura, estruturada e escalável.

## 🚀 Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [pg (node-postgres)](https://node-postgres.com/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [uuid](https://www.npmjs.com/package/uuid)
- [chance](https://www.npmjs.com/package/chance) (para gerar dados aleatórios)
- [express-generator](https://expressjs.com/en/starter/generator.html)

## 📁 Estrutura do Projeto

Projeto gerado com o `express-generator`, com as seguintes pastas principais:

```
├── routes/
│   └── dados.js          # Rotas para manipulação dos dados
├── public/
│   └── data.json         # Arquivo de dados em formato JSON
├── .env                  # Variáveis de ambiente protegidas
├── db.js                 # Lógica de conexão com PostgreSQL
├── app.js                # Configuração principal do Express
├── package.json
└── README.md
```

## 🔐 Segurança com `.env`

O projeto utiliza a biblioteca `dotenv` para proteger dados sensíveis como:

```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=hm16
```

Essas informações são carregadas no código via `process.env`, garantindo que não fiquem expostas no repositório.

> **Obs:** O arquivo `.env` está incluído no `.gitignore` e não deve ser versionado.

---

## 🧪 Rotas da API

### ✅ Buscar todos os dados
```
GET /dados/
```
**Exemplo:**
```bash
curl -X GET http://localhost:3000/dados/
```

### 🔍 Buscar por nome
```
GET /dados/nome/:pNome
```
**Exemplo:**
```bash
curl -X GET http://localhost:3000/dados/nome/marcos
```

### 🔍 Buscar por email
```
GET /dados/email/:pEmail
```
**Exemplo:**
```bash
curl -X GET http://localhost:3000/dados/email/zulu
```

---

### ➕ Adicionar novo dado
```
POST /dados/
```
**Exemplo:**
```bash
curl -X POST http://localhost:3000/dados/
```

---

### ❌ Deletar um registro por ID
```
DELETE /dados/delete/:id
```
**Exemplo:**
```bash
curl -X DELETE http://localhost:3000/dados/delete/123e4567-e89b-12d3-a456-426614174000
```

---

### ✏️ Editar um registro por ID
```
PUT /dados/edita/:id
```
**Exemplo:**
```bash
curl -X PUT -H "Content-Type: application/json" \
     -d '{"nome": "Novo Nome", "email": "novo@email.com"}' \
     http://localhost:3000/dados/edita/123e4567-e89b-12d3-a456-426614174000
```

---

## 📦 Instalação e Execução

1. Clone o repositório:
```bash
git clone https://github.com/Gbmonte9/rest-api-nodejs.git
```

2. Instale as dependências:
```bash
npm install
```

3. Crie um arquivo `.env` com suas configurações:
```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=hm16
```

4. Inicie o servidor:
```bash
npm start
```

Servidor disponível em: [http://localhost:3000](http://localhost:3000)

---

## ✍️ Autor

Gabriel Monte – [LinkedIn](https://www.linkedin.com/in/gabriel-rodrigues-mt/)  
Estudante de Engenharia de Software na Estácio & Desenvolvedor Fullstack na Step Computer Academy

---