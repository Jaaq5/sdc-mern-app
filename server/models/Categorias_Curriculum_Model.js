const mongoose = require("mongoose");
const { Schema } = mongoose;

const Categorias_Curriculum_Model = mongoose.Schema({
  Nombre: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model(
  "Categorias_Curriculum",
  Categorias_Curriculum_Model,
);
