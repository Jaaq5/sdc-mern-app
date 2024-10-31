const express = require("express");
const pregunta_route = express.Router();

const Preguntas_Controller = require("../controllers/Preguntas_Controller");
pregunta_route.get(
  "/obtener-preguntas",
  Preguntas_Controller.Obtener_Preguntas,
);

module.exports = pregunta_route;
