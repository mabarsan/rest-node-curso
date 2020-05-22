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

if (process.env.NODE_ENV === 'dev') {
    urlDb = 'mongodb://cafe:Inovages2014@localhost:27017/cafe';
} else {
    urlDb = process.env.MONGO_URI;
}

process.env.URL_BD = urlDb;