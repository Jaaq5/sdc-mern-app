import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Lenguajes from "./Lenguajes";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";

import {mapListaToHTML, SeccionOrderEditor} from "../Components/Editor/ListaOrden";
import {TextoEditor} from "../Components/Editor/TextoEditor";

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
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';


const ToolBoxSwitcher = ({TextoEditar, setTextoEditar, ListaEditar, setListaEditar, documento, setDocumento, Editando, setEditando}) => {
	console.log("Ed: "+Editando)
	switch(Editando.Tipo){
		case "Texto":
			return (<>
				<TextoEditor TextoEditar={TextoEditar} setTextoEditar={setTextoEditar} documento={documento} setDocumento={setDocumento} Editando={Editando} setEditando={setEditando} />
			</>)
		case "Orden":
			return (<>
				<SeccionOrderEditor ListaEditar={ListaEditar} setListaEditar={setListaEditar} documento={documento} setDocumento={setDocumento} Editando={Editando} setEditando={setEditando} />
			</>)
	}
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
  const [idiomas, setIdiomas] = useState([]);
  const [cats_habilidades, setCatHabilidades] = useState([]);
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
  const dense = true;
  //Editor
  const [categoria_curriculum, setCatCurriculum] = useState("");
  const [categoria_puesto, setCatPuesto] = useState("");
  const [documento, setDocumento] = useState(null);
  const [SeccionesHTML, setHTMLInfo] = useState({});
  const [Editando, setEditando] = useState(null);
  const [TextoEditar, setTextoEditar] = useState("");
  const [ListaEditar, setListaEditar] = useState([]);
  const [laborallist, setBloquesLaboral] = useState([]);
  const [formallist, setBloquesFormal] = useState([]);
  const [informallist, setBloquesInformal] = useState([]);
  const [habilidadeslist, setBloquesHabilidades] = useState([]);
  const [proyectoslist, setBloquesProyectos] = useState([]);
  const [publicacioneslist, setBloquesPublicaciones] = useState([]);
  const [referenciaslist, setBloquesReferencias] = useState([]);
  const [idiomaslist, setBloquesIdiomas] = useState([]);

  const getNameById =
        (id) => {
          const matchedMenuItem = idiomas.find((menuItem) => menuItem.props.value === id);
          return matchedMenuItem ? matchedMenuItem.props.children : null;
        };

	const createList = (listData, renderItem) => {
		return listData.map((item, index) => (
			<View key={index} style={stilos_paleta.seccion}>
			<Text style={stilos_paleta.titulo}>
				{renderItem(item)}
			</Text>
			</View>
		));
		};

	const convertListItemTextToPlainObject = (listItemTextArray) => {
		return listItemTextArray.map((listItemTextComponent) => {
			const { primary, secondary } = listItemTextComponent.props;
			return {
			prim: primary,
			sec: secondary,
			};
		});
		};

  const mapToHTML = (bloques, seccion) => {
    if (!bloques) return;
	if(seccion == "Educacion_Formal"){
		const sortedBloques = Object.entries(bloques).sort(
			([, a], [, b]) => new Date(b.Fecha_Final) - new Date(a.Fecha_Final),
		);
		setBloquesFormal(
			sortedBloques.map(([plan_id, bloque], index) => (
	
				<ListItemText
					primary={bloque.Programa + " en " + bloque.Institucion + ""}
					secondary={
					bloque.Fecha_Inicio +
					"-" +
					bloque.Fecha_Final +
					": " +
					bloque.Descripcion.substring(0, 30)
					}
				/>

			)),
			);
	}else if(seccion == "Educacion_Tecnica"){
		const sortedBloques = Object.entries(bloques).sort(
			([, a], [, b]) => new Date(b.Fecha_Final) - new Date(a.Fecha_Final),
		);
		setBloquesInformal(
			sortedBloques.map(([plan_id, bloque], index) => (
	
				<ListItemText
					primary={bloque.Programa + " en " + bloque.Institucion + ""}
					secondary={
					bloque.Fecha_Inicio +
					"-" +
					bloque.Fecha_Final +
					": " +
					bloque.Descripcion.substring(0, 30)
					}
				/>

			)),
			);

	}else if(seccion == "Experiencias_Laborales"){
		const sortedBloques = Object.entries(bloques).sort(
			([, a], [, b]) => new Date(b.Fecha_Final) - new Date(a.Fecha_Final),
		  );
		setBloquesLaboral(
			sortedBloques.map(([plan_id, bloque], index) => (
				<ListItemText
				  primary={bloque.Puesto + " en " + bloque.Organizacion + ""}
				  secondary={
					bloque.Fecha_Inicio +
					"-" +
					bloque.Fecha_Final +
					": " +
					bloque.Descripcion.substring(0, 30)
				  }
				/>
			)),
		  );
	}else if(seccion == "Idiomas"){
		const niveles = [
			{ id: 1, nombre: "Bajo" },
			{ id: 2, nombre: "Medio" },
			{ id: 3, nombre: "Alto" },
		  ];
		setBloquesIdiomas(
			Object.keys(bloques).map((lenguaje_id, index) => {
			  const bloque = bloques[lenguaje_id];
			  const bnivel = bloque.Nivel;
			  const tipoLenguaje = getNameById(bloque.Id);
			  return (
				  <ListItemText
					primary={`Nombre: ${tipoLenguaje} | Certificación: ${bloque.Certificacion}`}
					secondary={`Nivel ${niveles.find((obj) => obj.id == bloque.Nivel).nombre}`}
				  />
			  );
			}),
		  );
	}else if(seccion == "Habilidades"){
		const catHabilidadesList = cats_habilidades;
		setBloquesHabilidades(
			Object.keys(bloques).map((habilidad_id) => {
			  const bloque = bloques[habilidad_id];
			  const descripcionCorta =
				bloque.Descripcion.length > 10
				  ? `${bloque.Descripcion.substring(0, 10)}...`
				  : bloque.Descripcion;
	  
			  const tipoHabilidad =
			  catHabilidadesList.find(
				  (categoria) => categoria._id === bloque.ID_Categoria_Habilidad,
				)?.Nombre || "Desconocido";
	  
			  return (
				  <ListItemText
					primary={`Nombre: ${bloque.Nombre}`}
					secondary={`Descripción: ${descripcionCorta} - Tipo: ${tipoHabilidad}`}
				  />
			  );
			}),
		  );
	}else if(seccion == "Proyectos"){
		const sortedBloques = Object.entries(bloques).sort(
			([, a], [, b]) => new Date(b.Fecha_Final) - new Date(a.Fecha_Final),
		  );
	  
		setBloquesProyectos(
			sortedBloques.map(([plan_id, bloque], index) => (
				<ListItemText
				  primary={bloque.Proyecto + " en " + bloque.Intitucion + ""}
				  secondary={
					bloque.Fecha_Inicio +
					"-" +
					bloque.Fecha_Final +
					": " +
					bloque.Descripcion.substring(0, 30)
				  }
				/>
			)),
		  );
	}else if(seccion == "Publicaciones"){
		const sortedBloques = Object.entries(bloques).sort(
			([, a], [, b]) =>
			  new Date(b.Fecha_Publicacion) - new Date(a.Fecha_Publicacion),
		  );
		setBloquesPublicaciones(
			sortedBloques.map(([publicacion_id, bloque], index) => {
			  const publicacion = bloque;
			  return (
				  <ListItemText
					primary={`Título: ${publicacion.Titulo} | Publicadora: ${publicacion.Publicadora}`}
					secondary={
					  <>
						<div>Fecha: {publicacion.Fecha_Publicacion}</div>
						<div
						  style={{
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "ellipsis",
							maxWidth: "300px", // Ajusta el ancho máximo según sea necesario
						  }}
						>
						  {publicacion.Abstract}
						</div>
					  </>
					}
				  />
			  );
			}),
		  );
	}else if(seccion == "Referencias"){
		setBloquesReferencias(
			Object.keys(bloques).map((referencia_id, index) => {
			  const referencia = bloques[referencia_id];
			  return (
				  <ListItemText
					primary={`Nombre: ${referencia.Nombre} - ${referencia.Puesto} en ${referencia.Organizacion}`}
					secondary={`Contacto: ${referencia.Direccion}, ${referencia.Email}, ${referencia.Telefono}`}
				  />
			  );
			}),
		  );
	}

  };
  
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
					onClick={(e) => {
					setEditando({
						Tipo: "Orden"
					});
					mapListaToHTML(ListaEditar, setListaEditar, documento, setDocumento);
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
									Tipo: "Texto", 
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
			{Object.keys(documento.diseno.Secciones.Orden).map((seccion) => {
				const currentSeccion = documento.diseno.Secciones[documento.diseno.Secciones.Orden[seccion]];

				if (currentSeccion.Mostrar) {
					// Process bloques before returning JSX for the current section
					let bloqueslist;
					switch (documento.diseno.Secciones.Orden[seccion]) {
						case "Experiencia_Laboral":
							bloqueslist = laborallist;
							break;
						case "Educacion_Formal":
							bloqueslist = formallist;
							break;
						case "Educacion_Informal":
							bloqueslist = informallist;
							break;
						case "Idiomas":
							bloqueslist = idiomaslist;
							break;
						case "Habilidades":
							bloqueslist = habilidadeslist;
							break;
						case "Proyectos":
							bloqueslist = proyectoslist;
							break;
						case "Publicaciones":
							bloqueslist = publicacioneslist;
							break;
						case "Referencias":
							bloqueslist = referenciaslist;
							break;
						default:
							bloqueslist = [];
					}
					return (
					<div id={"Seccion_" + documento.diseno.Secciones.Orden[seccion]} style={stilos_paleta.seccion}>
						<p id={documento.diseno.Secciones.Orden[seccion] + "_Titulo_Texto"} style={stilos_paleta.titulo}>
						{currentSeccion.Titulo}
						{!Editando ? (
							<Button
							title="Editar título de sección"
							style={editButton}
							onClick={(e) => {
								setTextoEditar(currentSeccion.Titulo);
								setEditando({
								Tipo: "Texto",
								pos: posicionEnOverlay(documento.diseno.Secciones.Orden[seccion] + "_Titulo_Texto"),
								Seccion: documento.diseno.Secciones.Orden[seccion],
								Campo: "Titulo",
								label: "Titulo de sección " + documento.diseno.Secciones.Orden[seccion],
								placeholder: documento.diseno.Secciones.Orden[seccion],
								});
							}}
							>
							<BorderColorIcon style={editButtonIcon} />
							</Button>
						) : (
							<></>
						)}
						<List dense={dense} style={{ padding: "5px", maxHeight: "95%", overflow: "auto", backgroundColor: "#ccd5" }}>
						{bloqueslist}
						</List>
						</p>
						{SeccionesHTML[seccion]}

					</div>
					);
				} else {
					return <></>;
				}
				})}
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
			{Object.keys(documento.diseno.Secciones.Orden).map((seccion) => {
			const currentSeccion = documento.diseno.Secciones[documento.diseno.Secciones.Orden[seccion]];

			if (currentSeccion.Mostrar) {
				let bloqueslistpdf;
					switch (documento.diseno.Secciones.Orden[seccion]) {
						case "Experiencia_Laboral":
							bloqueslistpdf = createList(convertListItemTextToPlainObject(laborallist), (item) => `${item.prim}: ${item.sec}`);
							break;
						case "Educacion_Formal":
							bloqueslistpdf = createList(convertListItemTextToPlainObject(formallist), (item) => `${item.prim}: ${item.sec}`);
							break;
						case "Educacion_Informal":
							bloqueslistpdf = createList(convertListItemTextToPlainObject(informallist), (item) => `${item.prim}: ${item.sec}`);
							break;
						case "Idiomas":
							bloqueslistpdf = createList(convertListItemTextToPlainObject(idiomaslist), (item) => `${item.prim}: ${item.sec}`);
							break;
						case "Habilidades":
							bloqueslistpdf = createList(convertListItemTextToPlainObject(habilidadeslist), (item) => `${item.prim}: ${item.sec}`);
							break;
						case "Proyectos":
							bloqueslistpdf = createList(convertListItemTextToPlainObject(proyectoslist), (item) => `${item.prim}: ${item.sec}`);
							break;
						case "Publicaciones":
							bloqueslistpdf = createList(convertListItemTextToPlainObject(publicacioneslist), (item) => `${item.prim}: ${item.sec}`);
							break;
						case "Referencias":
							bloqueslistpdf = createList(convertListItemTextToPlainObject(referenciaslist), (item) => `${item.prim}: ${item.sec}`);
							break;
						default:
							bloqueslistpdf = [];
					}
				return (
				<View key={seccion} style={stilos_paleta.seccion}>
					<Text style={stilos_paleta.titulo}>
					{currentSeccion.Titulo}
					</Text>
					<View style={stilos_paleta.seccion}>
					{bloqueslistpdf} {/* Render the idiomas list */}
					</View>
					{SeccionesHTML[seccion]} {/* Render other section content */}
				</View>
				);
			} else {
				return null;
			}
			})}
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

		category_manager
        .ObtenerCategoriasHabilidad()
        .then((response) => {
          mapDBListToHTML(setCatHabilidades, response);
        })
        .catch((e) => {});

		category_manager
        .ObtenerIdiomas()
        .then((response) => {
          mapDBListToHTML(setIdiomas, response);
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

  useEffect(() => {
	if (idiomas.length > 0) {
		mapToHTML(user_data.bloques["Experiencias_Laborales"], "Experiencias_Laborales");
		mapToHTML(user_data.bloques["Educacion_Formal"], "Educacion_Formal");
		mapToHTML(user_data.bloques["Educacion_Tecnica"], "Educacion_Tecnica");
		mapToHTML(user_data.bloques["Idiomas"], "Idiomas");
		mapToHTML(user_data.bloques["Habilidades"], "Habilidades");
		mapToHTML(user_data.bloques["Proyectos"], "Proyectos");
		mapToHTML(user_data.bloques["Publicaciones"], "Publicaciones");
		mapToHTML(user_data.bloques["Referencias"], "Referencias");
	}
  }, [idiomas, user_data]);

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
				  <Button onClick={(e) => {
					  setEditando({
						Tipo: "Orden"
					});
					mapListaToHTML(ListaEditar, setListaEditar, documento, setDocumento);
				  }}
				  >
					Secciones
				  </Button>
			  </div>
			  {Editando? (
				<div id="overlay" style={{position: "absolute", width: "100%", height: "100%", backgroundColor: "#0000", zIndex: 99}}>
					<ToolBoxSwitcher
						TextoEditar={TextoEditar} 
						setTextoEditar={setTextoEditar} 
						ListaEditar={ListaEditar} 
						setListaEditar={setListaEditar} 
						documento={documento} 
						setDocumento={setDocumento} 
						Editando={Editando} 
						setEditando={setEditando}
					/>
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
