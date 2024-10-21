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

//style
import {
  paperStylem, 
  paperSX, 
  heading, row, 
  btnStyle, 
  listStyle, 
  deleteButton, 
  dense,
  deleteForeverStyle
} from "../style";

// Para cargar los datos de usuario, ponerlos como parámetros aquí
// También agregarlos en "App.js" (se pueden agregar otras variables ahí)
function Conferencias({
  user_data,
  setUserData,
  manager_bloques,
  category_manager,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!user_data?.usuario_id);
  const [conferencias, setConferencias] = useState([]);



  // Form
  const [conferencia_id, setConferenciaId] = useState(true);
  const [fechaConferencia, setFechaConferencia] = useState("");
  const [titulo, setTitulo] = useState("");
  const [lugar, setLugar] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // Datos adicionales que no están en el formulario
  const ID_Categoria_Puesto = user_data?.ID_Categoria_Puesto || "";
  const ID_Categoria_Curriculum = user_data?.ID_Categoria_Curriculum || "";

  // Cargar el bloque de publicaciones y manejar los datos existentes
  const mapToHTML = (bloques) => {
    if (!bloques) return;

    const sortedBloques = Object.entries(bloques).sort(
      ([, a], [, b]) =>
        new Date(b.Fecha_Conferencia) - new Date(a.Fecha_Conferencia),
    );

    setConferencias(
      sortedBloques.map(([conferencia_id, bloque], index) => {
        const conferencia = bloque;
        return (
          <ListItemButton
            key={conferencia_id}
            style={listStyle}
            onClick={(e) => editarDatos(conferencia_id)}
          >
            <ListItemText
              primary={`Título: ${conferencia.Titulo} | Lugar: ${conferencia.Lugar}`}
              secondary={
                <>
                  <div>Fecha: {conferencia.Fecha_Conferencia}</div>
                  <div
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "300px", // Ajusta el ancho máximo según sea necesario
                    }}
                  >
                    {conferencia.Descripcion}
                  </div>
                </>
              }
            />
            <Button
              style={deleteButton}
              onClick={(e) => eliminarConferencia(conferencia_id, index)}
            >
              <DeleteForever style = {deleteForeverStyle} />
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
      user_data.bloques.Conferencias = user_data.bloques.Conferencias
        ? user_data.bloques.Conferencias
        : {};
      setUserData(user_data);

      // Mapear la lista de publicaciones a HTML
      mapToHTML(user_data.bloques.Conferencias);
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
    setConferenciaId(true);
    setFechaConferencia("");
    setTitulo("");
    setLugar("");
    setDescripcion("");
  };

  const editarDatos = (conferencia_id) => {
    const conferencia = user_data.bloques.Conferencias[conferencia_id];
    if (!conferencia) return;

    setConferenciaId(conferencia_id);
    setFechaConferencia(conferencia.Fecha_Conferencia);
    setTitulo(conferencia.Titulo);
    setLugar(conferencia.Lugar);
    setDescripcion(conferencia.Descripcion);
  };

  const manejarDatos = (e) => {
    e.preventDefault();

    const datosConferencia = {
      Fecha_Conferencia: fechaConferencia,
      Titulo: titulo,
      Lugar: lugar,
      Descripcion: descripcion,
      ID_Categoria_Puesto: ID_Categoria_Puesto,
      ID_Categoria_Curriculum: ID_Categoria_Curriculum,
    };

    if (conferencia_id !== true) {
      manager_bloques.ActualizarBloque(
        user_data,
        setUserData,
        "Conferencias",
        conferencia_id,
        datosConferencia,
      );
    } else {
      // Crear nueva publicacion
      const nuevaConferencia = manager_bloques.InsertarBloque(
        user_data,
        setUserData,
        "Conferencias",
        datosConferencia,
      );

      setConferenciaId(nuevaConferencia);
    }

    // Mapear los datos actualizados a la lista
    mapToHTML(user_data.bloques.Conferencias);

    manager_bloques.GuardarCambios(user_data);
    reiniciarForm();
  };

  const eliminarConferencia = (conferencia_id, index) => {
    manager_bloques.BorrarBloque(
      user_data,
      setUserData,
      "Conferencias",
      conferencia_id,
    );
    delete user_data.bloques.Conferencias[conferencia_id];
    mapToHTML(user_data.bloques.Conferencias);

    manager_bloques.GuardarCambios(user_data);
    reiniciarForm();
  };

  return (
    <>
      <div>
        <h1 style={{ color: "white", fontSize: "5rem" }}>Conferencias</h1>
      </div>
      <div style={{ padding: "10px", width: "100%" }}>
        <Grid align="center" container spacing={0} className="wrapper">
          <div>
            <Paper style={paperStylem} sx={paperSX}>
              <Typography component="h3" variant="h3" style={heading}>
              Conferencias
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
                    primary={"Agregar Nueva conferencia"}
                    secondary={"Agregar nueva conferencia"}
                  />
                </ListItemButton>
                {conferencias}
              </List>
            </Paper>
          </div>
          <div style={{ width: "20px" }}></div>
          <div>
            <Grid align="center" className="wrapper">
              <Paper style={paperStylem} sx={paperSX}>
                <Typography component="h3" variant="h3" style={heading}>
                  {conferencia_id === true ? "Añadir" : "Modificar"} Conferencia
                </Typography>
                <form onSubmit={manejarDatos}>
                  <TextField
                    style={row}
                    fullWidth
                    id="fechaConferencia"
                    type="date"
                    label="Fecha de la Conferencia"
                    placeholder="Fecha Conferencia"
                    name="fechaConferencia"
                    required
                    value={fechaConferencia}
                    onChange={(e) => setFechaConferencia(e.target.value)}
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
                    id="lugar"
                    type="text"
                    label="Lugar"
                    placeholder="Lugar de la conferencia"
                    name="lugar"
                    required
                    value={lugar}
                    onChange={(e) => setLugar(e.target.value)}
                  />
                  <TextField
                    style={row}
                    fullWidth
                    id="descripcion"
                    type="text"
                    label="Descripcion"
                    placeholder="Descripción breve de su participación"
                    name="descripcion"
                    required
                    multiline
                    rows={4}
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                  />

                  <Button style={btnStyle} variant="contained" type="submit">
                    {conferencia_id === true ? "Crear" : "Guardar"}
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

export default Conferencias;