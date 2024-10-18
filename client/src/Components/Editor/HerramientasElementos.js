import React, { useEffect, useState } from "react";

import {
  Input,
  InputLabel,
  Button,
  TextField,
  Typography,
  List,
  ListItemText,
  ListItemButton,
  Select,
  MenuItem,

  //Icons
  ListItemIcon,
} from "@mui/material";

import FormatBoldIcon from '@mui/icons-material/FormatBold';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';

function obtenerOpcionesDeEstilos(documento, path){
	const opciones = {};
	if(!documento || !path)
		return opciones;
	
	let item = documento;
	path.forEach((p) => {item = item[p]? item[p] : item});
	
	Object.entries(item.style).forEach(([k, v]) => opciones[k] = v);
	opciones.fontSize = opciones.fontSize? opciones.fontSize : "10px";
	opciones.fSize = Number(opciones.fontSize.substring(0, opciones.fontSize.length-2));
	return opciones;
}

function manejarBold(estado){
	const weight = estado.fontWeight? estado.fontWeight : 400;
	estado.fontWeight = weight === 400? 700 : 400;
	return estado;
}

function manejarFontSize(estado, val){
	estado.fSize = val;
	estado.fontSize = val+"pt";
	console.log(estado);
	return estado;
}

function actualizarDocumento(documento, setDocumento, path, estado, Editando, setEditando){
	let item = documento;
	path.forEach((p) => {item = item[p]? item[p] : item});
	item.style = estado;
	setDocumento(documento);
	const elm = document.getElementById(Editando.id);
	Object.entries(estado).forEach(([k, v]) => elm.style[k] = v);
}

function HerramientasElementos({opciones, documento, setDocumento, Editando, setEditando, style}){
	const [estadoOpciones, setEstadoOpciones] = useState({});
	
	useEffect(() => {
		setEstadoOpciones(obtenerOpcionesDeEstilos(documento, Editando.path));
	}, [documento, Editando, setEstadoOpciones]);
	
	if(!Editando)
		return (<></>)
	
	const upd = () => {actualizarDocumento(documento, setDocumento, Editando.path, estadoOpciones, Editando, setEditando)};
	let fsize = estadoOpciones.fSize || 10;
	
	return (<>
	<div id={"HerramientasElementos"} style={{position: "absolute", left: (250)+"px",top: (0)+"px", display: "flex", flexDirection: "row", maxWidth: "calc(100%-300px)", height: "30px", backgroundColor: "#f00", pointerEvents: "auto"}}>
		{Editando.Fuentes["fontWeight"]? (
			<Button onClick={(e) => {setEstadoOpciones(manejarBold(estadoOpciones)); upd()}}><FormatBoldIcon /></Button>
		):(<></>)}
		{Editando.Fuentes["fontSize"]? (<>
			<TextIncreaseIcon />
			<input type="number" 
			  min = "1"
			  max = "99"
			  style={{width: "30px", height: "80%"}}
			  aria-label="input_fontSize"
			  placeholder="10"
			  value={fsize+""}
			  onChange={(event) => {fsize = event.target.value; setEstadoOpciones(manejarFontSize(estadoOpciones, event.target.value)); upd();}} />
		</>):(<></>)}
	</div>
	</>);
}

export default HerramientasElementos;