const jwt = require('jsonwebtoken');
require('../config/config');
/***********************
 * 
 *  Verifica Token
 * 
 ************************/

let verificaToken = (req, res, next) => {

    let token = req.get('token'); // nombre del headrer

    jwt.verify(token, process.env.SEED_TOKEN, (err, decode) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                error: err
            });
        }

        req.usuario = decode.usuario;
        next();
    });
};

/***********************
 * 
 *  Verifica Admin
 * 
 ************************/

let verificaAdminRole = (req, res, next) => {

    let usuario = req.usuario;
    if (usuario.role != 'ADMIN_ROLE') {
        res.status(401).json({
            ok: false,
            error: 'Usuario sin premisos para realiza la acción solicitada'
        });
    } else {
        next();
    }

};

/***********************
 * 
 *  Verifica Admin
 * 
 ************************/

let verificaTokenUrl = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED_TOKEN, (err, decode) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                error: err
            });
        }

        req.usuario = decode.usuario;
        next();
    });

};

module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenUrl
};