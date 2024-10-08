const express = require("express");
const categoria_puesto_route = express.Router();

const Categorias_Puesto_Controller = require("../controllers/Categorias_Puesto_Controller");

categoria_puesto_route.get(
  "/obtener-categorias-puesto",
  Categorias_Puesto_Controller.Obtener_Categorias_Puesto,
);

module.exports = categoria_puesto_route;
