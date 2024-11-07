function GuardarEstadoPagina({user_data}){
	if(user_data){
		const path = window.location.pathname;
		const cv_index = path === "/editor-curriculo"? user_data.editando_curriculo : null;
		localStorage.setItem("sdc_session", user_data.usuario_id+";"+user_data.token+";"+path+(cv_index? ";"+cv_index : ""));
	}
	
}

export default GuardarEstadoPagina;