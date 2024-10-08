const Categorias_Puesto = require("../models/Categorias_Puesto_Model");
const { ObjectId } = require("mongodb");

const Obtener_Categorias_Puesto = async (req, res) => {
  try {
    const categorias_puesto = await Categorias_Puesto.find();
    return res.status(200).json({
      success: true,
      msg: "Se ha encontrado la categoria exitosamente",
      categorias_puesto: categorias_puesto,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
  }
};


module.exports = {
  Obtener_Categorias_Puesto,
};
