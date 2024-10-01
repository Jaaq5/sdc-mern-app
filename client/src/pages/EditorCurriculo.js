import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Lenguajes from "./Lenguajes";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";

import {mapListaToHTML, SeccionOrderEditor} from "../Components/Editor/ListaOrden";
import {TextoEditor} from "../Components/Editor/TextoEditor";
import {SelectorID} from "../Components/Editor/SelectorID";

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

import BorderColorIcon from '@mui/icons-material/BorderColor';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';

const ToolBoxSwitcher = ({user_data, TextoEditar, setTextoEditar, ListaEditar, setListaEditar, documento, setDocumento, Editando, setEditando, SeleccionarIDs}) => {
	switch(Editando.Tipo){
		case "Texto":
			return (<>
				<TextoEditor TextoEditar={TextoEditar} setTextoEditar={setTextoEditar} documento={documento} setDocumento={setDocumento} Editando={Editando} setEditando={setEditando} />
			</>)
		case "IDs":
			return (<>
				<SelectorID user_data={user_data} TextoEditar={TextoEditar} setTextoEditar={setTextoEditar} ListaEditar={ListaEditar} setListaEditar={setListaEditar} documento={documento} setDocumento={setDocumento} Editando={Editando} setEditando={setEditando} SeleccionarIDs={SeleccionarIDs}/>
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
  const [cats_habilidades, setCatHabilidades] = useState([]);
  const [plantillas, setPlantillas] = useState([]);
  const [curriculo_id, setCurriculoId] = useState(null);
  const [idiomas, setIdiomas] = useState(null);

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
	width: "100%",
	maxHeight: "2rem",
	minWidth: "1rem",
	minHeight: "1rem",
    cursor: "pointer",
    color: "#0000",
	margin: "inherit",
	padding: "0px",
	display: "inline",
	fontSize: "inherit",
	position: "absolute",
	left: "-10px",
	top: "0.0rem"
  };
  const seccionEditButton = {
    backgroundColor: "#fff0",
    border: "0px",
    borderRadius: "5px",
	maxWidth: "20px",
	maxHeight: "20px",
	minWidth: "20px",
	minHeight: "20px",
    cursor: "pointer",
    color: "#000",
	margin: "0px",
	padding: "0px",
	display: "inline",
	fontSize: "inherit",
	position: "absolute",
	right: "2px",
	top: "2px"
  };
  const editButtonIcon ={
	  width: "20px", 
	  height: "20px"
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
  const [Editando, setEditando] = useState(null);
  const [TextoEditar, setTextoEditar] = useState("");
  const [ListaEditar, setListaEditar] = useState([]);
  const [tempIds, setTempIds] = useState({}); //Ids calculadas automaticamente y son las que se dibujan

  const getNameById =
        (id) => {
          const matchedMenuItem = idiomas.find((item) => item._id === id);
          return matchedMenuItem ? matchedMenuItem.Nombre : null;
        };
		
    const obtenerTextoEstructura = (user_data, nombreSeccion, seccion, id, estructura, index) => {
	let texto = "";
	estructura.Texto.forEach((campo) => {
		if(seccion[campo] || seccion[campo] === ""){ //Titulo y otros de plantilla
			texto += seccion[campo] === ""? estructura.Editable.Placeholder : seccion[campo];
		}else if(id && user_data.bloques[nombreSeccion][id][campo]){ //Bloques de datos
			if(nombreSeccion === "Idiomas" && campo === "Id")
				texto += getNameById(user_data.bloques[nombreSeccion][id][campo])
			else
				texto += user_data.bloques[nombreSeccion][id][campo]
		}else{ //Texto generico
			texto += campo;
		}
	});
	return texto;
  };
  
  const ElementoTextoEditable_HTML = ({user_data, documento, nombreSeccion, seccion, estructura, id, index}) => {
	  return (Editando? 
		(<></>)
		:
		(<Button
			title={estructura.Editable.Titulo}
			style={editButton}
			id={"Edit_Button_Texto_"+nombreSeccion+"_"+index}
			onClick={(e) => {
				setTextoEditar(seccion.TituloSeccion);
				setEditando({
					Tipo: "Texto",
					pos: posicionEnOverlay("Texto_"+nombreSeccion+"_"+index),
					Seccion: nombreSeccion,
					Campo: "TituloSeccion",
					label: estructura.Editable.Label,
					placeholder: estructura.Editable.Placeholder,
				});
			}}
			>
			<BorderColorIcon style={editButtonIcon} />
		</Button>)
	  );
  };
  
  const ElementoEditable_HTML = ({user_data, documento, nombreSeccion, seccion, estructura, id, index}) => {
	  if((!estructura) || !estructura.Editable)
		  return (<></>);
	  switch(estructura.Editable.Tipo){
		  case "Texto":
			return (<><ElementoTextoEditable_HTML user_data={user_data} documento={documento} nombreSeccion={nombreSeccion} seccion={seccion} estructura={estructura} id={id} index={index} /></>)
	  };
	  return (<></>);
  };

  const ElementoTextoEstructurado_HTML = ({user_data, documento, nombreSeccion, seccion, estructura, id, index}) => {
	  
	  return (<>
	  <p id={"Texto_"+nombreSeccion+"_"+index} style={estructura.style} key={nombreSeccion+id+index} >
			{obtenerTextoEstructura(user_data,nombreSeccion, seccion, id, estructura, index)}
			<ElementoEditable_HTML user_data={user_data} documento={documento} nombreSeccion={nombreSeccion} seccion={seccion} estructura={estructura} id={id} index={index} />
	  </p></>);
  };
	
  const ElementoEstructurado_HTML = ({user_data, documento, nombreSeccion, seccion, estructura, id, index}) => {
	  //console.log("Texto: "+nombreSeccion+", "+id+", "+index+", "+estructura.Tipo)
	  if(!estructura)
		  return (<></>);
	  
	  switch(estructura.Tipo){
		  case "Texto":
			return (<ElementoTextoEstructurado_HTML user_data={user_data} documento={documento} nombreSeccion={nombreSeccion} seccion={seccion} estructura={estructura} id={id} index={index} />);
		  case "IDs":
		    let list = [];
			
			//documento.datos.Secciones[nombreSeccion].IDs
			tempIds[nombreSeccion]?.forEach((bloque_id, index) => {
				list.push(
					<div style={estructura.plantillaStyle}>{Object.keys(estructura.Plantilla).map((index) => {
						return (<>
							<ElementoEstructurado_HTML user_data={user_data} documento={documento} nombreSeccion={nombreSeccion} seccion={seccion} estructura={estructura.Plantilla[index]} id={bloque_id} index={index} />
						</>)
					})}</div>
				);
			});
			return (<div style={estructura.style}>{list}</div>);
	  };
  };
	
  const SeccionHTMLEstructurada = ({user_data, seccion, documento, id}) => {
	  if(!documento.diseno.Secciones[seccion].Mostrar || !documento.diseno.Secciones[seccion].Estructura)
		  return (<></>);
	  
	  //La posicion necesita ser relativa para que funcione correctamente
	  if(Object.isFrozen(documento.diseno.Secciones[seccion].style)) //Ocurre la primera vez que se renderiza
		documento.diseno.Secciones[seccion].style = documento.diseno.Secciones[seccion].style? documento.diseno.Secciones[seccion].style : {};
		documento.diseno.Secciones[seccion].style = JSON.parse(JSON.stringify(documento.diseno.Secciones[seccion].style));
		documento.diseno.Secciones[seccion].style.position = "relative";
		
	  return (
		<div id={"Seccion_" + seccion} style={documento.diseno.Secciones[seccion].style} key={seccion}>
			{documento.diseno.Secciones[seccion].Editable? (
				<Button  
					title={documento.diseno.Secciones[seccion].Editable.Titulo}
					style={seccionEditButton}
					id={"Edit_Button_Seccion_"+seccion}
					onClick={(e) => {
					setEditando({
						Tipo: documento.diseno.Secciones[seccion].Editable.Tipo,
						pos: posicionEnOverlay("Seccion_"+seccion),
						Seccion: seccion,
						Campo: documento.diseno.Secciones[seccion].Editable.Campo,
						Arreglo: documento.diseno.Secciones[seccion].Editable.Arreglo,
						Lista: tempIds[seccion]
					});
					
					}} >
						<SwapHorizontalCircleIcon style={editButtonIcon}/>
				</Button>
			) : (
				<></>
			)}
			{Object.keys(documento.diseno.Secciones[seccion].Estructura).map((index) => {
				return (<>
					<ElementoEstructurado_HTML user_data={user_data} documento={documento} nombreSeccion={seccion} seccion={documento.diseno.Secciones[seccion]} estructura={documento.diseno.Secciones[seccion].Estructura[index]} id={id} index={index} />
				</>)
			})}
		</div>
	  );
  };
  
  //Ordena bloques del usuario por Fecha (si tiene), y por categorias del curriculo y puesto
  const OrdenarBloques = (bloques, ID_Categoria_Curriculo, ID_Categoria_Puesto) => {
	let sortedBloques = [];
	if(!bloques)
		return [];
	
	
	//Ordenar por fecha
	if(bloques[Object.keys(bloques)[0]].Fecha_Final)
		sortedBloques = Object.entries(bloques).sort(
		  ([, a], [, b]) => new Date(b.Fecha_Final) - new Date(a.Fecha_Final),
		);
	else if(bloques[Object.keys(bloques)[0]].Fecha_Publicacion)
		sortedBloques = Object.entries(bloques).sort(
		  ([, a], [, b]) => new Date(b.Fecha_Publicacion) - new Date(a.Fecha_Publicacion),
		);
	else
		sortedBloques = Object.entries(bloques).sort();
	
	//Ordenar por categorias
	sortedBloques = sortedBloques.sort(
		  ([, a], [, b]) => (b.ID_Categoria_Curriculo? (b.ID_Categoria_Curriculo === ID_Categoria_Curriculo? 1 : 0) : 0) - (a.ID_Categoria_Curriculo? (a.ID_Categoria_Curriculo === ID_Categoria_Curriculo? 1 : 0) : 0),
		);
	sortedBloques = sortedBloques.sort(
		  ([, a], [, b]) => (b.ID_Categoria_Puesto? (b.ID_Categoria_Puesto === ID_Categoria_Puesto? 1 : 0) : 0) - (a.ID_Categoria_Puesto? (a.ID_Categoria_Puesto === ID_Categoria_Puesto? 1 : 0) : 0),
		);
	return sortedBloques;
  }; 

  //Actualiza las IDs de bloques seleccionadas
  //Ocurre al inicio y cuando se cambia algun dato de cantidad o ID fija
  const SeleccionarIDs = (user_data, documento, ID_Categoria_Curriculo, ID_Categoria_Puesto) => {
    if (!user_data) return;
	Object.keys(documento.datos.Secciones).map((seccion) => {
		let cantidad = documento.diseno.Secciones[seccion].Editable.Arreglo? documento.datos.Secciones[seccion].Cantidad : 1;
		let lista = OrdenarBloques(user_data.bloques[seccion]);
		cantidad = Math.min(lista.length, cantidad);
		tempIds[seccion] = [];
		
		for(let i=cantidad; i>=0; i-=1){
			if(documento.diseno.Secciones[seccion].Editable.Arreglo)
				if(documento.datos.Secciones[seccion].IDs[i]){
					tempIds[seccion].push(documento.datos.Secciones[seccion].IDs[i]);
				}else{
					documento.datos.Secciones[seccion].IDs.splice(i,1);
				}
		}
		for(let i=0; tempIds[seccion].length < cantidad && i < lista.length; i+=1){
			if(documento.diseno.Secciones[seccion].Editable.Arreglo)
				if(!documento.datos.Secciones[seccion].IDs.includes(lista[i][0]))
					tempIds[seccion].push(lista[i][0]);
		}
	});
	setDocumento(documento);
	setTempIds(tempIds);
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
	pos = [Math.max(0, pos[0]), Math.max(0, pos[1])];
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
			<SeccionHTMLEstructurada user_data={user_data} seccion={"Informacion_Personal"} documento={documento} id={documento.datos.Secciones.Informacion_Personal} />
			{Object.keys(documento.diseno.Secciones.Orden).map((seccion) => {
				return(<SeccionHTMLEstructurada user_data={user_data} seccion={documento.diseno.Secciones.Orden[seccion]} documento={documento} key={"123"+seccion+documento.diseno.Secciones.Orden[seccion]}/>)
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
			{Object.keys(documento.diseno.Secciones.Orden).map((seccion) => 
				documento.diseno.Secciones[documento.diseno.Secciones.Orden[seccion]].Mostrar? (
					<View style={stilos_paleta.seccion}>
					  <Text style={stilos_paleta.titulo}>
						{documento.diseno.Secciones[documento.diseno.Secciones.Orden[seccion]].TituloSeccion}
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
        .ObtenerIdiomas()
        .then((response) => {
		  setIdiomas(response);
        })
        .catch((e) => {});

	  category_manager
        .ObtenerCategoriasHabilidad()
        .then((response) => {
          mapDBListToHTML(setCatHabilidades, response);
        })
        .catch((e) => {});
		

      setCurriculoId(user_data.editando_curriculo);
	  
	  //DEBUG
	  const doc = curriculum_manager.CopiarPlantilla("simple").Documento;//user_data.curriculums[user_data.editando_curriculo].Documento;
      setDocumento(
		doc
      );
      setCatCurriculum(
        user_data.curriculums[user_data.editando_curriculo].ID_Categoria_Curriculo,
      );
      setCatPuesto(
        user_data.curriculums[user_data.editando_curriculo].ID_Categoria_Puesto,
      );
	  
	  SeleccionarIDs(user_data, doc, user_data.curriculums[user_data.editando_curriculo].ID_Categoria_Curriculo, user_data.curriculums[user_data.editando_curriculo].ID_Categoria_Puesto);

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
					    user_data={user_data}
						TextoEditar={TextoEditar} 
						setTextoEditar={setTextoEditar} 
						ListaEditar={ListaEditar} 
						setListaEditar={setListaEditar} 
						documento={documento} 
						setDocumento={setDocumento} 
						Editando={Editando} 
						setEditando={setEditando}
						SeleccionarIDs={SeleccionarIDs}
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
