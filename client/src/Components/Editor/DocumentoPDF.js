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

const ElementoEstructuradoPDF = ({user_data, documento, nombreSeccion, seccion, estructura, id, index, tempIds, obtenerTextoEstructura}) => {
  //console.log("Texto: "+nombreSeccion+", "+id+", "+index+", "+estructura.Tipo)
  if(!estructura)
	  return (<></>);
  
  switch(estructura.Tipo){
	  case "Texto":
		return (<ElementoTextoEstructuradoPDF user_data={user_data} documento={documento} nombreSeccion={nombreSeccion} seccion={seccion} estructura={estructura} id={id} index={index} obtenerTextoEstructura={obtenerTextoEstructura} />);
	  case "Div":
		return (<ElementoTextoEstructuradoPDF user_data={user_data} documento={documento} nombreSeccion={nombreSeccion} seccion={seccion} estructura={estructura} id={id} index={index} obtenerTextoEstructura={obtenerTextoEstructura} />);
	  case "Imagen":
		return (<ElementoImagenEstructuradoPDF user_data={user_data} documento={documento} nombreSeccion={nombreSeccion} seccion={seccion} estructura={estructura} id={id} index={index} obtenerTextoEstructura={obtenerTextoEstructura} />);
	  
	  case "IDs":
		let list = [];
		
		//documento.datos.Secciones[nombreSeccion].IDs
		tempIds[nombreSeccion]?.forEach((bloque_id, index) => {
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

const SeccionPDFEstructurada = ({user_data, seccion, documento, id, tempIds, obtenerTextoEstructura}) => {
  if(!documento.diseno.Secciones[seccion] || !documento.diseno.Secciones[seccion].Mostrar || !documento.diseno.Secciones[seccion].Estructura)
	  return (<></>);

  return (
	<View id={"PDF_Seccion_" + seccion} style={documento.diseno.Secciones[seccion].style} key={seccion}>
		{Object.keys(documento.diseno.Secciones[seccion].Estructura).map((index) => {
			return (<>
				<ElementoEstructuradoPDF user_data={user_data} documento={documento} nombreSeccion={seccion} seccion={documento.diseno.Secciones[seccion]} estructura={documento.diseno.Secciones[seccion].Estructura[index]} id={id} index={index} tempIds={tempIds} obtenerTextoEstructura={obtenerTextoEstructura} />
			</>)
		})}
	</View>
  );
};

const PaginaPDFEstructurada = ({user_data, documento, tempIds, obtenerTextoEstructura}) => {
	  if(!documento)
		  return (<></>);
	  return (<Page style={documento.diseno.Paginas[0].style} id={"pagina_"+1}>
				<View style={{position:"absolute"}}></View>
				{
					Object.entries(documento.diseno.Paginas[0].Estructura).map(([key, val]) => {
						if(documento.diseno.Secciones[val])
							return (<SeccionPDFEstructurada user_data={user_data} seccion={val} documento={documento} id={documento.datos.Secciones[val]} tempIds={tempIds} obtenerTextoEstructura={obtenerTextoEstructura}/>)
						
						else if(documento.diseno.Secciones.Orden[val])
							return (<SeccionPDFEstructurada user_data={user_data} seccion={documento.diseno.Secciones.Orden[val]} documento={documento} tempIds={tempIds} obtenerTextoEstructura={obtenerTextoEstructura}/>)
						
						else if(typeof(val) === "object"){
							return (<div style={val.style}>
								{Object.keys(val.Secciones).map((seccion) => {
									 if(typeof(val.Secciones[seccion]) === "string")
										return(<SeccionPDFEstructurada user_data={user_data} seccion={val.Secciones[seccion]} id={documento.datos.Secciones[val.Secciones[seccion]]} documento={documento} tempIds={tempIds} obtenerTextoEstructura={obtenerTextoEstructura}/>)
									 else
										 return(<SeccionPDFEstructurada user_data={user_data} seccion={documento.diseno.Secciones.Orden[val.Secciones[seccion]]} documento={documento} tempIds={tempIds} obtenerTextoEstructura={obtenerTextoEstructura}/>)
								})}
							</div>)
						}
					})
				}
			  </Page>);
  };


const DocumentoPDF = ({user_data, documento, tempIds, obtenerTextoEstructura}) => {

    if (!documento) 
		return (<></>);
    else{
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
	)};
 };
 
export default DocumentoPDF;