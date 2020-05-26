const mongoose = require('mongoose');
const Contrato = require('./contrato');
const Calendaro = require('./calendario');
const Alumno = require('./alumnos');
const Curso = require('./curso');




let Schema = mongoose.Schema;

let profesorSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El campo nombre es necesario'],
    },
    apellidos: {
        type: String,
        required: [true, 'El campo apellido es necesario'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El campo email es necesario']
    },
    telefono: {
        type: String, // preparar PIPE
        required: [true, 'El campo teléfono es necesario']
    },
    direccion: {
        type: String,
    },
    cp: {
        type: Number
    },
    avatar: {
        type: String
    },
    usuario: {
        type: String,
        required: [true, 'El campo usuario es necesaruo'],
        unique: true
    },
    pasword: {
        type: String,
        required: true
    },
    contrato: {
        type: Contrato,
        required: true
    },
    calendario: {
        type: Calendaro,
        // Autogenerado al crear el profesor ( se crea limpio)
    },
    alumnos: {
        type: [...Alumno]
    },
    cursos: {
        type: [...Curso]
    }

});

module.exports = mongoose.model('Profesor', profesorSchema);