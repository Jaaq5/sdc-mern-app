const Categorias_Curriculum = require("../models/Categorias_Curriculum_Model");
const { ObjectId } = require("mongodb");


const Obtener_Categorias_Curriculum = async (req, res) => {
  try {
    const categorias_curriculum = await Categorias_Curriculum.find();
    return res.status(200).json({
      success: true,
      msg: "Se ha encontrado la categoria exitosamente",
      categorias_curriculum: categorias_curriculum,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
  }
};


module.exports = {
  Obtener_Categorias_Curriculum,
};
