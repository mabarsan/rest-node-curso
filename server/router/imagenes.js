const express = require('express');
const { verificaTokenUrl } = require('../middlewares/autenticacion');
const path = require('path');
const fs = require('fs');

let app = express();


app.get('/imagenes/:tipo/:img', verificaTokenUrl, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathUrl = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');

    if (fs.existsSync(pathUrl)) {
        res.sendFile(pathUrl);
    } else {
        res.sendFile(noImagePath);
    }

});

module.exports = app;