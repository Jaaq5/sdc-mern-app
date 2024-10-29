const Usuarios = require("../models/Usuario_Model");
const Curriculums = require("../models/Curriculums_Model");
const Bloques = require("../models/Bloques_Model");
const Categorias_Curriculum = require("../models/Categorias_Curriculum_Model");
const Categorias_Puesto = require("../models/Categorias_Puesto_Model");
const Secrets = require("../models/Secrets_Model")
const { ObjectId } = require("mongodb");
// Dependiencia para manejar archivos
const multer = require("multer");
const crypto = require('crypto');

//Creates password hash
function hasher(text){
	const algorithm = 'aes-256-gcm';
	const key = crypto.randomBytes(32);
	const iv = crypto.randomBytes(16);

	// Create the cipher
	const cipher = crypto.createCipheriv(algorithm, key, iv);

	// Encrypt the data
	let encrypted = cipher.update(text, 'utf8', 'hex');
	encrypted += cipher.final('hex');

	// Add the auth tag
	const authTag = cipher.getAuthTag();

	// The encrypted data
	const encryptedText = `${encrypted}:${authTag}`;
	return {text: encryptedText, key: key, iv: iv};
}

//Hashes text using existing crypto data
function rehasher(encryptedData, text) {
	// Split the encrypted data and auth tag
	const algorithm = 'aes-256-gcm';
	const key = encryptedData.key;
	const iv = encryptedData.iv;

	// Create the decipher
	const cipher = crypto.createCipheriv(algorithm, key, iv);

	// Encrypt the data
	let encrypted = cipher.update(text, 'utf8', 'hex');
	encrypted += cipher.final('hex');

	// Add the auth tag
	const authTag = cipher.getAuthTag();

	// The encrypted data
	return {text: `${encrypted}:${authTag}`, noAuth: `${encrypted}`};
}

async function TokenChecker(token, uid, res){
	const secret = await Secrets.findOne({ID_Usuario: uid});
	if (secret.QueryToken !== token || !secret.QueryToken){
		return {
			success: false, 
			res: res
			.status(403)
			.json({ success: false, error: "Sesión expirada o inválida" })
		}
	}
	return {success: true};
}

/*function unhasher(encryptedText) {
	// Split the encrypted data and auth tag
	const [encrypted, authTag] = encryptedText.split(':');

	const algorithm = 'aes-256-gcm';
	const key = crypto.randomBytes(32);
	const iv = crypto.randomBytes(16);

	// Create the decipher
	const decipher = crypto.createDecipheriv(algorithm, key, iv);

	// Verify the auth tag
	decipher.setAuthTag(authTag);

	// Decrypt the data
	let decrypted = decipher.update(encrypted, 'hex', 'utf8');
	decrypted += decipher.final('utf8');

	// The decrypted data
	const decryptedText = decrypted;
}*/

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
        Conferencias: {},
        Premios: {},
        Repositorios: {},
        Referencias: {},

        Informacion_Personal_NID: 1,
        Educacion_Formal_NID: 1,
        Educacion_Tecnica_NID: 1,
        Experiencias_Laborales_NID: 1,
        Habilidades_NID: 1,
        Idiomas_NID: 1,
        Proyectos_NID: 1,
        Publicaciones_NID: 1,
        Conferencias_NID: 1,
        Premios_NID: 1,
        Repositorios_NID: 1,
        Referencias_NID: 1,
      },
    });
    await Bloque.save();
	
	//Encriptar contrasena y guardar parametros
	const hash = hasher(contrasena)
	const secret = new Secrets({
		Param_1 : hash.key,
		Param_2 : hash.iv,
	});

    const user = new Usuarios({
      Nombre: nombre,
      Email: email,
      Contrasena: hash.text, 
      Curriculums_IDs: [],
      Bloque_ID: Bloque._id,
    });

    await user.save();
	
    Bloque.ID_Usuario = user._id;
    await Bloque.save();
	secret.ID_Usuario = user.id;
	await secret.save();

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
  const { usuario_id, token } = req.body;

  try {
    const usuario = await Usuarios.findById(new ObjectId(usuario_id));
    if (!usuario) {
      return res
        .status(404)
        .json({ success: false, error: "Usuario no encontrado" });
    }
	
	const secret = await TokenChecker(token, usuario._id, res);
	if(!secret.success)
		return secret.res;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No se ha proporcionado ninguna imagen",
      });
    }

    // Guarda la imagen en el campo 'userImage' del modelo como Buffer
    usuario.userImage = req.file.buffer;

    await usuario.save();

    return res.status(200).json({
      success: true,
      msg: "Imagen de usuario actualizada exitosamente",
      usuario_id: usuario._id,
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
  const { usuario_id, token } = req.params;

  try {
    const usuario = await Usuarios.findById(new ObjectId(usuario_id));
    if (!usuario) {
      return res
        .status(404)
        .json({ success: false, error: "Usuario no encontrado" });
    }
	
	const secret = await TokenChecker(token, usuario._id, res);
	if(!secret.success)
		return secret.res;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No se ha proporcionado ninguna imagen",
      });
    }

    // Guarda la imagen en el campo 'userImage' del modelo como Buffer
    usuario.userImage = req.file.buffer;

    await usuario.save();

    return res.status(200).json({
      success: true,
      msg: "Imagen de usuario actualizada exitosamente",
      usuario_id: usuario._id,
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
  const { usuario_id, token } = req.params;

  try {
    const usuario = await Usuarios.findById(new ObjectId(usuario_id));
    if (!usuario) {
      return res
        .status(404)
        .json({ success: false, error: "Usuario no encontrado" });
    }
	
	const secret = await TokenChecker(token, usuario._id, res);
	if(!secret.success)
		return secret.res;

    // Elimina la imagen del campo 'userImage'
    usuario.userImage = null;

    await usuario.save();

    return res.status(200).json({
      success: true,
      msg: "Imagen de usuario eliminada exitosamente",
      usuario_id: usuario._id,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
  }
};

const Actualizar_Usuario = async (req, res) => {
  const { nombre, usuario_id, token } = req.body;
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

const Actualizar_Usuario_Bloque_old = async (req, res) => {
  const { usuario_id, bloques, token } = req.body;

  try {
    const usuario = await Usuarios.findById(new ObjectId(usuario_id));
    if (!usuario) {
      return res
        .status(404)
        .json({ success: false, error: "No se encontró al usuario" });
    }
	
	const secret = await TokenChecker(token, usuario._id, res);
	if(!secret.success)
		return secret.res;

    const bloque_datos = await Bloques.findById(usuario.Bloque_ID);
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
      usuario_id: usuario._id,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
  }
};

const Actualizar_Usuario_Bloque = async (req, res) => {
  const { usuario_id, seccion, id, campo, datos, token } = req.body;

  try {
    const usuario = await Usuarios.findById(new ObjectId(usuario_id));
    if (!usuario) {
      return res
        .status(404)
        .json({ success: false, error: "No se encontró al usuario" });
    }
	
	const secret = await TokenChecker(token, usuario._id, res);
	if(!secret.success)
		return secret.res;

    const bloque_datos = await Bloques.findById(usuario.Bloque_ID);
    if (!bloque_datos) {
      return res.status(404).json({
        success: false,
        error: "No se encontró al bloque del usuario",
      });
    }
	
	if(seccion){
		bloque_datos.Bloques[seccion] = bloque_datos.Bloques[seccion]? bloque_datos.Bloques[seccion] : {};
	}
	
	let bloqueId = 1;
	if(id){
		bloqueId = Number(bloque_datos.Bloques[seccion][id]? id : bloque_datos[seccion+"_NID"]);
		if(!bloque_datos.Bloques[seccion][bloqueId])
			bloque_datos[seccion+"_NID"] += 1;
		
		bloque_datos.Bloques[seccion][bloqueId] = bloque_datos.Bloques[seccion][bloqueId]? bloque_datos.Bloques[seccion][bloqueId] : {};
	}
	
	//Cambiar un campo especifico
	if(campo){
		bloque_datos.Bloques[seccion][bloqueId][campo] = datos;
	}else if(id){ //Cambiar un bloque especifico
		bloque_datos.Bloques[seccion][bloqueId] = datos;
	}else if(seccion){ //Cambiar todos los bloques de una seccion
		bloque_datos.Bloques[seccion] = datos;
	}else{ //Cambiar todas las secciones
		bloque_datos.Bloques = datos;
	}
	
	//https://stackoverflow.com/questions/61955931/mongoose-save-not-saving-changes
	//Marcar para que mongoose guarde los cambios
	bloque_datos.markModified('Bloques');
    await bloque_datos.save();

    return res.status(200).json({
      success: true,
      msg: "Se ha actualizado al usuario exitosamente",
      usuario_id: usuario._id,
	  nid: bloqueId
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
	token
  } = req.body;

  try {
    const usuario = await Usuarios.findById(new ObjectId(usuario_id));
    if (!usuario) {
      return res.status(409).json({
        success: false,
        error: "Usuario no encontrado al crear curriculum",
      });
    }
	
	const secret = await TokenChecker(token, usuario._id, res);
	if(!secret.success)
		return secret.res;

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
	token
  } = req.body;

  try {
    const usuario = await Usuarios.findById(new ObjectId(usuario_id));
    if (!usuario) {
      return res
        .status(404)
        .json({ success: false, error: "No se encontró al usuario" });
    }
	
	const secret = await TokenChecker(token, usuario._id, res);
	if(!secret.success)
		return secret.res;

    if (!usuario.Curriculums_IDs.includes(new ObjectId(curriculum_id)))
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
        error: "No se encontró la categoria curriculum al actualizar",
      });
    }

    const cat_puesto = await Categorias_Puesto.findById(
      new ObjectId(categoria_puesto_id),
    );
    if (!cat_puesto) {
      return res.status(404).json({
        success: false,
        error: "No se encontró la categoria puesto al actualizar",
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
	
	const secret = await TokenChecker(token, usuario._id, res);
	if(!secret.success)
		return secret.res;
	
	const index = usuario.Curriculums_IDs.indexOf(new ObjectId(curriculum_id));
    if (index < 0)
      return res
        .status(403)
        .json({ success: false, error: "Curriculo sin acceso." });

    const curriculum_id_v = new ObjectId(curriculum_id);
    const curriculum = await Curriculums.findById(
      curriculum_id_v,
    );
    if (!curriculum) {
      return res.status(404).json({
        success: false,
        error: "No se encontró el curriculum del usuario",
      });
    }

    var nueva_lista = usuario.Curriculums_IDs.toSpliced(index, 1);
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
    //Contrasena: hasher(contrasena),
  });
  
  if (!usuario) {
    return res.status(201).json({success: true, error: "Ese correo electrónico equivocado o contraseña incorrecta.",});
  }
  
  const secret = await Secrets.findOne({ID_Usuario: usuario._id});
  if (!secret) {
    return res.status(201).json({success: true, error: "Ese correo electrónico equivocado o contraseña incorrecta.",});
  }
  
  const rehashed = rehasher({key: secret.Param_1, iv: secret.Param_2}, contrasena);
  if (rehashed.text !== usuario.Contrasena) {
	  return res.status(201).json({success: true, error: "Ese correo electrónico equivocado o contraseña incorrecta.",});
  }
  
  //Genera un token, se usa para verificar querys
  const token = rehasher({key: secret.Param_1, iv: secret.Param_2}, "Token De Usuario");
  secret.QueryToken = token.noAuth;
  await secret.save();
  return res
    .status(200)
    .json({ success: true, msg: "Log in exitoso.", usuario_id: usuario._id, token: token.noAuth });
};

const Log_Out = async (req, res) => {
  return res.status(200).json({ success: true, msg: "Log out exitoso." });
};

const Obtener_Datos_Usuario = async (req, res) => {
  const { usuario_id, token } = req.params;
  try {
    const usuario = await Usuarios.findById(new ObjectId(usuario_id));

    if (!usuario) {
      return res
        .status(404)
        .json({ success: false, error: "Usuario no encontrado" });
    }
	
	const secret = await TokenChecker(token, usuario._id, res);
	if(!secret.success)
		return secret.res;

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
      .status(500)
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

    //await Bloques.deleteOne({ _id: deletedUser.Bloque_ID });

    //await Curriculums.deleteMany({ Usuario_ID: us_id });

    //await Usuarios.deleteOne({ _id: us_id });

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
