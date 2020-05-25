/******************
 *     Puerto
 *******************/
process.env.PORT = process.env.PORT || 3000;

/******************
 *     ENTORNO
 *******************/
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/******************
 *     BBDD
 *******************/
let urlDb;

/******************
 *     SEED
 *******************/
process.env.SEED_TOKEN = process.env.SEED_TOKEN ||  'EstaEsLaFirmaDeDesarrollo-202005';

/******************
 *     FECHA TOKEN
 *******************/

// 60 seg * 60 min * 24 h * 60 d
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

if (process.env.NODE_ENV === 'dev') {
    urlDb = 'mongodb://cafe:Inovages2014@localhost:27017/cafe';
} else {
    urlDb = process.env.MONGO_URI;
}

process.env.URL_BD = urlDb;

/******************
 *     GOOGLE ID
 *******************/
process.env.CLIENT_ID = process.env.CLIENT_ID ||  '985802351589-gc2un9ocsl4q91i9pialva91h3vvgj8r.apps.googleusercontent.com';