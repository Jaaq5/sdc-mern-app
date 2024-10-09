const express = require("express");
const idioma_route = express.Router();

const Idiomas_Controller = require("../controllers/Idiomas_Controller");
idioma_route.get("/obtener-idiomas", Idiomas_Controller.Obtener_Idiomas);

module.exports = idioma_route;
