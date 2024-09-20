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
  FormControlLabel,
  Switch,
} from "@mui/material";
import { PostAdd, DeleteForever } from "@mui/icons-material";

// Para cargar los datos de usuario, ponerlos como parámetros aquí
// También agregarlos en "App.js" (se pueden agregar otras variables ahí)
function Publicaciones({
  user_data,
  setUserData,
  manager_bloques,
  category_manager,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!user_data?.usuario_id);
  const [publicaciones, setPublicaciones] = useState([]);

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
  const dense = true;

  // Form
  const [publicacion_id, setPublicacionId] = useState(true);
  const [fechaPublicacion, setFechaPublicacion] = useState("");
  const [titulo, setTitulo] = useState("");
  const [publicadora, setPublicadora] = useState("");
  const [abstract, setAbstract] = useState("");

  // Datos adicionales que no están en el formulario
  const ID_Categoria_Puesto = user_data?.ID_Categoria_Puesto || "";
  const ID_Categoria_Curriculum = user_data?.ID_Categoria_Curriculum || "";

  // Cargar el bloque de publicaciones y manejar los datos existentes
  const mapToHTML = (bloques) => {
    if (!bloques) return;

    const sortedBloques = Object.entries(bloques).sort(
      ([, a], [, b]) => new Date(b.Fecha_Publicacion) - new Date(a.Fecha_Publicacion)
    );

    setPublicaciones(
      sortedBloques.map(([publicacion_id, bloque], index) => {
        const publicacion = bloque;
        return (
          <ListItemButton
            key={publicacion_id}
            style={listStyle}
            onClick={(e) => editarDatos(publicacion_id)}
          >
            <ListItemText
              primary={`Título: ${publicacion.Titulo} | Publicadora: ${publicacion.Publicadora}`}
              secondary={
                <>
                  <div>Fecha: {publicacion.Fecha_Publicacion}</div>
                  <div
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "300px", // Ajusta el ancho máximo según sea necesario
                    }}
                  >
                    {publicacion.Abstract}
                  </div>
                </>
              }
            />
            <Button
              style={deleteButton}
              onClick={(e) => eliminarPublicacion(publicacion_id, index)}
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
      user_data.bloques.Publicaciones = user_data.bloques.Publicaciones
        ? user_data.bloques.Publicaciones
        : {};
      setUserData(user_data);

      // Mapear la lista de publicaciones a HTML
      mapToHTML(user_data.bloques.Publicaciones);
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
    setPublicacionId(true);
    setFechaPublicacion("");
    setTitulo("");
    setPublicadora("");
    setAbstract("");
  };

  const editarDatos = (publicacion_id) => {
    const publicacion = user_data.bloques.Publicaciones[publicacion_id];
    if (!publicacion) return;

    setPublicacionId(publicacion_id);
    setFechaPublicacion(publicacion.Fecha_Publicacion);
    setTitulo(publicacion.Titulo);
    setPublicadora(publicacion.Publicadora);
    setAbstract(publicacion.Abstract);
  };

  const manejarDatos = (e) => {
    e.preventDefault();

    const datosPublicacion = {
      Fecha_Publicacion: fechaPublicacion,
      Titulo: titulo,
      Publicadora: publicadora,
      Abstract: abstract,
      ID_Categoria_Puesto: ID_Categoria_Puesto,
      ID_Categoria_Curriculum: ID_Categoria_Curriculum,
    };

    if (publicacion_id !== true) {
      manager_bloques.ActualizarBloque(
        user_data,
        setUserData,
        "Publicaciones",
        publicacion_id,
        datosPublicacion,
      );
    } else {
      // Crear nueva publicación
      const nuevaPublicacion = manager_bloques.InsertarBloque(
        user_data,
        setUserData,
        "Publicaciones",
        datosPublicacion,
      );

      setPublicacionId(nuevaPublicacion);
    }

    // Mapear los datos actualizados a la lista
    mapToHTML(user_data.bloques.Publicaciones);

    manager_bloques.GuardarCambios(user_data);
    reiniciarForm();
  };

  const eliminarPublicacion = (publicacion_id, index) => {
    manager_bloques.BorrarBloque(
      user_data,
      setUserData,
      "Publicaciones",
      publicacion_id,
    );
    delete user_data.bloques.Publicaciones[publicacion_id];
    mapToHTML(user_data.bloques.Publicaciones);

    manager_bloques.GuardarCambios(user_data);
    reiniciarForm();
  };

  return (
    <>
      <div>
        <h1 style={{ color: "white", fontSize: "5rem" }}>Publicaciones</h1>
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
                Publicaciones
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
                  style={{ ...listStyle, backgroundColor: "#4f96" }}
                  onClick={(e) => reiniciarForm()}
                >
                  <PostAdd />
                  <div style={{ width: "20px" }}></div>
                  <ListItemText
                    primary={"Agregar Nueva Publicación"}
                    secondary={"Agregar nueva publicación"}
                  />
                </ListItemButton>
                {publicaciones}
              </List>
            </Paper>
          </div>
          <div style={{ width: "20px" }}></div>
          <div>
            <Grid align="center" className="wrapper">
              <Paper style={paperStyle} sx={paperSX}>
                <Typography component="h3" variant="h3" style={heading}>
                  {publicacion_id === true ? "Añadir" : "Modificar"} Publicación
                </Typography>
                <form onSubmit={manejarDatos}>
                  <TextField
                    style={row}
                    fullWidth
                    id="fechaPublicacion"
                    type="date"
                    label="Fecha Publicación"
                    placeholder="Fecha Publicación"
                    name="fechaPublicacion"
                    required
                    value={fechaPublicacion}
                    onChange={(e) => setFechaPublicacion(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    style={row}
                    fullWidth
                    id="titulo"
                    type="text"
                    label="Título"
                    placeholder="Título"
                    name="titulo"
                    required
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                  />
                  <TextField
                    style={row}
                    fullWidth
                    id="publicadora"
                    type="text"
                    label="Publicadora"
                    placeholder="Publicadora"
                    name="publicadora"
                    required
                    value={publicadora}
                    onChange={(e) => setPublicadora(e.target.value)}
                  />
                  <TextField
                    style={row}
                    fullWidth
                    id="abstract"
                    type="text"
                    label="Resumen"
                    placeholder="Resumen corto"
                    name="abstract"
                    required
                    multiline
                    rows={4}
                    value={abstract}
                    onChange={(e) => setAbstract(e.target.value)}
                  />

                  <Button style={btnStyle} variant="contained" type="submit">
                    {publicacion_id === true ? "Crear" : "Guardar"}
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

export default Publicaciones;