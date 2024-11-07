import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Grid,
  Button,
  Paper,
  TextField,
  Typography,
  List,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { PostAdd, DeleteForever } from "@mui/icons-material";
import { apiUrl } from "../consts";
import axios from "axios";

//style
import {
  paperStylem,
  paperSX,
  heading,
  row,
  btnStyle,
  listStyle,
  deleteButton,
  deleteForeverStyle,
} from "../style";

function Premios({ user_data, setUserData, manager_bloques, mostrarTitulo }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!user_data?.usuario_id);
  const [premios, setPremios] = useState([]);

  // Formulario
  const [bloque_id, setBloqueId] = useState(true);
  const [nombrePremio, setNombrePremio] = useState("");
  const [institucion, setInstitucion] = useState("");
  const [fechaPremio, setFechaPremio] = useState("");

  // Datos adicionales que no están en el formulario
  const ID_Categoria_Puesto = user_data?.ID_Categoria_Puesto || "";
  const ID_Categoria_Curriculum = user_data?.ID_Categoria_Curriculum || "";

  // Cargar premios y mapeo a HTML
  const mapToHTML = (bloques) => {
    if (!bloques) return;

    setPremios(
      Object.keys(bloques).map((premio_id) => {
        const bloque = bloques[premio_id];

        return (
          <ListItemButton
            key={premio_id}
            style={listStyle}
            onClick={() => editarDatos(premio_id)}
          >
            <ListItemText
              primary={`Premio: ${bloque.Nombre}`}
              secondary={`Institución: ${bloque.Institucion} - Fecha: ${bloque.Fecha}`}
            />
            <Button
              style={deleteButton}
              onClick={(e) => eliminarPremio(premio_id)}
            >
              <DeleteForever style={deleteForeverStyle} />
            </Button>
          </ListItemButton>
        );
      }),
    );
  };

  useEffect(() => {
    if (!user_data) {
      navigate("/login");
    } else {
      // Crear bloque si no existe
      user_data.bloques.Premios = user_data.bloques.Premios
        ? user_data.bloques.Premios
        : {};
      setUserData(user_data);

      // Mapear la lista de premios a HTML
      mapToHTML(user_data.bloques.Premios);
      setLoading(false);
	  //valor default
	  mostrarTitulo = mostrarTitulo !== false;
    }
  }, [user_data, setUserData, navigate]);

  if (loading) {
    return (
      <center>
        <h1>Loading...</h1>
      </center>
    );
  }

  const reiniciarForm = () => {
    setBloqueId(true);
    setNombrePremio("");
    setInstitucion("");
    setFechaPremio("");
  };

  const editarDatos = (premio_id) => {
    const bloque = user_data.bloques.Premios[premio_id];
    if (!bloque) return;

    setBloqueId(premio_id);
    setNombrePremio(bloque.Nombre);
    setInstitucion(bloque.Institucion);
    setFechaPremio(bloque.Fecha);
  };

  const manejarDatos = (e) => {
    e.preventDefault();

    const datosBloque = {
      Nombre: nombrePremio,
      Institucion: institucion,
      Fecha: fechaPremio,
      ID_Categoria_Puesto: ID_Categoria_Puesto,
      ID_Categoria_Curriculum: ID_Categoria_Curriculum,
    };

    if (bloque_id !== true) {
      manager_bloques.ActualizarBloque(
        user_data,
        setUserData,
        "Premios",
        bloque_id,
        datosBloque,
      );
    } else {
      // Crear nuevo bloque
      const bloque = manager_bloques.InsertarBloque(
        user_data,
        setUserData,
        "Premios",
        datosBloque,
      );

      setBloqueId(bloque);
    }

    mapToHTML(user_data.bloques.Premios);
    manager_bloques.GuardarCambios(user_data);
    reiniciarForm();
  };

  const eliminarPremio = (premio_id) => {
    manager_bloques.BorrarBloque(user_data, setUserData, "Premios", premio_id);
    delete user_data.bloques.Premios[premio_id];
    mapToHTML(user_data.bloques.Premios);

    manager_bloques.GuardarCambios(user_data);
    reiniciarForm();
  };

  return (
    <>
      {mostrarTitulo !== false? (<div>
        <h1 style={{ color: "white", fontSize: "5rem" }}>Premios y Reconocimientos</h1>
      </div>)
	  :
	  (<></>)
	}
      <div style={{ padding: "10px", width: "100%" }}>
        <Grid align="center" container spacing={0} className="wrapper">
          <div>
            <Paper style={paperStylem} sx={paperSX}>
              <Typography component="h3" variant="h3" style={heading}>
                Premios
              </Typography>
              <List
                dense
                style={{
                  padding: "5px",
                  maxHeight: "95%",
                  overflow: "auto",
                  backgroundColor: "#ccd5",
                }}
              >
                <ListItemButton
                  key={true}
                  style={(listStyle, { backgroundColor: "#4f96" })}
                  onClick={(e) => reiniciarForm()}
                >
                  <PostAdd />
                  <div style={{ width: "20px" }}></div>
                  <ListItemText
                    primary={"Agregar nuevo premio"}
                    secondary={"Agregar un nuevo premio o reconocimiento"}
                  />
                </ListItemButton>
                {premios}
              </List>
            </Paper>
          </div>
          <div style={{ width: "20px" }}></div>
          <div>
            <Grid align="center" className="wrapper">
              <Paper style={paperStylem} sx={paperSX}>
                <Typography component="h3" variant="h3" style={heading}>
                  {bloque_id === true ? "Añadir" : "Modificar"} Premio
                </Typography>
                <form onSubmit={manejarDatos}>
                  <TextField
                    style={row}
                    fullWidth
                    id="nombrePremio"
                    type="text"
                    label="Nombre del premio"
                    placeholder="Nombre del premio"
                    name="nombrePremio"
                    inputProps={{ maxLength: 40 }}
                    required
                    value={nombrePremio}
                    onChange={(e) => setNombrePremio(e.target.value)}
                  />
                  <TextField
                    style={row}
                    fullWidth
                    id="institucion"
                    type="text"
                    label="Institución"
                    placeholder="Institución que otorgó el premio"
                    name="institucion"
                    inputProps={{ maxLength: 100 }}
                    required
                    value={institucion}
                    onChange={(e) => setInstitucion(e.target.value)}
                  />
                  <TextField
                    style={row}
                    fullWidth
                    id="fechaPremio"
                    type="date"
                    label="Fecha"
                    placeholder="Fecha de recibimiento del premio"
                    name="fechaPremio"
                    required
                    InputLabelProps={{ shrink: true }}
                    value={fechaPremio}
                    onChange={(e) => setFechaPremio(e.target.value)}
                  />
                  <br />
                  <Button style={btnStyle} variant="contained" type="submit">
                    {bloque_id === true ? "Crear" : "Guardar"}
                  </Button>
                </form>
              </Paper>
            </Grid>
          </div>
        </Grid>
      </div>
    </>
  );
}

export default Premios;
