import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Input,
  Grid,
  Button,
  Paper,
  Typography,
  List,
  ListItemText,
  ListItemButton,
  TextField,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { PostAdd, DeleteForever } from "@mui/icons-material";

function Lenguajes({ user_data, setUserData, manager_bloques }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!user_data?.usuario_id);
  const [lenguajes, setLenguajes] = useState([]);
  const lenguajes_temp = [
    { id: 1, nombre: "Español" },
    { id: 2, nombre: "Inglés" },
    { id: 3, nombre: "Francés" },
  ];
  const niveles = [
    { id: 1, nombre: "Bajo" },
    { id: 2, nombre: "Medio" },
    { id: 3, nombre: "Alto" },
  ];
  // Estilos
  const paperStyle = {
    padding: "2rem",
    margin: "10px auto",
    borderRadius: "1rem",
    boxShadow: "10px 10px 10px",
    minHeight: "800px",
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
    marginTop: "1rem",
    fontSize: "1.2rem",
    fontWeight: "700",
    backgroundColor: "blue",
    borderRadius: "0.5rem",
  };
  const listStyle = {
    border: "solid 3px #999999aa",
    borderRadius: "5px",
    marginBottom: "5px",
    height: "5rem",
    overflow: "hidden",
    backgroundColor: "#fff",
  };
  const deleteButton = {
    backgroundColor: "#f55",
    border: "0px",
    borderRadius: "5px",
    float: "right",
    cursor: "pointer",
    color: "#000",
  };

  // Formulario
  const [bloque_id, setBloqueId] = useState(true);
  const [lenguaje, setLenguaje] = useState("");
  const [nivel, setNivel] = useState("");
  const [certificacion, setCertificacion] = useState("");
  //

  // Cargar habilidades y mapeo a HTML
  const mapToHTML = (bloques) => {
    if (!bloques) return;

    setLenguajes(
      Object.keys(bloques).map((lenguaje_id, index) => {
        const bloque = bloques[lenguaje_id];
        const bnivel = bloque.Nivel;

        return (
          <ListItemButton
            key={lenguaje_id}
            style={listStyle}
            onClick={() => editarDatos(lenguaje_id)}
          >
            <ListItemText
              primary={`Nombre: ${lenguajes_temp.find((obj) => obj.id == bloque.Id).nombre} | Certificación: ${bloque.Certificacion}`}
              secondary={`Nivel ${niveles.find((obj) => obj.id == bloque.Nivel).nombre}`}
            />
            <Button
              style={deleteButton}
              onClick={(e) => eliminarLenguaje(lenguaje_id, index)}
            >
              <DeleteForever />
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
      user_data.bloques.Idiomas = user_data.bloques.Idiomas
        ? user_data.bloques.Idiomas
        : {};
      setUserData(user_data);

      // Mapear la lista de habilidades a HTML
      mapToHTML(user_data.bloques.Idiomas);
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

  const reiniciarForm = () => {
    setBloqueId(true);
    setLenguaje("");
    setNivel("");
    setCertificacion("");
  };

  const editarDatos = (lenguaje_id) => {
    const bloque = user_data.bloques.Idiomas[lenguaje_id];
    if (!bloque) return;

    setBloqueId(lenguaje_id);
    setLenguaje(bloque.Id);
    setNivel(bloque.Nivel);
    setCertificacion(bloque.Certificacion);
  };

  const manejarDatos = (e) => {
    e.preventDefault();

    const datosBloque = {
      Id: lenguaje,
      Nivel: nivel,
      Certificacion: certificacion,
    };

    if (bloque_id !== true) {
      manager_bloques.ActualizarBloque(
        user_data,
        setUserData,
        "Idiomas",
        bloque_id,
        datosBloque,
      );
    } else {
      // Crear nuevo bloque
      const bloque = manager_bloques.InsertarBloque(
        user_data,
        setUserData,
        "Idiomas",
        datosBloque,
      );

      setBloqueId(bloque);
    }

    mapToHTML(user_data.bloques.Idiomas);
    manager_bloques.GuardarCambios(user_data);
    reiniciarForm();
  };

  const eliminarLenguaje = (lenguaje_id, index) => {
    manager_bloques.BorrarBloque(
      user_data,
      setUserData,
      "Idiomas",
      lenguaje_id,
    );
    delete user_data.bloques.Idiomas[lenguaje_id];
    mapToHTML(user_data.bloques.Idiomas);

    manager_bloques.GuardarCambios(user_data);
    reiniciarForm();
  };

  return (
    <>
      <div>
        <h1 style={{ color: "white", fontSize: "5rem" }}>Idiomas</h1>
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
              <Typography component="h3" variant="h3" style={heading}>
                Idiomas conocidos
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
                  <ListItemText primary={"Agregar Nuevo Idioma"} />
                </ListItemButton>
                {lenguajes}
              </List>
            </Paper>
          </div>
          <div style={{ width: "20px" }}></div>
          <div>
            <Grid align="center" className="wrapper">
              <Paper style={paperStyle} sx={paperSX}>
                <Typography component="h3" variant="h3" style={heading}>
                  {bloque_id === true ? "Añadir" : "Modificar"} Lenguaje
                </Typography>
                <form onSubmit={manejarDatos}>
                  <InputLabel id="lenguajesSelect">Lenguaje</InputLabel>
                  <Select
                    style={{ width: "60%" }}
                    variant="outlined"
                    labelId="lenguajesSelect"
                    label={"Lenguaje"}
                    value={lenguaje}
                    onChange={(e) => {
                      setLenguaje(e.target.value);
                    }}
                  >
                    {lenguajes_temp.map((option) => {
                      return (
                        <MenuItem key={option.id} value={option.id}>
                          {option.nombre}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <div>
                    <InputLabel id="nivelesSelect">Nivel</InputLabel>
                    <Select
                      style={{ width: "60%" }}
                      variant="outlined"
                      labelId="nivelesSelect"
                      label={"Nivel"}
                      value={nivel}
                      onChange={(e) => {
                        setNivel(e.target.value);
                      }}
                    >
                      <option value="Seleccione un nivel">
                        {" "}
                        -- Seleccione un nivel --{" "}
                      </option>
                      {niveles.map((option) => {
                        return (
                          <MenuItem key={option.id} value={option.id}>
                            {option.nombre}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </div>
                  <TextField
                    style={row}
                    fullWidth
                    id="certificacion"
                    type="text"
                    label="Certificación"
                    placeholder="Certificación"
                    name="certificacion"
                    required
                    value={certificacion}
                    onChange={(e) => setCertificacion(e.target.value)}
                  />
                  <div>
                    <Button style={btnStyle} variant="contained" type="submit">
                      {bloque_id === true ? "Crear" : "Guardar"}
                    </Button>
                  </div>
                </form>
              </Paper>
            </Grid>
          </div>
        </Grid>
      </div>
    </>
  );
}

export default Lenguajes;
