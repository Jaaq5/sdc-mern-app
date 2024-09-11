import "./App.css";
import { React, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Components/Home";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import EducacionFormal from "./Components/EducacionFormal";
import EducacionTecnica from "./Components/EducacionTecnica";
import SobreMi from "./Components/SobreMi";
import InformacionPersonal from "./pages/InformacionPersonal";
import ExperienciaLaboral from "./pages/ExperienciaLaboral";
import Publicaciones from "./pages/Publicaciones";
import Referencias from "./pages/Referencias";
import Proyectos from "./pages/Proyectos";
import Habilidades from "./pages/Habilidades";
import Lenguajes from "./pages/Lenguajes";

import { Navbar } from "./Components/Navbar";
// import ProtectedRoute from "./Components/ProtectedRoute";

import { apiUrl } from "./consts";
import axios from "axios";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [user_data, setUserData] = useState(null);
  const [listas_categorias, setListas] = useState({});

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
      return user_data.bloques[sub_tabla + "_NID"] - 1;
    },

    ActualizarBloque: (user_data, setUserData, sub_tabla, id, data) => {
      user_data.bloques[sub_tabla][id] = data; //Actualizar bloque
      setUserData(user_data); //Actualizar variable de sesion
    },

    BorrarBloque: (user_data, setUserData, sub_tabla, id) => {
      delete user_data.bloques[sub_tabla][id]; //Eliminar bloque
      setUserData(user_data); //Actualizar variable de sesion
    },

    GuardarCambios: (user_data) => {
      axios
        .patch(apiUrl + "/api/users/actualizar-usuario-bloque", {
          usuario_id: user_data.usuario_id,
          bloques: user_data.bloques,
        })
        .then((response) => {
          if (!response.data.success) {
            console.error("Error a actualizar el bloque");
          }
        })
        .catch((err) => {
          console.log(err);
        });
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

    ObtenerCategoriasHabilidad: async () => {
      if (listas_categorias.hailidades) return listas_categorias.hailidades;
      var categorias = [];
      axios
        .get(apiUrl + "/api/cat-skill/obtener-categorias-habilidad")
        .then((response) => {
          if (response.data.categorias_hailidad) {
            categorias = response.data.hailidades;
            listas_categorias.categorias_hailidad = categorias;
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
  };

  useEffect(() => {
    axios
      .post(apiUrl + "/api/users/log-in-usuario", { withCredentials: true })
      .then((response) => {
        if (response.data.usuario_id) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(() => setIsLoggedIn(false));

    //Load DB lists into cache
    category_manager.ObtenerCategoriasCurriculum();
    category_manager.ObtenerCategoriasPuesto();
    category_manager.ObtenerCategoriasHabilidad();
    category_manager.ObtenerIdiomas();

    //Initialize db
    //axios.post(apiUrl + "/api/cat-curriculums/crear-categoria-curriculum", {nombre: "Laboral"}).then((response) => {console.log(response);}).catch((err) => {console.log(err);});
    //axios.post(apiUrl + "/api/cat-curriculums/crear-categoria-curriculum", {nombre: "Académico"}).then((response) => {console.log(response);}).catch((err) => {console.log(err);});
  }, []);

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
                <Navigate to="/home" />
              ) : (
                <Login
                  setIsLoggedIn={setIsLoggedIn}
                  user_data={user_data}
                  setUserData={setUserData}
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
                <SignUp setIsLoggedIn={setIsLoggedIn} />
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
            path="/sobremi"
            element={
              !isLoggedIn ? (
                <Navigate to="/login" />
              ) : (
                <SobreMi
                  user_data={user_data}
                  setUserData={setUserData}
                  manager_bloques={manager_bloques}
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
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
