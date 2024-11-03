const mongoose = require("mongoose");
const { Schema } = mongoose;

const Preguntas_Model = mongoose.Schema({
  Nombre: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Preguntas", Preguntas_Model);
