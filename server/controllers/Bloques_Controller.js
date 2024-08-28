const Usuarios = require('../models/Usuario_Model');
const Bloques = require('../models/Bloques_Model');
const { ObjectId } = require('mongodb');

const Crear_Bloque = async (req, res) => {
    const { usuario_id } = req.usuario_id;
    
    try {
        const usuario = await Usuarios.findById(new ObjectId(usuario_id));
        if (!usuario) {
            return res.status(409).json({ success: false, error: "Usuario no encontrado al crear bloque" });
        }
		
		const bloque = new Bloques({
				Bloques: {
					"Informacion_Personal" : {},
					"Educacion_Formal" : {},
					"Educacion_Tecnica" : {},
					"Habilidades" : {},
					"Proyectos" : {},
					"Publicaciones" : {},
					"Referencias" : {},
					
					"Informacion_Personal_NID" : 1,
					"Educacion_Formal_NID" : 1,
					"Educacion_Tecnica_NID" : 1,
					"Habilidades_NID" : 1,
					"Proyectos_NID" : 1,
					"Publicaciones_NID" : 1,
					"Referencias_NID" : 1
				},
				ID_Usuario: usuario_id
			})
			
        await bloque.save();
		
		//Llamadas internas
		if(!res)
			return true
		
        return res.status(200).json({ success: true, msg: 'Se ha creado el bloque exitosamente', bloque_id: bloque._id });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

//Para pruebas
//Usualmente se obtiene al pedir el usuario
const Obtener_Bloque = async (req, res) => {
	const bloque_id = req.body.bloque_id;
	
	try {
        const bloque = await Bloques.findById(new ObjectId(bloque_id));
        if (!bloque) {
            return res.status(409).json({ success: false, error: "Bloque no encontrado" });
        }

        
        return res.status(200).json({ success: true, msg: 'Se ha encontrado el bloque exitosamente', bloque_id: bloque._id, bloques: bloque.Bloques });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

const Actualizar_Bloque = async (req, res) => {
    const { bloque_id, nuevo_bloque } = req.body;

    try {
        const bloque = await Bloques.findById(new ObjectId(bloque_id));
        if (!bloque) {
            return res.status(409).json({ success: false, error: "Usuario no encontrado al buscar bloque de información" });
        }

        bloque.Bloques = nuevo_bloque;

        await bloque.save();

        return res.status(200).json({ success: true, msg: 'Se ha actualizado al bloque exitosamente', bloque_id: bloque._id });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

//Para pruebas
//Usualmente se borra al borrar el usuario
const Eliminar_Bloque = async (req, res) => {
    try {
        const { bloque_id } = req.params;
		
		const bloque = await Bloques.findById(new ObjectId(bloque_id));
        if (!bloque) {
            return res.status(404).json({ success: false, error: "Bloque no encontrado" });
        }

		await Bloques.deleteOne({ _id: new ObjectId(bloque_id) });

        return res.status(200).json({ success: true, msg: 'Bloque eliminado correctamente' });
    } catch (error) {
        return res.status(400).send({ success: false, msg: error.message });
    }
};



module.exports = {
	Crear_Bloque,
	Obtener_Bloque,
	Actualizar_Bloque,
    Eliminar_Bloque
};