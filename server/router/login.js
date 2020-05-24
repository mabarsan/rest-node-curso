const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');



app.post('/login', async(req, res) => {

    let body = req.body;
    let usuario = await Usuario.findOne({ email: body.email });

    if (!usuario) {
        return res.status(400).json({
            ok: false,
            err: 'Usuaio o contraseña incorrecta'
        });
    } else {
        if (!bcrypt.compareSync(body.password, usuario.password)) {
            return res.status(400).json({
                ok: false,
                err: 'Usuaio o contraseña incorrecta'
            });
        }

        let token = jwt.sign({
            usuario
        }, process.env.SEED_TOKEN, { expiresIn: 60 * 60 * 24 * 30 });

        return res.json({
            ok: true,
            usuario,
            token
        });
    }
});


module.exports = app;