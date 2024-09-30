import {
  TextField,
} from "@mui/material";

const TextoEditor = ({TextoEditar, setTextoEditar, documento, setDocumento, Editando, setEditando}) => {
	  if(!documento)
		  return (<></>);
	  setTimeout(function(){document.getElementById("Editor_Texto_Input")?.focus()},200);
	  return (<div style={{position: "absolute", left: Editando.pos[0]+"px",top: Editando.pos[1]+"px", marginTop: "-10px"}}>
			<TextField
				id="Editor_Texto_Input"
				style={{display: "flex", backgroundColor: "#EFFFFF", zIndex: 100}}
				InputProps = {{style: {}}}
				variant="standard"
				size="small"
				sx={{ label: { fontWeight: "700", fontSize: "1.0rem" } }}
				type="text"
				label={Editando.label}
				placeholder={Editando.placeholder}
				required
				value={TextoEditar}
				onChange={(e) => {
				  setTextoEditar(e.target.value);
				  documento.diseno.Secciones[Editando.Seccion][Editando.Campo] = e.target.value;
				  setDocumento(documento);
				}}
				onKeyDown={(e) => {if(e.keyCode === 13) setEditando(null)}}
				onBlur={(e) => {setEditando(null)}}
			  ></TextField>
		  </div>
	  
	  );
  };
  
export { TextoEditor };