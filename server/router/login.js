const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
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

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}




app.post('/google', async(req, res) => {

    let token = req.body.id_token;

    let usuarioGoogle = await verify(token).catch(e => {
        res.status(403).json({
            ok: false,
            error: e
        });
    });

    let email = usuarioGoogle.email;
    let usuario = await Usuario.findOne({ email }).catch(err => {
        res.status(500).json({
            ok: false,
            error: err
        });
    });

    if (usuario) {
        if (!usuario.google) {
            res.status(400).json({
                ok: false,
                error: 'No puede acceder con google, es necesario acceso estandar'
            });
        } else {
            let token = jwt.sign({
                usuario
            }, process.env.SEED_TOKEN, { expiresIn: 60 * 60 * 24 * 30 });

            res.json({
                ok: true,
                usuario,
                token
            });
        }
    } else {
        let usuarioNew = new Usuario({
            nombre: usuarrioGoogle.nombre,
            email: usuarrioGoogle.email,
            img: usuarrioGoogle.img,
            google: true,
            password: ';)'
        });

        let usuarioDb = await usuarioNew.save().catch(err => {
            res.status(500).json({
                ok: false,
                error: err
            });
        });

        let token = jwt.sign({
            usuarioDb
        }, process.env.SEED_TOKEN, { expiresIn: 60 * 60 * 24 * 30 });

        console.log(usuarioNew);
        res.json({
            ok: true,
            usuario: usuarioDb,
            token
        });
    }
});


module.exports = app;