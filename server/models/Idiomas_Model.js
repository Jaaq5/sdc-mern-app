const mongoose = require("mongoose");
const { Schema } = mongoose;

const Idiomas_Model = mongoose.Schema({
  Nombre: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Idiomas", Idiomas_Model);
