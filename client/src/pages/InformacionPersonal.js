import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Input,
  Grid,
  Button,
  Paper,
  TextField,
  Typography,
  List,
  ListItemText,
  ListItemButton,
  Switch,
  FormControlLabel,
} from "@mui/material";

import { PostAdd, DeleteForever } from "@mui/icons-material";

// Para cargar los datos de usuario, ponerlos como parámetros aquí
// También agregarlos en "App.js" (se pueden agregar otras variables ahí)
function InformacionPersonal({
  user_data,
  setUserData,
  manager_bloques,
  category_manager,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!user_data?.usuario_id);

  const [informacion, setInformacion] = useState([]);

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
  const fieldTitleStyle = { float: "left" };
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
  const dense = true;

  // Form
  const [bloque_id, setBloqueId] = useState(true);
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [puesto, setPuesto] = useState("");
  const [direccion, setDireccion] = useState("");
  const [mostrarFoto, setMostrarFoto] = useState(false);
  const [mostrarPuesto, setMostrarPuesto] = useState(false);
  //
  const [id_categoria_puesto, setIdCategoriaPuesto] = useState("");
  const [sobre_mi, setSobreMi] = useState("");


  // Cargar el bloque de información personal y manejar los datos existentes
  const mapToHTML = (bloques) => {
    if (!bloques) return;

    setInformacion(
      Object.keys(bloques).map((info_id, index) => {
        const bloque = bloques[info_id];
        return (
          <ListItemButton
            key={info_id}
            style={listStyle}
            onClick={(e) => editarDatos(info_id)}
          >
            <ListItemText
              primary={`Tel: ${bloque.Telefono} | ${bloque.Mostrar_Puesto ? `Puesto: ${bloque.Puesto}` : ""}`}
              secondary={`Dirección: ${bloque.Direccion} | Correo: ${bloque.Correo} | Mostrar Foto: ${bloque.Mostrar_Foto ? "Sí" : "No"}`}
            />
            <Button
              style={deleteButton}
              onClick={(e) => eliminarBloque(info_id, index)}
            >
              <DeleteForever />
            </Button>
          </ListItemButton>
        );
      }),
    );
  };

  // Al cargar el componente
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

      // Mapear la lista de información personal a HTML
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

  const reiniciarForm = () => {
    setBloqueId(true);
    setTelefono("");
    setCorreo("");
    setPuesto("");
    setDireccion("");
    setMostrarFoto(false);
    setMostrarPuesto(false);
  };

  const editarDatos = (info_id) => {
    const bloque = user_data.bloques.Informacion_Personal[info_id];
    if (!bloque) return;

    setBloqueId(info_id);
    setTelefono(bloque.Telefono);
    setCorreo(bloque.Correo);
    setPuesto(bloque.Puesto);
    setDireccion(bloque.Direccion);
    setMostrarFoto(bloque.Mostrar_Foto);
    setMostrarPuesto(bloque.Mostrar_Puesto);
    //
    setIdCategoriaPuesto(bloque.ID_Categoria_Puesto);
    setSobreMi(bloque.Sobre_Mi);
  };

  const manejarDatos = (e) => {
    e.preventDefault();

    const datosBloque = {
      Telefono: telefono,
      Correo: correo,
      Puesto: puesto,
      Direccion: direccion,
      Mostrar_Foto: mostrarFoto,
      Mostrar_Puesto: mostrarPuesto,
      ID_Categoria_Puesto: id_categoria_puesto,
      Sobre_Mi: sobre_mi,
    };

    if (bloque_id !== true) {
      manager_bloques.ActualizarBloque(
        user_data,
        setUserData,
        "Informacion_Personal",
        bloque_id,
        datosBloque,
      );
    } else {
      // Crear nuevo bloque
      const bloque = manager_bloques.InsertarBloque(
        user_data,
        setUserData,
        "Informacion_Personal",
        datosBloque,
      );

      setBloqueId(bloque);
    }

    // Mapear los datos actualizados a la lista
    mapToHTML(user_data.bloques.Informacion_Personal);

    manager_bloques.GuardarCambios(user_data);
  };

  const eliminarBloque = (info_id, index) => {
    manager_bloques.BorrarBloque(
      user_data,
      setUserData,
      "Informacion_Personal",
      info_id,
    );
    delete user_data.bloques.Informacion_Personal[info_id];
    mapToHTML(user_data.bloques.Informacion_Personal);

    manager_bloques.GuardarCambios(user_data);
    reiniciarForm();
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
              <Typography component="h3" variant="h3" style={heading}>
                Informacion Personal
              </Typography>
              <List
                dense={dense}
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
                    primary={"Agregar Nueva Información"}
                    secondary={"Agregar nueva información personal"}
                  />
                </ListItemButton>
                {informacion}
              </List>
            </Paper>
          </div>
          <div style={{ width: "20px" }}></div>
          <div>
            <Grid align="center" className="wrapper">
              <Paper style={paperStyle} sx={paperSX}>
                <Typography component="h3" variant="h3" style={heading}>
                  {bloque_id === true ? "Añadir" : "Modificar"} Información
                  Personal
                </Typography>
                <form onSubmit={manejarDatos}>
                  <TextField
                    style={row}
                    fullWidth
                    id="telefono"
                    type="tel"
                    label="Teléfono"
                    placeholder="Teléfono"
                    name="telefono"
                    required
                    value={telefono}
                    onChange={(e) => {
                      const regex = /^[0-9\b]+$/;
                      if (e.target.value === "" || regex.test(e.target.value)) {
                        setTelefono(e.target.value);
                      }
                    }}
                    onInvalid={(e) =>
                      e.target.setCustomValidity(
                        "Introduce un número de teléfono válido",
                      )
                    }
                  />
                  <TextField
                    style={row}
                    fullWidth
                    id="correo"
                    type="email"
                    label="Correo"
                    placeholder="Correo"
                    name="correo"
                    required
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                  />

                  <TextField
                    style={row}
                    fullWidth
                    id="puesto"
                    type="text"
                    label="Puesto"
                    placeholder="Puesto"
                    name="puesto"
                    required
                    value={puesto}
                    onChange={(e) => setPuesto(e.target.value)}
                  />
                  <TextField
                    style={row}
                    fullWidth
                    id="direccion"
                    type="text"
                    label="Dirección"
                    placeholder="Dirección"
                    name="direccion"
                    required
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={mostrarFoto}
                        onChange={(e) => setMostrarFoto(e.target.checked)}
                      />
                    }
                    label="Mostrar Foto"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={mostrarPuesto}
                        onChange={(e) => setMostrarPuesto(e.target.checked)}
                      />
                    }
                    label="Mostrar Puesto"
                  />
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

export default InformacionPersonal;
