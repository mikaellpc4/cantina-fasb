// O nodemon reinica e aplica alterações feitas no programa automaticamente
// Normalmente é necessario reiniciar o servidor para ver as mudanças

const cookieParser = require('cookie-parser');
const path = require('path');
const flash = require('express-flash');
const express = require('express'); //express é responsavel por iniciar o app pelo NodeJS
const session = require('express-session');
const route = require('../routes/route');
const db = require('../routes/database');
const errorHandler = require('../middleware/errorHandler')

const app = express(); //inicia o servidor
//Em caso de servidor web alterar isso 

//Configuração do Flash para enviar mensagens   
app.use(session({
    cookie: { maxAge: 60000 },
    secret: 'woot',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

const publicDirectory = path.join(__dirname, '../public'); //Aonde ficara os JS e CSS da pagina
//dirname = pega o acesso do diretorio atual aonde está
app.use(express.static(publicDirectory)); //faz com que o programa use o publicDirectory como acesso
app.set('view engine', 'ejs'); //ejs é a view engine que sera usada para exibir o HTML
app.set('views', path.join(__dirname, 'views'))// deterina aonde se localiza a pasta com as views para o ejs

//Facilita a interação com cookies
app.use(cookieParser());

//Permite receber os valores em JSON como resposta
app.use(express.json())

//Envia os dados recebidos pelo HTML via forms
app.use(express.urlencoded({ extended: false }))

//Usa as rotas que estão criadas na pasta rotas
app.use(route)

//Global error handler
app.use(errorHandler);

const checkTableExist = async () => {
        const results = await db.query(`SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'users'`);
        if (results.rows.length > 0) {
            return true
        }
        return false
}

const createTable = async (err) => {
    await db.connect();
    if (await checkTableExist() == false) {
        console.log('Table not found, creating a new table')
        await db.query(`CREATE TABLE users (
                     id SERIAL PRIMARY KEY,
                     role varchar(100) NOT NULL,
                     name varchar(100) NOT NULL,
                     email varchar(100) NOT NULL UNIQUE,
                     celular varchar(11) NOT NULL UNIQUE,
                     password varchar(255) NOT NULL,
                     status varchar(100) NOT NULL DEFAULT 'unconfirmed',
                     refreshTokens varchar[] UNIQUE
                 )`)
        return
    }
    console.log('PostgreSQL OK!')
}

const start = async () => {
    console.log('------------------------------------------------------------------------------')
    await createTable()
    app.listen(3000, () => {
        console.log("App ON")
        console.log("Port 3000")
    })
}

start()