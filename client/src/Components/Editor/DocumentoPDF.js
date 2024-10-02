import { Font, Page, Text, View, Document, StyleSheet, PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";

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

const ElementoEstructuradoPDF = ({user_data, documento, nombreSeccion, seccion, estructura, id, index, tempIds, obtenerTextoEstructura}) => {
  //console.log("Texto: "+nombreSeccion+", "+id+", "+index+", "+estructura.Tipo)
  if(!estructura)
	  return (<></>);
  
  switch(estructura.Tipo){
	  case "Texto":
		return (<ElementoTextoEstructuradoPDF user_data={user_data} documento={documento} nombreSeccion={nombreSeccion} seccion={seccion} estructura={estructura} id={id} index={index} obtenerTextoEstructura={obtenerTextoEstructura} />);
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
};

const SeccionPDFEstructurada = ({user_data, seccion, documento, id, tempIds, obtenerTextoEstructura}) => {
  if(!documento.diseno.Secciones[seccion].Mostrar || !documento.diseno.Secciones[seccion].Estructura)
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


const DocumentoPDF = ({user_data, documento, documentoEstilo, paginaEstilo, tempIds, obtenerTextoEstructura}) => {

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
		//Object.entries(documentoEstilo).forEach([key, value]) => {docuStyle[key] = value})
		docuStyle.fontFamily = "Roboto";
		
		let numeroDePaginas = 1;
		return (
        <Document
		  id="documento_pdf"
          style={
            docuStyle
          }
		  
        >
          <Page size={[595.28, 841.89]} style={paginaEstilo} id={"pagina_"+numeroDePaginas}>
			<View style={{position:"absolute"}}></View>
			<SeccionPDFEstructurada user_data={user_data} seccion={"Informacion_Personal"} documento={documento} id={documento.datos.Secciones.Informacion_Personal} tempIds={tempIds} obtenerTextoEstructura={obtenerTextoEstructura} />
			{Object.keys(documento.diseno.Secciones.Orden).map((seccion) => {
				return(<SeccionPDFEstructurada user_data={user_data} seccion={documento.diseno.Secciones.Orden[seccion]} documento={documento} tempIds={tempIds} obtenerTextoEstructura={obtenerTextoEstructura}/>)
			})}
          </Page>
        </Document>
	)};
 };
 
export default DocumentoPDF;