import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Input, Grid, Button, Paper, TextField, Typography, List, ListItem, ListItemText, ListItemButton } from "@mui/material";

import axios from "axios";

//Para cargar los datos de usuario, ponerlos como parametros aqui
//Tambien agregarlos en "App.js" (se pueden agregar otras variables ahi)
function EducacionFormal({user_data, setUserData, manager_bloques}) {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(!user_data?.usuario_id);
	
	const [educaciones, setEducaciones] = useState([]);
	
	//Style
	const paperStyle = {padding: "2rem", margin: "10px auto", borderRadius:"1rem", boxShadow: "10px 10px 10px"};
	const paperSX = {width: {xs: '80vw',     // 0
								sm: '50vw',     // 600
								md: '40vw',     // 900
								lg: '30vw',     // 1200
								xl: '20vw',     // 1536 
							},
							height:{
								lg: '60vh',     // 1200px and up
							}};
    const heading = {fontSize:"2.5rem", fontWeight:"600"}
    const row = {display:"flex", marginTop:"2rem"}
    const btnStyle={marginTop:"2rem", fontSize:"1.2rem", fontWeight:"700", backgroundColor:"blue", borderRadius:"0.5rem"};
	const listStyle = {border:"solid 3px #999999aa", borderRadius: "5px", marginBottom:"5px", height:"5rem", overflow: "hidden"};
	const listButtonStyle = {border:"solid 1px #999999aa", height:"3rem", overflow: "hidden"};
	const [dense, setDense] = useState(true);
	
	//Form
	const [fecha_inicio, setFechaInicio] = useState("-");
	const [fecha_final, setFechaFinal] = useState("-");
	const [programa, setPrograma] = useState("-");
	const [institucion, setInstitucion] = useState("-");
	const [descripcion, setDescripcion] = useState("-");
	const [categoria_curriculum, setCurriculum] = useState("-");
	const [categoria_puesto, setPuesto] = useState("-");

	//Al inicio de carga del componente
    useEffect(() => {
		if (!user_data) {
            navigate("/login");
        } else {
			//Crear bloque si no existe
			user_data.bloques.Educacion_Formal = user_data.bloques.Educacion_Formal? user_data.bloques.Educacion_Formal : {};
			setUserData(user_data);
			
			//Mapear lista de datos a HTML
			mapToHTML(user_data.bloques.Educacion_Formal);
            setLoading(false);
        }
    }, [user_data, setUserData, navigate]); //Espera a que estos existan?

    if (loading) {
        return <center><h1>Loading...</h1></center>;
    }


	const mapToHTML = (bloques) => {
		setEducaciones(Object.keys(bloques).map(plan_id => 
			<ListItemButton key={plan_id} style={listStyle}>
				<ListItemText 
					primary={bloques[plan_id].Programa+' en '+bloques[plan_id].Institucion+''} 
					secondary={bloques[plan_id].Fecha_Inicio+'-'+bloques[plan_id].Fecha_Final+': '+bloques[plan_id].Descripcion.substring(0, 30)}		
				/>
			</ListItemButton>));
	};
	
	const mapDBListToHTML = (lista) => {
		setEducaciones(Object.keys(lista).map(l_id => 
			<ListItemButton key={l_id} style={listStyle}>
				<ListItemText 
					primary={lista[l_id].Nombre} 
					secondary={null}	
				/>
			</ListItemButton>));
	};
	
	//To-Do -> Agregar categorias y diferencias entre crear y editar
	const manejarDatos = (e) => {
        e.preventDefault();
		
		//Crear Bloque Educacion Formal
		manager_bloques.InsertarBloque(user_data, setUserData, "Educacion_Formal", {
			Fecha_Inicio: fecha_inicio,
			Fecha_Final: fecha_final,
			Programa: programa,
			Institucion: institucion,
			Descripcion: descripcion,
			ID_Categoria_Curriculum: categoria_curriculum,
			ID_Categoria_Puesto: categoria_puesto
			});
		
		//Mapear lista de datos a HTML
		mapToHTML(user_data.bloques.Educacion_Formal);
		
		manager_bloques.GuardarCambios(user_data);
	};

    return (
		<>
			<div>
				<h1 style={{color:"white", fontSize:"5rem"}}>Educación Formal</h1>
			</div>
			<div style={{padding: "10px", width: "100%"}}>
			<Grid align="center" container spacing={0} className="wrapper">
				<div>
					<Paper style={paperStyle} sx={paperSX}>
						
							<List style={{padding:"5px"}} dense={dense} style={{maxHeight: "95%", overflow:"auto"}} >{educaciones}</List>
					</Paper>
				</div>
				<div style={{width:"20px"}}></div>
				<div>
					<Grid align="center" className="wrapper" style={{}}>
						<Paper style={paperStyle} sx={paperSX}>
							<Typography component="h1" variant="h5" style={heading}> Añadir Educación Formal </Typography>
							<form onSubmit={manejarDatos}>
								<h4 style={{float:"left"}}>Fecha de inicio:</h4>
								<Input style={row} sx={{label: { fontWeight: '700', fontSize:"1.3rem" }}} fullWidth type="date" label="Fecha de Inicio" variant="outlined" format="LL"  name="fecha_inicio" required onChange={(e)=>{setFechaInicio(e.target.value); e.target.setCustomValidity("");}} onInvalid={e => e.target.setCustomValidity("Seleccionar la fecha de inicio")} />                    
								<h4 style={{float:"left"}}>Fecha de finalización:</h4>
								<Input style={row} sx={{label: { fontWeight: '700', fontSize:"1.3rem" }}} fullWidth type="date" label="Fecha de Finalización" variant="outlined" format="LL" name="fecha_final" required onChange={(e)=>{if(e.target.value > fecha_inicio){setFechaFinal(e.target.value); e.target.setCustomValidity("");} else { e.target.setCustomValidity("X") }}} onInvalid={e => e.target.setCustomValidity("Escoger una fecha final que sea despés de la de inicio")}/>  
								<TextField style={row} sx={{label: { fontWeight: '700', fontSize:"1.3rem" }}} fullWidth type="text" label="Programa" name="nombre" placeholder="Titulo" name="programa" required onChange={(e)=>{setPrograma(e.target.value); e.target.setCustomValidity("");}} onInvalid={e => e.target.setCustomValidity("Llenar el nombre del titulo")}></TextField>
								<TextField style={row} sx={{label: { fontWeight: '700', fontSize:"1.3rem" }}} fullWidth label="Institucion" variant="outlined" placeholder="Institucion" name="institucion" required onChange={(e)=>{setInstitucion(e.target.value); e.target.setCustomValidity("");}} onInvalid={e => e.target.setCustomValidity("Llenar el nombre de la Institución")}/>                    
								<TextField style={row} sx={{label: { fontWeight: '700', fontSize:"1.3rem" }}} fullWidth label="Descripcion" variant="outlined" placeholder="Descripción" name="descripcion" required onChange={(e)=>{setDescripcion(e.target.value); e.target.setCustomValidity("");}}  onInvalid={e => e.target.setCustomValidity("Llenar la descripción")}/>
								<Button style={btnStyle} variant="contained" type="submit">Crear</Button>
							</form>
						</Paper>
					</Grid>
				</div>
			</Grid>
			</div>
		</>
    );
}

export default EducacionFormal;
