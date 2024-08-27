const mongoose = require('mongoose');
const { Schema } = mongoose;

const Curriculums_Templates_Model = mongoose.Schema({
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

	ID_Categoria_Curriculum: {
        type: mongoose.ObjectId,
		required: true
    },
	ID_Categoria_Puesto: {
        type: mongoose.ObjectId,
		required: true
    }
});

module.exports = mongoose.model("Curriculums_Templates", Curriculums_Templates_Model);