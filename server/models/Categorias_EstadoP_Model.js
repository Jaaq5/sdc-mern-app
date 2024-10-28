const mongoose = require("mongoose");
const { Schema } = mongoose;

const Categorias_EstadoP_Model = mongoose.Schema({
  Nombre: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Categorias_EstadoP", Categorias_EstadoP_Model);

