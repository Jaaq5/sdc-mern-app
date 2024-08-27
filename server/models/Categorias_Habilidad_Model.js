const mongoose = require('mongoose');
const { Schema } = mongoose;

const Categorias_Habilidad_Model = mongoose.Schema({
    Nombre: {
        type: String,
		required: true
    }
});

module.exports = mongoose.model("Categorias_Habilidad", Categorias_Habilidad_Model);