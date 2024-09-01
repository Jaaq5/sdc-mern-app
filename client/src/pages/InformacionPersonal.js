import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  Input,
  Grid,
  Button,
  Paper,
  TextField,
  Typography,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";

function InformacionPersonal({ user_data, setUserData, manager_bloques }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!user_data?.usuario_id);

  const [informacion, setInformacion] = useState([]);

  // Style
  const paperStyle = {
    padding: "2rem",
    margin: "10px auto",
    borderRadius: "1rem",
    boxShadow: "10px 10px 10px",
  };
  const paperSX = {
    width: {
      xs: "80vw", // 0
      sm: "50vw", // 600
      md: "40vw", // 900
      lg: "30vw", // 1200
      xl: "20vw", // 1536
    },
    height: {
      lg: "60vh", // 1200px and up
    },
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
  const fieldTitleStyle = { float: "left" };
  const listStyle = {
    border: "solid 3px #999999aa",
    borderRadius: "5px",
    marginBottom: "5px",
    height: "5rem",
    overflow: "hidden",
  };
  const listButtonStyle = {
    border: "solid 1px #999999aa",
    height: "3rem",
    overflow: "hidden",
  };
  const dense = true;

  // Form
  const [telefono, setTelefono] = useState("-");
  const [correo, setCorreo] = useState("-");
  const [puesto, setPuesto] = useState("-");
  const [direccion, setDireccion] = useState("-");
  const [mostrarFoto, setMostrarFoto] = useState(false);
  const [mostrarPuesto, setMostrarPuesto] = useState(false);

  // Al inicio de carga del componente
  useEffect(() => {
    if (!user_data) {
      navigate("/login");
    } else {
      // Crear bloque si no existe
      user_data.bloques.Informacion_Personal = user_data.bloques
        .Informacion_Personal
        ? user_data.bloques.Informacion_Personal
        : {};
      setUserData(user_data);

      // Mapear lista de datos a HTML
      mapToHTML(user_data.bloques.Informacion_Personal);
      setLoading(false);
    }
  }, [user_data, setUserData, navigate]);

  if (loading) {
    return (
      <center>
        <h1>Loading...</h1>
      </center>
    );
  }

  const mapToHTML = (bloques) => {
    setInformacion(
      Object.keys(bloques).map((info_id) => (
        <ListItemButton key={info_id} style={listStyle}>
          <ListItemText
            primary={`Teléfono: ${bloques[info_id].Telefono || "-"}`}
            secondary={
              `Correo: ${bloques[info_id].Correo || "-"}\n` +
              `Puesto: ${bloques[info_id].Puesto || "-"}\n` +
              `Dirección: ${bloques[info_id].Direccion || "-"}\n` +
              `Mostrar Foto: ${bloques[info_id].Mostrar_Foto ? "Sí" : "No"}\n` +
              `Mostrar Puesto: ${bloques[info_id].Mostrar_Puesto ? "Sí" : "No"}`
            }
          />
        </ListItemButton>
      )),
    );
  };

  const manejarDatos = (e) => {
    e.preventDefault();

    // Crear Bloque Información Personal
    manager_bloques.InsertarBloque(
      user_data,
      setUserData,
      "Informacion_Personal",
      {
        Telefono: telefono,
        Correo: correo,
        Puesto: puesto,
        Direccion: direccion,
        Mostrar_Foto: mostrarFoto,
        Mostrar_Puesto: mostrarPuesto,
        ID_Categoria_Puesto: user_data?.ID_Categoria_Puesto || "-",
        Sobre_mi: user_data?.Sobre_mi || "-",
      },
    );

    // Mostrar información en consola
    console.log(
      "Esto es lo que se guardará en el bloque Informacion Personal:",
      user_data.bloques.Informacion_Personal,
    );

    // Mapear lista de datos a HTML
    mapToHTML(user_data.bloques.Informacion_Personal);

    manager_bloques.GuardarCambios(user_data);
  };

  return (
    <>
      <div>
        <h1 style={{ color: "white", fontSize: "5rem" }}>
          Información Personal
        </h1>
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <Button
            variant="contained"
            style={{ ...btnStyle, backgroundColor: "green" }}
            color="success"
            component={Link}
            to="/home"
          >
            Volver a Inicio
          </Button>
        </div>
      </div>
      <div style={{ padding: "10px", width: "100%" }}>
        <Grid align="center" container spacing={0} className="wrapper">
          <div>
            <Paper style={paperStyle} sx={paperSX}>
              <List
                dense={dense}
                style={{ padding: "5px", maxHeight: "95%", overflow: "auto" }}
              >
                {informacion}
              </List>
            </Paper>
          </div>
          <div style={{ width: "20px" }}></div>
          <div>
            <Grid align="center" className="wrapper">
              <Paper style={paperStyle} sx={paperSX}>
                <Typography component="h1" variant="h5" style={heading}>
                  Añadir Información Personal
                </Typography>
                <form onSubmit={manejarDatos}>
                  <h4 style={fieldTitleStyle}>Teléfono:</h4>
                  <TextField
                    style={row}
                    sx={{ label: { fontWeight: "700", fontSize: "1.3rem" } }}
                    fullWidth
                    type="number"
                    label="Teléfono"
                    placeholder="Número de Teléfono"
                    name="telefono"
                    required
                    onChange={(e) => {
                      setTelefono(e.target.value);
                      e.target.setCustomValidity("");
                    }}
                    onInvalid={(e) =>
                      e.target.setCustomValidity("Llenar el número de teléfono")
                    }
                  />
                  <h4 style={fieldTitleStyle}>Correo:</h4>
                  <TextField
                    style={row}
                    sx={{ label: { fontWeight: "700", fontSize: "1.3rem" } }}
                    fullWidth
                    type="email"
                    label="Correo"
                    placeholder="Correo Electrónico"
                    name="correo"
                    required
                    onChange={(e) => {
                      setCorreo(e.target.value);
                      e.target.setCustomValidity("");
                    }}
                    onInvalid={(e) =>
                      e.target.setCustomValidity("Llenar el correo electrónico")
                    }
                  />
                  <h4 style={fieldTitleStyle}>Puesto:</h4>
                  <TextField
                    style={row}
                    sx={{ label: { fontWeight: "700", fontSize: "1.3rem" } }}
                    fullWidth
                    type="text"
                    label="Puesto"
                    placeholder="Título del Puesto"
                    name="puesto"
                    required
                    onChange={(e) => {
                      setPuesto(e.target.value);
                      e.target.setCustomValidity("");
                    }}
                    onInvalid={(e) =>
                      e.target.setCustomValidity("Llenar el nombre del puesto")
                    }
                  />
                  <h4 style={fieldTitleStyle}>Dirección:</h4>
                  <TextField
                    style={row}
                    sx={{ label: { fontWeight: "700", fontSize: "1.3rem" } }}
                    fullWidth
                    type="text"
                    label="Dirección"
                    placeholder="Dirección Completa"
                    name="direccion"
                    required
                    onChange={(e) => {
                      setDireccion(e.target.value);
                      e.target.setCustomValidity("");
                    }}
                    onInvalid={(e) =>
                      e.target.setCustomValidity("Llenar la dirección")
                    }
                  />
                  <h4 style={fieldTitleStyle}>Mostrar Foto:</h4>
                  <Input
                    style={row}
                    type="checkbox"
                    checked={mostrarFoto}
                    onChange={(e) => setMostrarFoto(e.target.checked)}
                    inputProps={{
                      style: {
                        cursor: "pointer",
                        marginRight: "10px",
                      },
                    }}
                  />
                  <h4 style={fieldTitleStyle}>Mostrar Puesto:</h4>
                  <Input
                    style={row}
                    type="checkbox"
                    checked={mostrarPuesto}
                    onChange={(e) => setMostrarPuesto(e.target.checked)}
                    inputProps={{
                      style: {
                        cursor: "pointer",
                        marginRight: "10px",
                      },
                    }}
                  />
                  <Button style={btnStyle} variant="contained" type="submit">
                    Crear
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

export default InformacionPersonal;
