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
import BorderColorIcon from '@mui/icons-material/BorderColor';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';


const TextoEditor = ({TextoEditar, setTextoEditar, documento, setDocumento, Editando, setEditando}) => {
	  if(!documento)
		  return (<></>);
	  setTimeout(function(){document.getElementById("Editor_Texto_Input")?.focus()},150);
	  return (<div style={{position: "absolute", left: Editando.pos[0]+"px",top: Editando.pos[1]+"px", marginTop: "-10px"}}>
			<TextField
				id="Editor_Texto_Input"
				style={{display: "flex", backgroundColor: "#EFEFEF", zIndex: 100}}
				InputProps = {{style: {}}}
				variant="standard"
				size="small"
				sx={{ label: { fontWeight: "700", fontSize: "1.0rem" } }}
				type="text"
				label={Editando.label}
				placeholder={Editando.placeholder}
				required
				value={TextoEditar}
				onChange={(e) => {
				  setTextoEditar(e.target.value);
				  documento.diseno.Secciones[Editando.Seccion][Editando.Campo] = e.target.value;
				  setDocumento(documento);
				}}
				onKeyDown={(e) => {if(e.keyCode === 13) setEditando(null)}}
				onBlur={(e) => {setEditando(null)}}
			  ></TextField>
		  </div>
	  
	  );
  };
  
const IdEditor = ({TextoEditar, setTextoEditar, documento, setDocumento, Editando, setEditando, Items}) => {
	  if(!documento)
		  return (<></>);
	  return (<>
			<TextField
				style={{display: "flex", position: "absolute", left: "400px",top: "400px", backgroundColor: "#EFEFEF"}}
				sx={{ label: { fontWeight: "700", fontSize: "1.0rem" } }}
				id="Informacion_Personal_Editor_Titulo"
				type="text"
				label="Titulo"
				placeholder="Titulo"
				required
				value={TextoEditar}
				onChange={(e) => {
				  setTextoEditar(e.target.value);
				  documento.diseno.Secciones[Editando.Seccion][Editando.Campo] = e.target.value;
				  setDocumento(documento);
				}}
			  ></TextField>
			  <Button onClick={(e) => {setEditando(null);}} >Listo</Button>
		  </>
	  
	  );
  };

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
  const row = { display: "flex" };
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
  
  //Stilos barra de herramientas
  const editButton = {
    backgroundColor: "#fff0",
    border: "0px",
    borderRadius: "5px",
	maxWidth: "30px",
	maxHeight: "30px",
    cursor: "pointer",
    color: "#000",
	margin: "0px",
	padding: "0px",
	display: "inline",
	fontSize: "inherit",
	position: "absolute",
	right: "2px"
  };
  const editButtonIcon ={
	  width: "0.8rem", 
	  height: "0.8rem"
  };
  const pdfCaja = {
	  backgroundColor: "#303030",
	  height: "1000px",
	  width: "auto",
	  overflow: "hidden",
  };
  const toolBar = {
	  backgroundColor: "#303030",
	  width: "calc(100% - 20px)",
	  height: "60px",
	  padding: "10px",
	  position: "sticky"
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
		width: "250px",
		textAlign: "left",
		backgroundColor: "#EF0FEF33",
		position: "relative",
		minHeight: "50px"
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
  
  //Editor
  const [categoria_curriculum, setCatCurriculum] = useState("");
  const [categoria_puesto, setCatPuesto] = useState("");
  const [documento, setDocumento] = useState(null);
  const [SeccionesHTML, setHTMLInfo] = useState({});
  const [Editando, setEditando] = useState(null);
  const [TextoEditar, setTextoEditar] = useState("");
  
  const posicionEnOverlay = (id) => {
	let doc = document.getElementById("contenedor_documento");
	if(!doc)
		return [0,0];
	
	const elm = document.getElementById(id);
	let parent = elm;
	let pos = [- doc.offsetLeft - doc.scrollLeft, - doc.offsetTop - doc.scrollTop];
	while(true){
		pos[0] += parent.offsetLeft;
		pos[1] += parent.offsetTop;
		if(parent.id? parent.id.includes("Seccion") : false)
			break;
		parent = parent.parentElement;
	}
	return pos;
	  
  };
  //HTML
  //Representacion HTMl del PDF, react-pdf no renderiza bien el documento en el DOM, pero esto da el un resultado mejor
  //Copiar la estructura usando elementos de react-pdf en "MyDocument" para descargarlo
  const MyHTMLDocument = () => {
    if (!documento) 
		return <></>;
    else{
		
		let numeroDePaginas = 1;
		return (
        <div
		  id="documento_html"
          style={{
            minHeight: "29.7cm",
            minWidth: "20cm",
			maxWidth: "20cm",
            backgroundColor: "#FFFFFF"
          }}
		  
        >
          <div style={stilos_paleta.pagina} id={"pagina_"+numeroDePaginas}>
			<div style={stilos_paleta.seccion} id={"Seccion_Informacion_Personal"}>
				<Button  
					title="Seleccionar la Informacion Personal"
					style={editButton}
					onClick={(e) => {setEditando({
						tipo: "Dropdown", 
						pos: posicionEnOverlay("Informacion_Personal"),
						Seccion: "Informacion_Personal",
						Campo: "Titulo"
					});
					}} >
						<SwapHorizontalCircleIcon style={editButtonIcon}/>
				</Button>
				
				<p style={stilos_paleta.titulo} id={"Informacion_Personal_Titulo_Texto"}>
					{documento.diseno.Secciones.Informacion_Personal.Titulo} 
					{!Editando? (<Button 
							title="Cambiar nombre"
							style={editButton}
							onClick={(e) => {
								setTextoEditar(documento.diseno.Secciones.Informacion_Personal.Titulo);
								setEditando({
									tipo: "Texto", 
									pos: posicionEnOverlay("Informacion_Personal_Titulo_Texto"),
									Seccion: "Informacion_Personal",
									Campo: "Titulo",
									label: "Nombre",
									placeholder: "Escribe tu nombre"
								});
						}} >
							<BorderColorIcon style={editButtonIcon}/>
						</Button>
						) : (
							<></>
						)}
				</p>
				<p style={stilos_paleta.item}>
					{user_data.bloques.Informacion_Personal[documento.datos.Secciones.Informacion_Personal].Mostrar_Puesto
					  ? "Para el puesto: "+(user_data.bloques.Informacion_Personal[documento.datos.Secciones.Informacion_Personal].Puesto)
					  : ""}
				</p>
				<p style={stilos_paleta.item}>
					Correo: {user_data.email}
				</p>
				<p style={stilos_paleta.item}>
					Teléfono: {user_data.bloques.Informacion_Personal[documento.datos.Secciones.Informacion_Personal].Telefono}
				</p>
			</div>
			{Object.keys(documento.diseno.Secciones.Orden).map((seccion) => 
				documento.diseno.Secciones[documento.diseno.Secciones.Orden[seccion]].Mostrar? (
					<div id={"Seccion_"+documento.diseno.Secciones.Orden[seccion]} style={stilos_paleta.seccion}>
					  <p id={documento.diseno.Secciones.Orden[seccion]+"_Titulo_Texto"} style={stilos_paleta.titulo}>
						{documento.diseno.Secciones[documento.diseno.Secciones.Orden[seccion]].Titulo}
						{!Editando? (<Button 
							title="Editar título de sección"
							style={editButton}
							onClick={(e) => {
								setTextoEditar(documento.diseno.Secciones[documento.diseno.Secciones.Orden[seccion]].Titulo);
								setEditando({
									tipo: "Texto", 
									pos: posicionEnOverlay(documento.diseno.Secciones.Orden[seccion]+"_Titulo_Texto"),
									Seccion: documento.diseno.Secciones.Orden[seccion],
									Campo: "Titulo",
									label: "Titulo de sección "+documento.diseno.Secciones.Orden[seccion],
									placeholder: documento.diseno.Secciones.Orden[seccion]
								});
						}} >
							<BorderColorIcon style={editButtonIcon}/>
						</Button>
						) : (
							<></>
						)}
					  </p>
					  {SeccionesHTML[seccion]}
					</div>
				) : (
					<></>
				)
			 )}
			 <p style={stilos_paleta.titulo}>
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
			  </p>
			  <p style={stilos_paleta.titulo}>
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
			  </p>
			  <p style={stilos_paleta.titulo}>
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
			  </p>
			  <p style={stilos_paleta.titulo}>
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
			  </p>
			  <p style={stilos_paleta.titulo}>
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
			  </p>
          </div>
        </div>
	)};
  };

  //PDF
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
					{user_data.bloques.Informacion_Personal[documento.datos.Secciones.Informacion_Personal].Mostrar_Puesto
					  ? "Para el puesto: "+(user_data.bloques.Informacion_Personal[documento.datos.Secciones.Informacion_Personal].Puesto)
					  : ""}
				</Text>
				<Text style={stilos_paleta.item}>
					Correo: {user_data.email}
				</Text>
				<Text style={stilos_paleta.item}>
					Teléfono: {user_data.bloques.Informacion_Personal[documento.datos.Secciones.Informacion_Personal].Telefono}
				</Text>
			</View>
			{Object.keys(documento.diseno.Secciones.Orden).map((seccion) => 
				documento.diseno.Secciones[documento.diseno.Secciones.Orden[seccion]].Mostrar? (
					<View style={stilos_paleta.seccion}>
					  <Text style={stilos_paleta.titulo}>
						{documento.diseno.Secciones[documento.diseno.Secciones.Orden[seccion]].Titulo}
					  </Text>
						{SeccionesHTML[seccion]}
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
	  
	  //DEBUG
	  const doc = curriculum_manager.CopiarPlantilla("simple").Documento;
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
		  <div style={pdfCaja}>
			  <div id="Herramientas" style={toolBar}>
				  <PDFDownloadLink style={{padding: "5px", borderRadius:"5px", backgroundColor: "#4ff78d"}} document={<MyDocument />} fileName="curriculum.pdf">
						{({ blob, url, loading, error }) => (loading ? 'Cargando...' : 'Descargar')}
				  </PDFDownloadLink>
				  <span style={{color: "white"}}>Por ahora, la plantilla simple es la utilizada</span>
			  </div>
			  {Editando? (
				  <div id="overlay" style={{position: "absolute", width: "100%", height: "100%", backgroundColor: "#0000", zIndex: 99}}>
					<TextoEditor TextoEditar={TextoEditar} setTextoEditar={setTextoEditar} documento={documento} setDocumento={setDocumento} Editando={Editando} setEditando={setEditando}/>
				  </div>
			  ) : (
				<>
				
				</>
			  )}
			  <div id="contenedor_documento" style={{overflow: "auto", maxHeight:"calc(100% - 60px)"}}>
				<MyHTMLDocument />
			  </div>
		  </div>
        </div>
      </div>
    </>
  );
}

export default EditorCurriculo;
