const Preguntas = require("../models/Preguntas_Model");
const { ObjectId } = require("mongodb");

const Obtener_Preguntas = async (req, res) => {
  try {
    const preguntas = await Preguntas.find();
    return res.status(200).json({
      success: true,
      msg: "Se han encontrado los preguntas",
      preguntas: preguntas,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
  }
};

module.exports = {
  Obtener_Preguntas,
};
