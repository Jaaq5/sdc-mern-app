const express = require("express");

const {
  Crear_Usuario,
  Log_In,
  Log_Out,
  Obtener_Datos_Usuario,
  Actualizar_Usuario,
  Actualizar_Usuario_Bloque,
  Crear_Curriculum,
  Actualizar_Usuario_Curriculum,
  Eliminar_Usuario_Curriculum,
  Eliminar_Usuario,
  upload,
  Subir_Imagen_Usuario,
  Actualizar_Imagen_Usuario,
  Eliminar_Imagen_Usuario,
} = require("../controllers/Usuarios_Controller");

const router = express.Router();

router.post("/subir-imagen", upload.single("userImage"), Subir_Imagen_Usuario);
router.patch("/actualizar-imagen/:usuario_id", Actualizar_Imagen_Usuario);
router.delete("/eliminar-imagen/:usuario_id", Eliminar_Imagen_Usuario);
router.post("/crear-usuario", Crear_Usuario);
router.post("/log-in-usuario", Log_In);
router.post("/log-out-usuario", Log_Out);
router.get("/obtener-usuario/:usuario_id", Obtener_Datos_Usuario);
router.patch("/crear-curriculum", Crear_Curriculum);
router.patch("/actualizar-usuario", Actualizar_Usuario);
router.patch("/actualizar-usuario-bloque", Actualizar_Usuario_Bloque);
router.patch("/actualizar-usuario-curr", Actualizar_Usuario_Curriculum);
router.delete(
  "/actualizar-usuario-curr/:usuario_id:curriculum_id",
  Eliminar_Usuario_Curriculum,
);
router.delete("/eliminar-usuario/:usuario_id", Eliminar_Usuario);

module.exports = router;
