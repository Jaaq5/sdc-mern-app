const Categorias_EstadoP = require("../models/Categorias_EstadoP_Model");
const { ObjectId } = require("mongodb");

const Obtener_Categorias_EstadoP = async (req, res) => {
  try {
    const categorias_estadoP = await Categorias_EstadoP.find();
    return res.status(200).json({
      success: true,
      msg: "Se ha encontrado la categoria exitosamente",
      categorias_estadoP: categorias_estadoP,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
  }
};

module.exports = {
  Obtener_Categorias_EstadoP,
};
