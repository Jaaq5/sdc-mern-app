const Categorias_Puesto = require('../models/Categorias_Puesto_Model');

const Crear_Categoria_Puesto = async (req, res) => {
    const { nombre } = req.nombre;
    
    try {
        const categoria_t = await Categorias_Puesto.findOne({Nombre: nombre});
        if (!categoria_t) {
            return res.status(409).json({ success: false, error: "Nombre de categoría duplicado" });
        }
		
		const categoria = new Categorias_Puesto({
				Nombre: nombre
			})
			
        await categoria.save();
        
        return res.status(200).json({ success: true, msg: 'Se ha creado la categoria de puesto exitosamente', categoria_id: categoria._id });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};


const Obtener_Categoria_Puesto = async (req, res) => {
	const categoria_id = req.body.categoria_id;
	
	try {
        const categoria = await Categorias_Puesto.findById(new ObjectId(categoria_id));
        if (!categoria) {
            return res.status(409).json({ success: false, error: "Categoria puesto no encontrada" });
        }

        
        return res.status(200).json({ success: true, msg: 'Se ha encontrado la categoria exitosamente', categoria_id: categoria._id, nombre: categoria.Nombre });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

const Obtener_Categorias_Puesto = async (req, res) => {
	try {
        return res.status(200).json({ success: true, msg: 'Se ha encontrado la categoria exitosamente', categorias_puesto: Categorias_Puesto.find()});
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

const Actualizar_Categoria_Puesto = async (req, res) => {
    const { categoria_id, nuevo_nombre } = req.body;

    try {
        const categoria = await Categorias_Puesto.findById(new ObjectId(categoria_id));
        if (!categoria) {
            return res.status(404).json({ success: false, error: "Categoria puesto no encontrada" });
        }

        categoria.Nombre = nuevo_nombre;

        await categoria.save();

        return res.status(200).json({ success: true, msg: 'Se ha actualizado la categoria exitosamente', categoria_id: categoria._id });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};


const Eliminar_Categoria_Puesto = async (req, res) => {
    try {
        const { categoria_id } = req.body;
		
		const categoria = await Categorias_Puesto.findById(new ObjectId(categoria_id));
        if (!categoria) {
            return res.status(404).json({ success: false, error: "Categoria puesto no encontrada" });
        }

		const categoria_borrada = await Categorias_Puesto.findOneAndDelete({ _id: categoria_id });

        if (!categoria_borrada) {
            return res.status(404).json({ success: false, message: 'Categoria no borrada' });
        }

        return res.status(200).json({ success: true, message: 'Categoria eliminada correctamente' });
    } catch (error) {
        return res.status(400).send({ success: false, msg: error.message });
    }
};



module.exports = {
	Crear_Categoria_Puesto,
	Obtener_Categoria_Puesto,
	Obtener_Categorias_Puesto,
	Actualizar_Categoria_Puesto,
    Eliminar_Categoria_Puesto
};