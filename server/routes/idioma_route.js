const express = require('express');
const idioma_route = express.Router();

const Idiomas_Controller = require('../controllers/Idiomas_Controller');

idioma_route.post('/crear-idioma', Idiomas_Controller.Crear_Idioma);
idioma_route.patch('/actualizar-idioma', Idiomas_Controller.Actualizar_Idioma);
idioma_route.get('/obtener-idiomas', Idiomas_Controller.Obtener_Idiomas);
idioma_route.delete('/eliminar-idioma/:categoria_id', Idiomas_Controller.Eliminar_Idioma);


module.exports = idioma_route;