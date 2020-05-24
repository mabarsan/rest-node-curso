const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const app = express();
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

app.get('/usuario', verificaToken, function(req, res) {

    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;
    let estado = req.query.estado || true;
    // Usuario.find({}, ' nombre email role google state ') Campos que se muestran en la consulta
    Usuario.find({ state: estado }, )
        .skip(desde)
        .limit(limite)
        .exec().then(async usuarios => {
            let total = await Usuario.count({ state: estado });
            res.json({
                ok: true,
                registros: total,
                usuarios
            });

        })
        .catch(err => {
            res.status(400).json({
                ok: false,
                error: err.message
            });
        });


});

app.post('/usuario', [verificaToken, verificaAdminRole], function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save().then(usuarioDB =>  {
        console.log(usuarioDB)
        res.json({
            ok: true,
            usuario: usuarioDB
        });

    }).catch(err => {

        res.status(400).json({
            ok: false,
            error: err.message
        });

    });

});

app.put('/usuario/:id', [verificaToken, verificaAdminRole], function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'password', 'img']);
    if (body.password) {
        body.password = bcrypt.hashSync(body.password, 10);
    }

    Usuario.findOneAndUpdate({ _id: id }, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.json({
                ok: true,
                usuario: usuarioDB
            });
        }
    });

});

app.delete('/usuario/:id', [verificaToken, verificaAdminRole], function(req, res) {

    let id = req.params.id;

    Usuario.findByIdAndUpdate({ _id: id }, { state: false }).then(usuarioDb => {
        res.json({
            ok: true,
            borrado: true,
            usuario: usuarioDb
        });
    }).catch(err => {
        res.status(400).json({
            ok: false,
            error: err
        });
    });
});

module.exports = app;