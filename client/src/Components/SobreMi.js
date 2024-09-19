import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Input,
  Grid,
  Button,
  Paper,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  TextareaAutosize,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
//import { TouchableOpacity } from "react-native";
//import Icon from 'react-native-vector-icons/FontAwesome5';

function SobreMi({ user_data, setUserData, manager_bloques }) {
  const [anchor, setAnchor] = React.useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!user_data?.usuario_id);
  const [texto, setTexto] = useState("");
  const [textos, setTextos] = useState([]);
  const [indx, setIndx] = useState(null);

  const listStyle = {
    border: "solid 3px #999999aa",
    borderRadius: "5px",
    marginBottom: "5px",
    height: "5rem",
    overflow: "hidden",
  };
  const dense = true;

  useEffect(() => {
    if (!user_data) {
      navigate("/login");
    } else {
      //Crear bloque si no existe
      user_data.bloques.Informacion_Personal = user_data.bloques
        .Informacion_Personal
        ? user_data.bloques.Informacion_Personal
        : {};
      setUserData(user_data);

      //Mapear lista de datos a HTML
      mapToHTML(user_data.bloques.Informacion_Personal);
      setLoading(false);
    }
  }, [user_data, setUserData, navigate]); //Espera a que estos existan?

  const mapToHTML = (bloques) => {
    setTextos(
      Object.keys(bloques).map((plan_id) => (
        <ListItemButton
          key={plan_id}
          style={listStyle}
          selected={plan_id === indx}
          onClick={() => {
            setIndx(plan_id);
          }}
        >
          <ListItemText
            primary={
              bloques[plan_id].Correo +
              " " +
              bloques[plan_id].Direccion +
              " " +
              bloques[plan_id].Telefono +
              " " +
              bloques[plan_id].Sobre_Mi
            }
          />
        </ListItemButton>
      )),
    );
  };

  const handlePopUpEditar = (e) => {
    if (indx != "") {
      setTexto(user_data.bloques.Informacion_Personal[parseInt(indx)].Sobre_mi);
      setAnchor(anchor ? null : e.currentTarget);
    }
  };

  const handlePopUp = (e) => {
    setAnchor(anchor ? null : e.currentTarget);
  };

  const savePopUpData = (e) => {
    manager_bloques.ActualizarBloque(
      user_data,
      setUserData,
      "Informacion_Personal",
      parseInt(indx),
      {
        Telefono: user_data.bloques["Informacion_Personal"][indx].Telefono,
        Correo: user_data.bloques["Informacion_Personal"][indx].Correo,
        Puesto: user_data.bloques["Informacion_Personal"][indx].Puesto,
        Direccion: user_data.bloques["Informacion_Personal"][indx].Direccion,
        Mostrar_Foto:
          user_data.bloques["Informacion_Personal"][indx].Mostrar_Foto,
        Mostrar_Puesto:
          user_data.bloques["Informacion_Personal"][indx].Mostrar_Puesto,
        ID_Categoria_Puesto:
          user_data.bloques["Informacion_Personal"][indx].ID_Categoria_Puesto,
        Sobre_Mi: texto,
      },
    );

    mapToHTML(user_data.bloques.Informacion_Personal);
    setAnchor(anchor ? null : e.currentTarget);
    manager_bloques.GuardarCambios(user_data);
  };

  const open = Boolean(anchor);
  const id = open ? "simple-popup" : undefined;

  const paperStyle = {
    padding: "2rem",
    margin: "100px auto",
    borderRadius: "1rem",
    boxShadow: "10px 10px 10px",
  };
  const heading = { fontSize: "2.5rem", fontWeight: "600" };
  const row = { display: "flex", marginTop: "2rem" };
  const btnStyle = {
    marginTop: "2rem",
    fontSize: "1.2rem",
    fontWeight: "700",
    backgroundColor: "blue",
    borderRadius: "0.5rem",
  };
  const label = { fontWeight: "700" };
  //const items = user_data.bloques.Informacion_Personal.map(({ID_Bloque, Sobre_Mi}) => ({ID_Bloque, Sobre_Mi}));

  return (
    <div>
      <Grid align="center" className="wrapper">
        <Paper
          style={paperStyle}
          sx={{
            width: {
              xs: "80vw",
              sm: "80vw",
              md: "70vw",
              lg: "60vw",
              xl: "50vw",
            },
            height: { lg: "50vh" },
          }}
        >
          <Typography component="h1" variant="h5" style={heading}>
            Parrafos
          </Typography>
          <List
            dense={dense}
            style={{ padding: "5px", maxHeight: "95%", overflow: "auto" }}
          >
            {textos}
          </List>
          <Button
            aria-describedby={id}
            type="button"
            onClick={handlePopUpEditar}
          >
            Editar parrafo
          </Button>
        </Paper>

        <Dialog
          id={id}
          open={open}
          anchor={anchor}
          PaperProps={{
            sx: {
              width: {
                xs: "80vw",
                sm: "80vw",
                md: "70vw",
                lg: "60vw",
                xl: "50vw",
              },
              height: { lg: "50vh" },
              overflow: "auto",
            },
          }}
        >
          <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
            <TextareaAutosize
              minRows={4}
              placeholder="Type anything…"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />
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
