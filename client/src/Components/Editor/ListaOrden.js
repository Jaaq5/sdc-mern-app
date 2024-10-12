import {
  Input,
  Button,
  
} from "@mui/material";

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const SeccionOrderEditor = ({ListaEditar, setListaEditar, documento, setDocumento, Editando, setEditando}) => {
	  if(!documento)
		  return (<></>);
	  return (
			<div style={{display: "block", width: "240px", backgroundColor: "#303030", textAlign: "center", pointerEvents: "auto"}}>
				<div style={{color: "#fff", fontWeight: "900", fontSize: "1.2em", borderBottom: "solid 2px rgb(200,200,200)"}}>
					Secciones<Button onClick={(e) => {setEditando(null)}}><CheckCircleIcon color = "success" /> </Button>
				</div>
				<div style={{display: "flex", width: "210px", flexDirection: "column", backgroundColor: "#303030", padding: "5px 15px", textAlign: "left"}}>
					{Editando.animando? (<div style={{width: "100%", height: "100%", position: "absolute"}}></div>) : (<></>)}
					{ListaEditar}
				</div>
				
			</div>
	  );
  };
  
function animarSwap(elemento1, elemento2, diff, animando, ListaEditar, setListaEditar, documento, setDocumento){
	if(animando)
			return;
	
	//Codigo de animacion
	animando = true;
	elemento1.style.top = -diff + "px";
	elemento2.style.top = diff + "px";

	setTimeout(function(){
		elemento1.style.top = "0px";
		elemento2.style.top = "0px";
		
		elemento1.style.transition = "none";
		elemento2.style.transition = "none";
		
		setTimeout(function(){
			elemento1.style.transition = "all 0.35s";
			elemento2.style.transition = "all 0.35s";
		}, 50);
		
		mapListaToHTML(ListaEditar, setListaEditar, documento, setDocumento);
		setDocumento(documento);
	},400);
}
  
const mapListaToHTML = (ListaEditar, setListaEditar, documento, setDocumento) => {
	const seccionOrden = {
		  borderRadius: "10px",
		  backgroundColor: "#0000",
		  border: "solid 2px rgba(230, 230, 230, 0.01)",
		  padding: "0px",
		  width: "200px",
		  height: "48px",
		  color: "#fff",
		  fontWeight: "700",
		  display: "flex",
		  justifyContent: "flex-start",
		  textAlign: "left",
		  verticalAlign: "middle", 
		  pointerEvents: "auto"
	  };
	const seccionIndex = {
		  borderRadius: "25px",
		  border: "solid 2px rgb(230, 150, 0)",
		  padding: "4px",
		  width: "21px",
		  height: "21px",
		  textAlign: "center"
	};
	const visibleButton = {
		padding: 0,
		margin: 0,
		color: "#fff",
		minWidth: "24px",
		width: "24px",
		height: "24px",
		position: "absolute",
		right: "30px",
		top: "12px"
	};
	const moveButton = {
		padding: 0,
		margin: 0,
		color: "#fff",
		minWidth: "24px",
		width: "24px",
		height: "24px",
		position: "absolute",
		right: "4px",
		top: "2px",
		display: "block"
	};
	const moveButtonDown = {
		padding: 0,
		margin: 0,
		color: "#fff",
		minWidth: "24px",
		width: "24px",
		height: "24px",
		position: "absolute",
		right: "4px",
		top: "26px"
	};
	const icon = {
		  width: "10px",
		  height: "10px"
	};
  
	let list = [];
	let animando = false;
	const diff = 54;
	documento.diseno.Secciones.Orden.forEach((seccion, index) => {
	list.push(
	<div key={index} id={"orden_"+index} style={{position: "relative", top: "0px", transition: "all 0.35s"}}>
			<div style={seccionOrden} >
				<span style={seccionIndex}>{(index+1)+""}</span>
				<span style={{margin: "4px", maxWidth: "140px", flexWrap: "none", overflow: "hidden"}}>{documento.diseno.Secciones[seccion].TituloSeccion}</span>
				<Button 
					  style={visibleButton}
					  onClick={(e) => {
						 if(animando)
								return; 
						  
						documento.diseno.Secciones[seccion].Mostrar = !documento.diseno.Secciones[seccion].Mostrar;
						mapListaToHTML(ListaEditar, setListaEditar, documento, setDocumento);
						setDocumento(documento);
					  }}
					>
					{documento.diseno.Secciones[seccion].Mostrar? (<VisibilityIcon />) : (<VisibilityOffIcon color="error" />)}
				</Button>
				{/*(index-1 >= 0)? (
					<Button style={moveButton} 
						onClick={(e) => {
							documento.diseno.Secciones.Orden[index] = documento.diseno.Secciones.Orden[index-1];
							documento.diseno.Secciones.Orden[index-1] = seccion;
							animarSwap(e.target.parentElement.parentElement.parentElement, document.getElementById("orden_"+(index-1)),diff,animando,ListaEditar, setListaEditar, documento, setDocumento);
						  }}
					>
						<KeyboardArrowUpIcon />
					</Button>
				) : (
					<></>	
				)}
				{(index+1 < documento.diseno.Secciones.Orden.length)? (
					<Button style={moveButtonDown}
					  onClick={(e) => {
							documento.diseno.Secciones.Orden[index] = documento.diseno.Secciones.Orden[index+1];
							documento.diseno.Secciones.Orden[index+1] = seccion;
							animarSwap(e.target.parentElement.parentElement.parentElement, document.getElementById("orden_"+(index+1)),-diff,animando,ListaEditar, setListaEditar, documento, setDocumento);
						  }}
					>
						<KeyboardArrowDownIcon />
					</Button>
				) : (
					<></>
				)*/}
			</div>
			<div id={"divisor_"+index} style={{width: "100%", borderBottom:"solid 2px rgba(230, 150, 0,0.2)"}}></div>
		</div>);
	});
	setListaEditar(list);
};

export {SeccionOrderEditor, mapListaToHTML};
