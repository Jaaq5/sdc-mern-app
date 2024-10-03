import {
  TextField,
} from "@mui/material";

const TextoEditor = ({TextoEditar, setTextoEditar, documento, setDocumento, Editando, setEditando}) => {
	  if(!documento)
		  return (<></>);
	  setTimeout(function(){document.getElementById("Editor_Texto_Input")?.focus()},200);
	  return (<div style={{position: "absolute", left: Editando.pos[0]+"px",top: Editando.pos[1]+"px", marginTop: "-10px"}}>
			<form><TextField
				id="Editor_Texto_Input"
				style={{display: "flex", backgroundColor: "#FFFFFF", zIndex: 100, marginTop: documento.diseno.Secciones[Editando.Seccion].style.marginTop || documento.diseno.Secciones[Editando.Seccion].style.margin}}
				InputProps = {{style: {color: "#000"}}}
				variant="standard"
				size="small"
				sx={{ label: { fontWeight: "700", fontSize: "1.0rem" } }}
				type="text"
				label={Editando.label}
				placeholder={Editando.placeholder}
				required
				value={TextoEditar}
				onChange={(e) => {
				  let val = e.target.value? e.target.value : "";
				  if(val === "")
					  e.target.setCustomValidity(
                        "No puede quedar vacío",
                      )
				  else
					  e.target.setCustomValidity(
                        "",
                      )
				  setTextoEditar(val);
				  documento.diseno.Secciones[Editando.Seccion][Editando.Campo] = val;
				  setDocumento(documento);
				}}
				
				onKeyDown={(e) => {if(e.keyCode === 13 && e.target.value !== "") setEditando(null)}}
				onBlur={(e) => {
					if(e.target.value !== "") 
						setEditando(null) 
					else{
						setTimeout(function(){
							e.target.focus()
							e.target.setCustomValidity("No puede quedar vacío")
						},0);
					}
					 }}
			  ></TextField></form>
		  </div>
	  
	  );
  };
  
export { TextoEditor };