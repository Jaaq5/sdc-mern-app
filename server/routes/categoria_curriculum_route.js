const express = require('express');
const categoria_curriculum_route = express.Router();

const Categorias_Curriculum_Controller = require('../controllers/Categorias_Curriculum_Controller');

categoria_curriculum_route.post('/crear-categoria-curriculum', Categorias_Curriculum_Controller.Crear_Categoria_Curriculum);
categoria_curriculum_route.patch('/actualizar-categoria-curriculum', Categorias_Curriculum_Controller.Actualizar_Categoria_Curriculum);
categoria_curriculum_route.get('/obtener-categorias-curriculum', Categorias_Curriculum_Controller.Obtener_Categorias_Curriculum);
categoria_curriculum_route.delete('/eliminar-categoria_curriculum/:categoria_id', Categorias_Curriculum_Controller.Eliminar_Categoria_Curriculum);


module.exports = categoria_curriculum_route;