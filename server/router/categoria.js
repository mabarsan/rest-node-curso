const express = require('express');
let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
const Categoria = require('../models/categoria');


let app = express();

/**
 * Lista las categorias existentes
 */
app.get('/categoria', [verificaToken], (req, res) => {

    Categoria.find()
        .populate('usuario')
        .sort('descripcion')
        .then(categorias => {

            res.json({
                ok: true,
                categorias
            });

        }).catch(err => {
            res.status(400).json({
                ok: false,
                error: err
            });
        });
});


app.get('/categoria/:id', [verificaToken], (req, res) => {

    let id = req.params.id;

    Categoria.findById(id).then(categoriaDb => {

        if (!categoriaDb) {
            return res.json({
                ok: true,
                categoria: 'No existe ninguna categoria con ese ID'
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDb
        });

    }).catch(err => {
        res.status(400).json({
            ok: false,
            error: err
        });
    })

});


/**
 * Crea una nueva categoria
 */
app.post('/categoria', [verificaToken], (req, res) => {

    let body = req.body;
    let idUsuario = req.usuario._id;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: idUsuario
    });

    categoria.save().then(categoriaDb => {

        res.json({
            ok: true,
            categoria: categoriaDb
        });

    }).catch(err => {
        res.status(500).json({
            ok: false,
            error: err
        });
    })

});

/**
 * Actualiza una categoria
 */
app.put('/categoria/:id', [verificaToken], (req, res) => {

    let body = req.body;
    let id = req.params.id;
    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }).then(categoriaDb => {

        if (!categoriaDb) {
            return res.status(400).json({
                ok: false,
                categoria: 'Categoria no encontrada',
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDb
        });

    }).catch(err => {
        res.status(500).json({
            ok: false,
            error: err
        });
    });
});

app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id).then(categoriaDb => {

        if (!categoriaDb) {
            return res.status(400).json({
                ok: false,
                categoria: 'Categoria no encontrada',
            });
        }

        res.json({
            ok: true,
            estado: 'Eliminada',
            categoria: categoriaDb
        });

    }).catch(err => {
        res.status(500).json({
            ok: false,
            error: err
        });
    });
});

module.exports = app;