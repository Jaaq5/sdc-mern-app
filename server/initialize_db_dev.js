// ./mongo server:27017/dbname --quiet initialize_db_dev.js
// mongo file.js "another file.js"
const Usuarios_Controller = require('../controllers/Usuarios_Controller');
Usuarios_Controller.Crear_Usuario({Nombre:"Prueba_1", Email:"prueba@prueba.com", Contrasena:"1234"}, null)
//db.Usuarios.insert({Nombre:"Prueba_1", Email:"prueba@prueba.com", Contrasena:"1234", Bloque_ID:"", Curriculums_IDs:[]});