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

//Color
import { SwatchesPicker, CompactPicker, SketchPicker } from 'react-color';
import Paletas from "./ColorPalettes";

import FormatBoldIcon from '@mui/icons-material/FormatBold';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import BorderAllIcon from '@mui/icons-material/BorderAll';
import BorderClearIcon from '@mui/icons-material/BorderClear';
import BorderTopIcon from '@mui/icons-material/BorderTop';
import BorderBottomIcon from '@mui/icons-material/BorderBottom';
import BorderLeftIcon from '@mui/icons-material/BorderLeft';
import BorderRightIcon from '@mui/icons-material/BorderRight';
import BorderOuterIcon from '@mui/icons-material/BorderOuter';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


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
	opciones.fIndex = fontsData.fonts.indexOf(fontsData.fonts.find((f) => f.fontFamily === opciones.fontFamily));
	
	opciones.color = opciones.color? opciones.color : "#000000";
	opciones.backgroundColor = opciones.backgroundColor? opciones.backgroundColor : "#FFFFFF00";
	opciones.borderColor = opciones.borderColor? opciones.borderColor : "#FFFFFF";
	opciones.fontStyle = fontsData.fonts[opciones.fIndex].importAvailability.includes("Italic")? opciones.fontStyle : "normal";
	opciones.borderNums = {
		sizeTop: opciones.borderTopWidth? Number(opciones.borderTopWidth.substring(0, opciones.borderTopWidth.length-2)) : 0,
		sizeBottom: opciones.borderBottomWidth? Number(opciones.borderBottomWidth.substring(0, opciones.borderBottomWidth.length-2)) : 0,
		sizeLeft: opciones.borderLeftWidth? Number(opciones.borderLeftWidth.substring(0, opciones.borderLeftWidth.length-2)) : 0,
		sizeRight: opciones.borderRightWidth? Number(opciones.borderRightWidth.substring(0, opciones.borderRightWidth.length-2)) : 0,
		sizeAll: 1
	};
	
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

function manejarFontFamily(estado, val, fIndex){
	estado.fontFamily = fontsData.fonts.find((f) => f.name === val).fontFamily;
	estado.fontStyle = fontsData.fonts[fIndex].importAvailability.includes("Italic")? estado.fontStyle : "normal";
	estado.fontWeight = fontsData.fonts[fIndex].importAvailability.includes("Bold")? estado.fontWeight : 400;
	estado.fontWeight = fontsData.fonts[fIndex].importAvailability.includes("Regular")? estado.fontWeight : 300;
	estado.fontWeight = fontsData.fonts[fIndex].importAvailability.includes("Light")? estado.fontWeight : Math.max(estado.fontWeight, 400);
	return estado;
}

function manejarFontColor(estado, hcolor){
	estado.color = hcolor;
	return estado;
}
function manejarBGColor(estado, hcolor){
	estado.backgroundColor = hcolor;
	return estado;
}

function manejarBorde(estado, data){
	data.size = data.size? data.size+"pt" : "";
	switch(data.mode){
		case "Clear":
			estado.borderTopWidth = "0pt";
			estado.borderBottomWidth = "0pt";
			estado.borderLeftWidth = "0pt";
			estado.borderRightWidth = "0pt";
			break;
		case "Color":
			estado.borderColor = data.hcolor;
			estado.borderTopColor = data.hcolor;
			estado.borderBottomColor = data.hcolor;
			estado.borderLeftColor = data.hcolor;
			estado.borderRightColor = data.hcolor;
			break;
		case "Style":
			estado.borderStyle = data.style;
			break;
		case "All":
			estado.borderTopWidth = data.size;
			estado.borderBottomWidth = data.size;
			estado.borderLeftWidth = data.size;
			estado.borderRightWidth = data.size;
			break;
		case "Top":
		case "Bottom":
		case "Left":
		case "Right":
			data.size = data.size === estado["border"+data.mode+"Width"]? "0pt" : data.size;
			estado["border"+data.mode+"Width"] = data.size;
			//estado["border"+data.mode+"Color"] = data.hcolor? data.hcolor : estado.borderColor;
			break;
		default:
			break;
	}
	estado.borderColor = estado.borderColor? estado.borderColor : "#000";
	estado.borderStyle = estado.borderStyle? estado.borderStyle : "solid";
	return estado;
}

const expandingOptionsIds = {};
function manejarExpandirOpciones(id, width, height){
	expandingOptionsIds[id] = true;
	Object.keys(expandingOptionsIds).forEach((ids) => {
		const swatcher = document.getElementById(ids);
		const toggle = swatcher.style.maxWidth === "0px" && ids === id;
		if(swatcher){
			//swatcher.style.width = toggle? width : "0px";
			swatcher.style.height = toggle? height : "0px";
			swatcher.style.maxHeight = toggle? height : "0px";
			swatcher.style.maxWidth = toggle? width : "0px";
		}
	});
	
}

function actualizarDocumento(documento, setDocumento, path, estado, Editando, setEditando){
	let item = documento;
	path.forEach((p) => {item = item[p]? item[p] : item});
	item.style = estado;
	setDocumento(documento);
	const elm = document.getElementById(Editando.id);
	estado.transition = "all 0.1s";
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
	padding: "2px",
	zIndex: 400
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
	const [fontIndex, setFontIndex] = useState(0);
	const [color, setColor] = useState("#000");
	const [bgcolor, setBGColor] = useState("#FFFFFF00");
	const [border, setBorder] = useState({});
	const [recentColors, setRecentColors] = useState([]);
	const [paletteColors, setPaletteColors] = useState(["#FFFFFF00", "#000000", "#CCCCCC"]);
	
	
	const mapDBListToHTML = (setter, lista) => {
		const subStyles = [];
		lista.forEach((item) => {
			let s = JSON.parse(JSON.stringify(listButtonStyle)); 
			s.fontFamily = item.fontFamily;
			s.fontWeight = 400;
			s.fontWeight = item.importAvailability.includes("Bold")? s.fontWeight : 400;
			s.fontWeight = item.importAvailability.includes("Regular")? s.fontWeight : 300;
			s.fontWeight = item.importAvailability.includes("Light")? s.fontWeight : 400;
			subStyles.push(s);
			
			});
		
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
		setColor(op.color);
		setBGColor(op.backgroundColor);
		setFontIndex(op.fIndex);
		setBorder(op.borderNums);
		
		mapDBListToHTML(setHtmlFontList, fontsData.fonts);
	}, [documento, Editando, setEstadoOpciones, setHtmlFontList]);
	
	
	if(!Editando)
		return (<></>)
	
	const upd = () => {actualizarDocumento(documento, setDocumento, Editando.path, estadoOpciones, Editando, setEditando)};
	let fsize = estadoOpciones.fSize || 10;
	
	return (<>
	<div id={"HerramientasElementos"} style={{position: "absolute", left: (0)+"px",top: (0)+"px", justifyContent: "center",display: "flex", flexDirection: "row", width: "100%", maxWidth: "calc(100%-300px)", height: "35px", backgroundColor: "#fffe", pointerEvents: "auto"}}>
		<div style={ToolElmStyle}><Button style={{zIndex: 200}} onClick={(e) => {setEditando(null)}}><CheckCircleIcon color = "success" /> </Button></div>
		{Editando.Fuentes["color"]? (<div style={ToolElmStyle}>
			<Button id={"font_edit_color_button"} style={ToolButtonStyle} 
					onClick={(e) => {
						manejarExpandirOpciones("color_font_swatches", "350px", "350px");
						}}>
				<FormatColorTextIcon style={ToolIconStyle} />
				<div id={"font_color_bar"} style={{position: "absolute", top: "24px", left: "3px", width: "22px", height:"4px", backgroundColor: estadoOpciones.color}}></div>
			</Button>
			<div id={"color_font_swatches"} style={{overflow: "hidden", display: "flex", position: "absolute", top: "35px", maxWidth: "0px", maxHeight: "0px", transition: "all 0.2s"}}>
				<SketchPicker 
					disableAlpha={true}
					color={color}
					onChange={(c,e) => {
						setColor(c.hex);
						const elm = document.getElementById("font_color_bar");
						if(elm)
							elm.style.backgroundColor = c.hex;
						setEstadoOpciones(manejarFontColor(estadoOpciones, c.hex)); upd();
					}}
				/>
			</div>
		</div>):(<></>)}
		{Editando.Fuentes["backgroundColor"]? (<div style={ToolElmStyle}>
			<Button id={"font_edit_bgcolor_button"} style={ToolButtonStyle} 
					onClick={(e) => {
						manejarExpandirOpciones("color_bg_swatches", "350px", "350px");
						}}>
				<FormatColorFillIcon style={ToolIconStyle} />
				<div id={"bg_color_bar_white"} style={{position: "absolute", top: "24px", left: "3px", width: "22px", height:"4px", backgroundColor: "#fff"}}></div>
				<div id={"bg_color_bar"} style={{position: "absolute", top: "24px", left: "3px", width: "22px", height:"4px", backgroundColor: estadoOpciones.backgroundColor}}></div>
			</Button>
			<div id={"color_bg_swatches"} style={{overflow: "hidden", display: "flex", position: "absolute", top: "35px", maxWidth: "0px", maxHeight: "0px", transition: "all 0.2s"}}>
				<SketchPicker 
					color={bgcolor}
					presetColors={["#FFFFFF00", '#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF']}
					onChange={(c,e) => {
						///https://stackoverflow.com/questions/57803/how-to-convert-decimal-to-hexadecimal-in-javascript
						const alpha = Math.floor((c.rgb.a * 255)).toString(16).toUpperCase();
						setBGColor(c.hex+(alpha.length === 1? "0" : "")+alpha);
						const elm = document.getElementById("bg_color_bar");
						if(elm)
							elm.style.backgroundColor = c.hex+(alpha.length === 1? "0" : "")+alpha;
						setEstadoOpciones(manejarBGColor(estadoOpciones, c.hex+(alpha.length === 1? "0" : "")+alpha)); upd();
					}}
				/>
			</div>
		</div>):(<></>)}
		{Editando.Fuentes["border"]? (<div style={ToolElmStyle}>
			<Button id={"border_edit_button"} style={ToolButtonStyle} 
					onClick={(e) => {
						manejarExpandirOpciones("border_options", "350px", "350px");
						}}>
				<BorderAllIcon style={ToolIconStyle} />
				<div id={"border_color_bar_white"} style={{position: "absolute", top: "24px", left: "3px", width: "22px", height:"4px", backgroundColor: "#fff"}}></div>
				<div id={"border_color_bar"} style={{position: "absolute", top: "24px", left: "3px", width: "22px", height:"4px", backgroundColor: estadoOpciones.borderColor}}></div>
			</Button>
			<div id={"border_options"} style={{overflow: "hidden", display: "flex", position: "absolute", top: "35px", maxWidth: "0px", maxHeight: "0px", transition: "all 0.2s"}}>
				<div>
					<div style={ToolElmStyle}>
						<Button id={"border_clear"} style={ToolButtonStyle} 
								onClick={(e) => {
									const res = manejarBorde(estadoOpciones, {mode: "Clear"})
									setEstadoOpciones(res); 
									upd();}}>
								<BorderClearIcon style={ToolIconStyle} />
						</Button>
					</div>
					<div style={ToolElmStyle}>
						<Button id={"border_outer"} style={ToolButtonStyle} 
								onClick={(e) => {
									border.lastSide = "All";
									setBorder(border);
									const res = manejarBorde(estadoOpciones, {mode: "All", size: border.sizeAll})
									setEstadoOpciones(res); 
									upd();}}>
								<BorderOuterIcon style={ToolIconStyle} />
						</Button>
						<input type="number" 
						  min = "0" max = "4" step = "0.25"
						  style={{width: "50px", height: "80%"}}
						  aria-label="size_border_all" placeholder="1"
						  defaultValue={border.sizeAll}
						  onChange={(event) => {border.sizeAll = event.target.value}} />
					</div>
					<div style={ToolElmStyle}>
						<Button id={"border_top"} style={ToolButtonStyle} 
								onClick={(e) => {
									border.lastSide = "Top";
									setBorder(border);
									const res = manejarBorde(estadoOpciones, {mode: "Top", size: border.sizeTop})
									setEstadoOpciones(res); 
									upd();}}>
								<BorderTopIcon style={ToolIconStyle} />
						</Button>
						<input type="number" 
						  min = "0" max = "4" step = "0.25"
						  style={{width: "50px", height: "80%"}}
						  aria-label="size_border_top" placeholder="1"
						  defaultValue={border.sizeTop}
						  onChange={(event) => {border.sizeTop = event.target.value}} />
					</div>
					<div style={ToolElmStyle}>
						<Button id={"border_bottom"} style={ToolButtonStyle} 
								onClick={(e) => {
									border.lastSide = "Bottom";
									setBorder(border);
									const res = manejarBorde(estadoOpciones, {mode: "Bottom", size: border.sizeBottom})
									setEstadoOpciones(res); 
									upd();}}>
								<BorderBottomIcon style={ToolIconStyle} />
						</Button>
						<input type="number" 
						  min = "0" max = "4" step = "0.25"
						  style={{width: "50px", height: "80%"}}
						  aria-label="size_border_bottom" placeholder="1"
						  defaultValue={border.sizeBottom}
						  onChange={(event) => {border.sizeBottom = event.target.value}} />
					</div>
					<div style={ToolElmStyle}>
						<Button id={"border_left"} style={ToolButtonStyle} 
								onClick={(e) => {
									border.lastSide = "Left";
									setBorder(border);
									const res = manejarBorde(estadoOpciones, {mode: "Left", size: border.sizeLeft})
									setEstadoOpciones(res); 
									upd();}}>
								<BorderLeftIcon style={ToolIconStyle} />
						</Button>
						<input type="number" 
						  min = "0" max = "4" step = "0.25"
						  style={{width: "50px", height: "80%"}}
						  aria-label="size_border_left" placeholder="10"
						  defaultValue={border.sizeLeft}
						  onChange={(event) => {border.sizeLeft = event.target.value}} />
					</div>
					<div style={ToolElmStyle}>
						<Button id={"border_right"} style={ToolButtonStyle} 
								onClick={(e) => {
									border.lastSide = "Right";
									setBorder(border);
									const res = manejarBorde(estadoOpciones, {mode: "Right", size: border.sizeRight})
									setEstadoOpciones(res); 
									upd();}}>
								<BorderRightIcon style={ToolIconStyle} />
						</Button>
						<input type="number" 
						  min = "0" max = "4" step = "0.25"
						  style={{width: "50px", height: "80%"}}
						  aria-label="size_border_right" placeholder="10"
						  defaultValue={border.sizeRight}
						  onChange={(event) => {border.sizeRight = event.target.value}} />
					</div>
				</div>
				<SketchPicker 
					color={estadoOpciones.borderColor}
					presetColors={["#FFFFFF00", '#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF']}
					onChange={(c,e) => {
						setBGColor(c.hex)
						const elm = document.getElementById("border_color_bar");
						if(elm)
							elm.style.borderColor = c.hex;
						const res = manejarBorde(estadoOpciones, {mode: "Color", hcolor: c.hex, side: border.lastSide});
						setEstadoOpciones(res); 
						upd();
					}}
				/>
			</div>
		</div>):(<></>)}
		{fontsData.fonts[fontIndex].importAvailability.includes("Bold") && Editando.Fuentes["fontWeight"]? (<div style={ToolElmStyle}>
			<Button id={"font_edit_bold_button"} style={estadoOpciones.fontWeight === 400? ToolButtonStyle : ToolButtonActiveStyle} 
					onClick={(e) => {
						const res = manejarBold(estadoOpciones);
						actualizarBoton("font_edit_bold_button", res, "fontWeight", 400); 
						setEstadoOpciones(res); 
						upd();}}>
					<FormatBoldIcon style={ToolIconStyle} />
			</Button>
		</div>):(<></>)}
		{fontsData.fonts[fontIndex].importAvailability.includes("Italic") && Editando.Fuentes["fontStyle"]? (<div style={ToolElmStyle}>
			<Button id={"font_edit_italic_button"} style={estadoOpciones.fontStyle !== 'Italic'? ToolButtonStyle : ToolButtonActiveStyle} 
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
				  style = {{margin: "0px", paddingLeft: "5px"}}
				  defaultValue={""}
				  value={font}
				  label="Letra"
				  size="small"
				  onChange={(e) => {
					  setFont(e.target.value);
					  const i = fontsData.fonts.indexOf(fontsData.fonts.find((f) => f.name === e.target.value));
					  setFontIndex(i);
					  setEstadoOpciones(manejarFontFamily(estadoOpciones, e.target.value, i)); 
					  upd();
				  }}
				>
				  {htmlfontList}
				</NativeSelect>
				
			</FormControl>
		</div>
	</div>
	</>);
}

export default HerramientasElementos;