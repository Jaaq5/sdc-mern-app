const express = require("express");
const categoria_estadoP_route = express.Router();

const Categorias_EstadoP_Controller = require("../controllers/Categorias_EstadoP_Controller");

categoria_estadoP_route.get(
  "/obtener-categorias-estadoP",
  Categorias_EstadoP_Controller.Obtener_Categorias_EstadoP,
);

module.exports = categoria_estadoP_route;