const Usuarios = require("../models/Usuario_Model");
const Curriculums = require("../models/Curriculums_Model");
const Bloques = require("../models/Bloques_Model");
const { ObjectId } = require("mongodb");

const Crear_Usuario = async (req, res) => {
  const { nombre, email, contrasena } = req.body;
  //const profilePicture = req.file;

  try {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(401).json({
        success: false,
        error: "Formato de correo electrónico inválido",
      });
    }

    const existingEmail = await Usuarios.findOne({ Email: email });
    if (existingEmail) {
      return res.status(402).json({
        success: false,
        error: "Dirección de correo electrónico ya está en uso",
      });
    }

    const Bloque = new Bloques({
      Bloques: {
        Informacion_Personal: {},
        Educacion_Formal: {},
        Educacion_Tecnica: {},
        Experiencias_Laborales: {},
        Habilidades: {},
        Idiomas: {},
        Proyectos: {},
        Publicaciones: {},
        Referencias: {},

        Informacion_Personal_NID: 1,
        Educacion_Formal_NID: 1,
        Educacion_Tecnica_NID: 1,
        Experiencias_Laborales_NID: 1,
        Habilidades_NID: 1,
        Idiomas_NID: 1,
        Proyectos_NID: 1,
        Publicaciones_NID: 1,
        Referencias_NID: 1,
      },
    });
    await Bloque.save();

    const user = new Usuarios({
      Nombre: nombre,
      Email: email,
      Contrasena: contrasena, //TO-DO: Encrypt
      Curriculums_IDs: [],
      Bloque_ID: Bloque._id,
    });

    await user.save();

    /*await Bloques.updateOne(
			{ _id: Bloque._id },
				{
					$set{ ID_Usuario: user._id }
				}
				function (err, res) {
					if (err) 
						throw err
				});*/
    Bloque.ID_Usuario = user._id;
    await Bloque.save();

    if (!res) return true;

    return res.status(201).json({
      success: true,
      msg: "Se ha registrado el usuario exitosamente",
      usuario_id: user._id,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
  }
};

const Actualizar_Usuario = async (req, res) => {
  const { nombre, usuario_id } = req.body;
  const { curriculums_ids } = req.curriculums;

  try {
    const user = await Usuarios.findById(new ObjectId(usuario_id));
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "No se encontró al usuario" });
    }

    if (nombre) user.Nombre = nombre;

    if (curriculums_ids) user.Curriculums_IDs = curriculums_ids;

    await user.save();

    return res.status(200).json({
      success: true,
      msg: "Se ha actualizado al usuario exitosamente",
      usuario_id: user._id,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
  }
};

const Actualizar_Usuario_Bloque = async (req, res) => {
  const { usuario_id, bloques } = req.body;

  try {
    const user = await Usuarios.findById(new ObjectId(usuario_id));
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "No se encontró al usuario" });
    }

    const bloque_datos = await Bloques.findById(user.Bloque_ID);
    if (!bloque_datos) {
      return res.status(404).json({
        success: false,
        error: "No se encontró al bloque del usuario",
      });
    }

    bloque_datos.Bloques = bloques;

    await bloque_datos.save();

    return res.status(200).json({
      success: true,
      msg: "Se ha actualizado al usuario exitosamente",
      usuario_id: user._id,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
  }
};

const Log_In = async (req, res) => {
  const email = req.body.email;
  const contrasena = req.body.contrasena;
  const usuario = await Usuarios.findOne({
    Email: email,
    Contrasena: contrasena,
  });
  let usuario_id;
  if (!usuario) {
    return res.status(201).json({
      success: true,
      error: "Ese correo electrónico equivocado o contraseña incorrecta.",
    });
  }

  usuario_id = usuario._id;
  return res
    .status(200)
    .json({ success: true, msg: "Log in exitoso.", usuario_id: usuario_id });
};

const Log_Out = async (req, res) => {
  return res.status(200).json({ success: true, msg: "Log out exitoso." });
};

const Obtener_Datos_Usuario = async (req, res) => {
  const { usuario_id } = req.params;
  try {
    const usuario = await Usuarios.findById(new ObjectId(usuario_id));

    if (!usuario) {
      return res
        .status(404)
        .json({ success: false, error: "Usuario no encontrado" });
    }

    const bloques = await Bloques.findById(usuario.Bloque_ID);

    const curriculums = await Curriculums.find({
      _id: { $in: usuario.Curriculums_IDs },
    });

    const userData = {
      _id: usuario._id,
      name: usuario.Nombre,
      email: usuario.Email,
      bloques: bloques.Bloques,
      curriculums: curriculums ? curriculums : [],
    };

    return res
      .status(200)
      .json({ success: true, msg: "Usuario encontrado", data: userData });
  } catch (error) {
    console.log(error.message);
    return res
      .status(400)
      .json({ success: false, error: "Error interno del servidor" });
  }
};

const Eliminar_Usuario = async (req, res) => {
  const { usuario_id } = req.params;
  try {
    const us_id = new ObjectId(usuario_id);
    const deletedUser = await Usuarios.findById(us_id);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, msg: "Usuario no encontrado" });
    }

    await Bloques.deleteOne({ _id: deletedUser.Bloque_ID });

    await Curriculums.deleteMany({ Usuario_ID: us_id });

    await Usuarios.deleteOne({ _id: us_id });

    return res
      .status(200)
      .json({ success: true, msg: "Usuario eliminado correctamente" });
  } catch (error) {
    return res.status(400).send({ success: false, msg: error.message });
  }
};

module.exports = {
  Crear_Usuario,
  Log_In,
  Log_Out,
  Obtener_Datos_Usuario,
  Actualizar_Usuario,
  Actualizar_Usuario_Bloque,
  Eliminar_Usuario,
};
