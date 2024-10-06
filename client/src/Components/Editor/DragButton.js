import  { useState } from "react";

const calcularBotonMovimiento = (pos, setBotonMovimiento, id) => {
	//Calcular las posiciones para los botones en los bordes y esquinas
	let movimiento = [0,0];
	let scrollOrigin = [0,0];
	let ended = [0,0];
	let origen = 0;
	let dragging = false;
	let buttonm = null;
	
	
	const drag = (accion) => {
		scrollOrigin = origen === 0? [window.scrollX, window.scrollY] : scrollOrigin;
		origen = origen === 0? [accion.clientX, accion.clientY] : [origen[0] - (ended[0] - accion.clientX), origen[1] - (ended[1] - accion.clientY)]

		accion.target.style.width = "900%";
		accion.target.style.height = "900%";
		accion.target.style.top = "-300%";
		accion.target.style.left = "-300%";
		
		dragging = true; 
	};
	
	const updatePos = (accion, id) => {
		movimiento = !dragging? movimiento : [accion.clientX - (scrollOrigin[0] - window.scrollX)*1 - origen[0], accion.clientY  - (scrollOrigin[1] - window.scrollY)*1 - origen[1]] ;
		if(dragging){
			let t = [pos[0] + movimiento[0], pos[1] + movimiento[1]];
			
			const elm = document.getElementById(id);
			elm.style.transform = "translate("+t[0]+"px,"+t[1]+"px)"
			elm.style.transition = "all 0.1s"
			
			if(accion.target.id === "botton_mover"){
				//accion.target.parentElement.style.transform = "translate("+t[0]+"px,"+t[1]+"px)";
			}else{
				//accion.target.parentElement.parentElement.style.transform = "translate("+t[0]+"px,"+t[1]+"px)";
			}
		}
	};
	
	const end = (accion, path, documento, setDocumento, id) => {
		let t = [pos[0] + movimiento[0], pos[1] + movimiento[1]];

	    //accion.target.parentElement.style.transform = "";
		//accion.target.parentElement.style.top = (docPos[1] + movimiento[1])+"px";
		//accion.target.parentElement.style.left = (docPos[0] + movimiento[0])+"px";
		
		//const elm = document.getElementById(id);
		//elm.style.transform = ""
		
		//accion.target.style.width = "100%";
		//accion.target.style.height = "100%";
		//accion.target.style.top = "0";
		//accion.target.style.left = "0";
		
		ended = [accion.clientX, accion.clientY];
		
		dragging = false;
	};
	
	buttonm = (
		<button id={"botton_mover"} style={{backgroundColor:"#0000", border: 0, minWidth: "100%", minHeight: "100%", position: "absolute", padding: 0, display: "flex", justifyContent: "center", alignItems:"center"}}
		onMouseDown={(e) => drag(e)}
		onMouseMove={(e) => updatePos(e, id)}
		onMouseUp=  {(e) => end(e, id)}
		>
		</button>);
		
	setBotonMovimiento(buttonm);
};

const DragButton = ({id}) => {
	const [pos, setPos] = useState(null);
	const [botonMovimiento, setBotonMovimiento] = useState(null);

	
	//const p = posicionObjeto(initialPos);
	//if(pos == null)
	//	setPos(p)
	const elm = document.getElementById(id);
	
	if(!botonMovimiento)
		calcularBotonMovimiento([0,0],setBotonMovimiento,id);

	
	
	return (
	<div id={"button_drag_"+id }
		style={{width: "100%", height: "100%", backgroundColor: "#0000", border:"0", position: "absolute", left: "0px",top: "0px", display:"flex", justifyContent: "center", textAlign: "center", transitionProperty: "transform", transitionDuration: "0.1s"}}
	>
		{botonMovimiento}
	</div>);
};

export default DragButton;