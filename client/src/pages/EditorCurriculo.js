import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import Slider from '@mui/material/Slider';

import DocumentoPDF from "../Components/Editor/DocumentoPDF";

import PanelSeccion from "../Components/Editor/PanelSeccion";
import {mapListaToHTML, SeccionOrderEditor} from "../Components/Editor/ListaOrden";
import {TextoEditor} from "../Components/Editor/TextoEditor";
import {SelectorID} from "../Components/Editor/SelectorID";
import {EditorTamano, celdasAPx, celdasPagina, resolucionCeldas, GridCSS} from "../Components/Editor/EditorTamano";
import BotonEditable from "../Components/Editor/BotonEditable";
import Autosave from "../Components/Editor/Autosave";
import HerramientasElementos from "../Components/Editor/HerramientasElementos";
import CajaTextoCreador from "../Components/Editor/CajaTextoCreador";

import "./editor.css";

import { stripeStyle, textOverlayStyle } from "../style";

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

import {
	listButtonStyle, 
  } from "../style";
import { theme } from "../theme";

const ToolBoxSwitcher = ({user_data, TextoEditar, setTextoEditar, ListaEditar, setListaEditar, documento, setDocumento, Editando, setEditando, SeleccionarIDs, zoom}) => {
	switch(Editando.Tipo){
		case "Texto":
			return (<>
				<TextoEditor TextoEditar={TextoEditar} setTextoEditar={setTextoEditar} documento={documento} setDocumento={setDocumento} Editando={Editando} setEditando={setEditando} zoom={zoom} />
			</>)
		case "IDs":
			return (<>
				<SelectorID user_data={user_data} TextoEditar={TextoEditar} setTextoEditar={setTextoEditar} ListaEditar={ListaEditar} setListaEditar={setListaEditar} documento={documento} setDocumento={setDocumento} Editando={Editando} setEditando={setEditando} SeleccionarIDs={SeleccionarIDs}  zoom={zoom}/>
			</>)
		case "Orden":
			return (<>
				<SeccionOrderEditor ListaEditar={ListaEditar} setListaEditar={setListaEditar} documento={documento} setDocumento={setDocumento} Editando={Editando} setEditando={setEditando} zoom={zoom}/>
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

  //Stilos barra de herramientas
  const editButton = {
    backgroundColor: "#fff0",
    border: "0px",
    borderRadius: "5px",
	width: "100%",
	maxHeight: "100%",
	minWidth: "2rem",
	minHeight: "100%",
    cursor: "pointer",
    color: "#000",
	margin: "0px",
	padding: "0px",
	display: "inline",
	fontSize: "inherit",
	position: "absolute",
	left: "0%",
	top: "2px"
  };
  const seccionEditButton = {
    backgroundColor: "#fff0",
    border: "0px",
    borderRadius: "5px",
	maxWidth: "100%",
	maxHeight: "100%",
	minWidth: "100%",
	minHeight: "100%",
    cursor: "pointer",
    color: "#000",
	margin: "0px",
	padding: "0px",
	display: "inline",
	fontSize: "inherit",
	position: "absolute",
	right: "0px",
	top: "0px",
	pointerEvents: "auto"
  };
  const seccionEditButtonIcon ={
	  width: "20px", 
	  height: "20px",
	  display: "none"
  };
  const editButtonIcon ={
	  width: "20px", 
	  height: "20px",
	  maxHeight: "1rem",
	  pointerEvents: "auto",
	  color: "#000"
  };
  const pdfCaja = {
	  backgroundColor: "#303030",
	  height: "1000px",
	  width: "70%",
	  minWidth: (celdasPagina[0]*resolucionCeldas)+"px",
	  overflow: "hidden",
	  position: "relative"
  };
  const toolBar = {
	  backgroundColor: "#303030",
	  width: "calc(100% - 20px)",
	  minHeight: "60px",
	  height: "60px",
	  padding: "5px",
	  position: "sticky",
	  flexDirection: "row"
  };
  
  
  //Editor
  const [categoria_curriculum, setCatCurriculum] = useState("");
  const [categoria_puesto, setCatPuesto] = useState("");
  const [documento, setDocumento] = useState(null);
  const [Editando, setEditando] = useState(null);
  const [TextoEditar, setTextoEditar] = useState("");
  const [ListaEditar, setListaEditar] = useState([]);
  const [tempIds, setTempIds] = useState({}); //Ids calculadas automaticamente y son las que se dibujan
  const [opcionesPanel, setOpcionesPanel] = useState({}); //Opciones pasadas al selector de panel de edicion para las secciones externamente
  const [minMaxDoc, setMinMaxDoc] = useState([0,0,600,800]);
  const [zoom, setZoom] = useState(1);
  const [controles, setControles] = useState({});
   
  //DEBUG
  const [editMode, setEditMode] = useState("Usuario");

  const getNameById = (id) => {
	      if(!idiomas)
			  return "";
          const matchedMenuItem = idiomas.find((item) => item._id === id);
          return matchedMenuItem ? matchedMenuItem.Nombre : "";
        };
		
  //Retorna el estilo
  const tamanoYPosicion = (estructura, pindex = 0, index = 0) => {
	try{
		estructura.style = JSON.parse(JSON.stringify(estructura.style? estructura.style : {}));
	}catch(e){
		estructura = JSON.parse(JSON.stringify(estructura? estructura : {}));
		estructura.style = JSON.parse(JSON.stringify(estructura.style? estructura.style : {}));
	}
	estructura.style.position = "relative";
	const tc = [0,0];
	if(estructura.Celdas){
		const t = celdasAPx(estructura.Celdas);
		tc[0] = t.width;
		tc[1] = t.height;
		estructura.style.width = t.width+"px";
		estructura.style.height = t.height+"px";
	}
	if(estructura.Pos){
		//TODO
		//Hacer esto al cometer cambios
		/*const tPos = [estructura.Pos[0], estructura.Pos[1]];
		if(estructura.Estructura){
			if(tPos[1] > (pindex+1)*60){
				tPos[1] -= (pindex+1)*60;
				if(documento.diseno.Paginas[pindex+1] && documento.diseno.Paginas[pindex+1].Estructura.indexOf(index) < 0)
					documento.diseno.Paginas[pindex+1].Estructura.push(index);
				else{
					documento.diseno.Paginas.push({
						style: documento.diseno.Paginas[0].style,
						Elementos: documento.diseno.Paginas[0].Elementos,
						Estructura: [index]
					});
				}
				//Remover de la pagina anterior
				delete documento.diseno.Paginas[pindex].Estructura[documento.diseno.Paginas[pindex].Estructura.indexOf(index)];
				
			}else{
				tPos[1] -= (pindex)*60;
			}
		}*/
		const t = celdasAPx(estructura.Pos);
		estructura.style.left = t.width+"px";
		estructura.style.top = t.height+"px";
		estructura.style.position = "absolute";
		
		
		minMaxDoc[0] = minMaxDoc[0] < t.width? minMaxDoc[0] : t.width;
		minMaxDoc[1] = minMaxDoc[1] < t.height? minMaxDoc[1] : t.height;
		minMaxDoc[2] = minMaxDoc[2] > t.width + tc[0]? minMaxDoc[2] : t.width + tc[0];
		minMaxDoc[3] = minMaxDoc[3] > t.height + tc[1]? minMaxDoc[3] : t.height + tc[1];
		//setMinMaxDoc(minMaxDoc);
	}
	return estructura.style;
  };
  
  const extenderPath = (path, extend) => {
	 const newPath = [];
	 path.forEach((p) => newPath.push(p));
	 extend.forEach((p) => newPath.push(p));
	 return newPath;
  };
		
  const formatoYear = (modificador, texto) => {
	  if(texto === "")
		  return "Al presente"
	  switch(modificador){
		  case "__year":
			return (new Date(texto)).getFullYear();
		  default:
			return texto;
	  }
  };
  
  const obtenerTextoEstructura = (user_data, nombreSeccion, seccion, id, estructura, index) => {
	let texto = "";
	let skipNext = 0;
	estructura.Texto.forEach((campo, index) => {
		if(skipNext > 0){
			skipNext -= 1;
		//Modificadores de texto, TODO
		}else if (campo === "__year"){
			texto += formatoYear("__year", user_data.bloques[nombreSeccion][id][estructura.Texto[index+1]]);
			skipNext = 1;
		}else if (campo === "__check"){
			texto += user_data.bloques[nombreSeccion][id][estructura.Texto[index+2]]? estructura.Texto[index+1]+user_data.bloques[nombreSeccion][id][estructura.Texto[index+2]] : "";
			skipNext = 2;
		}else if(seccion[campo] || seccion[campo] === ""){ //Titulo y otros de plantilla
			texto += seccion[campo] === ""? (estructura.Editable && estructura.Editable.Placeholder || "") : seccion[campo];
		}else if(id && (user_data.bloques[nombreSeccion][id][campo] || user_data.bloques[nombreSeccion][id][campo] === "")){ //Bloques de datos
			if(nombreSeccion === "Idiomas" && campo === "Id")
				texto += getNameById(user_data.bloques[nombreSeccion][id][campo])
			
			else{
				texto += user_data.bloques[nombreSeccion][id][campo]
			}
		}else{ //Texto generico
			texto += campo;
		}
	});
	return texto;
  };
  const textoMultilinea = (texto) => {
	//return texto;
	const t = texto.split('\n');
	return t.map((str, index) => <>{str}<br /></>);
  };
  
  const ElementoTextoEditableHTML = ({user_data, documento, nombreSeccion, seccion, estructura, id, index, path}) => {
	  const newPath = extenderPath(path, [estructura.Editable.Campo]);
	  return (<BotonEditable 
		estructura={estructura} 
		seccion={seccion} 
		nombreSeccion={nombreSeccion} 
		setEditando={setEditando} 
		path={path} 
		nid={"Texto_"+nombreSeccion+"_"+index+path} 
		style={editButton} 
		Icon={BorderColorIcon} 
		iconStyle={editButtonIcon} 
		posicionEnOverlay={posicionEnOverlay} 
		setTextoEditar={setTextoEditar}
		texto={seccion[estructura.Editable.Campo]}
		/>);
  };
  
  const ElementoEditableHTML = ({user_data, documento, nombreSeccion, seccion, estructura, id, index, path}) => {
	  if((!estructura) || !estructura.Editable)
		  return (<></>);
	  switch(estructura.Editable.Tipo){
		  case "Texto":
		  case "Estilo":
			return (<><ElementoTextoEditableHTML user_data={user_data} documento={documento} nombreSeccion={nombreSeccion} seccion={seccion} estructura={estructura} id={id} index={index} path={path} /></>);
	  };
	  return (<></>);
  };

  const ElementoTextoEstructuradoHTML = ({user_data, documento, nombreSeccion, seccion, estructura, id, index, path}) => {
	  const elm = textoMultilinea(obtenerTextoEstructura(user_data,nombreSeccion, seccion, id, estructura, index));
	  //dangerouslySetInnerHTML={{__html: [elm, ()]}}
	  return (<>
	  <div id={"Texto_"+nombreSeccion+"_"+index+path} style={estructura.style} key={nombreSeccion+id+index} >
		{elm}
		<ElementoEditableHTML user_data={user_data} documento={documento} nombreSeccion={nombreSeccion} seccion={seccion} estructura={estructura} id={id} index={index} path={path}/>	
	  </div></>);
  };
  
  const ElementoDivEstructuradoHTML = ({user_data, documento, nombreSeccion, seccion, estructura, id, index, path}) => {
	  const nid = "Div_"+nombreSeccion+"_"+path;
	  estructura.style.position = "relative";
	  return (<>
	  <div id={nid} style={estructura.style} key={nombreSeccion+id+path} 
	  onMouseEnter={(e) => {document.getElementById(nid).style.boxShadow = "inset 0 0 0 2px purple";}}
	  onMouseLeave={(e) => {document.getElementById(nid).style.boxShadow = "inset 0 0 0 0px purple"}}
	  
	  >
		<BotonEditable 
			estructura={estructura} 
			seccion={seccion} 
			nombreSeccion={nombreSeccion} 
			setEditando={setEditando} 
			path={path} 
			nid={nid} 
			style={editButton} 
			Icon={SwapHorizontalCircleIcon} 
			iconStyle={seccionEditButtonIcon} 
			posicionEnOverlay={posicionEnOverlay} 
			setTextoEditar={setTextoEditar}
			texto={""}
		/>

		{textoMultilinea(obtenerTextoEstructura(user_data,nombreSeccion, seccion, id, estructura, index))}
		<ElementoEditableHTML user_data={user_data} documento={documento} nombreSeccion={nombreSeccion} seccion={seccion} estructura={estructura} id={id} index={index} />
	  </div></>);
  };
  
  const ElementoImgEstructuradoHTML = ({user_data, documento, nombreSeccion, seccion, estructura, id, index, path}) => {
	  const imgStyle = JSON.parse(JSON.stringify(estructura.style? estructura.style : {}));
	  imgStyle.top = 0;
	  imgStyle.left = 0;
	  const nid = "Imagen_"+nombreSeccion+"_"+index;
	  return (<div id={"Container_"+nid} style={estructura.style}
			onMouseEnter={(e) => {document.getElementById("Container_"+nid).style.boxShadow = "inset 0 0 0 2px purple"; }}
			onMouseLeave={(e) => {document.getElementById("Container_"+nid).style.boxShadow = "inset 0 0 0 0px purple"; }}
		>
		<img id={nid} style={imgStyle} key={nombreSeccion+id+index} src={`data:image/png;base64,${user_data.userImage}`} />
		<BotonEditable 
			estructura={estructura} 
			seccion={seccion} 
			nombreSeccion={nombreSeccion} 
			setEditando={setEditando} 
			path={path} 
			nid={nid} 
			style={editButton} 
			Icon={SwapHorizontalCircleIcon} 
			iconStyle={seccionEditButtonIcon} 
			posicionEnOverlay={posicionEnOverlay} 
			setTextoEditar={setTextoEditar}
			texto={""}
		/>
	  </div>);
  };
	
  const ElementoEstructuradoHTML = ({user_data, documento, nombreSeccion, seccion, estructura, id, index, path}) => {
	  if(!estructura)
		  return (<></>);
	  estructura.style = tamanoYPosicion(estructura);
	  switch(estructura.Tipo){
		  case "Texto":
			return (<ElementoTextoEstructuradoHTML user_data={user_data} documento={documento} nombreSeccion={nombreSeccion} seccion={seccion} estructura={estructura} id={id} index={index} path={path} />);
		  case "Div":
			return (<ElementoDivEstructuradoHTML user_data={user_data} documento={documento} nombreSeccion={nombreSeccion} seccion={seccion} estructura={estructura} id={id} index={index} path={path} />);
		  case "Imagen":
			return (<ElementoImgEstructuradoHTML user_data={user_data} documento={documento} nombreSeccion={nombreSeccion} seccion={seccion} estructura={estructura} id={id} index={index} path={path}/>);
		  case "Estructura":
		    const newPath = extenderPath(path, ["Estructura",index]);
			const style = tamanoYPosicion(estructura);
			style.pointerEvents = "none";
			estructura.style = style;
			return (<div style={style}>
				{Object.entries(estructura.Estructura).map(([index, estr]) => 
					(<ElementoEstructuradoHTML user_data={user_data} documento={documento} nombreSeccion={nombreSeccion} seccion={seccion}  estructura={estr} id={id} index={index} path={extenderPath(path, ["Estructura",index])} />)
				)}
			</div>)
		  case "IDs":
		    let list = [];
			tempIds[nombreSeccion]?.forEach((bloque_id, index) => {
				list.push(
					<div style={estructura.plantillaStyle}>{Object.keys(estructura.Plantilla).map((index) => {
						return (<>
							<ElementoEstructuradoHTML user_data={user_data} documento={documento} nombreSeccion={nombreSeccion} seccion={seccion} estructura={estructura.Plantilla[index]} id={bloque_id} index={index} path={extenderPath(path,["Plantilla", index])}/>
						</>)
					})}</div>
				);
			});
			const p = extenderPath(path,[]);
			const nid ="IDs_"+nombreSeccion+path;
			estructura.style.pointerEvents = "none";
			return (<div id={nid} style={estructura.style}>
				<BotonEditable 
					estructura={estructura} 
					seccion={seccion} 
					nombreSeccion={nombreSeccion} 
					setEditando={setEditando} 
					path={p} 
					nid={nid} 
					style={editButton} 
					Icon={SwapHorizontalCircleIcon} 
					iconStyle={seccionEditButtonIcon} 
					posicionEnOverlay={posicionEnOverlay} 
					setTextoEditar={setTextoEditar}
					texto={""}
				/>
			{list}
			</div>);
	  };
	  
	  return (<></>);
  };
	
  const SeccionHTMLEstructurada = ({user_data, seccion, documento, id, path}) => {
	  if(!documento.diseno.Secciones[seccion] || !documento.diseno.Secciones[seccion].Mostrar)
		  return (<></>);
	  
	  //La posicion necesita ser relativa para que funcione correctamente
	  if(Object.isFrozen(documento.diseno.Secciones[seccion].style)){ //Ocurre la primera vez que se renderiza
		documento.diseno.Secciones[seccion].style = documento.diseno.Secciones[seccion].style? documento.diseno.Secciones[seccion].style : {};
		documento.diseno.Secciones[seccion].style = JSON.parse(JSON.stringify(documento.diseno.Secciones[seccion].style));
		documento.diseno.Secciones[seccion].style.position = documento.diseno.Secciones[seccion].style.position? documento.diseno.Secciones[seccion].style.position : "relative";
	  }
	  
	  const pindex = path.indexOf("Paginas")+1;
	  const ind = documento.diseno.Secciones.Orden.indexOf(seccion);
	  documento.diseno.Secciones[seccion].style = tamanoYPosicion(documento.diseno.Secciones[seccion], pindex, ind<0? seccion : ind);
	  documento.diseno.Secciones[seccion].style.overflow = documento.diseno.Secciones[seccion].style.overflow? documento.diseno.Secciones[seccion].style.overflow : "hidden"; 
	  
	  let crearContenedor = false;
	  let posStyle = {position: "relative", pointerEvents: "none", width: "100%"};
	  if(documento.diseno.Secciones[seccion].Pos){
		  posStyle.height = documento.diseno.Secciones[seccion].style.top;
	  }
	  const sec = (
				<div id={"Seccion_" + seccion} style={documento.diseno.Secciones[seccion].style} key={seccion} 
					onMouseEnter={(e) => {document.getElementById("Seccion_" + seccion).style.boxShadow = "inset 0 0 0 2px purple";}}
					onMouseLeave={(e) => {document.getElementById("Seccion_" + seccion).style.boxShadow = "inset 0 0 0 0px purple"; }}
					>
					<BotonEditable 
						estructura={documento.diseno.Secciones[seccion]} 
						seccion={documento.diseno.Secciones[seccion]} 
						nombreSeccion={seccion} 
						setEditando={setEditando} 
						path={path} 
						nid={"Seccion_"+seccion} 
						style={editButton} 
						Icon={SwapHorizontalCircleIcon} 
						iconStyle={seccionEditButtonIcon} 
						posicionEnOverlay={posicionEnOverlay} 
						setTextoEditar={setTextoEditar}
						texto={""}
					/>
					{Object.entries(documento.diseno.Secciones[seccion].Estructura).map(([index, estructura]) => {
						const newPath = extenderPath(path, ["Estructura",index]);
						return (<>
							<ElementoEstructuradoHTML user_data={user_data} documento={documento} nombreSeccion={seccion} seccion={documento.diseno.Secciones[seccion]} estructura={documento.diseno.Secciones[seccion].Estructura[index]} id={id} index={index} path={newPath} />
						</>)
					})}
				</div>
			  );
	  
	  if(crearContenedor)
		  return (<div style={{position: "absolute", backgroundColor: "#0000", pointerEvents: "none"}}><div style={posStyle}></div>{sec}</div>)
	  else
		  return sec;
  };
  
  const SubPaginaEstructuraHTML = ({user_data, documento, estructura, path}) => {
	if(!estructura)
		return (<></>);
    if(documento.diseno.Secciones[estructura]){
		return (<SeccionHTMLEstructurada user_data={user_data} seccion={estructura} documento={documento} id={documento.datos.Secciones[estructura]} path={["diseno","Secciones",estructura]} />);
		
	}else if(documento.diseno.Secciones.Orden[estructura]){
		return (<SeccionHTMLEstructurada user_data={user_data} seccion={documento.diseno.Secciones.Orden[estructura]} documento={documento} path={["diseno","Secciones",documento.diseno.Secciones.Orden[estructura]]}/>);
			
	}else if(typeof(estructura) === "object"){
		const pindex = path.indexOf("Paginas")+1;
		const id = "Estructura_"+path;
		const p = extenderPath(path,[]);
		const ps = posicionEnOverlay(id);
		if(!estructura.Pos && ps[0] !== -1){
			estructura.Pos = [(ps[0]-ps[2]+ps[3])/celdasPagina[0], (ps[1]-ps[4]-ps[5])/celdasPagina[1]];
		}
		estructura.style = tamanoYPosicion(estructura, pindex, estructura);
		return (<div id={id} style={estructura.style}>
			<BotonEditable 
				estructura={estructura} 
				seccion={null} 
				nombreSeccion={""} 
				setEditando={setEditando} 
				path={p} 
				nid={id} 
				style={editButton} 
				Icon={SwapHorizontalCircleIcon} 
				iconStyle={seccionEditButtonIcon} 
				posicionEnOverlay={posicionEnOverlay} 
				setTextoEditar={setTextoEditar}
				texto={""}
			 />
			{estructura.Estructura? (Object.keys(estructura.Estructura).map((index) => {
				 if(typeof(estructura.Estructura[index]) === "string")
					return(<SeccionHTMLEstructurada user_data={user_data} seccion={estructura.Estructura[index]} id={documento.datos.Secciones[estructura.Estructura[index]]} documento={documento} path={["diseno","Secciones",estructura.Estructura[index]]}/>);
				 else if(typeof(estructura.Estructura[index]) === "number")
					 return(<SeccionHTMLEstructurada user_data={user_data} seccion={documento.diseno.Secciones.Orden[estructura.Estructura[index]]} documento={documento} path={["diseno","Secciones",documento.diseno.Secciones.Orden[estructura.Estructura[index]]]}/>);
				 else{
					 const newPath = extenderPath(path, ["Estructura",index]);
					 return(<SubPaginaEstructuraHTML user_data={user_data} documento={documento} estructura={estructura.Estructura[index]} path={newPath}/>);
				 }
			})
			)
			:
			(<></>)
			}
		</div>)
	}
	return (<></>);
  };
  
  const PaginaHTMLEstructurada = ({user_data, documento, paginaEstilo, pindex}) => {
	  if(!documento)
		  return (<></>);
	  const styled = {};
	  Object.entries(paginaEstilo).forEach(([key, val]) => styled[key] = val);
	  styled.top = (pindex*celdasPagina[1]*100)+"px";
	  return (<div style={styled} id={"pagina_"+pindex}>
				<div style={{position:"absolute"}}>
					{documento.diseno.Paginas[pindex]?.Elementos? (Object.entries(documento.diseno.Paginas[pindex].Elementos).forEach(([key, val]) => {
						if(documento.diseno.Elementos[val]){
							
						}
					}))
					:
					(<></>)
					}
				</div>
				{documento.diseno.Paginas[pindex]?.Estructura?
					(Object.entries(documento.diseno.Paginas[pindex].Estructura).map(([key, val]) => {
						return (<SubPaginaEstructuraHTML user_data={user_data} documento={documento} estructura={val} path={["diseno","Paginas",pindex,"Estructura",key]}/>)
					}))
					:
					(<></>)
					
				}
			  </div>);
  };
  
  //Ordena bloques del usuario por Fecha (si tiene), y por categorias del curriculo y puesto
  const OrdenarBloques = (bloques, ID_Categoria_Curriculum, ID_Categoria_Puesto) => {
	let sortedBloques = [];
	if(!bloques)
		return [];
	
	
	//Ordenar por fecha
	if(bloques[Object.keys(bloques)[0]]?.Fecha_Final)
		sortedBloques = Object.entries(bloques).sort(
		  ([, a], [, b]) => new Date(b.Fecha_Final) - new Date(a.Fecha_Final),
		);
	else if(bloques[Object.keys(bloques)[0]]?.Fecha_Publicacion)
		sortedBloques = Object.entries(bloques).sort(
		  ([, a], [, b]) => new Date(b.Fecha_Publicacion) - new Date(a.Fecha_Publicacion),
		);
	else
		sortedBloques = Object.entries(bloques).sort();
	
	//Ordenar por categorias
	sortedBloques = sortedBloques.sort(
		  ([, a], [, b]) => (b.ID_Categoria_Curriculum? (b.ID_Categoria_Curriculum === ID_Categoria_Curriculum? 1 : 0) : 0) - (a.ID_Categoria_Curriculum? (a.ID_Categoria_Curriculum === ID_Categoria_Curriculum? 1 : 0) : 0),
		);
	sortedBloques = sortedBloques.sort(
		  ([, a], [, b]) => (b.ID_Categoria_Puesto? (b.ID_Categoria_Puesto === ID_Categoria_Puesto? 1 : 0) : 0) - (a.ID_Categoria_Puesto? (a.ID_Categoria_Puesto === ID_Categoria_Puesto? 1 : 0) : 0),
		);
	return sortedBloques;
  }; 

  //Actualiza las IDs de bloques seleccionadas
  //Ocurre al inicio y cuando se cambia algun dato de cantidad o ID fija
  const SeleccionarIDs = (user_data, documento, ID_Categoria_Curriculum, ID_Categoria_Puesto) => {
    if (!user_data) return;
	Object.keys(documento.datos.Secciones).map((seccion) => {
		let cantidad = documento.diseno.Secciones[seccion].Editable && documento.diseno.Secciones[seccion].Editable.Arreglo? documento.datos.Secciones[seccion].Cantidad : 1;
		let lista = OrdenarBloques(user_data.bloques[seccion]);
		cantidad = Math.min(lista.length, cantidad);
		tempIds[seccion] = [];
		
		for(let i=cantidad; i>=0; i-=1){
			if(documento.diseno.Secciones[seccion].Editable?.Arreglo)
				if(documento.datos.Secciones[seccion].IDs[i]){
					tempIds[seccion].push(documento.datos.Secciones[seccion].IDs[i]);
				}else{
					documento.datos.Secciones[seccion].IDs.splice(i,1);
				}
		}
		for(let i=0; tempIds[seccion].length < cantidad && i < lista.length; i+=1){
			if(documento.diseno.Secciones[seccion].Editable?.Arreglo)
				if(!documento.datos.Secciones[seccion].IDs.includes(lista[i][0]))
					tempIds[seccion].push(lista[i][0]);
		}
	});
	documento.datos.tempIds = tempIds;
	setDocumento(documento);
	setTempIds(tempIds);
  };
  
  const posicionEnOverlay = (id) => {
	const doc = document.getElementById("documento_html");
	const container = document.getElementById("contenedor_documento");
	const editor = document.getElementById("contenedor_documentos");
	const pag = document.getElementById("pagina_0");
	if(!pag)
		return [-1,-1];
	const pagStyle = pag.currentStyle || window.getComputedStyle(pag);
	if(!doc)
		return [0,0];
	
	const elm = document.getElementById(id);
	if(!elm)
		return [-1,-1];
	let parent = elm;
	let pos = [0, 0];
	
	const isDiv = id.includes("Div");
	while(true){
	
		if(parent.id? parent.id.includes("pagina") : false){
			break;
		}
		pos[0] += parent.offsetLeft;
		pos[1] += parent.offsetTop;
		parent = parent.parentElement;
	}

	//pos = [pos[0] + doc.offsetLeft*0 + container.offsetLeft - editor.scrollLeft + Number(pagStyle.paddingLeft.substring(0, pagStyle.paddingLeft.length-2)), pos[1] +   doc.offsetTop*0 + container.offsetTop - editor.scrollTop + Number(pagStyle.paddingTop.substring(0, pagStyle.paddingTop.length-2))];
	pos = [pos[0] + doc.offsetLeft*0 + container.offsetLeft - editor.scrollLeft, pos[1] +   doc.offsetTop*0 + container.offsetTop - editor.scrollTop];
	pos = [Math.max(-10000, pos[0]), Math.max(-10000, pos[1]), container.offsetLeft, editor.scrollLeft , container.offsetTop, editor.scrollTop];
	return pos;
  };
  
  
  //HTML
  //[595.28, 841.89]
  const documentoEstilo = {
		//minHeight: "29.7cm",
		//minWidth: "21cm",
		//maxWidth: "21cm",
		width: "594px",
		backgroundColor: "#FFFFFF",
		fontFamily: "Roboto",
		boxSizing: "border-box"
  };
  const paginaEstilo = {
		//maxHeight: "841.89px",
		minHeight: "29.7cm",
		minWidth: "21cm",
		maxWidth: "21cm",
		//height: "841.89px",
		width: "21cm",
		display: "inline flex",
		backgroundColor: "#FFFFFF",
		//gridTemplateColumns: "repeat(40, 1fr)",
		//gridTemplateRows: "repeat(60, 1fr)",
		flexDirection: "row",
		alignContent: "flex-start",
		flexWrap: "wrap",
		//overflow: "visible"
		//paddingTop: "70px",
		//paddingLeft: "70px",
		boxSizing: "border-box"
		
  };
  const divisorPagina = {
	  position: "absolute",
	  border: "solid 1px #00f",
	  width: paginaEstilo.width,
	  height: "0px",
	  }
  
  //Representacion HTMl del PDF, react-pdf no renderiza bien el documento en el DOM, pero esto da el un resultado mejor
  //Copiar la estructura usando elementos de react-pdf en "MyDocument" para descargarlo
  const MyHTMLDocument = () => {
	
    if (!documento) 
		return <></>;
    else{
		Object.entries(documento.diseno.style).forEach(([key, value]) => {
			documentoEstilo[key] = value;
		});
		documentoEstilo.pointerEvents = "auto"
		documento.diseno.style = documentoEstilo;

		//Hacer estilos un objeto editable
		const cont = document.getElementById("contenedor_documentos")
		const prev = [0,0];
		if(cont){
			prev[0] = cont.scrollLeft;
			prev[1] = cont.scrollTop;
			cont.scrollLeft = 0;
			cont.scrollTop = 0;
		}
		Object.entries(documento.diseno.Secciones).forEach(([nombreseccion, seccion]) => {
			seccion.style = seccion.style? JSON.parse(JSON.stringify(seccion.style)) : {};
			seccion.style.zIndex = documento.diseno.Paginas[0].Estructura.indexOf(nombreseccion) * 5+5;
			const p = posicionEnOverlay("Seccion_"+nombreseccion);
			if(!seccion.Pos && p[0] !== -1){
				seccion.Pos = [(p[0]-p[2]+p[3])/celdasPagina[0], (p[1]-p[4]-p[5])/celdasPagina[1]];
			}
			if(seccion.Celdas){
				const t = celdasAPx(seccion.Celdas);
				seccion.style.width = t.width+"px";
				seccion.style.height = t.height+"px";
			}
		
			if(seccion.Estructura)
				Object.entries(seccion.Estructura).forEach(([index, estr]) => {
					let newStyle = {};
					Object.entries(estr.style? estr.style : {}).forEach(([key, val]) => newStyle[key] = val);
					estr.style = newStyle;
					if(estr.Celdas){
						const t = celdasAPx(estr.Celdas);
						estr.style.width = t.width+"px";
						estr.style.height = t.height+"px";
					}
					
					if(estr.Plantilla)
						Object.entries(estr.Plantilla).forEach(([index2, plnt]) => {
							newStyle = {};
							Object.entries(plnt.style? plnt.style : {}).forEach(([key, val]) => newStyle[key] = val);
							plnt.style = newStyle;
							if(plnt.Celdas){
								const t = celdasAPx(plnt.Celdas);
								plnt.style.width = t.width+"px";
								plnt.style.height = t.height+"px";
							}
						});
			});
		});
		
		if(cont){
			cont.scrollLeft = prev[0];
			cont.scrollTop = prev[1];
		}
		
		const calcDivisor = (numeroDePaginas) => {
			let style = {};
			Object.entries(divisorPagina).forEach(([key, value]) => {style[key] = value});
			style.top = (numeroDePaginas * celdasPagina[1] * resolucionCeldas) + "px";
			return style;
		};
		
		const pagina = document.getElementById("pagina_0");
		const height = Math.max(minMaxDoc[3], pagina? pagina.scrollHeight : 0);
		let numeroDePaginas = pagina? Math.ceil(height/(celdasPagina[1] * resolucionCeldas)) : 1;
		
		const divisores = [];
		for(let i=1; i < numeroDePaginas; i+=1)
			divisores.push(<div style={calcDivisor(i)} id={"divisor_pagina_"+(i+1)}></div>)
		
		Object.entries(documento.diseno.Paginas[0].style).forEach(([key, value]) => {
			paginaEstilo[key] = value;
		});
		paginaEstilo.height = numeroDePaginas*(celdasPagina[1] * resolucionCeldas)+"px";//minMaxDoc[3]+"px"
		documento.diseno.Paginas[0].style = paginaEstilo;
		paginaEstilo.width = (celdasPagina[0]*resolucionCeldas)+"px"
		paginaEstilo.minWidth = paginaEstilo.width;
		paginaEstilo.maxWidth = paginaEstilo.width;
		

		return (
        <div
		  id="documento_html"
          style={
            documentoEstilo
          }
		  
        >
			  <PaginaHTMLEstructurada user_data={user_data} documento={documento} paginaEstilo={paginaEstilo} pindex={0}/>
			  {divisores}
		</div>
	)}
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

  const handleKeyDown = (e) => {
	  if(e.ctrlKey){
		controles.ctrl = true;
		setControles(controles);
  }};
  const handleKeyUp = (e) => {
	  if(e.ctrlKey){
		controles.ctrl = false;
		console.log("Falsing")
		setControles(controles);
  }};
  const handleWheel = (e, zoom, setZoom) => {
	  if(e.ctrlKey){
		  e.preventDefault();
		  if(!Editando){
			  controles.zoom = Math.min(Math.max((controles.zoom? controles.zoom : 1) + (e.deltaY > 0? -0.05 : 0.05), 0.5), 2);
			  setZoom(controles.zoom);
		  }
	  }
  };
  
  //Al inicio de carga del componente
  useEffect(() => {
	//window.addEventListener('keydown', handleKeyDown);
	//window.addEventListener('keyup', handleKeyUp);
	const cont = document.getElementById("contenedor_documentos");
	const overlay = document.getElementById("overlay");
	cont?.addEventListener('wheel', (e) => {handleWheel(e,zoom,setZoom)});
	  
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
	  let doc = user_data.curriculums[user_data.editando_curriculo].Documento?.diseno?.__Comment? user_data.curriculums[user_data.editando_curriculo].Documento : curriculum_manager.CopiarPlantilla("simple").Documento;
	  doc = editMode === "Usuario"? doc : curriculum_manager.CopiarPlantilla("simple").Documento;
      setDocumento(
		doc
      );
      setCatCurriculum(
        user_data.curriculums[user_data.editando_curriculo].ID_Categoria_Curriculum,
      );
      setCatPuesto(
        user_data.curriculums[user_data.editando_curriculo].ID_Categoria_Puesto,
      );
	  
	  SeleccionarIDs(user_data, doc, user_data.curriculums[user_data.editando_curriculo].ID_Categoria_Curriculum, user_data.curriculums[user_data.editando_curriculo].ID_Categoria_Puesto);

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

  const calcularTamanoPaginaPixeles = () => {
	  //const elm = document.getElementById("pagina_medidor"); 
	  //if(elm){
		//const style = elm.currentStyle || window.getComputedStyle(elm);
		//celdasPagina[0] = Number(style.width.substring(0, style.width.length-2))/resolucionCeldas;
		//celdasPagina[1] = Number(style.height.substring(0, style.height.length-2))/resolucionCeldas;
	  //}
  };

  if (cargando) {
    return (
      <center>
        <h1>Cargando...</h1>
      </center>
    );
  }

  return (
    <>
	  <div id={"pagina_medidor"} style={{width: "594px", height: "841px", display: "none"}}>
	  {calcularTamanoPaginaPixeles()}
	  </div>
      <div >
        <h1 style={{ color: "white", fontSize: "5rem", margin: "0" }}>
          Modificar Currículo
        </h1>
      </div>

      <div style={{ padding: "10px", width: "110%" }}>
        <div style={{ display: "flex", minHeight: "100%" }}>
		<div style={{ width: "30%", maxHeight: "1000px", position: "relative", display: "none" }}>
		<div style={{ ...stripeStyle, position: "absolute", top: 0, left: 0, width: "100%" }}>
			<div style={textOverlayStyle}>
			Edición de la sección seleccionada
			</div>
		</div>
		
		<div style={{ marginTop: "50px", height: "1000px", overflow: "auto"}}>
			<PanelSeccion
			user_data={user_data}
			setUserData={setUserData}
			manager_bloques={manager_bloques}
			category_manager={category_manager}
			opciones={opcionesPanel}
			/>
		</div>
		</div>
		  <div id={"Editor_Caja"} style={pdfCaja}>
		  <div id={"Titulo_Editor"} style={stripeStyle}>
			<div style={textOverlayStyle}>
				Editor de dator del currículo
			</div>
		  </div>
			  <div id="Herramientas" style={toolBar}>
				  {Editando || editMode==="Plantilla"? 
					(<div style={{color: "#ccc"}}>...</div>) 
					: 
					(<Autosave user_data={user_data} setUserData={setUserData} curriculum_manager={curriculum_manager} documento={documento} styles={{color: "#ccc"}}/>)
				  }
				  <PDFDownloadLink style={{padding: "5px", borderRadius:"5px", backgroundColor: theme.palette.yellow.main, color: theme.palette.white.main}} 
						document={
							<DocumentoPDF 
								user_data={user_data}
								documento={documento} 
								tempIds={tempIds} 
								obtenerTextoEstructura={obtenerTextoEstructura} 
							/>
							} 
							fileName="curriculum.pdf"
					>
						{({ blob, url, loading, error }) => (loading ? 'Cargando...' : 'Descargar')}
				  </PDFDownloadLink>
				  <Button style={{ color: theme.palette.yellow.main }} onClick={(e) => {
					  setEditando(null);
					  setEditando({
						Tipo: "Orden"
					});
					mapListaToHTML(ListaEditar, setListaEditar, documento, setDocumento);
				  }}
				  >
					Secciones
				  </Button>
				  <Button style={{ color: theme.palette.yellow.main }} onClick={(e) => {
					  SeleccionarIDs(user_data, documento, categoria_curriculum, categoria_puesto);
					  curriculum_manager.ActualizarCurriculo(user_data, setUserData, user_data.curriculums[curriculo_id]._id, documento, categoria_curriculum, categoria_puesto);
				  }}
				  >
					Guardar
				  </Button>
				  <CajaTextoCreador documento={documento} setDocumento={setDocumento} style={{color: theme.palette.yellow.main}} iconStyle={{}} id={"Boton_Crear_Texto"}/>
				  <Slider sx={{position: "relative", width:"200px"}}
					aria-label="ZoomSlider"
					valueLabelDisplay="auto"
					defaultValue={1}
					value={zoom}
					min={0.5}
					max={2}
					getAriaValueText={(val) => {return val+"x"}}
					step={0.1}
					style={{ color: theme.palette.yellow.main }}
					onChange={(val) => {
						setZoom(val.target.value)
					}}
				  />
				  {process.env.NODE_ENV === "development"? (
				  <><Button style={{ color: theme.palette.yellow.main }} onClick={(e) => {
					  const edit = editMode === "Usuario"? "Plantilla" : "Usuario"
					  let doc = user_data.curriculums[user_data.editando_curriculo].Documento?.diseno?.__Comment? user_data.curriculums[user_data.editando_curriculo].Documento : curriculum_manager.CopiarPlantilla("simple").Documento;
					  doc = edit === "Usuario"? doc : curriculum_manager.CopiarPlantilla("simple").Documento;
					  SeleccionarIDs(user_data, doc, categoria_curriculum, categoria_puesto);
					  setDocumento(
						doc
					  );
					  setEditMode(edit);
				  }}
				  >
					Modo:{" "+editMode}
				  </Button>
				  {editMode === "Plantilla"?
					  (<Button style={{ color: theme.palette.yellow.main }} onClick={(e) => {
						    var a = document.createElement("a");
							const id = documento.datos.Secciones.Informacion_Personal;
							delete documento.datos.tempIds;
							documento.datos.Secciones.Informacion_Personal = "id";
						    var json = JSON.stringify({
								ID_Categoria_Curriculum: category_manager.IdANombreCurriculo(categoria_curriculum),
								ID_Categoria_Puesto: category_manager.IdANombrePuesto(categoria_puesto),
							    Nombre : "Simple",
								Documento: documento
								}, null, 2),
							blob = new Blob([json], {type: "octet/stream"}),
							url = window.URL.createObjectURL(blob);
							a.href = url;
							a.download = "plantilla.json";
							a.click();
							window.URL.revokeObjectURL(url);
							documento.datos.tempIds = tempIds;
							documento.datos.Secciones.Informacion_Personal = id;
					  }}
					  >
						Exportar
					  </Button>)
					  :
					  (<></>)
				  }
				  </>)
				  :
				  (<></>)
				  }
			  </div>
			  {Editando? (
					<div id="overlay_unzoomed" style={{position: "absolute", width: "100%", height: "100%", backgroundColor: "#0000", zIndex: 1001, zoom: (1), pointerEvents: (Editando.Celdas || Editando.Pos)? "none" : "auto"}} >
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
							zoom={zoom}
						/>
						{(Editando.Fuentes || Editando.Color)? (
							<HerramientasElementos 
								opciones={{}}
								documento={documento} 
								setDocumento={setDocumento} 
								Editando={Editando} 
								setEditando={setEditando}
								path={[]}
								style={{}}
							/>
						) 
						: 
						(<></>)
						}
					</div>
						
				  ) 
				  : 
				  (<></>)
			  }
				  {Editando? (
					<div id="overlay" style={{position: "absolute", width: "300%", height: "300%", backgroundColor: "#0001", zIndex: 1000, zoom: zoom, pointerEvents: (Editando.Celdas || Editando.Pos)? "auto" : "none" }} >
						{/*(Editando.Celdas || Editando.Pos)? (<GridCSS offset={[0,0]}/>) : (<></>)*/}
						
						{(Editando.Celdas || Editando.Pos)? (
							<EditorTamano 
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
								zoom={zoom}
							/>
						) 
						: 
						(<></>)
						}
						
					</div>
				  ) : (
					<>
					</>
				  )}
				  <div id="contenedor_documentos" 
					style={{width: "100%", height: "100%", overflow: "scroll", maxHeight:"calc(100% - 60px)", position:"relative", pointerEvents: "auto", display: "flex", justifyContent: "center", zoom: zoom, transition: "all 1.2s"}}
					onScroll={(e) => {
						//const elm = document.getElementById("overlay");
						//if(elm ){
						//	elm.style.transform = "translate("+(-e.target.scrollLeft*0)+"px, "+(-e.target.scrollTop)+"px)";
						//}
					}}
					tabIndex={0}
				  >
				    
					<div id="contenedor_documento" style={{position: "relative", width: "50%", height: "150%", pointerEvents: "none", top: (-minMaxDoc[1]+60)+"px", left: (-minMaxDoc[0])+"px"}}>
					  <MyHTMLDocument />
					</div>
				  </div>
		  </div>

		  <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', zIndex: 100 }}>
			<div style={stripeStyle}>
				<div style={textOverlayStyle}>
				Vista previa
				</div>
			</div>

			<div style={{ flexGrow: 1 }}> {/* Make this div grow to take available space */}
				{!Editando? (
					<PDFViewer style={{ width: '100%', height: '100%'}}>
						<DocumentoPDF 
							user_data={user_data}
							documento={documento} 
							tempIds={tempIds} 
							obtenerTextoEstructura={obtenerTextoEstructura} 
						/>
					</PDFViewer>
					)
					:
					(<></>)
				}
			</div>
			</div>
        </div>
      </div>
    </>
  );
}

export default EditorCurriculo;
