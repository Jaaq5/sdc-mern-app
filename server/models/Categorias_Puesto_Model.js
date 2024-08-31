const mongoose = require("mongoose");
const { Schema } = mongoose;

const Categorias_Puesto_Model = mongoose.Schema({
  Nombre: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Categorias_Puesto", Categorias_Puesto_Model);
