import EducacionFormal from "../EducacionFormal";
import EducacionTecnica from "../EducacionTecnica";
import InformacionPersonal from "../../pages/InformacionPersonal";
import ExperienciaLaboral from "../../pages/ExperienciaLaboral";
import Publicaciones from "../../pages/Publicaciones";
import Referencias from "../../pages/Referencias";
import Proyectos from "../../pages/Proyectos";
import Habilidades from "../../pages/Habilidades";
import Lenguajes from "../../pages/Lenguajes";

function PanelSeccion({
				user_data,
				setUserData,
				manager_bloques,
				category_manager,
				opciones
				}){
					
	const SeleccionPanel = ({opciones}) => {
		switch(opciones.Seccion){
			case "Educacion_Formal":
				return (<EducacionFormal user_data={user_data} setUserData={setUserData} manager_bloques={manager_bloques} category_manager={category_manager}/>)
			case "Educacion_Tecnica":
				return (<EducacionTecnica user_data={user_data} setUserData={setUserData} manager_bloques={manager_bloques} category_manager={category_manager}/>)
			case "Informacion_Personal":
				return (<InformacionPersonal user_data={user_data} setUserData={setUserData} manager_bloques={manager_bloques} category_manager={category_manager}/>)
			case "Experiencias_Laborales":
				return (<ExperienciaLaboral user_data={user_data} setUserData={setUserData} manager_bloques={manager_bloques} category_manager={category_manager}/>)
			case "Idiomas":
				return (<Lenguajes user_data={user_data} setUserData={setUserData} manager_bloques={manager_bloques} category_manager={category_manager}/>)
			case "Habilidades":
				return (<Habilidades user_data={user_data} setUserData={setUserData} manager_bloques={manager_bloques} category_manager={category_manager}/>)
			case "Proyectos":
				return (<Proyectos user_data={user_data} setUserData={setUserData} manager_bloques={manager_bloques} category_manager={category_manager}/>)
			case "Publicaciones":
				return (<Publicaciones user_data={user_data} setUserData={setUserData} manager_bloques={manager_bloques} category_manager={category_manager}/>)
			case "Referencias":
				return (<Referencias user_data={user_data} setUserData={setUserData} manager_bloques={manager_bloques} category_manager={category_manager}/>)
			
			default:
				return (<></>)
		};
		return (<></>);
	};
	
	return (<SeleccionPanel opciones={opciones}/>)
	
};
export default PanelSeccion;