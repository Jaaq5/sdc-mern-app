
const mongoose = require("mongoose");
const { Schema } = mongoose;

const Categorias_NivelI_Model = mongoose.Schema({
  Nombre: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Categorias_NivelI", Categorias_NivelI_Model);