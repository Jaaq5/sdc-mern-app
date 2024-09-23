import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Lenguajes from "./Lenguajes";

import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";

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
  category_manager,
}) {
  const navigate = useNavigate();
  const [cargando, setLoading] = useState(!user_data?.usuario_id);

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
  const paperSX = {};
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
  const toolBar = {
	  backgroundColor: "#303030",
	  width: "calc(100% - 20px)",
	  height: "60px",
	  padding: "10px"
  };

  //PDF
  const stilos_paleta = StyleSheet.create({
	pagina: {
		paddingTop: 35,
		paddingBottom: 65,
		paddingLeft: 35,
		paddingRight: 35,
		textAlign: "center",
	},
    seccion: {
		margin: "1px",
		padding: "3px",
		flexGrow: 1,
		width: "250px",
		textAlign: "left",
		backgroundColor: "#EF0FEF33",
    },
	titulo: {
		margin: 12,
		fontSize: 14,
		textAlign: 'justify',
		fontFamily: 'Times-Roman'
	},
	item: {
		margin: 2,
		fontSize: 10,
		textAlign: 'justify',
		fontFamily: 'Times-Roman'
	},
  });

  //
  const MyDocument = () => {
    if (!documento) return <></>;
    else
      return (
        <Document
          style={{
            minHeight: "29.7cm",
			maxHeight: "29.7cm",
            minWidth: "20cm",
			maxWidth: "20cm",
            backgroundColor: "#EFEFEF",
          }}
        >
          <Page size="A4" style={stilos_paleta.pagina}>
			<View style={stilos_paleta.seccion}>
				<Text style={stilos_paleta.titulo}>
					Aplicante: {user_data.name}
				</Text>
				<Text style={stilos_paleta.item}>
					{user_data.bloques.Informacion_Personal[documento.datos.Informacion_Personal].Mostrar_Puesto
					  ? "Para el puesto: "+(user_data.bloques.Informacion_Personal[documento.datos.Informacion_Personal].Puesto)
					  : ""}
				</Text>
				<Text style={stilos_paleta.item}>
					Correo: {user_data.email}
				</Text>
				<Text style={stilos_paleta.item}>
					Teléfono: {user_data.bloques.Informacion_Personal[documento.datos.Informacion_Personal].Telefono}
				</Text>
			</View>
			{Object.keys(documento.diseno.Secciones.Orden).map((seccion) => 
				documento.diseno.Secciones[documento.diseno.Secciones.Orden[seccion]].Mostrar? (
					<View style={stilos_paleta.seccion}>
					  <Text >
						{documento.diseno.Secciones[documento.diseno.Secciones.Orden[seccion]].Titulo}
						{SeccionesHTML[seccion]}
					  </Text>
					</View>
				) : (
					<></>
				)
			 )}
			 <Text style={stilos_paleta.titulo}>
				Casi todo aquel día caminó sin acontecerle cosa que de contar fuese, de
				lo cual se desesperaba, porque quisiera topar luego luego con quien
				hacer experiencia del valor de su fuerte brazo. Autores hay que dicen
				que la primera aventura que le avino fue la del Puerto Lápice, otros
				dicen que la de los molinos de viento; pero lo que yo he podido
				averiguar en este caso, y lo que he hallado escrito en los anales de la
				Mancha, es que él anduvo todo aquel día, y, al anochecer, su rocín y él
				se hallaron cansados y muertos de hambre, y que, mirando a todas partes
				por ver si descubriría algún castillo o alguna majada de pastores donde
				recogerse y adonde pudiese remediar su mucha hambre y necesidad, vio, no
				lejos del camino por donde iba, una venta,que fue como si viera una
				estrella que, no a los portales, sino a los alcázares de su redención le
				encaminaba. Diose priesa a caminar, y llegó a ella a tiempo que
				anochecía.
			  </Text>
          </Page>
        </Document>
      );
  };

  //Editor
  const [categoria_curriculum, setCatCurriculum] = useState("");
  const [categoria_puesto, setCatPuesto] = useState("");
  const [documento, setDocumento] = useState(null);

  const [SeccionesHTML, setHTMLInfo] = useState({});

  const mapToHTML_IP = (bloque) => {
    if (!bloque) return;

    setHTMLInfo(
      <div style={{}}>
        {bloque.Mostrar_Foto ? (
          <img style={documento.diseno.Informacion_Personal.Foto} src="" />
        ) : (
          <></>
        )}
        <h1 style={documento.diseno.Informacion_Personal.Nombre}>
          {bloque.Nombre}
        </h1>
        {bloque.Mostrar_Puesto ? (
          <p style={documento.diseno.Informacion_Personal.Puesto}>
            Para el puesto: {" " + bloque.Puesto}
          </p>
        ) : (
          <></>
        )}
        <p style={documento.diseno.Informacion_Personal.Telefono}>
          Teléfono: {" " + bloque.Telefono}
        </p>
        <p style={documento.diseno.Informacion_Personal.Correo}>
          Correo: {" " + bloque.Correo}
        </p>
        <p style={documento.diseno.Informacion_Personal.Direccion}>
          Dirección: {" " + bloque.Direccion}
        </p>
      </div>,
    );
  };

  
  //Dropdowns
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

      setCurriculoId(user_data.editando_curriculo);
      console.log(user_data.editando_curriculo);
	  
	  //DEBUG
	  const doc = curriculum_manager.CopiarPlantilla("simple").Documento; //user_data.curriculums[user_data.editando_curriculo].Documento;
      setDocumento(
		doc
      );
      setCatCurriculum(
        user_data.curriculums[user_data.editando_curriculo].ID_Categoria_Curriculo,
      );
      setCatPuesto(
        user_data.curriculums[user_data.editando_curriculo].ID_Categoria_Puesto,
      );
      setLoading(false);
    }
  }, [
    user_data,
    setUserData,
    category_manager,
    navigate,
    setCatCurr,
    setCatPuesto,
    cargando,
  ]); //Espera a que estos existan?

  if (cargando) {
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
        <div style={{ display: "flex", minHeight: "100%" }}>
          <div style={{ width: "30%", maxHeight: "1000px", overflow: "auto" }}>
            <Lenguajes
              user_data={user_data}
              setUserData={setUserData}
              manager_bloques={manager_bloques}
              category_manager={category_manager}
            />
          </div>
		  <div style={{height: "1000px"}}>
			  <div id="Herramientas" style={toolBar}>
				  <PDFDownloadLink style={{padding: "5px", borderRadius:"5px", backgroundColor: "#4ff78d"}} document={<MyDocument />} fileName="curriculum.pdf">
						{({ blob, url, loading, error }) => (loading ? 'Cargando...' : 'Descargar')}
				  </PDFDownloadLink>
			  </div>
			  <PDFViewer style={{minWidth: "22cm", height: "100%"}} showToolbar={false}>
				<MyDocument />
			  </PDFViewer>
		  </div>
        </div>
      </div>
    </>
  );
}

export default EditorCurriculo;
