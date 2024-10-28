const express = require("express");
const curriculum_template_route = express.Router();

const Curriculums_Templates_Controller = require("../controllers/Curriculums_Templates_Controller");

curriculum_template_route.get(
  "/obtener-template",
  Curriculums_Templates_Controller.Obtener_Curriculum_Template,
);
curriculum_template_route.get(
  "/obtener-templates",
  Curriculums_Templates_Controller.Obtener_Curriculum_Templates,
);

module.exports = curriculum_template_route;
