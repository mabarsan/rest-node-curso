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
    console.log(usuario.role);
    if (usuario.role != 'ADMIN_ROLE') {
        res.status(401).json({
            ok: false,
            error: 'Usuario sin premisos para realiza la acción solicitada'
        });
    } else {
        next();
    }

};

module.exports = {
    verificaToken,
    verificaAdminRole
};