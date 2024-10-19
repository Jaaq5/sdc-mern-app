import React, { useEffect, useState } from "react";
import fontsData from "../../fonts/0_fontlist";

import {
  Input,
  InputLabel,
  Button,
  TextField,
  Typography,
  List,
  ListItemText,
  ListItemButton,
  NativeSelect,
  MenuItem,
  FormControl,
  //Icons
  ListItemIcon,
} from "@mui/material";

import FormatBoldIcon from '@mui/icons-material/FormatBold';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';

//style
import {
  paperStyleb, 
  paperSX, 
  heading, row, 
  btnStyle, 
  fieldTitleStyle, 
  listStyle, 
  listButtonStyle, 
  deleteButton, 
  dense,
  deleteForeverStyle
} from "../../style";

function obtenerOpcionesDeEstilos(documento, path){
	const opciones = {};
	if(!documento || !path)
		return opciones;
	
	let item = documento;
	path.forEach((p) => {item = item[p]? item[p] : item});
	
	Object.entries(item.style).forEach(([k, v]) => opciones[k] = v);
	opciones.fontSize = opciones.fontSize? opciones.fontSize : "10px";
	opciones.fSize = Number(opciones.fontSize.substring(0, opciones.fontSize.length-2));
	opciones.fontFamily = opciones.fontFamily? opciones.fontFamily : "Arial";
	opciones.fFamily = fontsData.fonts.find((f) => f.fontFamily === opciones.fontFamily).name;
	return opciones;
}

function manejarBold(estado){
	const weight = estado.fontWeight? estado.fontWeight : 400;
	estado.fontWeight = weight === 400? 700 : 400;
	return estado;
}

function manejarFontStyle(estado){
	const style = estado.fontStyle? estado.fontStyle : "normal";
	estado.fontStyle = style === "normal"? "italic" : "normal";
	return estado;
}

function manejarTextDecoration(estado){
	const deco = estado.textDecoration? estado.textDecoration : "";
	estado.textDecoration = deco === ""? "underline" : "";
	return estado;
}

function manejarFontSize(estado, val){
	estado.fSize = val;
	estado.fontSize = val+"px";
	return estado;
}

function manejarFontFamily(estado, val){
	estado.fontFamily = fontsData.fonts.find((f) => f.name === val).fontFamily;
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

function actualizarBoton(id, estado, campo, def){
	const elm = document.getElementById(id);
	if(elm){
		const s = estado[campo] === def? ToolButtonStyle.backgroundColor : ToolButtonActiveStyle.backgroundColor;
		elm.style.backgroundColor = s;
	}
}

const ToolElmStyle = {
	display: "flex",
	backgroundColor: "#fdfeff", 
	boxShadow: "inset 0 0 0 1px #03f3", 
	padding: "2px"
};
const ToolIconStyle = {
	color: "#556",
	fontSize: "1.6rem"
};
const ToolButtonStyle = {
	backgroundColor: "#fdfeff",
	maxWidth: "2em",
	minWidth: "2em",
	boxShadow: "inset 0 0 0 1px #03f3",
	padding: "0px"
};
const ToolButtonActiveStyle = {
	backgroundColor: "#cdcecf",
	maxWidth: "2em",
	minWidth: "2em",
	boxShadow: "inset 0 0 0 1px #03f3",
	padding: "0px"
};

function HerramientasElementos({opciones, documento, setDocumento, Editando, setEditando, style}){
	const [estadoOpciones, setEstadoOpciones] = useState({});
	const [htmlfontList, setHtmlFontList] = useState([]);
	const [font, setFont] = useState(0);
	const [isBold, setIsBold] = useState(false);
	
	
	const mapDBListToHTML = (setter, lista) => {
		const subStyles = [];
		lista.forEach((item) => {let s = JSON.parse(JSON.stringify(listButtonStyle)); s.fontFamily = item.fontFamily; subStyles.push(s);})
		
		setter(
		  Object.keys(lista).map((l_id) => (
			<option value={lista[l_id]._id} key={l_id} style={subStyles[l_id]}>
			  {lista[l_id].name}
			</option>
		  )),
		);
	  };
		
	useEffect(() => {
		const op = obtenerOpcionesDeEstilos(documento, Editando.path)
		setEstadoOpciones(op);
		setFont(op.fFamily);
		setIsBold(op.fontWeight === 700);
		
		mapDBListToHTML(setHtmlFontList, fontsData.fonts);
	}, [documento, Editando, setEstadoOpciones]);
	
	
	if(!Editando)
		return (<></>)
	
	const upd = () => {actualizarDocumento(documento, setDocumento, Editando.path, estadoOpciones, Editando, setEditando)};
	let fsize = estadoOpciones.fSize || 10;
	
	return (<>
	<div id={"HerramientasElementos"} style={{position: "absolute", left: (250)+"px",top: (0)+"px", display: "flex", flexDirection: "row", maxWidth: "calc(100%-300px)", height: "35px", backgroundColor: "#f00", pointerEvents: "auto"}}>
		{Editando.Fuentes["fontWeight"]? (<div style={ToolElmStyle}>
			<Button id={"font_edit_bold_button"} style={estadoOpciones.fontWeight === 400? ToolButtonStyle : ToolButtonActiveStyle} 
					onClick={(e) => {
						const res = manejarBold(estadoOpciones);
						actualizarBoton("font_edit_bold_button", res, "fontWeight", 400); 
						setEstadoOpciones(res); 
						upd();}}>
					<FormatBoldIcon style={ToolIconStyle} />
			</Button>
		</div>):(<></>)}
		{Editando.Fuentes["fontStyle"]? (<div style={ToolElmStyle}>
			<Button id={"font_edit_italic_button"} style={estadoOpciones.fontStyle === 'normal'? ToolButtonStyle : ToolButtonActiveStyle} 
					onClick={(e) => {
						const res = manejarFontStyle(estadoOpciones);
						actualizarBoton("font_edit_italic_button", res, "fontStyle", "normal"); 
						setEstadoOpciones(res); 
						upd();}}>
				<FormatItalicIcon style={ToolIconStyle} />
			</Button>
		</div>):(<></>)}
		{Editando.Fuentes["textDecoration"]? (<div style={ToolElmStyle}>
			<Button id={"font_edit_underline_button"} style={!estadoOpciones.textDecoration? ToolButtonStyle : ToolButtonActiveStyle} 
					onClick={(e) => {
						const res = manejarTextDecoration(estadoOpciones);
						actualizarBoton("font_edit_underline_button", res, "textDecoration", ""); 
						setEstadoOpciones(res); 
						upd();}}>
				<FormatUnderlinedIcon style={ToolIconStyle} />
			</Button>
		</div>):(<></>)}
		{Editando.Fuentes["fontSize"]? (<div style={ToolElmStyle}>
			<TextIncreaseIcon style={ToolIconStyle} />
			<input type="number" 
			  min = "1"
			  max = "99"
			  style={{width: "30px", height: "80%"}}
			  aria-label="input_fontSize"
			  placeholder="10"
			  defaultValue={estadoOpciones.fSize}
			  onChange={(event) => {fsize = event.target.value; setEstadoOpciones(manejarFontSize(estadoOpciones, event.target.value)); upd();}} />
		</div>):(<></>)}
		<div style={ToolElmStyle}>
			<TextFieldsIcon style={ToolIconStyle} />
			<FormControl style={{ width: "120px", marginTop: "0px", maxHeight: "100%", display: "flex", backgroundColor: "#fff", boxShadow: "inset 0 0 0 1px #03f3", paddingLeft: "5px"}}>
				<InputLabel id="select_font_label" style={{display: "none"}}>
				  
				</InputLabel>
				<NativeSelect
				  labelId="select_font_label"
				  id="select_font_select"
				  InputProps = {{style: {margin: "0px"}}}
				  style = {{margin: "0px", paddingLeft: "5px"}}
				  defaultValue={""}
				  value={font}
				  label="Letra"
				  size="small"
				  onChange={(e) => {setFont(e.target.value); setEstadoOpciones(manejarFontFamily(estadoOpciones, e.target.value)); upd();}}
				>
				  {htmlfontList}
				</NativeSelect>
				
			</FormControl>
		</div>
		{Editando.Fuentes["color"]? (<div style={ToolElmStyle}>
			<TextIncreaseIcon style={ToolIconStyle} />
			<input type="number" 
			  min = "1"
			  max = "99"
			  style={{width: "30px", height: "80%"}}
			  aria-label="input_fontSize"
			  placeholder="10"
			  defaultValue={estadoOpciones.fSize}
			  onChange={(event) => {fsize = event.target.value; setEstadoOpciones(manejarFontSize(estadoOpciones, event.target.value)); upd();}} />
		</div>):(<></>)}
	</div>
	</>);
}

export default HerramientasElementos;