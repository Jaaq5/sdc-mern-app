const Categorias_Curriculum = require("../models/Categorias_Curriculum_Model");
const { ObjectId } = require("mongodb");

const Crear_Categoria_Curriculum = async (req, res) => {
  const { nombre } = req.body;

  try {
    const categoria_t = await Categorias_Curriculum.findOne({ Nombre: nombre });
    if (categoria_t) {
      return res
        .status(409)
        .json({ success: false, error: "Nombre de categoría duplicado" });
    }

    const categoria = new Categorias_Curriculum({
      Nombre: nombre,
    });

    await categoria.save();

    return res.status(200).json({
      success: true,
      msg: "Se ha creado la categoria de curriculum exitosamente",
      categoria_id: categoria._id,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
  }
};

const Obtener_Categoria_Curriculum = async (req, res) => {
  try {
    const categoria = await Categorias_Curriculum.findById(
      new ObjectId(categoria_id),
    );
    if (!categoria) {
      return res
        .status(409)
        .json({ success: false, error: "Categoria curriculum no encontrada" });
    }

    return res.status(200).json({
      success: true,
      msg: "Se ha encontrado la categoria exitosamente",
      categoria_id: categoria._id,
      nombre: categoria.Nombre,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
  }
};

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

const Actualizar_Categoria_Curriculum = async (req, res) => {
  const { categoria_id, nuevo_nombre } = req.body;

  try {
    const categoria = await Categorias_Curriculum.findById(
      new ObjectId(categoria_id),
    );
    if (!categoria) {
      return res
        .status(404)
        .json({ success: false, error: "Categoria curriculum no encontrada" });
    }

    categoria.Nombre = nuevo_nombre;

    await categoria.save();

    return res.status(200).json({
      success: true,
      msg: "Se ha actualizado la categoria exitosamente",
      categoria_id: categoria._id,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
  }
};

const Eliminar_Categoria_Curriculum = async (req, res) => {
  try {
    const { categoria_id } = req.params;

    const categoria = await Categorias_Curriculum.findById(
      new ObjectId(categoria_id),
    );
    if (!categoria) {
      return res
        .status(404)
        .json({ success: false, error: "Categoria curriculum no encontrada" });
    }

    await Categorias_Curriculum.deleteOne({ _id: new ObjectId(categoria_id) });

    return res
      .status(200)
      .json({ success: true, message: "Categoria eliminada correctamente" });
  } catch (error) {
    return res.status(400).send({ success: false, msg: error.message });
  }
};

module.exports = {
  Crear_Categoria_Curriculum,
  Obtener_Categoria_Curriculum,
  Obtener_Categorias_Curriculum,
  Actualizar_Categoria_Curriculum,
  Eliminar_Categoria_Curriculum,
};
