const express = require("express");
const categoria_curriculum_route = express.Router();

const Categorias_Curriculum_Controller = require("../controllers/Categorias_Curriculum_Controller");

categoria_curriculum_route.get(
  "/obtener-categorias-curriculum",
  Categorias_Curriculum_Controller.Obtener_Categorias_Curriculum,
);

module.exports = categoria_curriculum_route;
