import  { useState } from "react";
import WarningIcon from '@mui/icons-material/Warning';
import {
  Button,
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import PhotoSizeSelectSmallIcon from '@mui/icons-material/PhotoSizeSelectSmall';
import ControlCameraIcon from '@mui/icons-material/ControlCamera';

const celdasPagina = [595/40, 841/60]//react-pdf    [756 / 40, 1123 / 60]; //En px
const tamanoObjeto = (path, documento, setDocumento) => {
  if(!documento)
	  return {width:0, height:0};

  let item = documento;
  if(path.Celdas)
	item = path;
  else
	path.forEach((campo) => item = item[campo]);
  
  if(item.Celdas){
	  return celdasAPx(item.Celdas);
  }else{
	  item.Celdas = [10,10];
	  setDocumento(documento);
	  return celdasAPx([10,10]);
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
		origenes[index] = origenes[index] === 0? [accion.clientX, accion.clientY] : origenes[index];
	};
	
	const updatePos = (accion, myindex, posiciones, cajax) => {
		movimiento[myindex] = origenes[myindex] === 0? movimiento[myindex] : [accion.clientX - origenes[myindex][0], accion.clientY - origenes[myindex][1]] ;
		movimiento[myindex] = [movimiento[myindex][0] * mults[myindex][0], movimiento[myindex][1] * mults[myindex][1]]
		if(origenes[myindex] !== 0){
			accion.target.style.transition = "none";
			accion.target.style.transform = "translate("+movimiento[myindex][0]+"px,"+movimiento[myindex][1]+"px)";
			accion.target.style.minWidth = (size*20)+"px"
			accion.target.style.minHeight = (size*20)+"px"
			accion.target.style.margin = (-size*10)+"px 0px 0px "+(-size*10)+"px"
			

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
	
	
	const drag = (accion, index) => {
		//movimiento = origen === 0? movimiento : [accion.clientX - origen[0] - movimiento[0], accion.clientY - origen[1] - movimiento[1]] ;
		scrollOrigin = origen === 0? [window.scrollX, window.scrollY] : scrollOrigin;
		origen = origen === 0? [accion.clientX, accion.clientY] : [origen[0] - (ended[0] - accion.clientX), origen[1] - (ended[1] - accion.clientY)];
		console.log(scrollOrigin + ", "+ [window.scrollX, window.scrollY])
		
		
		//let t = [pos[0] + movimiento[0], pos[1] + movimiento[1]];
		let t = [accion.clientX - (scrollOrigin[0] - window.scrollX)*1 - origen[0], accion.clientY  - (scrollOrigin[1] - window.scrollY)*1 - origen[1]]//[pos[0] + movimiento[0] + (scrollOrigin[0] - window.scrollX), pos[1] + movimiento[1] + (scrollOrigin[1] - window.scrollY)];
		const c = [Math.floor(t[0]/celdasPagina[0]),Math.floor(t[1]/celdasPagina[1])];
		t = [c[0]*celdasPagina[0], c[1] * celdasPagina[1]];
			
		document.getElementById("pos_celda_texto").innerHTML = c[0]+" x "+c[1];//Math.floor(t[0])+" x "+Math.floor(t[1]);
		
		accion.target.style.width = "600%";
		accion.target.style.height = "600%";
		accion.target.style.top = "-200%";
		accion.target.style.left = "-200%";
		
		dragging = true; 
	};
	
	const updatePos = (accion, id) => {
		movimiento = !dragging? movimiento : [accion.clientX - (scrollOrigin[0] - window.scrollX)*1 - origen[0], accion.clientY  - (scrollOrigin[1] - window.scrollY)*1 - origen[1]] ;
		if(dragging){
			let t = [pos[0] + movimiento[0], pos[1] + movimiento[1]];
			const c = [Math.floor(t[0]/celdasPagina[0]),Math.floor(t[1]/celdasPagina[1])];
			t = [Math.floor(movimiento[0]/celdasPagina[0])*celdasPagina[0], Math.floor(movimiento[1]/celdasPagina[1]*celdasPagina[1])];
			
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
		
		ended = [accion.clientX, accion.clientY];
		
		dragging = false;
		//calcularBotonMovimiento(tamano, t, docPos, setBotonMovimiento, path, documento, setDocumento, setPos, id);
	};
	
	buttonm = (
		<button id={"botton_mover"} style={{backgroundColor:"#0000", border: 0, minWidth: tamano.width+"px", minHeight: tamano.height+"px", position: "absolute", padding: 0, display: "flex", justifyContent: "center", alignItems:"center"}}
		onMouseDown={(e) => drag(e)}
		onMouseMove={(e) => updatePos(e, id)}
		wheel 	=   {(e) => updatePos(e, id)}
		onMouseUp=  {(e) => end(e, path, documento, setDocumento, id)}
		>
		<OpenWithIcon style={{"color" : "blue", pointerEvents: "none"}}/>
		</button>);
		
	setBotonMovimiento(buttonm);
};



const EditorTamano = ({user_data, TextoEditar, setTextoEditar, ListaEditar, setListaEditar, documento, setDocumento, Editando, setEditando, SeleccionarIDs}) => {
	//<BloquesToHTML user_data={user_data} TextoEditar={TextoEditar} setTextoEditar={setTextoEditar} ListaEditar={ListaEditar} setListaEditar={setListaEditar} documento={documento} setDocumento={setDocumento} Editando={Editando} setEditando={setEditando} />
	const [botones, setBotones] = useState([]);
	const [tamano, setTamano] = useState([0,0]);
	const [err, setErr] = useState(null);
	const [caja, setCaja] = useState(null);
	const [pos, setPos] = useState(null);
	const [botonMovimiento, setBotonMovimiento] = useState(null);
	
	if(!Editando || !Editando.path || !Editando.id)
		return (<></>);
	let e = false;
	const cajax = document.getElementById(Editando.id);
	if(err === null){
		setCaja(cajax);
		e = cajax?.clientHeight < cajax?.scrollHeight || cajax?.clientWidth < cajax?.scrollWidth;
		setErr(e);
	}
	
	let item = documento;
	Editando.path.forEach((campo) => item = item[campo]);
	
	const t = tamanoObjeto(item, documento, setDocumento)
	if(tamano[0] === 0)
		setTamano(t);
	
	const m = cajax.currentStyle || window.getComputedStyle(cajax);
	let initialPos = item.Pos? item.Pos : [
		Math.floor((Editando.pos[0] - Editando.pos[2]- Number(m.marginLeft.substring(0, m.marginLeft.length-2)))/celdasPagina[0]),
		Math.floor((Editando.pos[1] - Number(m.marginTop.substring(0, m.marginTop.length-2)) + Editando.pos[5])/celdasPagina[1])
	];
	const p = posicionObjeto(initialPos);
	if(pos == null)
		setPos(p)
	
	const dataMov = [t, p, Editando.pos, setBotonMovimiento, Editando.path, documento, setDocumento, setPos, Editando.id];
	
	if(botones.length === 0)
		calcularBotones(t, setBotones, Editando.path, documento, setDocumento, setTamano, setErr, [cajax.clientWidth, cajax.scrollWidth, cajax.clientHeight, cajax.scrollHeight, Editando.id], e, dataMov);
	
	
	if(!botonMovimiento)
		calcularBotonMovimiento(...dataMov);

	const gridStyle = {
	  width: "100%",//(celdasPagina[0]*60)+"px",
	  height: "100%",
	  //left: Editando.pos[2]+"px",
	  position: "absolute",
	  backgroundImage: "repeating-linear-gradient(#ccc5 0 1px, transparent 1px 100%), repeating-linear-gradient(90deg, #ccc5 0 1px, transparent 1px 100%)",
	  backgroundSize: celdasPagina[0]+"px "+celdasPagina[1]+"px",
	}
	
	return (<>
	<div style={gridStyle}></div>
	<div id="caja_tamano" 
		style={{width: tamano.width + "px", height: tamano.height + "px", backgroundColor: "#e495e820", border:"solid 2px #e495e8", borderRadius: "0px", position: "absolute", left: Editando.pos[0]+"px",top: Editando.pos[1]+"px", margin: "-2px", display:"flex", justifyContent: "center", textAlign: "center", transitionProperty: "height, width, transform", transitionDuration: "0.1s"}}
		
		>
		{err? (
		<div style={{backgroundColor: "#fff", border:"solid 0px #000", position: "absolute", top: "-60px", minWidth: "230px",width: "100%", height: "30px"}}>
			 <WarningIcon color="warning" style={{position: "relative", top: "5px"}} />{" La caja podria ser pequeña"}
		</div>) 
		: 
		(<></>)
		}
		<div style={{minWidth: "230px", backgroundColor: "#fff", border:"solid 0px #000", position: "absolute", top: "-30px", width: "100%", height: "30px"}}>
			<ControlCameraIcon style={{position:"relative", top: "5px"}} />{" "}
			<span id="pos_celda_texto">{initialPos? (<span>{initialPos[0]+" "}x{" "+initialPos[1]}</span>) : (<></>)}</span> 
			{"  |  "}
			<PhotoSizeSelectSmallIcon style={{position:"relative", top: "5px"}} />{" "}
			<span id="tamano_celda_texto">{item.Celdas[0]+" "}x{" "+item.Celdas[1]}</span>
			<Button onClick={(e) => {setEditando(null)}}><CheckCircleIcon color = "success" /> </Button>
		</div>
		{Editando.Pos? (<>{botonMovimiento}</>) : (<></>)}
		{Editando.Celdas? (<>{botones}</>) : (<></>)}
	</div></>);
};

export {EditorTamano, tamanoObjeto, celdasAPx, celdasPagina};