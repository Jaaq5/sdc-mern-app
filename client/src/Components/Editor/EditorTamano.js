import  { useState } from "react";
import WarningIcon from '@mui/icons-material/Warning';
import {
  Button,
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import OpenWithIcon from '@mui/icons-material/OpenWith';

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
			accion.target.style.minWidth = (size*12)+"px"
			accion.target.style.minHeight = (size*12)+"px"
			accion.target.style.margin = (-size*6)+"px 0px 0px "+(-size*6)+"px"
			

			let t = [Math.min(Math.max(tamano.width + movimiento[myindex][0], 100),756), Math.min(Math.max(tamano.height + movimiento[myindex][1],100), 1123)];
			const c = [Math.floor(t[0]/celdasPagina[0]),Math.floor(t[1]/celdasPagina[1])];
			t = [c[0]*celdasPagina[0], c[1] * celdasPagina[1]];
			
			accion.target.parentElement.style.width = t[0]+"px";
			accion.target.parentElement.style.height = t[1]+"px";
			

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
		let t = [Math.min(Math.max(tamano.width + movimiento[index][0], 100),756), Math.min(Math.max(tamano.height + movimiento[index][1],100), 1123)];
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

const calcularBotonMovimiento = (tamano, pos, docPos, setBotonMovimiento, path, documento, setDocumento, setPos) => {
	//Calcular las posiciones para los botones en los bordes y esquinas
	let movimiento = [0,0];
	let origen = 0;
	let dragging = false;
	let buttonm = null;
	
	
	const drag = (accion, index) => {
		//movimiento = origen === 0? movimiento : [accion.clientX - origen[0] - movimiento[0], accion.clientY - origen[1] - movimiento[1]] ;
		origen = origen === 0? [accion.clientX, accion.clientY] : origen;
		
		let t = [Math.min(Math.max(pos[0] + movimiento[0], -500),756), Math.min(Math.max(pos[1] + movimiento[1],-500), 1123)];
		const c = [Math.floor(t[0]/celdasPagina[0]),Math.floor(t[1]/celdasPagina[1])];
		t = [c[0]*celdasPagina[0], c[1] * celdasPagina[1]];
			
		document.getElementById("pos_celda_texto").innerHTML = c[0]+" x "+c[1];//Math.floor(t[0])+" x "+Math.floor(t[1]);
		
		dragging = true; 
	};
	
	const updatePos = (accion) => {
		movimiento = !dragging? movimiento : [accion.clientX - origen[0], accion.clientY - origen[1]] ;
		if(dragging){
			if(accion.target.id === "botton_mover")
				accion.target.parentElement.style.transform = "translate("+movimiento[0]+"px,"+movimiento[1]+"px)";
			else
				accion.target.parentElement.parentElement.style.transform = "translate("+movimiento[0]+"px,"+movimiento[1]+"px)";
			

			let t = [Math.min(Math.max(pos[0] + movimiento[0], -500),756), Math.min(Math.max(pos[1] + movimiento[1],-500), 1123)];
			const c = [Math.floor(t[0]/celdasPagina[0]),Math.floor(t[1]/celdasPagina[1])];
			t = [c[0]*celdasPagina[0], c[1] * celdasPagina[1]];
			
			document.getElementById("pos_celda_texto").innerHTML = c[0]+" x "+c[1];//Math.floor(t[0])+" x "+Math.floor(t[1]);
		}
	};
	
	const end = (accion, path, documento, setDocumento,) => {
		let t = [Math.min(Math.max(pos[0] + movimiento[0], -500),756), Math.min(Math.max(pos[1] + movimiento[1],-500), 1123)];
		let item = documento;
		path.forEach((campo) => item = item[campo]);
		
		item.Pos = [Math.floor(t[0]/celdasPagina[0]), Math.floor(t[1]/celdasPagina[1])];
		t = [t[0] * celdasPagina[0], t[1] * celdasPagina[1]];
		setDocumento(documento);
		setPos(t);
		
	    //accion.target.parentElement.style.transform = "";
		//accion.target.parentElement.style.top = (docPos[1] + movimiento[1])+"px";
		//accion.target.parentElement.style.left = (docPos[0] + movimiento[0])+"px";
		
		dragging = false;
		//calcularBotonMovimiento(tamano, t, docPos, setBotonMovimiento, path, documento, setDocumento, setPos);
	};
	
	buttonm = (
		<button id={"botton_mover"} style={{backgroundColor:"#0000", border: 0, minWidth: tamano.width+"px", minHeight: tamano.height+"px", position: "absolute", padding: 0, display: "flex", justifyContent: "center", alignItems:"center"}}
		onMouseDown={(e) => drag(e)}
		onMouseMove={(e) => updatePos(e)}
		onMouseUp={(e) => end(e, path, documento, setDocumento)}
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
	
	
	let initialPos = item.Pos? item.Pos : [Math.floor(Editando.pos[0]/celdasPagina[0]),Math.floor(Editando.pos[1]/celdasPagina[1])];
	const p = posicionObjeto(initialPos);
	if(pos == null)
		setPos(p)
	
	if(botones.length === 0)
		calcularBotones(t, setBotones, Editando.path, documento, setDocumento, setTamano, setErr, [cajax.clientWidth, cajax.scrollWidth, cajax.clientHeight, cajax.scrollHeight], e);
	
	if(!botonMovimiento)
		calcularBotonMovimiento(t, p, Editando.pos, setBotonMovimiento, Editando.path, documento, setDocumento, setPos);

	
	
	return (
	<div id="caja_tamano" 
		style={{width: tamano.width + "px", height: tamano.height + "px", backgroundColor: "#e495e820", border:"solid 2px #e495e8", borderRadius: "0px", position: "absolute", left: Editando.pos[0]+"px",top: Editando.pos[1]+"px", margin: "-2px", display:"flex", justifyContent: "center", textAlign: "center", transitionProperty: "height, width", transitionDuration: "0.1s"}}
		
		>
		{err? (
		<div style={{backgroundColor: "#fff", border:"solid 0px #000", position: "absolute", top: "-60px", minWidth: "200px",width: "100%", height: "30px"}}>
			 <WarningIcon color="warning" style={{position: "relative", top: "5px"}} />{" La caja podria ser pequeña"}
		</div>) 
		: 
		(<></>)
		}
		<div style={{backgroundColor: "#fff", border:"solid 0px #000", position: "absolute", top: "-30px", width: "100%", height: "30px"}}>
			<span id="pos_celda_texto">{initialPos? (<span>{initialPos[0]+" "}x{" "+initialPos[1]}</span>) : (<></>)}</span> {"  |  "}<span id="tamano_celda_texto">{item.Celdas[0]+" "}x{" "+item.Celdas[1]}</span>
			<Button onClick={(e) => {setEditando(null)}}><CheckCircleIcon color = "success" /> </Button>
		</div>
		{Editando.Pos? (<>{botonMovimiento}</>) : (<></>)}
		{Editando.Celdas? (<>{botones}</>) : (<></>)}
	</div>);
};

export {EditorTamano, tamanoObjeto, celdasAPx, celdasPagina};