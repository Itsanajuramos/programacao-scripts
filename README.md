# programacao-scripts
Prova 2

Este código é uma aplicação Node.js utilizando o framework Express para criar um servidor web. Além disso, faz uso do Prisma como ORM (Object-Relational Mapping) para interagir com o banco de dados. A aplicação fornece rotas para lidar com operações relacionadas a usuários, como registro, login, perfil, atualização de perfil e exclusão de conta.

Aqui estão as explicações detalhadas para cada rota e uma descrição dos métodos HTTP utilizados:

Configuração e Middleware

Express Setup:
const express = require('express');: Importa o módulo Express.
const app = express();: Inicializa a aplicação Express.

Session Middleware:
const session = require('express-session');: Importa o módulo de sessão.
app.use(session({ ... }));: Configura o middleware de sessão para gerenciar sessões de usuário.

Prisma Setup:
const { PrismaClient } = require('@prisma/client');: Importa o cliente Prisma.
const prisma = new PrismaClient();: Inicializa o cliente Prisma para interação com o banco de dados.

Body Parser Middleware:
const bodyParser = require('body-parser');: Importa o middleware body-parser.
app.use(bodyParser.urlencoded({ extended: true }));: Configura o body-parser para tratar dados de formulário.
app.use(express.json());: Permite que a aplicação lide com dados JSON.

EJS Setup:
Configura o mecanismo de visualização EJS para renderizar páginas HTML dinamicamente.

Method Override Middleware:
const methodOverride = require('method-override');: Importa o método override para simular solicitações DELETE via POST.
app.use(methodOverride('_method'));: Configura o método override como middleware.


Rotas


Rota para a Página Inicial (GET /):
app.get('/', ...): Renderiza a página inicial.

Rota para a Página de Cadastro (GET /register):
app.get('/register', ...): Renderiza a página de registro com um parâmetro indicando o sucesso do cadastro.

Rota para Processar o Formulário de Registro (POST /register):
app.post('/register', ...): Processa o formulário de registro, valida os dados e cria um novo usuário no banco de dados.

Rota para a Página de Login (GET /login):
app.get('/login', ...): Renderiza a página de login.

Rota para Processar o Formulário de Login (POST /login):
app.post('/login', ...): Processa o formulário de login, valida as credenciais e autentica o usuário.

Rota para a Página de Perfil (GET /profile/:userId):
app.get('/profile/:userId', ...): Renderiza a página de perfil com base no ID do usuário na URL.

Rota para Processar o Formulário de Atualização de Perfil (POST /profile):
app.post('/profile', ...): Processa o formulário de atualização de perfil, verifica a autenticação e atualiza os dados do usuário no banco de dados.

Rota para a Página de Confirmação de Exclusão de Conta (GET /profile/delete/:userId):
app.get('/profile/delete/:userId', ...): Renderiza a página de confirmação de exclusão com os dados do usuário.

Rota para Processar a Exclusão de Conta (DELETE /profile/delete/:userId):
app.delete('/profile/delete/:userId', ...): Exclui o usuário do banco de dados e redireciona para a página inicial.


Descrição dos Métodos HTTP:


POST: Utilizado para enviar dados ao servidor, como formulários. No contexto da aplicação, é usado para processar informações de registro, login e atualização de perfil.

GET: Utilizado para requisitar dados do servidor. Na aplicação, é usado para acessar páginas e informações públicas, como a página inicial, de registro, login e perfil.

PUT (simulado com Method Override): Normalmente utilizado para atualizar informações no servidor, mas neste caso, é simulado pelo método override para simular solicitações PUT via POST. Na aplicação, é utilizado para processar formulários de atualização de perfil. (É o único jeito que consegui fazer funcionar kkk)

DELETE: Utilizado para solicitar a remoção de recursos no servidor. Na aplicação, é usado para excluir a conta do usuário.
