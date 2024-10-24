import {
  Button,
} from "@mui/material";

function BotonEditable({estructura, nombreSeccion, setEditando, posicionEnOverlay, nid, path, style, Icon, iconStyle, setTextoEditar, texto}){
	const bid = "Edit_Button_Estructura_"+path;
	return (<>
		{estructura.Editable? (
			<Button  
				title={estructura.Editable.Titulo}
				style={style}
				id={"Edit_Button_Estructura_"+path}
				onMouseEnter={(e) => {document.getElementById(bid).style.boxShadow = "inset 0 0 0 2px purple";}}
				onMouseLeave={(e) => {document.getElementById(bid).style.boxShadow = "inset 0 0 0 0px purple"; }}
				onClick={(e) => {
				setTextoEditar(texto);
				setEditando(null);
				setEditando({
					Tipo: estructura.Editable.Tipo,
					pos: posicionEnOverlay(nid),
					Seccion: nombreSeccion,
					Campo: estructura.Editable.Campo,
					Arreglo: estructura.Editable.Arreglo,
					Celdas: estructura.Editable.Celdas,
					Pos: estructura.Editable.Pos,
					path: path,
					id: nid,
					Fuentes : estructura.Editable.Fuentes,
					Borrar: estructura.Editable.Borrar,
					});
				}} >
					<Icon style={iconStyle}/>
			</Button>
		) : (
			<></>
		)}
	</>);
}

export default BotonEditable;