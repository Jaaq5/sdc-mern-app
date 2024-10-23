import  { useState, useEffect, useCallback } from "react";


function Autosave({user_data, setUserData, curriculum_manager, documento, styles}){
	const [guardando, setGuardando] = useState(false);
	const [guardador, setGuardador] = useState(null);
	const curriculo_id = user_data.editando_curriculo;
	
	const saveFunc = (documento) => {
		if(!curriculo_id || !user_data || !user_data.curriculums || !user_data.curriculums[curriculo_id])
			return () => {};
		return window.setTimeout(function(){
					setGuardando(true)
					window.setTimeout(function(){
					curriculum_manager.ActualizarCurriculo(
							user_data, 
							setUserData,
							user_data.curriculums[curriculo_id]._id,
							documento,
							user_data.curriculums[curriculo_id].ID_Categoria_Curriculum,
							user_data.curriculums[curriculo_id].ID_Categoria_Puesto)
							.then((response) => {
								if(response != null)
									setGuardando(!response.data.success)
								else
									setGuardando(null)
						})}, 10)
					}
					, 10);
	}
	
	useEffect(() => {
		if(!guardador && !guardando){
			setGuardador(saveFunc(documento))
		}else
		if(guardador && guardando){
			window.clearTimeout(guardador);
			setGuardador(saveFunc(documento))
		}else
		if(guardador && !guardando){
			window.clearTimeout(guardador);
			setGuardador(saveFunc(documento))
		}
		
	}, [setGuardador, documento])
	
				
	
	return (
	<>
		<div style={styles? styles : {}} >
			{guardando === true? 
			 (<>Guardando...</>)
			 :
			 (guardando === false?
				(<>Los cambios han sido guardados.</>)
				:
				(<>Error al guardar.</>)
			  )
			}
		</div>
	</>
	);
}

export default Autosave;