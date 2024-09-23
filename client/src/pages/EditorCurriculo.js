import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Lenguajes from "./Lenguajes";

import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';


import {
  Input,
  InputLabel,
  Grid,
  Button,
  Paper,
  TextField,
  Typography,
  List,
  ListItemText,
  ListItemButton,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";

import { DeleteForever, PostAdd } from "@mui/icons-material";

//Para cargar los datos de usuario, ponerlos como parametros aqui
//Tambien agregarlos en "App.js" (se pueden agregar otras variables ahi)
function EditorCurriculo({
  user_data,
  setUserData,
  manager_bloques,
  curriculum_manager,
  category_manager
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!user_data?.usuario_id);

  const [curriculos, setCurriculos] = useState([]);
  const [cats_curr, setCatCurr] = useState([]);
  const [cats_puesto, setCatsPuesto] = useState([]);
  const [plantillas, setPlantillas] = useState([]);
  const [curriculo_id, setCurriculoId] = useState(null);

  //Style
  const paperStyle = {
    padding: "2rem",
    margin: "1%",
    borderRadius: "0px",
    boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.4)",
    minHeight: "29.7cm",
	maxHeight: "29.7m",
	minWidth: "20cm",
	maxWidth: "20cm",
  };
  const paperSX = {
  };
  const heading = { fontSize: "2.5rem", fontWeight: "600" };
  const row = { display: "flex", marginTop: "2rem" };
  const btnStyle = {
    marginTop: "1rem",
    fontSize: "1.2rem",
    fontWeight: "700",
    backgroundColor: "blue",
    borderRadius: "0.5rem",
  };
  const fieldTitleStyle = {};
  const listStyle = {
    border: "solid 3px #999999aa",
    borderRadius: "5px",
    margin: "5px",
    height: "420px",
	minWidth: "300px",
	maxWidth: "300px",
    overflow: "hidden",
    backgroundColor: "#fff",
	display: "block",
	verticalAlign: "top",
  };
  const listButtonStyle = {
    border: "solid 1px #999999aa",
    height: "3rem",
    overflow: "hidden",
  };
  const deleteButton = {
    backgroundColor: "#f55",
    border: "0px",
    borderRadius: "5px",
    float: "right",
    cursor: "pointer",
    color: "#000",
  };
  const dense = true;
  
  //PDF
  const styles = StyleSheet.create({
	  page: {
		flexDirection: 'row',
		backgroundColor: '#EF0FEF33',
	  },
	  section: {
		margin: 10,
		padding: 10,
		flexGrow: 1
	  }
	});
	
	const MyDocument = () => {
	  if(!documento)
		  return (<></>);
	  else
		  return (
	  <Document style={{minHeight: "29.7cm",minWidth: "20cm", backgroundColor: '#EFEFEF',}}>
		<Page size="A4" style={styles.page} pageMode="useThumbs">
		  <View style={styles.section}>
			<Text>{documento.diseno.Informacion_Personal.Mostrar_Puesto? user_data.bloques.Informacion_Personal[documento.datos.Informacion_Personal].Puesto : "Sin Puesto"}</Text>
		  </View>
		  <View style={styles.section}>
			<Text>Section #2</Text>
		  </View>
		</Page>
	  </Document>
	)};

  //Editor
  const [categoria_curriculum, setCatCurriculum] = useState("");
  const [categoria_puesto, setCatPuesto] = useState("");
  const [documento, setDocumento] = useState(null);
  
  const [Informacion_Personal, setHTMLInfo] = useState(<></>);
  const [Educacion_Formal, setHTMLFormal] = useState(<></>);
  const [Educacion_Informal, setHTMLInformal] = useState(<></>);
  const [Experiencia_Laboral, setHTMLExp] = useState(<></>);
  const [Idiomas, setHTMLIdiomas] = useState(<></>);
  const [Proyectos, setHTMLProyectos] = useState(<></>);
  const [Publicaciones, setHTMLPubs] = useState(<></>);
  const [Referencias, setHTMLRefs] = useState(<></>);

  const mapToHTML_IP = (bloque) => {
    if (!bloque) return;

    setHTMLInfo(
        <div
          style={{}}
        >
		  {bloque.Mostrar_Foto? <img style={documento.diseno.Informacion_Personal.Foto} src=""/> : <></>}
          <h1 style={documento.diseno.Informacion_Personal.Nombre}>{bloque.Nombre}</h1>
		  {bloque.Mostrar_Puesto? <p style={documento.diseno.Informacion_Personal.Puesto}>Para el puesto: {" "+bloque.Puesto}</p> : <></>}
		  <p style={documento.diseno.Informacion_Personal.Telefono}>Teléfono: {" "+bloque.Telefono}</p>
		  <p style={documento.diseno.Informacion_Personal.Correo}>Correo: {" "+bloque.Correo}</p>
		  <p style={documento.diseno.Informacion_Personal.Direccion}>Dirección: {" "+bloque.Direccion}</p>
        </div>
      );
  };
  
  //Campos =>
  //ex: {"Fecha_Inicio": {"Tipo" : "p"}}
  const mapToHTML_Formal = (seccion, user_data, campos) => {
    const bloques = user_data.bloques[seccion]; //TODO, seleccion automatica
	var htmlBloques = Object.keys(bloques).map((id) => (
		<ListItemButton>
			{
				Object.keys(campos).map((campo) => (
					<p style={documento.diseno.Secciones[campo].style}> {bloques[id][campo]} </p>
				))
			}
		</ListItemButton>
	));
    setHTMLInfo(
        <div
          style={{}}
        >
		  <List
			dense={dense}
                style={{
                  padding: "5px",
                  maxHeight: "95%",
                  overflow: "auto",
                  backgroundColor: "#ccd5",
				  display: "flex",
				  flexWrap: "wrap",
				  flexDirection: "row",
				  
                }}
		  >
			{htmlBloques}
		  </List>
        </div>
      );
  };

  const mapDBListToHTML = (setter, lista) => {
    setter(
      Object.keys(lista).map((l_id) => (
        <MenuItem value={lista[l_id]._id} key={l_id} style={listButtonStyle}>
          {lista[l_id].Nombre}
        </MenuItem>
      )),
    );
  };

  //Al inicio de carga del componente
  useEffect(() => {
    if (!user_data || !user_data.editando_curriculo) {
      navigate("/login");
    } else {
      //Categorias
      category_manager
        .ObtenerCategoriasCurriculum()
        .then((response) => {
          mapDBListToHTML(setCatCurr, response);
        })
        .catch((e) => {});

      category_manager
        .ObtenerCategoriasPuesto()
        .then((response) => {
          mapDBListToHTML(setCatsPuesto, response);
        })
        .catch((e) => {});
		
	  setCurriculoId(user_data.editando_curriculo)	
	  console.log(user_data.editando_curriculo);
      setDocumento(user_data.curriculums[user_data.editando_curriculo].Documento);
	  setCatCurriculum(user_data.curriculums[user_data.editando_curriculo].ID_Categoria_Curriculo);
	  setCatPuesto(user_data.curriculums[user_data.editando_curriculo].ID_Categoria_Puesto)
      setLoading(false);
    }
  }, [
    user_data,
    setUserData,
    category_manager,
    navigate,
    setCatCurr,
    setCatPuesto,
    loading,
  ]); //Espera a que estos existan?

  if (loading) {
    return (
      <center>
        <h1>Cargando...</h1>
      </center>
    );
  }


  return (
    <>
      <div>
        <h1 style={{ color: "white", fontSize: "5rem" }}>
          Modificar Currículo
        </h1>
      </div>
      <div style={{ padding: "10px", width: "100%" }}>
        <div style={{display:"flex"}}>
			<div style={{width: "30%", maxHeight: "1000px", overflow: "auto"}}>
				<Lenguajes 
					  user_data={user_data}
					  setUserData={setUserData}
					  manager_bloques={manager_bloques}
					  category_manager={category_manager}
				/>
			</div>
			<MyDocument />
        </div>
      </div>
    </>
  );
}

export default EditorCurriculo;
