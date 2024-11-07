import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function CargarEstadoPagina({user_data}){
	const navigate = useNavigate();
	
	useEffect(() =>{
		if(user_data && !user_data.wasLoaded){
			const cookie = localStorage.getItem("sdc_session")?.split(";");
			const path = cookie[2];
			console.log(cookie[2]);
			user_data.wasLoaded = true;
			if(path){
				//setTimeout(() => {navigate(path)}, 100);
				user_data.editando_curriculo = cookie[3];
				navigate(path);
			}else
				navigate("/curriculo-menu");
		}	
	});
	
	return (<></>);
}

export default CargarEstadoPagina;