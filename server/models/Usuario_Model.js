const mongoose = require('mongoose');
const { Schema } = mongoose;

const Usuario_Model = mongoose.Schema({
    Email: {
        type:String,
        required:true
    },
    Nombre:{
        type:String,
        required:true
    },
	Contrasena: {
        type: String,
        required: true
    },
	
	Bloque_ID: {
		type: mongoose.ObjectId,
		required: true
	},
	Curriculums_IDs: {
		type: [mongoose.ObjectId],
		required: true
	}
});

module.exports = mongoose.model("Usuarios", Usuario_Model);