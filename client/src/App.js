import "./App.css";
import { React, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Components/Home";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import EducacionFormal from "./Components/EducacionFormal";
import EducacionTecnica from "./Components/EducacionTecnica";
import InformacionPersonal from "./pages/InformacionPersonal";
import ExperienciaLaboral from "./pages/ExperienciaLaboral";
import Publicaciones from "./pages/Publicaciones";
import Referencias from "./pages/Referencias";
import Proyectos from "./pages/Proyectos";
import Habilidades from "./pages/Habilidades";
import Lenguajes from "./pages/Lenguajes";
import Conferencias from "./pages/Conferencias";
import Premios from "./pages/Premios";
import Repositorios from "./pages/Repositorios";
import CambiarContrasena from "./Components/CambiarContrasena";

import CurriculosMenu from "./pages/CurriculosMenu";
import EditorCurriculo from "./pages/EditorCurriculo";
import plantilla_simple from "./Components/curriculotemplate";
import plantilla_laboral from "./Components/curriculotemplate";
import plantilla_academico from "./Components/curriculoAcademicoTemplate";
import plantilla_harvard from "./Components/curriculoHarvardTemplate";

import { Navbar } from "./Components/Navbar";
// import ProtectedRoute from "./Components/ProtectedRoute";

import { apiUrl } from "./consts";
import axios from "axios";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [user_data, setUserData] = useState(null);
  const [listas_categorias, setListas] = useState({});
  const [plantillas, setPlantillas] = useState(null);
  const [local, setLocal] = useState(false);

  const guardarLocal = (local) => {
    const data = { ultima_modificacion: Date.now() / 60000 };
    user_data.ultima_modificacion = data.ultima_modificacion;
    if (local) {
      data.bloques = user_data.bloques;
      data.urriculums = user_data.curriculums;
    }
    localStorage.setItem("sdc_local", JSON.stringify(data));
  };

  const manager_bloques = {
    //Funciones dinamicas para manipular bloques
    //Params: user_data(global), setUserData(callback global), sub_tabla(string, eg: Informacion_Personal), id(string, id del bloque dentro del ), data(objeto segun DB_model),
    InsertarBloque: (user_data, setUserData, sub_tabla, data) => {
      user_data.bloques[sub_tabla] = user_data.bloques[sub_tabla]
        ? user_data.bloques[sub_tabla]
        : {};
      user_data.bloques[sub_tabla + "_NID"] = user_data.bloques[
        sub_tabla + "_NID"
      ]
        ? user_data.bloques[sub_tabla + "_NID"]
        : 1;
      user_data.bloques[sub_tabla][
        user_data.bloques[sub_tabla + "_NID"].toString()
      ] = data; //Asignar nuevo bloque a la lista
      user_data.bloques[sub_tabla + "_NID"] =
        user_data.bloques[sub_tabla + "_NID"] + 1; //Incrementar
      setUserData(user_data); //Actualizar variable de sesion

      axios
        .patch(apiUrl + "/api/users/actualizar-usuario-bloque", {
          usuario_id: user_data.usuario_id,
          seccion: sub_tabla,
          id: user_data.bloques[sub_tabla + "_NID"],
          datos: data,
          token: user_data.token,
        })
        .then((response) => {});

      return user_data.bloques[sub_tabla + "_NID"] - 1;
    },

    ActualizarBloque: (user_data, setUserData, sub_tabla, id, data) => {
      user_data.bloques[sub_tabla][id] = data; //Actualizar bloque
      setUserData(user_data); //Actualizar variable de sesion
      axios
        .patch(apiUrl + "/api/users/actualizar-usuario-bloque", {
          usuario_id: user_data.usuario_id,
          seccion: sub_tabla,
          id: id,
          datos: data,
          token: user_data.token,
        })
        .then((response) => {});
    },

    BorrarBloque: (user_data, setUserData, sub_tabla, id) => {
      delete user_data.bloques[sub_tabla][id]; //Eliminar bloque
      setUserData(user_data); //Actualizar variable de sesion
      axios
        .patch(apiUrl + "/api/users/actualizar-usuario-bloque", {
          usuario_id: user_data.usuario_id,
          seccion: sub_tabla,
          id: id,
          datos: null,
          token: user_data.token,
        })
        .then((response) => {});
    },

    GuardarCambios: (user_data, seccion, id, campo) => {
      /*axios
        .patch(apiUrl + "/api/users/actualizar-usuario-bloque", {
          usuario_id: user_data.usuario_id,
          datos: user_data.bloques,
		  token: user_data.token
        })
        .then((response) => {
          if (!response.data.success) {
            console.error("Error a actualizar el bloque");
          }
        })
        .catch((err) => {
          console.log(err);
        });*/
      guardarLocal(local);
      return;
    },
  };

  const category_manager = {
    ObtenerCategoriasCurriculum: async () => {
      if (listas_categorias.categorias_curriculum)
        return listas_categorias.categorias_curriculum;
      var categorias = [];
      axios
        .get(apiUrl + "/api/cat-curriculums/obtener-categorias-curriculum")
        .then((response) => {
          if (response.data.categorias_curriculum) {
            categorias = response.data.categorias_curriculum;
            listas_categorias.categorias_curriculum = categorias;
            setListas(listas_categorias);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      return categorias;
    },

    ObtenerCategoriasPuesto: async () => {
      if (listas_categorias.categorias_puesto)
        return listas_categorias.categorias_puesto;
      var categorias = [];
      axios
        .get(apiUrl + "/api/cat-job/obtener-categorias-puesto")
        .then((response) => {
          if (response.data.categorias_puesto) {
            categorias = response.data.categorias_puesto;
            listas_categorias.categorias_puesto = categorias;
            setListas(listas_categorias);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      return categorias.result;
    },

    ObtenerCategoriasEstadoP: async () => {
      if (listas_categorias.categorias_estadoP)
        return listas_categorias.categorias_estadoP;
      var categorias = [];
      axios
        .get(apiUrl + "/api/cat-state/obtener-categorias-estadoP")
        .then((response) => {
          if (response.data.categorias_estadoP) {
            categorias = response.data.categorias_estadoP;
            listas_categorias.categorias_estadoP = categorias;
            setListas(listas_categorias);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      return categorias.result;
    },

    ObtenerCategoriasHabilidad: async () => {
      if (listas_categorias.categorias_habilidad)
        return listas_categorias.categorias_habilidad;
      var categorias = [];
      axios
        .get(apiUrl + "/api/cat-skill/obtener-categorias-habilidad")
        .then((response) => {
          if (response.data.categorias_habilidad) {
            categorias = response.data.categorias_habilidad;
            listas_categorias.categorias_habilidad = categorias;
            setListas(listas_categorias);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      return categorias;
    },

    ObtenerIdiomas: async () => {
      if (listas_categorias.idiomas) return listas_categorias.idiomas;
      var categorias = [];
      axios
        .get(apiUrl + "/api/cat-language/obtener-idiomas")
        .then((response) => {
          if (response.data.idiomas) {
            categorias = response.data.idiomas;
            listas_categorias.idiomas = categorias;
            setListas(listas_categorias);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      return categorias;
    },
    ObtenerCategoriasNivelI: async () => {
      if (listas_categorias.categorias_nivelI)
        return listas_categorias.categorias_nivelI;
      var categorias = [];
      axios
        .get(apiUrl + "/api/cat-level/obtener-categorias-nivelI")
        .then((response) => {
          if (response.data.categorias_nivelI) {
            categorias = response.data.categorias_nivelI;
            listas_categorias.categorias_nivelI = categorias;
            setListas(listas_categorias);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      return categorias.result;
    },

    ObtenerPreguntas: async () => {
      if (listas_categorias.preguntas) return listas_categorias.preguntas;
      var categorias = [];
      return axios
        .get(apiUrl + "/api/cat-question/obtener-preguntas")
        .then((response) => {
          if (response.data.preguntas) {
            categorias = response.data.preguntas;
            listas_categorias.preguntas = categorias;
            setListas(listas_categorias);
            return response.data.preguntas;
          }
        })
        .catch((err) => {
          console.log(err);
        });
      return categorias;
    },

    IdANombreNivelI: (cat_id) => {
      const cat = listas_categorias.categorias_nivelI.find(
        (cat) => cat._id === cat_id,
      );
      return cat && cat.Nombre ? cat.Nombre : "-";
    },
    IdANombreCurriculo: (cat_id) => {
      const cat = listas_categorias.categorias_curriculum.find(
        (cat) => cat._id === cat_id,
      );
      return cat && cat.Nombre ? cat.Nombre : "-";
    },
    IdANombrePuesto: (cat_id) => {
      const cat = listas_categorias.categorias_puesto.find(
        (cat) => cat._id === cat_id,
      );
      return cat && cat.Nombre ? cat.Nombre : "-";
    },
    IdANombreEstadoP: (cat_id) => {
      const cat = listas_categorias.categorias_estadoP.find(
        (cat) => cat._id === cat_id,
      );
      return cat && cat.Nombre ? cat.Nombre : "-";
    },
    IdAPregunta: (cat_id) => {
      const cat = listas_categorias.preguntas.find((cat) => cat._id === cat_id);
      return cat && cat.Nombre ? cat.Nombre : "-";
    },
    NombreAIdPregunta: (name) => {
      const cat = listas_categorias.preguntas.find(
        (cat) => cat.Nombre === name,
      );
      return cat && cat._id ? cat._id : "";
    },
  };

  const curriculum_manager = {
    ObtenerCurriculos: async (user_data) => {
      if (user_data?.curriculums) return user_data.curriculums;
      return [];
    },

    CrearCurriculo: async (user_data, setUserData, plantilla) => {
      if (!plantilla) return null;

      return axios
        .post(apiUrl + "/api/users/crear-curriculum", {
          usuario_id: user_data.usuario_id,
          documento: JSON.stringify(plantilla.Documento),
          categoria_curriculum_id: plantilla.ID_Categoria_Curriculum,
          categoria_puesto_id: plantilla.ID_Categoria_Puesto,
          token: user_data.token,
        })
        .then((response) => {
          if (response.data.success) {
            plantilla._id = response.data.curriculum_id;
            user_data.curriculums.push(plantilla);
            setUserData(user_data);
            return user_data.curriculums.length - 1;
          }
        })
        .catch((err) => {
          console.log(err);
        });
      return null;
    },

    ActualizarCurriculo: async (
      user_data,
      setUserData,
      curriculo_id,
      documento,
      cat_curr_id,
      cat_puesto_id,
    ) => {
      user_data.curriculums[user_data.editando_curriculo].Documento = documento;
      setUserData(user_data);
      return axios
        .patch(apiUrl + "/api/users/actualizar-usuario-curr", {
          usuario_id: user_data.usuario_id,
          curriculum_id: curriculo_id,
          documento: JSON.stringify(documento),
          categoria_curriculum_id: cat_curr_id,
          categoria_puesto_id: cat_puesto_id,
          token: user_data.token,
        }) /*.then((response) => {
          //Revisar respuesta si es necesario
          if (response.data.success && response.data.curriculum_id) {
            return response.data.curriculum_id;
          }
        })*/
        .catch((err) => {
          console.log(err);
        });
      //return null;
    },

    EliminarCurriculo: async (user_data, setUserData, index, curriculo_id) => {
      return axios
        .delete(
          apiUrl +
            "/api/users/eliminar-usuario-curr/" +
            user_data.usuario_id +
            "&" +
            curriculo_id +
            "&" +
            user_data.token,
          {
            params: {
              usuario_id: user_data.usuario_id,
              curriculum_id: curriculo_id,
            },
          },
        )
        .then((response) => {
          if (!response.data.success) {
            console.error("Error a eliminar el currículo");
          } else {
            user_data.curriculums.splice(index, 1); //Eliminar bloque
            setUserData(user_data); //Actualizar variable de sesion
            return true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
      return null;
    },

    ObtenerPlantillas: async (filtros) => {
      if (plantillas) return plantillas;
      var plant = [];
      axios
        .get(apiUrl + "/api/templates/obtener-templates")
        .then((response) => {
          if (response.data.curriculums) {
            plant = response.data.curriculums;
            plant.forEach((data) => {
              data.Documento = JSON.parse(data.Documento);
            });
            setPlantillas(plant);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      return plant;
    },

    CopiarPlantilla: (plantilla_id) => {
      let plantilla = null;
      if (plantillas)
        plantilla = plantillas[plantilla_id]
          ? plantillas[plantilla_id]
          : plantillas.find((plnt) => plnt._id === plantilla_id);
      else return null;

      if (plantilla_id !== "simple" && !plantilla) return null;

      if (plantilla_id === "simple") {
        plantilla = JSON.parse(JSON.stringify(plantilla_simple));
      } else if (plantilla_id === "laboral") {
        plantilla = JSON.parse(JSON.stringify(plantilla_laboral));
      } else if (plantilla_id === "academico") {
        plantilla = JSON.parse(JSON.stringify(plantilla_academico));
      } else if (plantilla_id === "harvard") {
        plantilla = JSON.parse(JSON.stringify(plantilla_harvard));
      } else {
        plantilla = JSON.parse(JSON.stringify(plantilla));
      }

      if (plantilla.Documento.datos.Secciones.Informacion_Personal === "id") {
        const infoPersonalBloques = user_data.bloques.Informacion_Personal;
        plantilla.Documento.datos.Secciones.Informacion_Personal =
          infoPersonalBloques ? Object.keys(infoPersonalBloques)[0] : null;

        plantilla.ID_Categoria_Curriculum =
          listas_categorias.categorias_curriculum.find(
            (cat) => cat.Nombre === plantilla.ID_Categoria_Curriculum,
          )._id;
        plantilla.ID_Categoria_Puesto =
          listas_categorias.categorias_puesto.find(
            (cat) => cat.Nombre === plantilla.ID_Categoria_Puesto,
          )._id;

        plantilla.Documento.diseno.Secciones.Informacion_Personal.TituloSeccion =
          user_data.name;
      }
      return plantilla;
    },
  };

  useEffect(() => {
    axios.defaults.withCredentials = true;
    //if(isLoggedIn){
    //Load DB lists into cache
    category_manager.ObtenerCategoriasCurriculum();
    category_manager.ObtenerCategoriasPuesto();
    category_manager.ObtenerCategoriasEstadoP();
    category_manager.ObtenerCategoriasHabilidad();
    category_manager.ObtenerCategoriasNivelI();
    category_manager.ObtenerIdiomas();
    category_manager.ObtenerPreguntas();
    curriculum_manager.ObtenerPlantillas();
    //}
	
	//Mantener sesion
	//Vuelve a pedir los datos de BD pero entra de una vez
	if(!isLoggedIn && localStorage.getItem("sdc_session")){
		const items = localStorage.getItem("sdc_session").split(";");
		const usuario_id = items[0];
		const token = items[1];
		axios
            .get(
              apiUrl + "/api/users/obtener-usuario/" + usuario_id + "&" + token,
              {
                params: {
                  //usuario_id: usuario_id,
                  //token: token
                },
              },
            )
            .then((response) => {
              if (response.data.data) {
                setIsLoggedIn(true);
                response.data.data.usuario_id = usuario_id;
                response.data.data.token = token;
                Object.keys(response.data.data.curriculums).map(
                  (curriculum_id) => {
                    response.data.data.curriculums[curriculum_id].Documento =
                      JSON.parse(
                        response.data.data.curriculums[curriculum_id].Documento,
                      );
                  },
                );
                setUserData(response.data.data);
                //navigate.navigate("/curriculo-menu"); //, { state: { usuario_id: usuario_id, user_data: response.data.data } });
              }
            })
            .catch((err) => {
              console.log(err);
            });
	}
  }, [isLoggedIn]);

  return (
    <div>
      <BrowserRouter>
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Routes>
          <Route
            path="/home"
            element={<Home user_data={user_data} setUserData={setUserData} />}
          />
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/curriculo-menu" />
              ) : (
                <Login
                  setIsLoggedIn={setIsLoggedIn}
                  user_data={user_data}
                  setUserData={setUserData}
                  setLocal={setLocal}
                />
              )
            }
          />
          <Route
            path="/signup"
            element={
              isLoggedIn ? (
                <Navigate to="/home" />
              ) : (
                <SignUp category_manager={category_manager} />
              )
            }
          />
          <Route
            path="/cambiarcontrasena"
            element={
              isLoggedIn ? (
                <Navigate to="/home" />
              ) : (
                <CambiarContrasena category_manager={category_manager} />
              )
            }
          />
          <Route
            path="/curriculo-menu"
            element={
              !isLoggedIn ? (
                <Navigate to="/login" />
              ) : (
                <CurriculosMenu
                  user_data={user_data}
                  setUserData={setUserData}
                  manager_bloques={manager_bloques}
                  curriculum_manager={curriculum_manager}
                  category_manager={category_manager}
                />
              )
            }
          />
          <Route
            path="/informacionPersonal"
            element={
              !isLoggedIn ? (
                <Navigate to="/login" />
              ) : (
                <InformacionPersonal
                  user_data={user_data}
                  setUserData={setUserData}
                  manager_bloques={manager_bloques}
                />
              )
            }
          />
          <Route
            path="/educacionformal"
            element={
              !isLoggedIn ? (
                <Navigate to="/login" />
              ) : (
                <EducacionFormal
                  user_data={user_data}
                  setUserData={setUserData}
                  manager_bloques={manager_bloques}
                  category_manager={category_manager}
                />
              )
            }
          />
          <Route
            path="/educaciontecnica"
            element={
              !isLoggedIn ? (
                <Navigate to="/login" />
              ) : (
                <EducacionTecnica
                  user_data={user_data}
                  setUserData={setUserData}
                  manager_bloques={manager_bloques}
                  category_manager={category_manager}
                />
              )
            }
          />
          <Route
            path="/experiencialaboral"
            element={
              !isLoggedIn ? (
                <Navigate to="/login" />
              ) : (
                <ExperienciaLaboral
                  user_data={user_data}
                  setUserData={setUserData}
                  manager_bloques={manager_bloques}
                  category_manager={category_manager}
                />
              )
            }
          />

          <Route
            path="/proyectos"
            element={
              !isLoggedIn ? (
                <Navigate to="/login" />
              ) : (
                <Proyectos
                  user_data={user_data}
                  setUserData={setUserData}
                  manager_bloques={manager_bloques}
                  category_manager={category_manager}
                />
              )
            }
          />

          <Route
            path="/habilidades"
            element={
              !isLoggedIn ? (
                <Navigate to="/login" />
              ) : (
                <Habilidades
                  user_data={user_data}
                  setUserData={setUserData}
                  manager_bloques={manager_bloques}
                  category_manager={category_manager}
                />
              )
            }
          />

          <Route
            path="/lenguajes"
            element={
              !isLoggedIn ? (
                <Navigate to="/login" />
              ) : (
                <Lenguajes
                  user_data={user_data}
                  setUserData={setUserData}
                  manager_bloques={manager_bloques}
                  category_manager={category_manager}
                />
              )
            }
          />

          <Route
            path="/publicaciones"
            element={
              !isLoggedIn ? (
                <Navigate to="/login" />
              ) : (
                <Publicaciones
                  user_data={user_data}
                  setUserData={setUserData}
                  manager_bloques={manager_bloques}
                  category_manager={category_manager}
                />
              )
            }
          />
          <Route
            path="/conferencias"
            element={
              !isLoggedIn ? (
                <Navigate to="/login" />
              ) : (
                <Conferencias
                  user_data={user_data}
                  setUserData={setUserData}
                  manager_bloques={manager_bloques}
                  category_manager={category_manager}
                />
              )
            }
          />

          {/* Inicio ruta para premios y reconocimientos */}
          <Route
            path="/premios"
            element={
              !isLoggedIn ? (
                <Navigate to="/login" />
              ) : (
                <Premios
                  user_data={user_data}
                  setUserData={setUserData}
                  manager_bloques={manager_bloques}
                  category_manager={category_manager}
                />
              )
            }
          />
          {/* Fin ruta para premios y reconocimientos */}

          {/* Inicio ruta para repositorios */}
          <Route
            path="/repositorios"
            element={
              !isLoggedIn ? (
                <Navigate to="/login" />
              ) : (
                <Repositorios
                  user_data={user_data}
                  setUserData={setUserData}
                  manager_bloques={manager_bloques}
                  category_manager={category_manager}
                />
              )
            }
          />
          {/* Fin ruta para repositorios */}

          <Route
            path="/referencias"
            element={
              !isLoggedIn ? (
                <Navigate to="/login" />
              ) : (
                <Referencias
                  user_data={user_data}
                  setUserData={setUserData}
                  manager_bloques={manager_bloques}
                  category_manager={category_manager}
                />
              )
            }
          />
          <Route
            path="/editor-curriculo"
            element={
              !isLoggedIn ? (
                <Navigate to="/login" />
              ) : (
                <EditorCurriculo
                  user_data={user_data}
                  setUserData={setUserData}
                  manager_bloques={manager_bloques}
                  curriculum_manager={curriculum_manager}
                  category_manager={category_manager}
                />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
