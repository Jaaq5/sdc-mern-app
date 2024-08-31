const express = require("express");
const curriculum_template_route = express.Router();

const Curriculums_Templates_Controller = require("../controllers/Curriculums_Templates_Controller");

curriculum_template_route.post(
  "/crear-template",
  Curriculums_Templates_Controller.Crear_Curriculum_Template_Vacio,
);
curriculum_template_route.patch(
  "/actualizar-template",
  Curriculums_Templates_Controller.Actualizar_Curriculum_Template,
);
curriculum_template_route.get(
  "/obtener-template",
  Curriculums_Templates_Controller.Obtener_Curriculum_Template,
);
curriculum_template_route.get(
  "/obtener-templates",
  Curriculums_Templates_Controller.Obtener_Curriculum_Templates,
);
curriculum_template_route.delete(
  "/eliminar-tmplate/:template_id",
  Curriculums_Templates_Controller.Eliminar_Curriculum_Template,
);

module.exports = curriculum_template_route;
