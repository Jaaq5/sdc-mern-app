import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  //Input,
  Grid,
  Button,
  Paper,
  TextField,
  Typography,
  List,
  ListItemText,
  ListItemButton,
  //Switch,
  //FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { PostAdd, DeleteForever } from "@mui/icons-material";
import { apiUrl } from "../consts";
import axios from "axios";

function Habilidades({ user_data, setUserData, manager_bloques }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!user_data?.usuario_id);
  const [habilidades, setHabilidades] = useState([]);

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
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoriasHabilidad, setCategoriasHabilidad] = useState([]);
  //
  const [id_categoria_curriculum, setIdCategoriaCurriculum] = useState("");
  const [id_categoria_puesto, setIdCategoriaPuesto] = useState("");
  const [id_categoria_habilidad, setIdCategoriaHabilidad] = useState("");

  // Cargar habilidades y mapeo a HTML
  const mapToHTML = (bloques) => {
    if (!bloques) return;

    setHabilidades(
      Object.keys(bloques).map((habilidad_id) => {
        const bloque = bloques[habilidad_id];
        const descripcionCorta =
          bloque.Descripcion.length > 10
            ? `${bloque.Descripcion.substring(0, 10)}...`
            : bloque.Descripcion;

        const tipoHabilidad =
          categoriasHabilidad.find(
            (categoria) => categoria._id === bloque.ID_Categoria_Habilidad,
          )?.Nombre || "Desconocido";

        return (
          <ListItemButton
            key={habilidad_id}
            style={listStyle}
            onClick={() => editarDatos(habilidad_id)}
          >
            <ListItemText
              primary={`Nombre: ${bloque.Nombre}`}
              secondary={`Descripción: ${descripcionCorta} - Tipo: ${tipoHabilidad}`}
            />
            <Button
              style={deleteButton}
              onClick={(e) => eliminarHabilidad(habilidad_id)}
            >
              <DeleteForever />
            </Button>
          </ListItemButton>
        );
      }),
    );
  };
  // Get ability categories
  const fetchCategoriasHabilidad = async () => {
    try {
      const response = await axios.get(
        apiUrl + "/api/cat-skill/obtener-categorias-habilidad",
      );
      setCategoriasHabilidad(response.data.categorias_habilidad); // Actualiza el estado con las categorías de habilidad
    } catch (error) {
      console.error("Error al obtener categorías de habilidades:", error);
    }
  };

  useEffect(() => {
    if (!user_data) {
      navigate("/login");
    } else {
      // Crear bloque si no existe
      user_data.bloques.Habilidades = user_data.bloques.Habilidades
        ? user_data.bloques.Habilidades
        : {};
      setUserData(user_data);

      // Mapear la lista de habilidades a HTML
      mapToHTML(user_data.bloques.Habilidades);
      setLoading(false);

      // Load ability categories
      fetchCategoriasHabilidad();
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
    setNombre("");
    setDescripcion("");
  };

  const editarDatos = (habilidad_id) => {
    const bloque = user_data.bloques.Habilidades[habilidad_id];
    if (!bloque) return;

    setBloqueId(habilidad_id);
    setNombre(bloque.Nombre);
    setDescripcion(bloque.Descripcion);
    //
    setIdCategoriaCurriculum(bloque.ID_Categoria_Curriculum);
    setIdCategoriaPuesto(bloque.ID_Categoria_Puesto);
    setIdCategoriaHabilidad(bloque.ID_Categoria_Habilidad);
  };

  const manejarDatos = (e) => {
    e.preventDefault();

    const datosBloque = {
      Nombre: nombre,
      Descripcion: descripcion,
      ID_Categoria_Curriculum: id_categoria_curriculum,
      ID_Categoria_Puesto: id_categoria_puesto,
      ID_Categoria_Habilidad: id_categoria_habilidad,
    };

    if (bloque_id !== true) {
      manager_bloques.ActualizarBloque(
        user_data,
        setUserData,
        "Habilidades",
        bloque_id,
        datosBloque,
      );
    } else {
      // Crear nuevo bloque
      const bloque = manager_bloques.InsertarBloque(
        user_data,
        setUserData,
        "Habilidades",
        datosBloque,
      );

      setBloqueId(bloque);
    }

    mapToHTML(user_data.bloques.Habilidades);
    manager_bloques.GuardarCambios(user_data);
  };

  const eliminarHabilidad = (habilidad_id, index) => {
    manager_bloques.BorrarBloque(
      user_data,
      setUserData,
      "Habilidades",
      habilidad_id,
    );
    delete user_data.bloques.Habilidades[habilidad_id];
    mapToHTML(user_data.bloques.Habilidades);

    manager_bloques.GuardarCambios(user_data);
    reiniciarForm();
  };

  return (
    <>
      <div>
        <h1 style={{ color: "white", fontSize: "5rem" }}>Habilidades</h1>
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
                Habilidades
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
                    primary={"Agregar Nueva Habilidad"}
                    secondary={"Agregar una nueva habilidad o herramienta"}
                  />
                </ListItemButton>
                {habilidades}
              </List>
            </Paper>
          </div>
          <div style={{ width: "20px" }}></div>
          <div>
            <Grid align="center" className="wrapper">
              <Paper style={paperStyle} sx={paperSX}>
                <Typography component="h3" variant="h3" style={heading}>
                  {bloque_id === true ? "Añadir" : "Modificar"} Habilidad
                </Typography>
                <form onSubmit={manejarDatos}>
                  <TextField
                    style={row}
                    fullWidth
                    id="nombre"
                    type="text"
                    label="Nombre"
                    placeholder="Nombre de la Habilidad"
                    name="nombre"
                    inputProps={{ maxLength: 40 }}
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                  <TextField
                    style={row}
                    fullWidth
                    id="descripcion"
                    type="text"
                    label="Descripción"
                    placeholder="Descripción de la Habilidad"
                    name="descripcion"
                    multiline
                    rows={4}
                    inputProps={{ maxLength: 255 }}
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                  />
                  <InputLabel id="categoriaHabilidadSelect">
                    Categoría de Habilidad
                  </InputLabel>
                  <Select
                    style={{ width: "60%" }}
                    variant="outlined"
                    labelId="categoriaHabilidadSelect"
                    label="Categoría de Habilidad"
                    value={id_categoria_habilidad}
                    onChange={(e) => setIdCategoriaHabilidad(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Seleccione una categoría
                    </MenuItem>
                    {categoriasHabilidad.map((option) => (
                      <MenuItem key={option._id} value={option._id}>
                        {option.Nombre}
                      </MenuItem>
                    ))}
                  </Select>

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

export default Habilidades;
