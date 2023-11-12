const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

// Configuração para usar o cookie-parser e express-session
app.use(cookieParser());
app.use(session({
    secret: 'minhachave',
    resave: false,
    saveUninitialized: true,
}));

// Configuração do Express para servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

const produtos = [
    { id: 1, nome: 'Arroz', preco: 25 },
    { id: 2, nome: 'Feijão', preco: 15 },
    { id: 3, nome: 'Bife', preco: 40 },
];

// Rota para exibir a lista de produtos na raiz "/"
app.get('/', (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Lista de Produtos</title>
            <link rel="stylesheet" type="text/css" href="/style.css">
        </head>
        <body>
            <div class="container">
                <h1>Lista de Produtos</h1>
                <ul>
                    ${produtos.map(
                        (produto) => `<li>${produto.nome} - ${produto.preco} <a href="/adicionar/${produto.id}">Adicionar ao Carrinho</a></li>`
                    ).join("")}
                </ul>
                <a id="carrinho" href="/carrinho">Ver Carrinho</a>
            </div>
        </body>
        </html>
    `);
});

// Rota para adicionar um produto ao carrinho
app.get('/adicionar/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const produto = produtos.find(p => p.id === id);

    if (produto) {
        if (!req.session.carrinho) {
            req.session.carrinho = [];
        }
        req.session.carrinho.push(produto);
    }

    res.redirect('/');
});

// Rota para remover o último item do carrinho
app.get('/remover', (req, res) => {
    const carrinho = req.session.carrinho || [];

    if (carrinho.length > 0) {
        carrinho.pop(); // Remover o último item do carrinho
    }

    res.redirect('/carrinho');
});

// Rota para exibir o carrinho de compras
app.get('/carrinho', (req, res) => {
    const carrinho = req.session.carrinho || [];
    const total = carrinho.reduce((acc, produto) => acc + produto.preco, 0);

    res.send(`
        <html class="carrinho">
        <head>
            <title>Carrinho de Compras</title>
            <link rel="stylesheet" type="text/css" href="/style.css">
        </head>
        <body class="container carrinho">
            <h1>Carrinho de compras</h1>
            <ul>
                ${carrinho.map(
                    (produto) => `<li>${produto.nome} - ${produto.preco}</li>`
                ).join("")}
            </ul>
            <p>Total: R$${total}</p>
            <a class="button button-green" href="/">Continuar comprando</a>
            <br>
            <a class="button button-red" href="/remover">Remover último item do carrinho</a>
        </body>
        </html>
    `);
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log("Aplicação rodando na porta 3000");
});
