const express = require('express');
const categoria_habilidad_route = express.Router();

const Categorias_Habilidad_Controller = require('../controllers/Categorias_Habilidad_Controller');

categoria_habilidad_route.post('/crear-categoria-habilidad', Categorias_Habilidad_Controller.Crear_Categoria_Habilidad);
categoria_habilidad_route.patch('/actualizar-categoria-habilidad', Categorias_Habilidad_Controller.Actualizar_Categoria_Habilidad);
categoria_habilidad_route.get('/obtener-categorias-habilidad', Categorias_Habilidad_Controller.Obtener_Categorias_Habilidad);
categoria_habilidad_route.delete('/eliminar-categoria-habilidad/:categoria_id', Categorias_Habilidad_Controller.Eliminar_Categoria_Habilidad);

module.exports = categoria_habilidad_route;