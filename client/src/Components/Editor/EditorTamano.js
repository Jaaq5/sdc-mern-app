import  { useState } from "react";
import WarningIcon from '@mui/icons-material/Warning';

const celdasPagina = [595/40, 841/60]//react-pdf    [756 / 40, 1123 / 60]; //En px
const tamanoObjeto = (path, documento, setDocumento) => {
  if(!documento)
	  return {width:0, height:0};
  
  let item = documento;
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


const calcularBotones = (tamano, setBotones, seccion, documento, setDocumento, setTamano, setErr) => {
	//Calcular las posiciones para los botones en los bordes y esquinas
	const posiciones = [[0,0],[0.5,0],[1,0], [0,1],[0.5,1],[1,1], [0,0.5],[1,0.5]]; //Posiciones (x,y) porcentuales
	const visualPosiciones = [];
	const mults = [[1,1],[0,1],[1,1], [1,1],[0,1],[1,1], [1,0],[1,0]];
	const movimiento = [];
	const dragging = [];
	const origenes = [];
	for(let i=0; i<posiciones.length; i += 1){
		visualPosiciones.push([posiciones[i][0] * tamano.width, posiciones[i][1] * tamano.height]);
		movimiento.push([0,0]);
		dragging.push(0);
		origenes.push(0);
	}
	const size = 15;
	let buttons = [];
	
	
	
	const drag = (accion, index) => {
		origenes[index] = origenes[index] === 0? [accion.clientX, accion.clientY] : origenes[index];
		//dragging[index] = setInterval(function() {
		//	console.log("Cambio: " + movimiento[index]);
		//}, 500);
	};
	
	const updatePos = (accion, myindex, posiciones) => {
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
	
	const end = (accion, index, seccion, documento, setDocumento) => {
		//clearInterval(dragging[index]);
		let t = [Math.min(Math.max(tamano.width + movimiento[index][0], 100),756), Math.min(Math.max(tamano.height + movimiento[index][1],100), 1123)];
		documento.diseno.Secciones[seccion].Celdas = [Math.floor(t[0]/celdasPagina[0]), Math.floor(t[1]/celdasPagina[1])];
		t = tamanoObjeto(["diseno", "Secciones", seccion], documento, setDocumento);
		setDocumento(documento);
		setTamano(t);
		
		setTimeout(function(){
			calcularBotones(t, setBotones, seccion, documento, setDocumento, setTamano, setErr);
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
		onMouseMove={(e) => updatePos(e, index, posiciones)}
		onMouseUp={(e) => end(e, index, seccion, documento, setDocumento)}
		>
		<div style={{backgroundColor:"#a5cef0", borderRadius: "20px", border: "solid 1px #0003", minWidth: size+"px", minHeight: size+"px",maxWidth: size+"px", maxHeight: size+"px", padding: 0, marginTop: "0%", pointerEvents: "none"}}></div>
		</button>)
	});
	setBotones(buttons);
};

const EditorTamano = ({user_data, TextoEditar, setTextoEditar, ListaEditar, setListaEditar, documento, setDocumento, Editando, setEditando, SeleccionarIDs}) => {
	//<BloquesToHTML user_data={user_data} TextoEditar={TextoEditar} setTextoEditar={setTextoEditar} ListaEditar={ListaEditar} setListaEditar={setListaEditar} documento={documento} setDocumento={setDocumento} Editando={Editando} setEditando={setEditando} />
	const [botones, setBotones] = useState([]);
	const [tamano, setTamano] = useState([0,0]);
	const [err, setErr] = useState(null);
	
	if(!Editando || typeof(Editando.Seccion) !== "string")
		return (<></>);
	
	if(err === null){
		const caja = document.getElementById("Seccion_"+Editando.Seccion)
		setErr(caja?.clientHeight < caja?.scrollHeight || caja?.clientWidth < caja?.scrollWidth);
	}
	
	const t = tamanoObjeto(["diseno", "Secciones", Editando.Seccion], documento, setDocumento)
	if(tamano[0] === 0)
		setTamano(t);
	
	if(botones.length === 0)
		calcularBotones(t, setBotones, Editando.Seccion, documento, setDocumento, setTamano, setErr);
	
	
	
	return (
	<div id="caja_tamano" style={{width: tamano.width + "px", height: tamano.height + "px", backgroundColor: "#e495e820", border:"solid 2px #e495e8", borderRadius: "0px", position: "absolute", left: Editando.pos[0]+"px",top: Editando.pos[1]+"px", margin: "-2px", display:"flex", justifyContent: "center", textAlign: "center", transition: "all 0.1s"}}>
		<div style={{backgroundColor: "#fff", border:"solid 0px #000", position: "relative", top: "-2rem", width: "100%", height: "30px"}}>
			<span id="tamano_celda_texto">{documento.diseno.Secciones[Editando.Seccion].Celdas[0]+" "}x{" "+documento.diseno.Secciones[Editando.Seccion].Celdas[1]}</span>
			{err? (<><WarningIcon color="warning"/>{" La caja es muy pequeña"}</>) :(<></>)}
		</div>
		{botones}
	</div>);
};

export {EditorTamano, tamanoObjeto, celdasAPx, celdasPagina};