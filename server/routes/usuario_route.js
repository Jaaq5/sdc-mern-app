const express = require('express');

const {
	Crear_Usuario,
	Log_In,
	Log_Out,
	Obtener_Datos_Usuario,
	Actualizar_Usuario,
	Actualizar_Usuario_Bloque,
	Eliminar_Usuario
} = require('../controllers/Usuarios_Controller');

const router = express.Router();

router.post('/crear-usuario', Crear_Usuario);
router.post('/log-in-usuario', Log_In);
router.post('/log-out-usuario', Log_Out);
router.get('/obtener-usuario/:usuario_id', Obtener_Datos_Usuario);
router.patch('/actualizar-usuario', Actualizar_Usuario);
router.patch('/actualizar-usuario-bloque', Actualizar_Usuario_Bloque);
router.delete('/borrar-usuario/:usuario_id', Eliminar_Usuario);


module.exports = router;