import EducacionFormal from "../EducacionFormal";
import EducacionTecnica from "../EducacionTecnica";
import InformacionPersonal from "../../pages/InformacionPersonal";
import ExperienciaLaboral from "../../pages/ExperienciaLaboral";
import Publicaciones from "../../pages/Publicaciones";
import Referencias from "../../pages/Referencias";
import Proyectos from "../../pages/Proyectos";
import Habilidades from "../../pages/Habilidades";
import Lenguajes from "../../pages/Lenguajes";
import Conferencias from "../../pages/Conferencias";
import Premios from "../../pages/Premios";
import Repositorios from "../../pages/Repositorios";

import {
  Button,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

function PanelSeccion({
  user_data,
  setUserData,
  manager_bloques,
  category_manager,
  opciones,
}) {
  const SeleccionPanel = ({ opciones }) => {
    switch (opciones.Seccion) {
      case "Educacion_Formal":
        return (
          <EducacionFormal
            user_data={user_data}
            setUserData={setUserData}
            manager_bloques={manager_bloques}
            category_manager={category_manager}
			mostrarTitulo={false}
          />
        );
      case "Educacion_Tecnica":
        return (
          <EducacionTecnica
            user_data={user_data}
            setUserData={setUserData}
            manager_bloques={manager_bloques}
            category_manager={category_manager}
			mostrarTitulo={false}
          />
        );
      case "Informacion_Personal":
        return (
          <InformacionPersonal
            user_data={user_data}
            setUserData={setUserData}
            manager_bloques={manager_bloques}
            category_manager={category_manager}
			mostrarTitulo={false}
          />
        );
      case "Experiencias_Laborales":
        return (
          <ExperienciaLaboral
            user_data={user_data}
            setUserData={setUserData}
            manager_bloques={manager_bloques}
            category_manager={category_manager}
			mostrarTitulo={false}
          />
        );
      case "Idiomas":
        return (
          <Lenguajes
            user_data={user_data}
            setUserData={setUserData}
            manager_bloques={manager_bloques}
            category_manager={category_manager}
			mostrarTitulo={false}
          />
        );
      case "Habilidades":
        return (
          <Habilidades
            user_data={user_data}
            setUserData={setUserData}
            manager_bloques={manager_bloques}
            category_manager={category_manager}
			mostrarTitulo={false}
          />
        );
      case "Proyectos":
        return (
          <Proyectos
            user_data={user_data}
            setUserData={setUserData}
            manager_bloques={manager_bloques}
            category_manager={category_manager}
			mostrarTitulo={false}
          />
        );
      case "Publicaciones":
        return (
          <Publicaciones
            user_data={user_data}
            setUserData={setUserData}
            manager_bloques={manager_bloques}
            category_manager={category_manager}
			mostrarTitulo={false}
          />
        );
      case "Conferencias":
        return (
          <Conferencias
            user_data={user_data}
            setUserData={setUserData}
            manager_bloques={manager_bloques}
            category_manager={category_manager}
			mostrarTitulo={false}
          />
        );
      case "Premios":
        return (
          <Premios
            user_data={user_data}
            setUserData={setUserData}
            manager_bloques={manager_bloques}
            category_manager={category_manager}
			mostrarTitulo={false}
          />
        );
      case "Repositorios":
        return (
          <Repositorios
            user_data={user_data}
            setUserData={setUserData}
            manager_bloques={manager_bloques}
            category_manager={category_manager}
			mostrarTitulo={false}
          />
        );
      case "Referencias":
        return (
          <Referencias
            user_data={user_data}
            setUserData={setUserData}
            manager_bloques={manager_bloques}
            category_manager={category_manager}
			mostrarTitulo={false}
          />
        );

      default:
        return <></>;
    }
    return <></>;
  };

  return (<div style={{position : "relative"}}>
		<Button style={{position: "sticky", left: "0px", top: "0px", color: "yellow", backgroundColor: "#303030", minWidth: "40px", border: "solid 2px #ccc"}} onClick={(e) => {e.target.parentElement.parentElement.style.left = "-150%"}}><CloseIcon style={{pointerEvents: "none"}} /></Button>
		<SeleccionPanel opciones={opciones} />
	</div>);
}
export default PanelSeccion;
