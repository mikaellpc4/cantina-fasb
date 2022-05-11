// O nodemon reinica e aplica alterações feitas no programa automaticamente
// Normalmente é necessario reiniciar o servidor para ver as mudanças

const express = require('express'); //express é responsavel por iniciar o app pelo NodeJS
const path = require('path');
const mysql = require('mysql'); 
const dotenv = require('dotenv');
const route = require('./route');
const flash = require('express-flash');
const session = require('express-session');

dotenv.config({ path: './.env'});

const app = express(); //inicia o servidor
//Em caso de servidor web alterar isso
const db = mysql.createPool({
    connectionLimit : 10,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

app.use(session({ cookie: { maxAge: 60000 }, 
    secret: 'woot',
    resave: false, 
    saveUninitialized: false}));
app.use(flash());

const publicDirectory = path.join(__dirname, '../public'); //Aonde ficara os JS e CSS da pagina
                                 //dirname = pega o acesso do diretorio atual aonde está
app.use(express.static(publicDirectory)); //faz com que o programa use o publicDirectory como acesso
app.set('view engine', 'ejs'); //ejs é a view engine que sera usada para exibir o HTML
app.set('views', path.join(__dirname, 'views'))
app.use(route)

//Envia os dados recebidos pelo HTML via forms
app.use(express.urlencoded({ extended: false }))

//Recebe os valores em forma de JSON
app.use(express.json())

app.get('/', function(req, res) {
    res.render('pages/index');
});


//conexões com banco de dados

db.getConnection( (error, connection) => {
    if(error) {
        console.log(error);
    }else{
        db.query(
                `
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY auto_increment,
                    name varchar(100) NOT NULL,
                    email varchar(255) NOT NULL,
                    celular INTEGER NOT NULL,
                    password varchar(255) NOT NULL
                  )
                `
        )
        console.log("MySQL OK!")
        app.listen(3000, () => {
            console.log("app on")
            console.log("Port 3000") 
        });
    }
    connection.release();
});

db.on('connect',function() {
    console.log('Conexão estabelecida')
})

//Define Routes
app.use('/auth', require('../routes/auth'));