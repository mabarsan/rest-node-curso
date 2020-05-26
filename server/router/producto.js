const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

const Producto = require('../models/productos');

app = express();


/**
 * Listado de producotos (populate usuario y categoria) ordenado y paginado
 */
app.get('/productos', verificaToken, (req, res) => {
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;
    let disponible = req.query.disponible || true;

    Producto.find({ disponible: disponible })
        .populate('usuario')
        .populate('categoria')
        .sort('nombre')
        .skip(desde)
        .limit(limite)
        .then(productos => {

            if (!productos) {
                return res.status(400).json({
                    ok: false,
                    error: 'No existen productos que mostrar'
                });
            }

            res.json({
                ok: true,
                productos
            });

        }).catch(err => {
            return res.status(500).json({
                ok: false,
                error: err
            });
        });

});

/**
 * Producto por ID (populate usuario y categoria)
 */
app.get('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id).populate('usuario').populate('categoria').then(productos => {

        if (!productos) {
            return res.status(400).json({
                ok: false,
                error: 'No existen productos que mostrar'
            });
        }

        res.json({
            ok: true,
            productos
        });

    }).catch(err => {
        return res.status(500).json({
            ok: false,
            error: err
        });
    });

});

/**
 * Busqueda de producto
 */

app.get('/productos/buscar/:busca', verificaToken, (req, res) =>  {

    let regex = new RegExp(req.params.busca, 'i');
    console.log(regex);
    Producto.find({ nombre: regex })
        .populate('usuario')
        .populate('categoria')
        .sort('nombre')
        .then(productos => {

            if (!productos) {
                return res.status(400).json({
                    ok: false,
                    error: 'No existen productos que mostrar'
                });
            }

            res.json({
                ok: true,
                productos
            });

        }).catch(err => {
            return res.status(500).json({
                ok: false,
                error: err
            });
        });

})


/**
 * Crea u nuevo producto
 */
app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save().then(productoDb => {
        if (!productoDb) {
            return res.status(400).json({
                ok: false,
                error: 'NO ha sido posible almacenar el producto'
            });
        }

        res.json({
            ok: true,
            producto: productoDb
        });

    }).catch(err => {
        return res.status(500).json({
            ok: false,
            error: err
        });
    })

});

/**
 * Actualiza un produco por ID
 */
app.put('/porducto/:id', (req, res) => {
    let id = req.params.id;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: body.usuario
    });

    Producto.findByIdAndUpdate(id, producto, { new: true, runValidators: true }).then(productoDb => {
        if (!productoDb) {
            return res.status(400).json({
                ok: false,
                error: 'NO se ha podido actualizar el producto'
            });
        }

        res.json({
            ok: true,
            productos: productoDb
        })

    }).catch(err => {
        return res.status(500).json({
            ok: false,
            error: err
        });
    })

});

/**
 * Elimina un producto por ID (Desactiva, pone en false la propiedad disponible)
 */
app.delete('/producto/:id', (req, res) => {

    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true }).then(productoDb => {

        if (!productoDb) {
            return res.status(400).json({
                ok: false,
                error: 'NO se ha podido eliminar el producto'
            });
        }

        res.json({
            ok: true,
            productos: productoDb
        })

    }).catch(err => {
        return res.status(500).json({
            ok: false,
            error: err
        });
    })

});


module.exports = app;