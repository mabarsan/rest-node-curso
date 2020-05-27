const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const { verificaToken } = require('../middlewares/autenticacion');

const Usuario = require('../models/usuario');
const Producto = require('../models/productos');

const app = express();
app.use(fileUpload());

app.put('/upload/:tipo/:id', verificaToken, (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    let tiposPermitidos = ['usuarios', 'productos'];

    //Verifico que el tipo esta permitido
    if (tiposPermitidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            error: 'La extensión ' + tipo + ' no esta permitida, solo de admiten: ' + tiposPermitidos.join(', ')
        });
    }

    if (!req.files) {
        res.status(400).json({
            ok: false,
            error: 'No se ha seleccionado archivos'
        });
    }
    let extPermitidas = ['jpg', 'png', 'gif', 'jpeg'];
    let archivo = req.files.archivo;
    let archivoDividido = archivo.name.split('.');

    let extArchivo = archivoDividido[archivoDividido.length - 1];
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extArchivo}`;

    //Verifico que la extension esta permitida
    if (extPermitidas.indexOf(extArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            error: 'La extensión ' + extArchivo + ' no esta permitida, solo se admiten: ' + extPermitidas.join(', ')
        });
    }


    archivo.mv(`uploads/${ tipo }/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        //imagen cargada

        switch (tipo) {
            case 'usuarios':
                imagenUsuario(id, res, nombreArchivo);
                break;
            case 'productos':
                imagenProducto(id, res, nombreArchivo);
                break;
        }



    })
});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id).then(async usuarioDb => {

        if (!usuarioDb) {
            res.status(400).json({
                ok: false,
                menssage: 'No existe el usuario en la base de datos'
            });
        }

        borrarArchivo(usuarioDb.img, 'usuarios');

        usuarioDb.img = nombreArchivo;
        usuarioDb.save().then(usuario => {

            res.json( {
                ok: true,
                usuario: usuario
            });

        });


    }).catch(err => {
        res.status(500).json({
            ok: false,
            error: err
        });
    });

}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id).then(async productoDb => {

        if (!productoDb) {
            res.status(400).json({
                ok: false,
                menssage: 'No existe el producto en la base de datos'
            });
        }
        if (productoDb.img) {
            borrarArchivo(productoDb.img, 'productos');
        }
        productoDb.img = nombreArchivo;
        productoDb.save().then(usuario => {

            res.json( {
                ok: true,
                producto: productoDb
            });

        });


    }).catch(err => {
        res.status(500).json({
            ok: false,
            error: err
        });
    });

}

function borrarArchivo(img, tipo) {
    //Borrar archivo
    let pathUrl = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    if (fs.existsSync(pathUrl)) {
        fs.unlinkSync(pathUrl);
    }
}

module.exports = app;