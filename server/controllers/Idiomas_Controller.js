const Idiomas = require("../models/Idiomas_Model");
const { ObjectId } = require("mongodb");

const Crear_Idioma = async (req, res) => {
  const { nombre } = req.nombre;

  try {
    const idioma_t = await Idiomas.findOne({ Idioma: nombre });
    if (!idioma_t) {
      return res
        .status(409)
        .json({ success: false, error: "Idioma duplicado" });
    }

    const idioma = new Idiomas({
      Nombre: nombre,
    });

    await idioma.save();

    return res.status(200).json({
      success: true,
      msg: "Se ha creado el idioma exitosamente",
      idioma_id: idioma._id,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
  }
};

const Obtener_Idioma = async (req, res) => {
  const idioma_id = req.body.idioma_id;

  try {
    const idioma = await Idiomas.findById(new ObjectId(idioma_id));
    if (!idioma) {
      return res
        .status(404)
        .json({ success: false, error: "Idioma no encontrado" });
    }

    return res.status(200).json({
      success: true,
      msg: "Se ha encontrado el idioma exitosamente",
      idioma_id: idioma._id,
      idioma: idioma.Nombre,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
  }
};

const Obtener_Idiomas = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      msg: "Se han encontrado los idiomas",
      idiomas_puesto: Idiomas.find(),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
  }
};

const Actualizar_Idioma = async (req, res) => {
  const { idioma_id, nuevo_nombre } = req.body;

  try {
    const idioma = await Idiomas.findById(new ObjectId(idioma_id));
    if (!idioma) {
      return res
        .status(404)
        .json({ success: false, error: "Idioma no encontrado al actualizar" });
    }

    idioma.Nombre = nuevo_nombre;

    await idioma.save();

    return res.status(200).json({
      success: true,
      msg: "Se ha actualizado el idioma exitosamente",
      idioma_id: idioma._id,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
  }
};

const Eliminar_Idioma = async (req, res) => {
  try {
    const { idioma_id } = req.params;

    const idioma = await Idiomas.findById(new ObjectId(idioma_id));
    if (!idioma) {
      return res
        .status(404)
        .json({ success: false, error: "Idioma no encontrado" });
    }

    await Idiomas.deleteOne({ _id: new ObjectId(idioma_id) });

    return res
      .status(200)
      .json({ success: true, message: "Idioma eliminado correctamente" });
  } catch (error) {
    return res.status(400).send({ success: false, msg: error.message });
  }
};

module.exports = {
  Crear_Idioma,
  Obtener_Idioma,
  Obtener_Idiomas,
  Actualizar_Idioma,
  Eliminar_Idioma,
};
