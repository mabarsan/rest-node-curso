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
    urlDb = 'mongodb+srv://mabarsan:Mbs955095@cluster0-5d0vz.mongodb.net/cafe';
}

process.env.URL_BD = urlDb;