import  { useState } from "react";
import WarningIcon from '@mui/icons-material/Warning';
import {
  Button,
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import PhotoSizeSelectSmallIcon from '@mui/icons-material/PhotoSizeSelectSmall';
import ControlCameraIcon from '@mui/icons-material/ControlCamera';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const resolucionCeldas = 100;
const celdasPagina = [594/resolucionCeldas, 841/resolucionCeldas]//react-pdf    [756 / 40, 1123 / 60]; //En px
const tamanoObjeto = (path, documento, setDocumento, id = "") => {
  if(!documento || !path)
	  return {width:0, height:0};

  let item = documento;
  if(path.Celdas)
	item = path;
  else
	path.forEach((campo) => item = item[campo]);
  
  const elm = document.getElementById(id);
  const mrgnCeldas = [0,0];
  if(elm){
	  const style = elm.currentStyle || window.getComputedStyle(elm);
	  mrgnCeldas[0] = Number(style.marginLeft.substring(0, style.marginLeft.length-2))/celdasPagina[0];
	  mrgnCeldas[1] = Number(style.marginTop.substring(0, style.marginTop.length-2))/celdasPagina[1];
  }
  
  
  if(item.Celdas){
	  mrgnCeldas[0] += item.Celdas[0];
	  mrgnCeldas[1] += item.Celdas[1];
	  return celdasAPx(mrgnCeldas);
  }else{
	  mrgnCeldas[0] += 10;
	  mrgnCeldas[1] += 10;
	  item.Celdas = mrgnCeldas;
	  setDocumento(documento);
	  return celdasAPx(mrgnCeldas);
  }
};

const celdasAPx = (Celdas) => {
  if(!Celdas)
	  return {width:0, height:0};

  if(Celdas){
	  return {width: Celdas[0] * celdasPagina[0], height: Celdas[1] * celdasPagina[1],};
  }else{
	  Celdas = [10,10];
	  return {width: 10 * celdasPagina[0], height: 10 * celdasPagina[1],};
  }
};

const posicionObjeto = (Pos) => {
  if(!Pos)
	  return [0, 0];

  if(Pos){
	  return [Pos[0] * celdasPagina[0], Pos[1] * celdasPagina[1]];
  }else{
	  Pos = [0,0];
	  return [0 * celdasPagina[0], 0 * celdasPagina[1]];
  }
};


const calcularBotones = (tamano, setBotones, path, documento, setDocumento, setTamano, setErr, cajax, err) => {
	//Calcular las posiciones para los botones en los bordes y esquinas
	const posiciones = [[0,0],[0.5,0],[1,0], [0,1],[0.5,1],[1,1], [0,0.5],[1,0.5]]; //Posiciones (x,y) porcentuales
	const visualPosiciones = [];
	const mults = [[1,1],[0,1],[1,1], [1,1],[0,1],[1,1], [1,0],[1,0]];
	const movimiento = [];
	const origenes = [];
	for(let i=0; i<posiciones.length; i += 1){
		visualPosiciones.push([posiciones[i][0] * tamano.width, posiciones[i][1] * tamano.height]);
		movimiento.push([0,0]);
		origenes.push(0);
	}
	const size = 15;
	let buttons = [];
	
	
	const drag = (accion, index) => {
		origenes[index] = origenes[index] === 0? [accion.clientX/gzoom, accion.clientY/gzoom] : origenes[index];
	};
	
	const updatePos = (accion, myindex, posiciones, cajax) => {
		movimiento[myindex] = origenes[myindex] === 0? movimiento[myindex] : [accion.clientX/gzoom - origenes[myindex][0], accion.clientY/gzoom - origenes[myindex][1]] ;
		movimiento[myindex] = [movimiento[myindex][0] * mults[myindex][0], movimiento[myindex][1] * mults[myindex][1]];
		if(origenes[myindex] !== 0){
			accion.target.style.transition = "none";
			accion.target.style.transform = "translate("+movimiento[myindex][0]+"px,"+movimiento[myindex][1]+"px)";
			accion.target.style.minWidth = (size*100)+"px"
			accion.target.style.minHeight = (size*100)+"px"
			accion.target.style.margin = (-size*50)+"px 0px 0px "+(-size*50)+"px"
			

			let t = [Math.min(Math.max(tamano.width + movimiento[myindex][0], 20),2756), Math.min(Math.max(tamano.height + movimiento[myindex][1],20), 21123)];
			const c = [Math.floor(t[0]/celdasPagina[0]),Math.floor(t[1]/celdasPagina[1])];
			t = [c[0]*celdasPagina[0], c[1] * celdasPagina[1]];
			
			const elm = document.getElementById(cajax[4]);
			
			accion.target.parentElement.style.width = t[0]+"px";
			accion.target.parentElement.style.height = t[1]+"px";
			elm.style.width = t[0]+"px";
			elm.style.height = t[1]+"px";
			

			setErr(t[0] < cajax[1] || t[1] < cajax[3]);
			
			document.getElementById("tamano_celda_texto").innerHTML = c[0]+" x "+c[1];//Math.floor(t[0])+" x "+Math.floor(t[1]);

			for(let i=0; i<posiciones.length; i += 1){
				if(i !== myindex){
					const b = document.getElementById("botton_tamano_"+i);
					b.style.left = (posiciones[i][0] * t[0])+"px"
					b.style.top = (posiciones[i][1] * t[1])+"px"
				}
			}
		}
	};
	
	const end = (accion, index, path, documento, setDocumento, cajax) => {
		let t = [Math.min(Math.max(tamano.width + movimiento[index][0], 20),2756), Math.min(Math.max(tamano.height + movimiento[index][1],20), 21123)];
		let item = documento;
		path.forEach((campo) => item = item[campo]);
		
		item.Celdas = [Math.floor(t[0]/celdasPagina[0]), Math.floor(t[1]/celdasPagina[1])];
		t = tamanoObjeto(item, documento, setDocumento);
		setDocumento(documento);
		setTamano(t);
		
		setTimeout(function(){
			calcularBotones(t, setBotones, path, documento, setDocumento, setTamano, setErr, cajax, err);
		},40);
		
		accion.target.style.transition = "all 0.1s";
	    accion.target.style.transform = "";
		accion.target.style.minWidth = (size)+"px"
		accion.target.style.minHeight = (size)+"px"
		accion.target.style.margin = (-size/2)+"px 0px 0px "+(-size/2)+"px"
		
		origenes[index] = 0;
		movimiento[index] = 0;
	};
	
	visualPosiciones.forEach((pos, index) => {
		buttons.push(
		//<button id={"botton_tamano_"+index} style={{backgroundColor:"#a5cef0", borderRadius: "20px", border: "solid 1px #0003", minWidth: size+"px", minHeight: size+"px", position: "absolute", left: pos[0]+"px", top: pos[1]+"px", padding: 0, margin: (-size/2)+"px 0px 0px "+(-size/2)+"px"}}
		<button id={"botton_tamano_"+index} style={{backgroundColor:"#0000", border: 0, minWidth: size+"px", minHeight: size+"px", position: "absolute", left: pos[0]+"px", top: pos[1]+"px", padding: 0, margin: (-size/2)+"px 0px 0px "+(-size/2)+"px", display: "flex", justifyContent: "center", alignItems:"center", transition: "all 0.1s"}}
		onMouseDown={(e) => drag(e,index)}
		onMouseMove={(e) => updatePos(e, index, posiciones, cajax)}
		onMouseUp={(e) => end(e, index, path, documento, setDocumento, cajax)}
		>
		<div style={{backgroundColor:"#a5cef0", borderRadius: "20px", border: "solid 1px #0003", minWidth: size+"px", minHeight: size+"px",maxWidth: size+"px", maxHeight: size+"px", padding: 0, marginTop: "0%", pointerEvents: "none"}}></div>
		</button>)
	});
	setBotones(buttons);
};

const calcularBotonMovimiento = (tamano, pos, docPos, setBotonMovimiento, path, documento, setDocumento, setPos, id) => {
	//Calcular las posiciones para los botones en los bordes y esquinas
	let movimiento = [0,0];
	let scrollOrigin = [0,0];
	let ended = [0,0];
	let origen = 0;
	let dragging = false;
	let buttonm = null;
	let direction = [true,true];
	
	
	const drag = (accion, index) => {
		//movimiento = origen === 0? movimiento : [accion.clientX - origen[0] - movimiento[0], accion.clientY - origen[1] - movimiento[1]] ;
		scrollOrigin = origen === 0? [window.scrollX/gzoom, window.scrollY/gzoom] : scrollOrigin;
		origen = origen === 0? [accion.clientX/gzoom, accion.clientY/gzoom] : [origen[0] - (ended[0] - accion.clientX/gzoom), origen[1] - (ended[1] - accion.clientY/gzoom)];
		direction = [true,true];
		
		//let t = [pos[0] + movimiento[0], pos[1] + movimiento[1]];
		//let t = [accion.clientX - (scrollOrigin[0] - window.scrollX)*1 - origen[0], accion.clientY  - (scrollOrigin[1] - window.scrollY)*1 - origen[1]]//[pos[0] + movimiento[0] + (scrollOrigin[0] - window.scrollX), pos[1] + movimiento[1] + (scrollOrigin[1] - window.scrollY)];
		//const c = [Math.floor(t[0]/celdasPagina[0]),Math.floor(t[1]/celdasPagina[1])];
		//t = [c[0]*celdasPagina[0], c[1] * celdasPagina[1]];
			
		//document.getElementById("pos_celda_texto").innerHTML = c[0]+" x "+c[1];//Math.floor(t[0])+" x "+Math.floor(t[1]);
		
		accion.target.style.width = "900%";
		accion.target.style.height = "900%";
		accion.target.style.top = "-400%";
		accion.target.style.left = "-400%";
		
		dragging = true; 
	};
	
	const updatePos = (accion, id) => {
		movimiento = !dragging? movimiento : [accion.clientX/gzoom - (scrollOrigin[0] - window.scrollX/gzoom)*1 - origen[0], accion.clientY/gzoom  - (scrollOrigin[1] - window.scrollY/gzoom)*1 - origen[1]] ;
		//Bloquear direccion de movimiento
		if(accion.shiftKey && direction[0] && direction[1] && Math.abs(movimiento[0]*movimiento[1]) > 15 ){
			direction = Math.abs(movimiento[0]) > Math.abs(movimiento[1])? [true,false] : [false,true];
		}
		movimiento[0] = direction[0]? movimiento[0] : 0;
		movimiento[1] = direction[1]? movimiento[1] : 0;
		if(dragging){
			let t = [pos[0] + movimiento[0], pos[1] + movimiento[1]];
			const c = [Math.floor(t[0]/celdasPagina[0]),Math.floor(t[1]/celdasPagina[1])];
			t = [Math.floor(movimiento[0]/celdasPagina[0])*celdasPagina[0], Math.floor(movimiento[1]/celdasPagina[1])*celdasPagina[1]];
			
			const elm = document.getElementById(id);
			elm.style.transform = "translate("+t[0]+"px,"+t[1]+"px)"
			elm.style.transition = "all 0.1s"
			
			if(accion.target.id === "botton_mover"){
				accion.target.parentElement.style.transform = "translate("+t[0]+"px,"+t[1]+"px)";
			}else{
				accion.target.parentElement.parentElement.style.transform = "translate("+t[0]+"px,"+t[1]+"px)";
			}
			
			document.getElementById("pos_celda_texto").innerHTML = c[0]+" x "+c[1];
		}
	};
	
	const end = (accion, path, documento, setDocumento, id) => {
		movimiento = !dragging? movimiento : [accion.clientX/gzoom - (scrollOrigin[0] - window.scrollX/gzoom)*1 - origen[0], accion.clientY/gzoom  - (scrollOrigin[1] - window.scrollY/gzoom)*1 - origen[1]] ;

		movimiento[0] = direction[0]? movimiento[0] : 0;
		movimiento[1] = direction[1]? movimiento[1] : 0;
		
		let t = [pos[0] + movimiento[0], pos[1] + movimiento[1]];
		let item = documento;
		path.forEach((campo) => item = item[campo]);
		
		item.Pos = [Math.floor(t[0]/celdasPagina[0]), Math.floor(t[1]/celdasPagina[1])];
		t = [t[0] * celdasPagina[0], t[1] * celdasPagina[1]];
		setDocumento(documento);
		setPos(t);
		
	    //accion.target.parentElement.style.transform = "";
		//accion.target.parentElement.style.top = (docPos[1] + movimiento[1])+"px";
		//accion.target.parentElement.style.left = (docPos[0] + movimiento[0])+"px";
		
		//const elm = document.getElementById(id);
		//elm.style.transform = ""
		
		accion.target.style.width = "100%";
		accion.target.style.height = "100%";
		accion.target.style.top = "0";
		accion.target.style.left = "0";
		
		
		
		ended = [accion.clientX/gzoom, accion.clientY/gzoom];
		direction = [true,true];
		
		dragging = false;
		//calcularBotonMovimiento(tamano, t, docPos, setBotonMovimiento, path, documento, setDocumento, setPos, id);
	};
	
	buttonm = (
		<button id={"botton_mover"} style={{backgroundColor:"#0000", border: 0, minWidth: tamano.width+"px", minHeight: tamano.height+"px", position: "absolute", padding: 0, display: "flex", justifyContent: "center", alignItems:"center"}}
		onMouseDown={(e) => drag(e)}
		onMouseMove={(e) => updatePos(e, id)}
		onMouseUp=  {(e) => end(e, path, documento, setDocumento, id)}
		>
		<OpenWithIcon style={{"color" : "blue", pointerEvents: "none"}}/>
		</button>);
		
	setBotonMovimiento(buttonm);
};

function manejarBorrarSeccion(Editando, documento, setDocumento){
	if(Editando.Seccion){
		const index = documento.diseno.Paginas[0].Estructura.indexOf(Editando.Seccion);
		documento.diseno.Paginas[0].Estructura.splice(index, 1); //Eliminar seccion
		delete documento.diseno.Secciones[Editando.Seccion];
		setDocumento(documento);
	}
}

function manejarOrdenCapa(dir, Editando, documento, setDocumento){
	const elm = document.getElementById(Editando.id);
	elm.style.zIndex = elm.style.zIndex? elm.style.zIndex : 0;
	
	
	let index = documento.diseno.Paginas[0].Estructura.indexOf(Editando.Seccion);
	const item = documento.diseno.Paginas[0].Estructura[index];
	if(dir === "up" && index < documento.diseno.Paginas[0].Estructura.length-1){
		documento.diseno.Paginas[0].Estructura[index] = documento.diseno.Paginas[0].Estructura[index+1];
		documento.diseno.Paginas[0].Estructura[index+1] = item 
		elm.style.zIndex = Math.max(Math.min(Number(elm.style.zIndex) + 11, 900), 1);
		index += 1;
	}else if(dir === "down" && index > 0){
		documento.diseno.Paginas[0].Estructura[index] = documento.diseno.Paginas[0].Estructura[index-1];
		documento.diseno.Paginas[0].Estructura[index-1] = item;
		elm.style.zIndex = Math.max(Math.min(Number(elm.style.zIndex) - 11, 900), 1);
		index -= 1;
	}
	
	document.getElementById("zIndex_layer").innerHTML = index
}

let gzoom = 1;

function OldGridCSS({}){
	const gridStyle = {
	  width: "100%",
	  height: "100%",
	  //left: Editando.pos[2]+"px",
	  position: "absolute",
	  backgroundImage: "linear-gradient(#fcc3 0 1px, transparent 1px 100%), linear-gradient(90deg, #ccf3 0 1px, transparent 1px 100%)",
	  backgroundSize: celdasPagina[0]+"px "+celdasPagina[1]+"px",
	  zIndex: 0
	};
	return (<div style={gridStyle}></div>)
}

function GridCSS({offset}){
	const off = offset? offset : [0,0];
	const gridStyle = {
	  width: "100%",
	  height: "100%",
	  //left: Editando.pos[2]+"px",
	  position: "absolute",
	  backgroundImage: "linear-gradient(#fcc3 0 1px, transparent 1px 100%), linear-gradient(90deg, #ccf3 0 1px, transparent 1px 100%)",
	  backgroundSize: "28.34px 28.34px",
	  zIndex: 0,
	  top: offset[0]+"px",
	  left: offset[1]+"px",
	};
	return (<div style={gridStyle}></div>)
}


const EditorTamano = ({user_data, TextoEditar, setTextoEditar, ListaEditar, setListaEditar, documento, setDocumento, Editando, setEditando, SeleccionarIDs, zoom}) => {
	//<BloquesToHTML user_data={user_data} TextoEditar={TextoEditar} setTextoEditar={setTextoEditar} ListaEditar={ListaEditar} setListaEditar={setListaEditar} documento={documento} setDocumento={setDocumento} Editando={Editando} setEditando={setEditando} />
	const [botones, setBotones] = useState([]);
	const [tamano, setTamano] = useState([0,0]);
	const [err, setErr] = useState(null);
	const [pos, setPos] = useState(null);
	const [botonMovimiento, setBotonMovimiento] = useState(null);
	const [xy, setXY] = useState(Editando.pos)
	
	gzoom = zoom;
	
	if(!Editando || !Editando.path || !Editando.id)
		return (<></>);
	let e = false;
	const cajax = document.getElementById(Editando.id);
	if(err === null){
		e = cajax?.clientHeight < cajax?.scrollHeight || cajax?.clientWidth < cajax?.scrollWidth;
		setErr(e);
	}
	
	let item = documento;
	Editando.path.forEach((campo) => {item = item[campo]});
	const hasParent = Editando.path[Editando.path.length-1] !== Editando.Seccion;
	
	const t = tamanoObjeto(item, documento, setDocumento, Editando.id);
	if(tamano[0] === 0)
		setTamano(t);
	
	const m = cajax.currentStyle || window.getComputedStyle(cajax);
	const doc = document.getElementById("contenedor_documento");
	
	const offset = hasParent? [0,0] : 
	[
		Math.floor((Editando.pos[0] - Number(m.marginLeft.substring(0, m.marginLeft.length-2)) - Editando.pos[2]   + Editando.pos[3]*1 + Number(doc.style.left.substring(0, doc.style.left.length-2)) - Number(doc.style.left.substring(0, doc.style.left.length-2))*0)/celdasPagina[0]),
		Math.floor((Editando.pos[1] - Number(m.marginTop.substring(0, m.marginTop.length-2))   + Editando.pos[4]*0 + Editando.pos[5]*1 - Number(doc.style.top.substring(0, doc.style.top.length-2)))/celdasPagina[1])
	];
	if(!item)
		item = {Pos: [0,0], Celdas: [0,0]};
	let initialPos = item.Pos? item.Pos : [
		offset[0],
		offset[1]
	];
	
	const p = posicionObjeto(initialPos);
	if(pos == null)
		setPos(p)
	
	const dataMov = [t, p, Editando.pos, setBotonMovimiento, Editando.path, documento, setDocumento, setPos, Editando.id];
	
	if(botones.length === 0)
		calcularBotones(t, setBotones, Editando.path, documento, setDocumento, setTamano, setErr, [cajax.clientWidth, cajax.scrollWidth, cajax.clientHeight, cajax.scrollHeight, Editando.id], e, dataMov);
	
	
	if(!botonMovimiento)
		calcularBotonMovimiento(...dataMov);
	
	return (<>
	<div id="caja_tamano" 
		style={{pointerEvents: "auto", width: tamano.width + "px", height: tamano.height + "px", backgroundColor: "#e495e820", border:"solid 2px #e495e8", borderRadius: "0px", position: "absolute", left: (xy[0])+"px",top: (xy[1])+"px", margin: "-2px", display:"flex", justifyContent: "center", textAlign: "center", transitionProperty: "height, width, transform", transitionDuration: "0.1s", zIndex: 1000}}
		
		>
		<div style={{position: "absolute", top: (Editando.pos[1]<0? (-Editando.pos[1])+"px" : ("0px")), width: "100%", minWidth: "270px", zoom: 1/gzoom}}>
			<div style={{backgroundColor: "#fff", border:"solid 0px #000", position: "absolute", top: err? "-60px" : "-30px", width: "100%", height: "30px", transition: "all 0.5s", overflow: "hidden"}}>
				 <WarningIcon color="warning" style={{position: "relative", top: "5px"}} />{" La caja podria ser pequeña"}
			</div>
			<div style={{backgroundColor: "#fff", border:"solid 0px #000", position: "absolute", top: "-30px", width: "100%", height: "30px"}}>
				{Editando.Pos? (<><ControlCameraIcon style={{position:"relative", top: "5px"}} />{" "}
				<span id="pos_celda_texto">{initialPos? (<span>{Math.floor(initialPos[0])+" "}x{" "+Math.floor(initialPos[1])}</span>) : (<></>)}</span>		
				{"  |  "}</>) : (<></>)}		
				<PhotoSizeSelectSmallIcon style={{position:"relative", top: "5px"}} />{" Z"+cajax.style.zIndex+" "}
				<span id="tamano_celda_texto">{Math.floor(item.Celdas[0])+" "}x{" "+Math.floor(item.Celdas[1])}</span>
				<Button style={{maxWidth: "50px", minWidth: "30px", padding: "0px", paddingBottom: "5px", zIndex: 200}} onClick={(e) => {setEditando(null)}}><CheckCircleIcon color = "success" /> </Button>
			</div>
			<div style={{backgroundColor: "#fff", border:"solid 0px #000", position: "absolute", top: "-30px", left: "100%", width: "30px", height: "auto"}}>
				<Button style={{maxWidth: "50px", minWidth: "30px", padding: "0px", paddingBottom: "5px", zIndex: 200}} onClick={(e) => {manejarOrdenCapa('up', Editando, documento, setDocumento)}}><KeyboardArrowUpIcon color = "primary" /> </Button>
				<span id="zIndex_layer">{documento.diseno.Paginas[0].Estructura.indexOf(Editando.Seccion)}</span>
				<Button style={{maxWidth: "50px", minWidth: "30px", padding: "0px", paddingBottom: "5px", zIndex: 200}} onClick={(e) => {manejarOrdenCapa('down', Editando, documento, setDocumento)}}><KeyboardArrowDownIcon color = "primary" /> </Button>
				{Editando.Borrar?  (<Button style={{maxWidth: "50px", minWidth: "30px", padding: "0px", paddingBottom: "5px", zIndex: 200}} onClick={(e) => {manejarBorrarSeccion(Editando, documento, setDocumento); setEditando(null)}}><DeleteForeverIcon color = "red" /> </Button>) : (<></>)}
			</div>
		</div>
		{Editando.Pos? (<>{botonMovimiento}</>) : (<></>)}
		{Editando.Celdas? (<>{botones}</>) : (<></>)}
	</div></>);
};

export {EditorTamano, tamanoObjeto, celdasAPx, celdasPagina, resolucionCeldas, GridCSS};