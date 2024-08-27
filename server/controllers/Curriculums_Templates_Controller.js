const Usuarios = require('../models/Usuario_Model');
const Categorias_Curriculum = require('../models/Categorias_Curriculum_Model');
const Categorias_Puesto = require('../models/Categorias_Puesto_Model');

const Crear_Curriculum_Template_Vacio = async (req, res) => {
    const { categoria_curriculum_id, categoria_puesto_id } = req.body;
    
    try {
		const curriculum = new Curriculums_Templates({
				Documento: "",
				ID_Categoria_Curriculum: categoria_curriculum_id,
				ID_Categoria_Puesto: categoria_puesto_id
			})
			
        await curriculum.save();
		
        return res.status(200).json({ success: true, msg: 'Se ha creado el templateexitosamente', curriculum_id: curriculum._id });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

const Obtener_Curriculum_Template = async (req, res) => {
	const { curriculum_id } = req.body;
	
	try {
		
		const curriculum = Curriculums_Templates.findById(new ObjectId(curriculum_id));
		if (!curriculum)
			return res.status(409).json({ success: false, error: "Template no encontrado" });

        
        return res.status(200).json({ success: true, msg: 'Se ha encontrado el template exitosamente', curriculum_id: curriculum._id, documento: curriculum.Documento });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

const Obtener_Curriculum_Templates = async (req, res) => {
	const { categoria_curriculum_id, categoria_puesto_id } = req.body;
	try {
		var curriculums = [];
		if(categoria_curriculum_id && categoria_puesto_id)
			curriculums = await Curriculums_Templates.find({ID_Categoria_Curriculum:categoria_curriculum_id, ID_Categoria_Puesto: categoria_puesto_id});
		else if(categoria_curriculum_id && !categoria_puesto_id)
			curriculums = await Curriculums_Templates.find({ID_Categoria_Curriculum:categoria_curriculum_id});
		else if(!categoria_curriculum_id && categoria_puesto_id)
			curriculums = await Curriculums_Templates.find({ID_Categoria_Puesto: categoria_puesto_id});
		else
			curriculums = await Curriculums_Templates.find();
		
        return res.status(200).json({ success: true, msg: 'Se ha encontrado los templates exitosamente', curriculums: curriculums});
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

const Actualizar_Curriculum_Template = async (req, res) => {
    const { curriculum_id, nuevo_documento, categoria_curriculum_id, categoria_puesto_id } = req.body;

    try {
        const curriculum = await Curriculums_Templates.findById(new ObjectId(curriculum_id));
        if (!curriculum) {
            return res.status(404).json({ success: false, error: 'No se encontró el template al actualizar' });
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

        return res.status(200).json({ success: true, msg: 'Se ha actualizado al template exitosamente', curriculum_id: curriculum._id });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

const Eliminar_Curriculum_Template = async (req, res) => {
    try {
        const { curriculum_id } = req.body;

		const curriculum_borrado = await Curriculums_Templates.findOneAndDelete({ _id: curriculum_id });

        if (!curriculum_borrado) {
            return res.status(404).json({ success: false, message: 'Template no encontrado al eliminar' });
        }

        return res.status(200).json({ success: true, message: 'Template eliminado correctamente' });
    } catch (error) {
        return res.status(400).send({ success: false, msg: error.message });
    }
};



module.exports = {
	Crear_Curriculum_Template_Vacio,
	Obtener_Curriculum_Template,
	Obtener_Curriculum_Templates,
	Actualizar_Curriculum_Template,
    Eliminar_Curriculum_Template
};