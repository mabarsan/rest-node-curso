require('./config/config');
const express = require('express')
const app = express();

var bodyParser = require('body-parser');


// create application/json parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/usuario', function(req, res) {
    res.json('Hello World GET')
});

app.post('/usuario', function(req, res) {

    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es obligatorio'
        })
    } else {

        res.json({
            usuario: body
        });
    }

});

app.put('/usuario', function(req, res) {
    res.json('Hello World PUT')
})

app.delete('/usuario', function(req, res) {
    res.json('Hello World DELETE')
})

app.listen(process.env.PORT);
console.log('Servidor iniciado en puerto:' + process.env.PORT);