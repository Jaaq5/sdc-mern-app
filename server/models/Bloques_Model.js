const mongoose = require('mongoose');
const { Schema } = mongoose;

const Bloques_Model = mongoose.Schema({
    Bloques: {
        type: Object,
		required: true
    },
	
	ID_Usuario: {
        type: mongoose.ObjectId
    }
});

module.exports = mongoose.model("Bloques", Bloques_Model);