const express = require('express');
const session = require('express-session');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Configurar o middleware de sessão
app.use(session({
  secret: 'sua-chave-secreta-aqui',
  resave: false,
  saveUninitialized: true,
}));

// Configurar EJS como o mecanismo de visualização
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Configurar Prisma
const prisma = new PrismaClient();

// Rota para a página inicial
app.get('/', (req, res) => {
  // Renderizar a página index.ejs
  res.render('index');
});

// Rota para a página de cadastro
app.get('/register', (req, res) => {
  // Passar um parâmetro para indicar o sucesso do cadastro
  res.render('register', { registrationSuccess: req.query.success === 'true' });
});

// Rota para processar o formulário de registro
app.post('/register', async (req, res) => {
  const {
    fullName,
    email,
    confirmEmail,
    phone,
    password,
    confirmPassword,
  } = req.body;

  // Validar se os campos de e-mail coincidem
  if (email !== confirmEmail) {
    return res.status(400).send('Emails do not match');
  }

  // Verificar se o e-mail já está em uso
  const existingUser = await prisma.usuario.findUnique({
    where: {
      email: email,
    },
  });

  if (existingUser) {
    return res.status(400).send('Email is already in use');
  }

  // Validar se as senhas coincidem
  if (password !== confirmPassword) {
    return res.status(400).send('Passwords do not match');
  }

  // Criar usuário no banco de dados
  const user = await prisma.usuario.create({
    data: {
      nome: fullName,
      email,
      telefone: phone,
      senha: password,
    },
  });

  // Redirecionar diretamente para a página de perfil com o ID do usuário na URL
  res.redirect(`/profile/${user.id}`);
});

// Rota para a página de login
app.get('/login', (req, res) => {
  res.render('login'); // Renderiza a página de login
});

// Rota para processar o formulário de login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validar o email e a senha
  const user = await prisma.usuario.findUnique({
    where: {
      email,
    },
  });

  if (!user || user.senha !== password) {
    console.log('Invalid login attempt');
    return res.status(401).send('Invalid email or password');
  }

  req.session.userId = user.id;

  console.log('Login successful');

  // Redirecionar para a página do perfil do usuário com o ID do usuário na URL
  res.redirect(`/profile/${user.id}`);
});

// Rota para a página de perfil
app.get('/profile/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  // Recuperar o usuário específico com base no ID fornecido na URL
  const user = await prisma.usuario.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return res.status(404).send('User not found');
  }

  // Renderizar a página de perfil com os dados específicos do usuário
  res.render('profile', { user});
});

// Rota para processar o formulário de atualização de perfil
app.post('/profile', async (req, res) => {
  const { fullName, email, phone, password } = req.body;

  // Recuperar o usuário autenticado
  const user = await prisma.usuario.findUnique({
    where: {
      email: req.body.email, // Use o email do usuário autenticado
    },
  });

  // Verificar se o usuário está autenticado
  if (!user) {
    return res.status(401).send('Unauthorized');
  }

  // Atualizar o perfil do usuário no banco de dados
  const updatedUser = await prisma.usuario.update({
    where: {
      id: user.id,
    },
    data: {
      nome: fullName,
      email,
      telefone: phone,
      senha: password, // Atualizar a senha se for fornecida
    },
  });

  res.render('profile', { user: updatedUser, updateSuccess: true, message: 'Dados Atualizados com Sucesso' });
});

const methodOverride = require('method-override');

// Configurar method-override para permitir a simulação de solicitações DELETE via POST
app.use(methodOverride('_method'));


// Rota para a página de confirmação de exclusão de conta
app.get('/profile/delete/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  // Verificar se o usuário está autenticado e se é o mesmo que está sendo excluído
  if (!req.session.userId || req.session.userId !== userId) {
    return res.status(401).send('Unauthorized');
  }

  // Recuperar o usuário específico com base no ID fornecido na URL
  const user = await prisma.usuario.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return res.status(404).send('User not found');
  }

  // Renderizar a página de confirmação de exclusão com os dados do usuário
  res.render('delete', { user });
});

// Rota para processar a exclusão de conta
app.delete('/profile/delete/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  // Verificar se o usuário está autenticado e se é o mesmo que está sendo excluído
  if (!req.session.userId || req.session.userId !== userId) {
    return res.status(401).send('Unauthorized');
  }

  // Excluir o usuário do banco de dados
  await prisma.usuario.delete({
    where: {
      id: userId,
    },
  });

  // Redirecionar para a página inicial após excluir a conta
  res.redirect('/');
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
