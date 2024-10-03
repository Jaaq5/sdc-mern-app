import ComicSans from "../../fonts/Comic Sans MS.ttf"
import RobotoBold from "../../fonts/Roboto-Bold.ttf"
import RobotoRegular from "../../fonts/Roboto-Regular.ttf"
import RobotoLight from "../../fonts/Roboto-Light.ttf"
import RobotoThin from "../../fonts/Roboto-Thin.ttf"


const ElementoTextoEstructuradoHTML = ({user_data, documento, nombreSeccion, seccion, estructura, id, index, obtenerTextoEstructura}) => {
  return (<>
  <p id={"HTML_Texto_"+nombreSeccion+"_"+index} style={estructura.style} key={nombreSeccion+id+index} >
		{obtenerTextoEstructura(user_data,nombreSeccion, seccion, id, estructura, index)}
  </p></>);
};

const ElementoDivEstructuradoHTML = ({user_data, documento, nombreSeccion, seccion, estructura, id, index, obtenerTextoEstructura}) => {
  return (<>
  <p id={"HTML_Texto_"+nombreSeccion+"_"+index} style={estructura.style} key={nombreSeccion+id+index} >
		{obtenerTextoEstructura(user_data,nombreSeccion, seccion, id, estructura, index)}
  </p></>);
};

const ElementoImgEstructuradoHTML = ({user_data, documento, nombreSeccion, seccion, estructura, id, index}) => {
	  return (<>
		<img id={"Imagen_"+nombreSeccion+"_"+index} style={estructura.style} key={nombreSeccion+id+index} src={`data:image/png;base64,${user_data.userImage}`} />
	  </>);
  };

const ElementoEstructuradoHTML = ({user_data, documento, nombreSeccion, seccion, estructura, id, index, obtenerTextoEstructura}) => {
  //console.log("Texto: "+nombreSeccion+", "+id+", "+index+", "+estructura.Tipo)
  if(!estructura)
	  return (<></>);
  
  switch(estructura.Tipo){
	  case "Texto":
		return (<ElementoTextoEstructuradoHTML user_data={user_data} documento={documento} nombreSeccion={nombreSeccion} seccion={seccion} estructura={estructura} id={id} index={index} obtenerTextoEstructura={obtenerTextoEstructura} />);
	  case "Div":
		return (<ElementoDivEstructuradoHTML user_data={user_data} documento={documento} nombreSeccion={nombreSeccion} seccion={seccion} estructura={estructura} id={id} index={index} obtenerTextoEstructura={obtenerTextoEstructura} />);
	  case "Imagen":
		return (<ElementoImgEstructuradoHTML user_data={user_data} documento={documento} nombreSeccion={nombreSeccion} seccion={seccion} estructura={estructura} id={id} index={index} obtenerTextoEstructura={obtenerTextoEstructura} />);
	  case "IDs":
		let list = [];
		if(!documento.datos.tempIds){
			return (<></>);
		}
		documento.datos.tempIds[nombreSeccion]?.forEach((bloque_id, index) => {
			list.push(
				<div style={estructura.plantillaStyle}>{Object.keys(estructura.Plantilla).map((index) => {
					return (
						<ElementoEstructuradoHTML user_data={user_data} documento={documento} nombreSeccion={nombreSeccion} seccion={seccion} estructura={estructura.Plantilla[index]} id={bloque_id} index={index} obtenerTextoEstructura={obtenerTextoEstructura} />
					)
				})}</div>
			);
		});
		return (<div style={estructura.style} key={nombreSeccion+estructura.Tipo}>{list}</div>);
  };
  return (<></>);
};

const SeccionHTMLEstructurada = ({user_data, seccion, documento, id, obtenerTextoEstructura}) => {
  if(!documento.diseno.Secciones[seccion] || !documento.diseno.Secciones[seccion].Mostrar || !documento.diseno.Secciones[seccion].Estructura)
	  return (<></>);

  return (
	<div id={"HTML_Seccion_" + seccion} style={documento.diseno.Secciones[seccion].style} key={seccion}>
		{documento.diseno.Secciones[seccion].Estructura? (Object.keys(documento.diseno.Secciones[seccion].Estructura).map((index) => {
			return (<>
				<ElementoEstructuradoHTML user_data={user_data} documento={documento} nombreSeccion={seccion} seccion={documento.diseno.Secciones[seccion]} estructura={documento.diseno.Secciones[seccion].Estructura[index]} id={id} index={index}  obtenerTextoEstructura={obtenerTextoEstructura} />
			</>)
		}))
		:
		(<></>)
		}
	</div>
  );
};

const PaginaHTMLEstructurada = ({user_data, documento, obtenerTextoEstructura}) => {
	  if(!documento || !documento.diseno.Paginas || !documento.diseno.Paginas[0].Estructura){
		  return (<div><div><p>Formato No Soportado</p></div></div>);
	  }
	  let listas=0;
	  return (<div style={documento.diseno.Paginas[0].style} id={"pagina_"+1} key={"pagina_"+1}>
				<div style={{position:"absolute"}} key={"Elementos"}></div>
				{
					Object.entries(documento.diseno.Paginas[0].Estructura).map(([key, val]) => {
						if(documento.diseno.Secciones[val])
							return (<SeccionHTMLEstructurada user_data={user_data} seccion={val} documento={documento} id={documento.datos.Secciones[val]} obtenerTextoEstructura={obtenerTextoEstructura}/>)
						
						else if(documento.diseno.Secciones.Orden[val])
							return (<SeccionHTMLEstructurada user_data={user_data} seccion={documento.diseno.Secciones.Orden[val]} documento={documento}  obtenerTextoEstructura={obtenerTextoEstructura}/>)
						
						else if(typeof(val) === "object"){
							listas += 1;
							return (<div style={val.style} key={"Lista_"+listas}>
								{Object.keys(val.Secciones).map((seccion) => {
									 if(typeof(val.Secciones[seccion]) === "string")
										return(<SeccionHTMLEstructurada user_data={user_data} seccion={val.Secciones[seccion]} id={documento.datos.Secciones[val.Secciones[seccion]]} documento={documento}  obtenerTextoEstructura={obtenerTextoEstructura}/>)
									 else
										 return(<SeccionHTMLEstructurada user_data={user_data} seccion={documento.diseno.Secciones.Orden[val.Secciones[seccion]]} documento={documento}  obtenerTextoEstructura={obtenerTextoEstructura}/>)
								})}
							</div>)
						}
					})
				}
			  </div>);
  };
  
const obtenerTextoEstructura = (user_data, nombreSeccion, seccion, id, estructura, index) => {
	let texto = "";
	estructura.Texto.forEach((campo) => {
		if(seccion[campo] || seccion[campo] === ""){ //Titulo y otros de plantilla
			texto += seccion[campo] === ""? estructura.Editable.Placeholder : seccion[campo];
		}else if(id && user_data.bloques[nombreSeccion][id][campo]){ //Bloques de datos
			if(nombreSeccion === "Idiomas" && campo === "Id")
				texto += "Idioma";//getNameById(user_data.bloques[nombreSeccion][id][campo])
			else
				texto += user_data.bloques[nombreSeccion][id][campo]
		}else{ //Texto generico
			texto += campo;
		}
	});
	return texto;
  };


const PrevistaHTML = ({user_data, documento}) => {
    if (!documento) 
		return (<></>);
    else{
		const docuStyle = {};
		documento.diseno.style = documento.diseno.style? documento.diseno.style : {};
		Object.entries(documento.diseno.style).forEach(([key, value]) => {docuStyle[key] = value});
		docuStyle.zoom = "0.5";
		
		let numeroDePaginas = 1;
		return (
        <div
		  id="documento_HTML"
          style={
            docuStyle
          }
		  
        >
          <PaginaHTMLEstructurada user_data={user_data} documento={documento}  obtenerTextoEstructura={obtenerTextoEstructura}/>
        </div>
	)};
 };
 
export default PrevistaHTML;