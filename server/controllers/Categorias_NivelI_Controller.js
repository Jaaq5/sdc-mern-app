const Categorias_NivelI = require("../models/Categorias_NivelI_Model");
const { ObjectId } = require("mongodb");

const Obtener_Categorias_NivelI = async (req, res) => {
  try {
    const categorias_nivelI = await Categorias_NivelI.find();
    return res.status(200).json({
      success: true,
      msg: "Se ha encontrado la categoria exitosamente",
      categorias_nivelI: categorias_nivelI,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
  }
};


module.exports = {
  Obtener_Categorias_NivelI,
};