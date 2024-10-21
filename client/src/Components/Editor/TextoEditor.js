import {
  TextField,
} from "@mui/material";

const TextoEditor = ({TextoEditar, setTextoEditar, documento, setDocumento, Editando, setEditando, zoom}) => {
	  if(!documento)
		  return (<></>);
	  /*
	  onBlur={(e) => {
					if(e.target.value !== "") 
						setEditando(null) 
					else{
						setTimeout(function(){
							e.target.focus()
							e.target.setCustomValidity("No puede quedar vacío")
						},10);
					}
					 }}
	  */
	  
	  setTimeout(function(){document.getElementById("Editor_Texto_Input")?.focus()},200);
	  return (<div style={{position: "absolute", left: (Editando.pos[0]*zoom)+"px",top: (Editando.pos[1]*zoom)+"px", marginTop: "-10px"}}>
			<form><TextField
				id="Editor_Texto_Input"
				style={{display: "flex", backgroundColor: "#FFFFFF00", zIndex: 100}}
				InputProps = {{style: {color: "#0000"}}}
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
				  
				  let item = documento;
				  let continues = true;
				  Editando.path?.forEach((p, index) => {if(index<(Editando.path.length-1) && continues && p !== "Estructura") item = item[p]; else continues = false;});
				  item[Editando.path[Editando.path.length-1]] = val;
				  setDocumento(documento);
				}}
				
				onKeyDown={(e) => {if(e.keyCode === 13 && e.target.value !== "") setEditando(null)}}
				
			  ></TextField></form>
		  </div>
	  
	  );
  };
  
export { TextoEditor };