import React, { useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input, Grid, Button, Paper, TextField, Typography, List, ListItem, ListItemText, ListItemButton, TextareaAutosize, Dialog, DialogActions, DialogContent } from "@mui/material";
//import { TouchableOpacity } from "react-native";
//import Icon from 'react-native-vector-icons/FontAwesome5';

function SobreMi({user_data, setUserData, manager_bloques}) {
    const [anchor, setAnchor] = React.useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(!user_data?.usuario_id);
    const [texto, setTexto] = useState("");
    const [textos, setTextos] = useState([]);


    const listStyle = {border:"solid 3px #999999aa", borderRadius: "5px", marginBottom:"5px", height:"5rem", overflow: "hidden"};
    const dense = true;

    useEffect(() => {
		if (!user_data) {
            navigate("/login");
        } else {
			//Crear bloque si no existe
			user_data.bloques.Informacion_Personal = user_data.bloques.Informacion_Personal? user_data.bloques.Informacion_Personal : {};
			setUserData(user_data);
			
			//Mapear lista de datos a HTML
			mapToHTML(user_data.bloques.Informacion_Personal);
            setLoading(false);
        }
    }, [user_data, setUserData, navigate]); //Espera a que estos existan?


    const mapToHTML = (bloques) => {
		setTextos(Object.keys(bloques).map(plan_id => 
			<ListItemButton key={plan_id} style={listStyle} onClick={handlePopUp}>
				<ListItemText 
					primary={bloques[plan_id].Sobre_Mi} 	
				/>
			</ListItemButton>));
	};

    const handlePopUp = (e) => {
        setAnchor(anchor ? null : e.currentTarget);
    }

    const savePopUpData = (e) => {
        //setAnchor(anchor ? null : e.currentTarget);
        console.log(texto);
    }

    const open = Boolean(anchor);
    const id = open ? 'simple-popup' : undefined;

    const ActualizarSobreMi = (e) => {
        e.preventDefault();

    };



    const paperStyle = { padding: "2rem", margin: "100px auto", borderRadius: "1rem", boxShadow: "10px 10px 10px" };
    const heading = { fontSize: "2.5rem", fontWeight: "600" };
    const row = { display: "flex", marginTop: "2rem" };
    const btnStyle={marginTop:"2rem", fontSize:"1.2rem", fontWeight:"700", backgroundColor:"blue", borderRadius:"0.5rem"};
    const label = { fontWeight: "700" };
    //const items = user_data.bloques.Informacion_Personal.map(({ID_Bloque, Sobre_Mi}) => ({ID_Bloque, Sobre_Mi}));



    return (
        <div>
        <Grid align="center" className="wrapper">
            <Paper style={paperStyle} sx={{ width: { xs: '80vw', sm: '80vw', md: '70vw', lg: '60vw', xl: '50vw' }, height: { lg: '50vh' } }}>
                <Typography component="h1" variant="h5" style={heading}>Parrafos</Typography>
                <List dense={dense} style={{padding:"5px", maxHeight: "95%", overflow:"auto"}} >{textos}</List>
                <Button aria-describedby={id} type="button" onClick={handlePopUp}>
                    Crear parrafo
                </Button>
            </Paper>

            <Dialog id={id} open={open} anchor={anchor} PaperProps={{sx:{ width: { xs: '80vw', sm: '80vw', md: '70vw', lg: '60vw', xl: '50vw' }, height: { lg: '50vh' }, overflow:'auto' }}}>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
                    <TextareaAutosize minRows={4} placeholder="Type anything…" onChange={e => {setTexto(e.target.value)}}/>
                </DialogContent>
                <DialogActions>
                    <Button aria-describedby={id} type="button" onClick={savePopUpData}>
                        Aceptar
                    </Button>
                    <Button aria-describedby={id} type="button" onClick={handlePopUp}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    </div>
    );
}

export default SobreMi;