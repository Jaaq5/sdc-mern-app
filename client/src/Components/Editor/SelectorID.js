import  { useState } from "react";
import {
  Button,
  List,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PushPinIcon from '@mui/icons-material/PushPin';

//TODO, mejorar campos incluidos
const BloquesListTexto = {
	Informacion_Personal: [["Puesto", " - ", "Sobre_Mi"], ["Correo", ", ", "Telefono"]],
	Experiencias_Laborales: [["Organizacion"], ["Puesto"]],
	Educacion_Formal: [["Programa", " en ", "Institucion"], ["Descripcion"]],
	Educacion_Informal: [["Programa", " en ", "Institucion"], ["Descripcion"]],
	Idiomas: [["Idioma"], ["Nivel"]],
	Habilidades: [["Nombre"], ["Descripcion"]],
	Proyectos: [["Proyecto"], ["Institucion"]],
	Publicaciones: [["Titulo"], ["Publicadora"]],
	Referencias: [["Nombre"], ["Email"]]
};

const obtenerTextoListaIDs = (user_data, _id, primary, Editando) => {
	let texto = "";
	BloquesListTexto[Editando.Seccion][primary? 0 : 1].forEach((campo) => {
		if(user_data.bloques[Editando.Seccion][_id][campo])
			texto += user_data.bloques[Editando.Seccion][_id][campo];
		else
			texto += campo;
	});
	return texto;
};

const crearBloquesToHTML = (user_data, TextoEditar, setTextoEditar, ListaEditar, setListaEditar, documento, setDocumento, Editando, setEditando) => {
	if((!user_data) || !user_data.bloques)
		return (<></>);
	
	const bloques = user_data.bloques[Editando.Seccion];
	
	const listStyle = {
		borderBottom: "solid 2px rgba(230, 150, 0, 0.2)",
		borderRadius: "0px",
		marginBottom: "5px",
		height: "5rem",
		overflow: "hidden",
		backgroundColor: "#fff0",
		color: "#fff"
	  };
	const activeListStyle = {
	  	borderBottom: "solid 2px rgba(230, 150, 0, 0.2)",
		borderRadius: "0px",
		marginBottom: "5px",
		height: "5rem",
		overflow: "hidden",
		backgroundColor: "#afa6",
		color: "#fff"
	  };
	
	if((!bloques) || Object.keys(bloques).length === 0)
		return (<ListItemButton
          key={"0"}
          style={listStyle}
          onClick={(e) => {
			  setEditando(null);
			}}
        >
		<ListItemText
			primary={
				"No has agregado ningúna información aquí."
			}
			secondary={<span style={{color:"#ccc"}}>
				{"Agrega en "+Editando.Seccion+", y aparecerán aquí"}
			</span>}
		  />
		</ListItemButton>);
	
	let sortedBloques = Object.entries(bloques).sort();
	
	//TODO Ordenar por categorias
	if(bloques && bloques[Object.keys(bloques)[0]].FechaFinal)
		sortedBloques = Object.entries(bloques).sort(
		  ([, a], [, b]) => new Date(b.Fecha_Final) - new Date(a.Fecha_Final),
		);
	let active = Editando.Arreglo? documento.datos.Secciones[Editando.Seccion][Editando.Campo] : [documento.datos.Secciones[Editando.Seccion]];
	
	setListaEditar(
      sortedBloques.map(([plan_id, bloque], index) => (<>
        <ListItemButton
          key={plan_id}
          style={active.includes(plan_id+"")? activeListStyle : listStyle}
          onClick={(e) => {
			  if(Editando.Campo){
				  if(Editando.Arreglo){
					  if(active.includes(plan_id+"")){
						  documento.datos.Secciones[Editando.Seccion][Editando.Campo] = active.filter((id) => id !== plan_id);
					  }else if(active.length < documento.datos.Secciones[Editando.Seccion].Cantidad){
						  documento.datos.Secciones[Editando.Seccion][Editando.Campo].push(plan_id);
					  }
				  }else{
					  
				  }
			  }else{ //Informacion_Personal
				  documento.datos.Secciones[Editando.Seccion] = plan_id;
			  }
			  setDocumento(documento);
			  crearBloquesToHTML(user_data, TextoEditar, setTextoEditar, ListaEditar, setListaEditar, documento, setDocumento, Editando, setEditando);
			  //setEditando(null);
			}}
        >
		{active.includes(plan_id+"")? 
			(<>
			<PushPinIcon style={{position: "absolute", right: "5px", top:"5px"}} />
			</>) 
			: 
			(<></>)
		}
		<ListItemText
			primary={
				obtenerTextoListaIDs(user_data, plan_id, true, Editando)
			}
			secondary={<span style={{color:"#ccc"}}>
				{obtenerTextoListaIDs(user_data, plan_id, false, Editando)}
			</span>}
		  />
		</ListItemButton>
      </>))
    );
};


const BotonesCantidad = ({TextoEditar, setTextoEditar, documento, setDocumento, Editando}) => {
	let cantidad = documento.datos.Secciones[Editando.Seccion].Cantidad;
	const moveButton = {
		padding: 0,
		margin: 0,
		color: "#fff",
		minWidth: "24px",
		width: "24px",
		height: "24px",
	};
	const moveButtonDown = {
		padding: 0,
		margin: 0,
		color: "#fff",
		minWidth: "24px",
		width: "24px",
		height: "24px",
	};
	setTextoEditar(cantidad);
	return (<div style={{textAlign: "center", display: "inline"}}>
		
		<span style={{color: "#fff", fontWeight: "900", fontSize: "1.2em"}}>

			<Button style={moveButton} 
				onClick={(e) => {
					cantidad -= cantidad > 0? 1 : 0;
					documento.datos.Secciones[Editando.Seccion].Cantidad = cantidad;
					setTextoEditar(cantidad);
					setDocumento(documento);
				  }}
			>
				<KeyboardArrowLeftIcon />
			</Button>
		
			{cantidad}
		

			<Button style={moveButtonDown}
			  onClick={(e) => {
					cantidad += cantidad < 21? 1 : 0;
					documento.datos.Secciones[Editando.Seccion].Cantidad = cantidad;
					setTextoEditar(cantidad);
					setDocumento(documento);
				  }}
			>
				<KeyboardArrowRightIcon />
			</Button>
		</span>
	</div>);
};
const EditorCantidad = ({TextoEditar, setTextoEditar, documento, setDocumento, Editando, setEditando}) => {
	return (<div style={{backgroundColor: "#303030", position: "absolute", left: "320px", width: "200px", textAlign: "center"}}>
		<div style={{color: "#fff", fontWeight: "900", fontSize: "1.2em", borderBottom: "solid 2px rgb(200,200,200)", padding: "3px", textAlign: "center"}}>Cuantos campos mostrar</div>
		<BotonesCantidad TextoEditar={TextoEditar} setTextoEditar={setTextoEditar} documento={documento} setDocumento={setDocumento} Editando={Editando} />
	</div>);
};

const SelectorID = ({user_data, TextoEditar, setTextoEditar, ListaEditar, setListaEditar, documento, setDocumento, Editando, setEditando, SeleccionarIDs}) => {
	//<BloquesToHTML user_data={user_data} TextoEditar={TextoEditar} setTextoEditar={setTextoEditar} ListaEditar={ListaEditar} setListaEditar={setListaEditar} documento={documento} setDocumento={setDocumento} Editando={Editando} setEditando={setEditando} />
	const [ListaSeleccionableIDs, setListaSeleccionable] = useState([]);
	
	if(ListaSeleccionableIDs.length === 0)
		crearBloquesToHTML(user_data,TextoEditar,setTextoEditar,ListaSeleccionableIDs,setListaSeleccionable,documento,setDocumento,Editando,setEditando);
	
	return (<div style={{backgroundColor: "#303030", border:"solid 2px rgb(100,100,100)", borderRadius: "0px", position: "absolute", left: Editando.pos[0]+"px",top: Editando.pos[1]+"px", marginTop: "-10px"}}>
		{Editando.Arreglo? (<>
				<EditorCantidad TextoEditar={TextoEditar} setTextoEditar={setTextoEditar} documento={documento} setDocumento={setDocumento} Editando={Editando} setEditando={setEditando} />
			</>) : (<>
			</>)}
		<List style={{width: "300px", maxHeight: "300px", overflowY: "auto", overflowX: "hidden"}}>
			
			<div style={{color: "#fff", fontWeight: "900", fontSize: "1.2em", borderBottom: "solid 2px rgb(200,200,200)", padding: "3px", textAlign: "center"}}>
				{documento.diseno.Secciones[Editando.Seccion].Editable?.Titulo}
				<Button onClick={(e) => {setEditando(null); SeleccionarIDs(user_data, documento, user_data.curriculums[user_data.editando_curriculo].ID_Categoria_Curriculo, user_data.curriculums[user_data.editando_curriculo].ID_Categoria_Puesto);}}><CheckCircleIcon color = "success" /> </Button>
			</div>
			{ListaSeleccionableIDs}
			
		</List>
	</div>);
};

export {SelectorID};