const Categorias_Habilidad = require("../models/Categorias_Habilidad_Model");
const { ObjectId } = require("mongodb");
/*
const Crear_Categoria_Habilidad = async (req, res) => {
  const { nombre } = req.nombre;

  try {
    const categoria_t = await Categorias_Habilidad.findOne({ Nombre: nombre });
    if (categoria_t) {
      return res
        .status(409)
        .json({ success: false, error: "Nombre de categoría duplicado" });
    }

    const categoria = new Categorias_Habilidad({
      Nombre: nombre,
    });

    await categoria.save();

    return res.status(200).json({
      success: true,
      msg: "Se ha creado la categoria de habilidad exitosamente",
      categoria_id: categoria._id,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
  }
};
*/
// Crea las categorías predeterminadas
const Crear_Categorias_Habilidad_Defecto = async () => {
  const categoriasDefault = [
    { Nombre: "Habilidad Técnica" },
    { Nombre: "Habilidad Blanda" },
  ];

  // Search for default categories
  for (const categoria of categoriasDefault) {
    const existingCategoria = await Categorias_Habilidad.findOne({
      Nombre: categoria.Nombre,
    });
    // Create the category if it doesn't exist
    if (!existingCategoria) {
      const nuevaCategoria = new Categorias_Habilidad(categoria);
      await nuevaCategoria.save();
    }
  }
};
/*
const Obtener_Categoria_Habilidad = async (req, res) => {
  const categoria_id = req.body.categoria_id;

  try {
    const categoria = await Categorias_Habilidad.findById(
      new ObjectId(categoria_id),
    );
    if (!categoria) {
      return res
        .status(409)
        .json({ success: false, error: "Categoria habilidad no encontrada" });
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
*/
const Obtener_Categorias_Habilidad = async (req, res) => {
  try {
    const categorias_habilidad = await Categorias_Habilidad.find();
	
    return res.status(200).json({
      success: true,
      msg: "Se ha encontrado la categoria exitosamente",
      categorias_habilidad: categorias_habilidad,
    });
  } catch (error) {
	console.log(error);
    return res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
  }
};
/*
const Actualizar_Categoria_Habilidad = async (req, res) => {
  const { categoria_id, nuevo_nombre } = req.body;

  try {
    const categoria = await Categorias_Habilidad.findById(
      new ObjectId(categoria_id),
    );
    if (!categoria) {
      return res
        .status(404)
        .json({ success: false, error: "Categoria habilidad no encontrada" });
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

const Eliminar_Categoria_Habilidad = async (req, res) => {
  try {
    const { categoria_id } = req.params;

    const categoria = await Categorias_Habilidad.findById(
      new ObjectId(categoria_id),
    );
    if (!categoria) {
      return res
        .status(404)
        .json({ success: false, error: "Categoria habilidad no encontrada" });
    }

    await Categorias_Habilidad.deleteOne({ _id: new ObjectId(categoria_id) });

    return res.status(200).json({
      success: true,
      message: "Categoria habilidad eliminada correctamente",
    });
  } catch (error) {
    return res.status(400).send({ success: false, msg: error.message });
  }
};
*/
module.exports = {
  //Crear_Categoria_Habilidad,
  Crear_Categorias_Habilidad_Defecto,
  //Obtener_Categoria_Habilidad,
  Obtener_Categorias_Habilidad,
  //Actualizar_Categoria_Habilidad,
  //Eliminar_Categoria_Habilidad,
};
