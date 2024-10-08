const Idiomas = require("../models/Idiomas_Model");
const { ObjectId } = require("mongodb");

const Obtener_Idiomas = async (req, res) => {
  try {
    const idiomas = await Idiomas.find();
    return res.status(200).json({
      success: true,
      msg: "Se han encontrado los idiomas",
      idiomas: idiomas,
    });
  } catch (error) {
    console.loh(error);
    return res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
  }
};

module.exports = {
  Obtener_Idiomas,
};
