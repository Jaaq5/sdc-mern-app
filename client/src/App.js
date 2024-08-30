import "./App.css";
import {React, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Components/Home";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import EducacionFormal from './Components/EducacionFormal';
import { Navbar } from "./Components/Navbar";
// import ProtectedRoute from "./Components/ProtectedRoute";

import { Axios_Url } from './consts';
import axios from "axios";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [user_data, setUserData] = useState(null);
  
  const manager_bloques = {
	//Funciones dinamicas para manipular bloques
	//Params: user_data(global), setUserData(callback global), sub_tabla(string, eg: Informacion_Personal), id(string, id del bloque dentro del ), data(objeto segun DB_model),
	InsertarBloque: (user_data, setUserData, sub_tabla, data) =>{
		user_data.bloques[sub_tabla][user_data.bloques[sub_tabla+"_NID"].toString()] = data; //Asignar nuevo bloque a la lista
		user_data.bloques[sub_tabla+"_NID"] = user_data.bloques[sub_tabla+"_NID"] + 1; //Incrementar
		setUserData(user_data); //Actualizar variable de sesion
	},
	
	ActualizarBloque:(user_data, setUserData, sub_tabla, id, data) =>{
		user_data.bloques[sub_tabla][id] = data; //Actualizar bloque
		setUserData(user_data); //Actualizar variable de sesion
	},
	
	BorrarBloque: (user_data, setUserData, sub_tabla, id) =>{
		delete user_data.bloques[sub_tabla][id]; //Eliminar bloque
		setUserData(user_data); //Actualizar variable de sesion
	},
	
	GuardarCambios: (user_data) =>{
		//To-Do
		console.error("Guardar Cambios todavía no está implementada, App.js")
	}
  }

  useEffect(() => {
      axios.post(Axios_Url+'/api/users/log-in-usuario', { withCredentials: true })
          .then(response => {
              if (response.data.usuario_id) {
                  setIsLoggedIn(true);
              } else {
                  setIsLoggedIn(false);
              }
          })
          .catch(() => setIsLoggedIn(false));
  }, []);

  return (
      <div>
          <BrowserRouter>
              <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
              <Routes>
                  <Route path="/home" element={<Home user_data={user_data} setUserData={setUserData} /> } />
                  <Route path="/login" element={isLoggedIn ? <Navigate to="/home" /> : <Login setIsLoggedIn={setIsLoggedIn} user_data={user_data} setUserData={setUserData} />} />
                  <Route path="/signup" element={isLoggedIn ? <Navigate to="/home" /> : <SignUp setIsLoggedIn={setIsLoggedIn} />} />
				  <Route path="/educacionformal" element={!isLoggedIn ? <Navigate to="/login" /> : <EducacionFormal user_data={user_data} setUserData={setUserData} manager_bloques={manager_bloques} />} />
              </Routes>
          </BrowserRouter>
      </div>
  );
}

export default App;