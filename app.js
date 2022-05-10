// O nodemon reinica e aplica alterações feitas no programa automaticamente
// Normalmente é necessario reiniciar o servidor para ver as mudanças

const express = require('express'); //express é responsavel por iniciar o server pelo NodeJS
const path = require('path');
const mysql = require('mysql'); 
const dotenv = require('dotenv');

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



const publicDirectory = path.join(__dirname, './public'); //Aonde ficara os JS e CSS da pagina
                                //dirname = pega o acesso do diretorio atual aonde está
app.use(express.static(publicDirectory)); //faz com que o programa use o publicDirectory como acesso
app.set('view engine', 'hbs'); //hbs é a view engine que sera usada para exibir o HTML

//Envia os dados recebidos pelo HTML via forms
app.use(express.urlencoded({ extended: false }))

//Recebe os valores em forma de JSON
app.use(express.json())
 
db.getConnection( (error) => {
    if(error) {
        console.log(error);
    }else{
        console.log("MySQL OK!")
        app.listen(3000, () => {
            console.log("Server on")
            console.log("Port 3000") 
        });
    }
});

db.on('connect',function() {
    console.log('Conexão estabelecida')
})

//Define Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));