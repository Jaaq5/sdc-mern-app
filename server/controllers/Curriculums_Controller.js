const Usuarios = require('../models/Usuario_Model');
const Curriculums = require('../models/Curriculums_Model');
const Categorias_Curriculum = require('../models/Categorias_Curriculum_Model');
const Categorias_Puesto = require('../models/Categorias_Puesto_Model');
const { ObjectId } = require('mongodb');

const Crear_Curriculum = async (req, res) => {
    const { usuario_id } = req.usuario;
    
    try {
        const usuario = await Usuarios.findById(new ObjectId(usuario_id));
        if (!usuario) {
            return res.status(409).json({ success: false, error: "Usuario no encontrado al crear curriculum" });
        }
		
		const curriculum = new Curriculums({
				Documento: "",
				ID_Usuario: usuario._id
			})
			
        await curriculum.save();
		
		await Usuarios.update({
			{ _id: usuario._id },
				{
					$push : {
						Curriculums_IDs: curriculum._id
					}
				}
		});
		
		if(!res)
			return true
        
        return res.status(200).json({ success: true, msg: 'Se ha creado el curriculum exitosamente', curriculum_id: curriculum._id });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

const Obtener_Curriculum = async (req, res) => {
	const { curriculum_id, usuario_id } = req.body;
	
	try {
        const usuario = await Usuarios.findById(new ObjectId(usuario_id));
        if (!usuario) {
            return res.status(409).json({ success: false, error: "Usuario no encontrado al buscar curriculum" });
        }
		
		const curriculum = Curriculums.findById(new ObjectId(curriculum_id));
		if (!curriculum)
			return res.status(409).json({ success: false, error: "Curriculum no encontrado" });

        
        return res.status(200).json({ success: true, msg: 'Se ha encontrado el curriculum exitosamente', curriculum_id: curriculum._id, documento: curriculum.Documento });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

const Actualizar_Curriculum = async (req, res) => {
    const { curriculum_id, nuevo_documento, categoria_curriculum_id, categoria_puesto_id } = req.body;

    try {
        const curriculum = await Curriculums.findById(new ObjectId(curriculum_id));
        if (!curriculum) {
            return res.status(404).json({ success: false, error: 'No se encontró el curriculum' });
        }
		
		const cat_curr = await Categorias_Curriculum.findById(new ObjectId(categoria_curriculum_id));
        if (!cat_curr) {
            return res.status(404).json({ success: false, error: 'No se encontró el template al actualizar' });
        }
		
		const cat_puesto = await Categorias_Pueto.findById(new ObjectId(categoria_puesto_id));
        if (!cat_puesto) {
            return res.status(404).json({ success: false, error: 'No se encontró el template al actualizar' });
        }

        curriculum.Documento = nuevo_documento;
		curriculum.ID_Categoria_Curriculum = new ObjectId(categoria_curriculum_id)
		curriculum.ID_Categoria_Puesto = new ObjectId(categoria_puesto_id)

        await curriculum.save();

        return res.status(200).json({ success: true, msg: 'Se ha actualizado al curriculum exitosamente', curriculum_id: curriculum._id });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

const Eliminar_Curriculum = async (req, res) => {
    try {
        const { curriculum_id } = req.params;
		
		const curriculum_id_v = new ObjectId(curriculum_id);
		
		const curriculum = await Curriculums.findById(new ObjectId(curriculum_id_v));
		
		if (!curriculum) {
            return res.status(404).json({ success: false, msg: 'Curriculum no encontrado' });
        }
		
		const usuario = await Usuarios.findById(curriculum.ID_Usuario);
		
		if (!usuario) {
            return res.status(404).json({ success: false, msg: 'Usuario de Curriculum no encontrado' });
        }
		
		
		var nueva_lista = usuario.Curriculums_IDs.filter((id) => id != curriculum_id_v);
		usuario.Curriculums_IDs = nueva_lista;
		
		await usuario.save();

		await Curriculums.deleteOne({ _id: curriculum_id_v });

        return res.status(200).json({ success: true, msg: 'Curriculum eliminado correctamente' });
    } catch (error) {
        return res.status(400).send({ success: false, msg: error.message });
    }
};



module.exports = {
	Crear_Curriculum,
	Obtener_Curriculum,
	Actualizar_Curriculum,
    Eliminar_Curriculum
};