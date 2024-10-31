const mongoose = require("mongoose");
const { Schema } = mongoose;

const Secrets_Model = mongoose.Schema({
  Param_1: {
    type: Buffer,
    required: true,
  },
  Param_2: {
    type: Buffer,
    required: true,
  },
  QueryToken: {
    type: String,
  },

  Pregunta: {
    type: String,
  },
  Respuesta: {
    type: String,
  },

  ID_Usuario: {
    type: mongoose.ObjectId,
  },
});

module.exports = mongoose.model("Secrets", Secrets_Model);
