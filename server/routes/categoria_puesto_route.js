const express = require('express');
const categoria_puesto_route = express.Router();

const Categorias_Puesto_Controller = require('../controllers/Categorias_Puesto_Controller');

categoria_puesto_route.post('/crear-categoria-puesto', Categorias_Puesto_Controller.Crear_Categoria_Puesto);
categoria_puesto_route.patch('/actualizar-categoria-puesto', Categorias_Puesto_Controller.Actualizar_Categoria_Puesto);
categoria_puesto_route.get('/obtener-categorias-puesto', Categorias_Puesto_Controller.Obtener_Categorias_Puesto);
categoria_puesto_route.delete('/eliminar-categoria-puesto/:categoria_id', Categorias_Puesto_Controller.Eliminar_Categoria_Puesto);


module.exports = categoria_puesto_route;