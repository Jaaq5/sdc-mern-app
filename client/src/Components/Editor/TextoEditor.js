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
	  const elm = document.getElementById(Editando.id);
	  const elmStyle = elm.currentStyle || window.getComputedStyle(elm);
	  
	  return (<div style={{position: "absolute", left: (Editando.pos[0]*zoom)+"px",top: (Math.max(Editando.pos[1], 60)*zoom)+"px", marginTop: "-10px", zIndex: 1000}}>
			<form><TextField
				id="Editor_Texto_Input"
				style={{display: "flex", backgroundColor: "#FFFFFF00", zIndex: 100, maxWidth: elmStyle.width}}
				InputProps = {{style: {color: "#0000"}}}
				variant="standard"
				size="small"
				sx={{ label: { fontWeight: "700", fontSize: "1.0rem"} }}
				type="text"
				label={Editando.label}
				placeholder={Editando.placeholder}
				multiline
				maxRows = {Editando.multiline? 10 : 1}
				required
				value={TextoEditar}
				autoComplete="none"
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
				  let item = documento.diseno.Secciones[Editando.Seccion];
				  item[Editando.Campo] = val;
				  
				  setTextoEditar(val);
				}}
				
				onKeyDown={(e) => {if((!Editando.multiline || e.ctrlKey) && e.keyCode === 13 && e.target.value !== "") setEditando(null)}}
				
			  ></TextField></form>
		  </div>
	  
	  );
  };
  
export { TextoEditor };