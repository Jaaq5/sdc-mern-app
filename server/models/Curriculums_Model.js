const mongoose = require('mongoose');
const { Schema } = mongoose;

const Curriculums_Model = mongoose.Schema({
    Documento: {
        type: String,
		required: true
    },
    Prevista: {
        name: { 
            type: String
        },
        type: { 
            type: String
        },
        data: { 
            type: Buffer
        }
    },
	
	ID_Usuario: {
        type: mongoose.ObjectId,
		required: true
    },
	ID_Categoria_Curriculum: {
        type: mongoose.ObjectId,
		required: true
    },
	ID_Categoria_Puesto: {
        type: mongoose.ObjectId,
		required: true
    }
});

module.exports = mongoose.model("Curriculums", Curriculums_Model);