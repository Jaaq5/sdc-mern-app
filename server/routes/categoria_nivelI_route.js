const express = require("express");
const categoria_nivelI_route = express.Router();

const Categorias_NivelI_Controller = require("../controllers/Categorias_NivelI_Controller");

categoria_nivelI_route.get(
  "/obtener-categorias-nivelI",
  Categorias_NivelI_Controller.Obtener_Categorias_NivelI,
);

module.exports = categoria_nivelI_route;