require('./config/config');
const mongoose = require('mongoose');
const express = require('express')

const app = express();

var bodyParser = require('body-parser');


// create application/json parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('./config/router/usuario'));


mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.URL_BD, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err, resp) => {
    if (err) throw err;
    console.log('Base de datos online');
});

app.listen(process.env.PORT);
console.log('Servidor iniciado en puerto:' + process.env.PORT);