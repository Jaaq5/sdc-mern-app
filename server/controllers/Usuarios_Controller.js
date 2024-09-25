const Usuarios = require("../models/Usuario_Model");
const Curriculums = require("../models/Curriculums_Model");
const Bloques = require("../models/Bloques_Model");
const { ObjectId } = require("mongodb");
// Dependiencia para manejar archivos
const multer = require("multer");

// Configuración de multer para manejar la carga de archivos
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limitar el tamaño del archivo a 2 MB
});
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
     *			{ _id: Bloque._id },
     *				{
     *					$set{ ID_Usuario: user._id }
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

// Controlador para subir la imagen de usuario
const Subir_Imagen_Usuario = async (req, res) => {
  const { usuario_id } = req.body;

  try {
    const user = await Usuarios.findById(new ObjectId(usuario_id));
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "Usuario no encontrado" });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No se ha proporcionado ninguna imagen",
      });
    }

    // Guarda la imagen en el campo 'userImage' del modelo como Buffer
    user.userImage = req.file.buffer;

    await user.save();

    return res.status(200).json({
      success: true,
      msg: "Imagen de usuario actualizada exitosamente",
      usuario_id: user._id,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
  }
};

// Controlador para actualizar la imagen de usuario
const Actualizar_Imagen_Usuario = async (req, res) => {
  const { usuario_id } = req.params;

  try {
    const user = await Usuarios.findById(new ObjectId(usuario_id));
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "Usuario no encontrado" });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No se ha proporcionado ninguna imagen",
      });
    }

    // Guarda la imagen en el campo 'userImage' del modelo como Buffer
    user.userImage = req.file.buffer;

    await user.save();

    return res.status(200).json({
      success: true,
      msg: "Imagen de usuario actualizada exitosamente",
      usuario_id: user._id,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
  }
};

// Controlador para eliminar la imagen de usuario
const Eliminar_Imagen_Usuario = async (req, res) => {
  const { usuario_id } = req.params;

  try {
    const user = await Usuarios.findById(new ObjectId(usuario_id));
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "Usuario no encontrado" });
    }

    // Elimina la imagen del campo 'userImage'
    user.userImage = null;

    await user.save();

    return res.status(200).json({
      success: true,
      msg: "Imagen de usuario eliminada exitosamente",
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

const Crear_Curriculum = async (req, res) => {
  const {
    usuario_id,
    documento,
    categoria_curriculum_id,
    categoria_puesto_id,
  } = req.body;

  try {
    const usuario = await Usuarios.findById(new ObjectId(usuario_id));
    if (!usuario) {
      return res.status(409).json({
        success: false,
        error: "Usuario no encontrado al crear curriculum",
      });
    }

    const curriculum = new Curriculums({
      Documento: documento,
      ID_Usuario: usuario._id,
      ID_Categoria_Curriculum: new ObjectId(categoria_curriculum_id),
      ID_Categoria_Puesto: new ObjectId(categoria_puesto_id),
    });

    await curriculum.save();

    await Usuarios.updateOne(
      { _id: usuario._id },
      {
        $push: {
          Curriculums_IDs: curriculum._id,
        },
      },
    );

    if (!res) return true;

    return res.status(200).json({
      success: true,
      msg: "Se ha creado el curriculum exitosamente",
      curriculum_id: curriculum._id,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
  }
};

const Actualizar_Usuario_Curriculum = async (req, res) => {
  const {
    usuario_id,
    curriculum_id,
    documento,
    categoria_curriculum_id,
    categoria_puesto_id,
  } = req.body;

  try {
    const user = await Usuarios.findById(new ObjectId(usuario_id));
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "No se encontró al usuario" });
    }

    if (!user.curriculums_ids.contains(new ObjectID(curriculum_id)))
      return res
        .status(403)
        .json({ success: false, error: "Curriculo sin acceso." });

    const curriculum = await Curriculums.findById(new ObjectId(curriculum_id));
    if (!curriculum) {
      return res.status(404).json({
        success: false,
        error: "No se encontró el curriculum del usuario",
      });
    }

    const cat_curr = await Categorias_Curriculum.findById(
      new ObjectId(categoria_curriculum_id),
    );
    if (!cat_curr) {
      return res.status(404).json({
        success: false,
        error: "No se encontró el curriculum al actualizar",
      });
    }

    const cat_puesto = await Categorias_Pueto.findById(
      new ObjectId(categoria_puesto_id),
    );
    if (!cat_puesto) {
      return res.status(404).json({
        success: false,
        error: "No se encontró el curriculum al actualizar",
      });
    }

    curriculum.Documento = documento;
    curriculum.ID_Categoria_Curriculum = new ObjectId(categoria_curriculum_id);
    curriculum.ID_Categoria_Puesto = new ObjectId(categoria_puesto_id);

    await curriculum.save();

    return res.status(200).json({
      success: true,
      msg: "Se ha actualizado al curriculum exitosamente",
      curriculum_id: curriculum_id,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
  }
};

const Eliminar_Usuario_Curriculum = async (req, res) => {
  try {
    const { usuario_id, curriculum_id } = req.params;

    const usuario = await Usuarios.findById(new ObjectId(usuario_id));
    if (!usuario) {
      return res
        .status(404)
        .json({ success: false, error: "No se encontró al usuario" });
    }

    if (!usuario.Curriculums_IDs.contains(new ObjectID(curriculum_id)))
      return res
        .status(403)
        .json({ success: false, error: "Curriculo sin acceso." });

    const curriculum_id_v = new ObjectId(curriculum_id);
    const curriculum = await Curriculums.findById(
      new ObjectId(curriculum_id_v),
    );
    if (!curriculum) {
      return res.status(404).json({
        success: false,
        error: "No se encontró el curriculum del usuario",
      });
    }

    var nueva_lista = usuario.Curriculums_IDs.filter(
      (id) => id != curriculum_id_v,
    );
    usuario.Curriculums_IDs = nueva_lista;

    await usuario.save();

    await Curriculums.deleteOne({ _id: curriculum_id_v });

    return res
      .status(200)
      .json({ success: true, msg: "Curriculum eliminado correctamente" });
  } catch (error) {
    return res.status(400).send({ success: false, msg: error.message });
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
      userImage: usuario.userImage
        ? usuario.userImage.toString("base64")
        : null,
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
  Actualizar_Imagen_Usuario,
  Eliminar_Imagen_Usuario,
  Subir_Imagen_Usuario,
  upload,
  Crear_Usuario,
  Log_In,
  Log_Out,
  Obtener_Datos_Usuario,
  Actualizar_Usuario,
  Actualizar_Usuario_Bloque,
  Crear_Curriculum,
  Actualizar_Usuario_Curriculum,
  Eliminar_Usuario_Curriculum,
  Eliminar_Usuario,
};
