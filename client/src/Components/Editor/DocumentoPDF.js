import { Font, Page, Text, Image, View, Document, StyleSheet, PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";

import ComicSans from "../../fonts/Comic Sans MS.ttf"
import RobotoBold from "../../fonts/Roboto-Bold.ttf"
import RobotoRegular from "../../fonts/Roboto-Regular.ttf"
import RobotoLight from "../../fonts/Roboto-Light.ttf"
import RobotoThin from "../../fonts/Roboto-Thin.ttf"


const ElementoTextoEstructuradoPDF = ({user_data, documento, nombreSeccion, seccion, estructura, id, index, obtenerTextoEstructura}) => {
  return (<>
  <Text id={"PDF_Texto_"+nombreSeccion+"_"+index} style={estructura.style} key={nombreSeccion+id+index} >
		{obtenerTextoEstructura(user_data,nombreSeccion, seccion, id, estructura, index)}
  </Text></>);
};

const ElementoImagenEstructuradoPDF = ({user_data, documento, nombreSeccion, seccion, estructura, id, index, obtenerTextoEstructura}) => {
  return (
  <>
	<Image id={"PDF_Imagen_"+nombreSeccion+"_"+index} style={estructura.style} key={nombreSeccion+id+index} cache={true} src={`data:image/png;base64,${user_data.userImage}`} />
  </>);
};

const ElementoEstructuradoPDF = ({user_data, documento, nombreSeccion, seccion, estructura, id, index, obtenerTextoEstructura}) => {
  //console.log("Texto: "+nombreSeccion+", "+id+", "+index+", "+estructura.Tipo)
  if(!estructura || !documento.datos.tempIds)
	  return (<></>);
  
  switch(estructura.Tipo){
	  case "Texto":
		return (<ElementoTextoEstructuradoPDF user_data={user_data} documento={documento} nombreSeccion={nombreSeccion} seccion={seccion} estructura={estructura} id={id} index={index} obtenerTextoEstructura={obtenerTextoEstructura} />);
	  case "Div":
		return (<ElementoTextoEstructuradoPDF user_data={user_data} documento={documento} nombreSeccion={nombreSeccion} seccion={seccion} estructura={estructura} id={id} index={index} obtenerTextoEstructura={obtenerTextoEstructura} />);
	  case "Imagen":
		return (<ElementoImagenEstructuradoPDF user_data={user_data} documento={documento} nombreSeccion={nombreSeccion} seccion={seccion} estructura={estructura} id={id} index={index} obtenerTextoEstructura={obtenerTextoEstructura} />);
	  case "Estructura":
			return (<div style={estructura.style}>
				{Object.entries(estructura.Estructura).map(([index, estr]) => 
					(<ElementoEstructuradoPDF user_data={user_data} documento={documento} nombreSeccion={nombreSeccion} seccion={seccion} estructura={estr} id={id} index={index} obtenerTextoEstructura={obtenerTextoEstructura} />)
				)}
			</div>)
	  case "IDs":
		let list = [];
		
		documento.datos.tempIds[nombreSeccion]?.forEach((bloque_id, index) => {
			list.push(
				<View style={estructura.plantillaStyle}>{Object.keys(estructura.Plantilla).map((index) => {
					return (
						<ElementoEstructuradoPDF user_data={user_data} documento={documento} nombreSeccion={nombreSeccion} seccion={seccion} estructura={estructura.Plantilla[index]} id={bloque_id} index={index} obtenerTextoEstructura={obtenerTextoEstructura} />
					)
				})}</View>
			);
		});
		return (<View style={estructura.style}>{list}</View>);
  };
  return (<></>);
};

const SeccionPDFEstructurada = ({user_data, seccion, documento, id, obtenerTextoEstructura}) => {
	  if(!documento.diseno.Secciones[seccion] || !documento.diseno.Secciones[seccion].Mostrar)
		  return (<></>);
	  
	  documento.diseno.Secciones[seccion].style = documento.diseno.Secciones[seccion].style? documento.diseno.Secciones[seccion].style : {};

	  
	  let crearContenedor = false;
	  let posStyle = {position: "relative", width: "100%", backgroundColor: "#00f0"};
	  const secStyle = JSON.parse(JSON.stringify(documento.diseno.Secciones[seccion].style))

	  if(documento.diseno.Secciones[seccion].Pos){
		  crearContenedor = true;
		  posStyle.height = documento.diseno.Secciones[seccion].style.top;
		  secStyle.top = "0px"
		  secStyle.position = "relative";
	  }
	  
	  const sec = (
				<View id={"Seccion_" + seccion} style={secStyle} key={seccion}>
					{Object.entries(documento.diseno.Secciones[seccion].Estructura).map(([index, estructura]) => {
						return (<>
							<ElementoEstructuradoPDF user_data={user_data} documento={documento} nombreSeccion={seccion} seccion={documento.diseno.Secciones[seccion]} estructura={documento.diseno.Secciones[seccion].Estructura[index]} id={id} index={index} obtenerTextoEstructura={obtenerTextoEstructura} />
						</>)
					})}
				</View>
			  );
	  
	  if(crearContenedor)
		  return (<View style={{position: "absolute", backgroundColor: "#f000", display: "flex", flexDirection: "column"}}><View style={posStyle}></View>{sec}</View>)
	  else
		  return sec;
};

  
const SubPaginaEstructuraPDF = ({user_data, documento, estructura, obtenerTextoEstructura}) => {
    if(documento.diseno.Secciones[estructura]){
		return (<SeccionPDFEstructurada user_data={user_data} seccion={estructura} documento={documento} id={documento.datos.Secciones[estructura]} obtenerTextoEstructura={obtenerTextoEstructura} />);
		
	}else if(documento.diseno.Secciones.Orden[estructura]){
		return (<SeccionPDFEstructurada user_data={user_data} seccion={documento.diseno.Secciones.Orden[estructura]} documento={documento} obtenerTextoEstructura={obtenerTextoEstructura}/>);
			
	}else if(typeof(estructura) === "object"){
		return (<View style={estructura.style}>
			{estructura.Estructura? (Object.keys(estructura.Estructura).map((index) => {
				 if(typeof(estructura.Estructura[index]) === "string")
					return(<SeccionPDFEstructurada user_data={user_data} seccion={estructura.Estructura[index]} id={documento.datos.Secciones[estructura.Estructura[index]]} documento={documento} obtenerTextoEstructura={obtenerTextoEstructura}/>);
				 else if(typeof(estructura.Estructura[index]) === "number")
					 return(<SeccionPDFEstructurada user_data={user_data} seccion={documento.diseno.Secciones.Orden[estructura.Estructura[index]]} documento={documento} obtenerTextoEstructura={obtenerTextoEstructura}/>);
				 else{
					 return(<SubPaginaEstructuraPDF user_data={user_data} documento={documento} estructura={estructura.Estructura[index]} obtenerTextoEstructura={obtenerTextoEstructura}/>);
				 }
			})
			)
			:
			(<></>)
			}
		</View>)
	}
	  return (<></>);
  };
  
const PaginaPDFEstructurada = ({user_data, documento, obtenerTextoEstructura}) => {
	  if(!documento || !documento.diseno.Paginas || !documento.diseno.Paginas[0].Estructura){
		  return (<Page><View><Text>Formato No Soportado</Text></View></Page>);
	  }

	  return (<Page style={documento.diseno.Paginas[0].style} id={"pagina_"+1}>
				<View style={{position:"absolute"}}>
					{documento.diseno.Paginas[0].Elementos? (Object.entries(documento.diseno.Paginas[0].Elementos).forEach(([key, val]) => {
						if(documento.diseno.Elementos[val]){
							
						}
					}))
					:
					(<></>)
					}
				</View>
				{
					Object.entries(documento.diseno.Paginas[0].Estructura).map(([key, val]) => {
						return (<SubPaginaEstructuraPDF user_data={user_data} documento={documento} estructura={val} obtenerTextoEstructura={obtenerTextoEstructura}/>)
					})
				}
			  </Page>);
  };


const DocumentoPDF = ({user_data, documento, tempIds, obtenerTextoEstructura}) => {

    if (!documento) 
		return (<></>);

	Font.register({
		family: "ComicSans",
		fonts: [
			{
			  src: ComicSans,
			  fontWeight: 400,
			},
			{
			  src: ComicSans,
			  fontWeight: 700,
			},
			{
			  src: ComicSans,
			  fontWeight: 900,
			}
		]
	});
	Font.register({
		family: "Roboto",
		fonts: [
			{
			  src: RobotoLight,
			  fontWeight: 400,
			},
			{
			  src: RobotoRegular,
			  fontWeight: 700,
			},
			{
			  src: RobotoBold,
			  fontWeight: 900,
			}
		]
	});
	Font.registerHyphenationCallback(word => (
	  [word]
	));
	
	const docuStyle = {};
	Object.entries(documento.diseno.style).forEach(([key, value]) => {docuStyle[key] = value});
	docuStyle.fontFamily = "Roboto"; //DEBUG
	
	let numeroDePaginas = 1;
	return (
		<Document
		  id="documento_pdf"
		  style={
			docuStyle
		  }
		  
		>
		  <PaginaPDFEstructurada user_data={user_data} documento={documento} tempIds={tempIds} obtenerTextoEstructura={obtenerTextoEstructura}/>
		</Document>
	);
 };
 
export default DocumentoPDF;