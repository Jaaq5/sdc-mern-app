import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Button,
  Paper,
  TextField,
  Typography,
  List,
  ListItemText,
  ListItemButton,
  MenuItem,
  Select,
} from "@mui/material";
import { PostAdd, DeleteForever } from "@mui/icons-material";
import axios from "axios";

// Styles
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

function Repositorios({ user_data, setUserData, manager_bloques }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!user_data?.usuario_id);
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState("");

  // Formulario
  const [repoId, setRepoId] = useState(true);
  const [nombreRepo, setNombreRepo] = useState("");
  const [urlRepo, setUrlRepo] = useState("");
  const [descripcionRepo, setDescripcionRepo] = useState("");

  // Datos adicionales que no están en el formulario
  const ID_Categoria_Puesto = user_data?.ID_Categoria_Puesto || "";
  const ID_Categoria_Curriculum = user_data?.ID_Categoria_Curriculum || "";

  // Validar URL con regex
  // Ejemplo: https://github.com/miusuario
  const validarUrl = (url) => {
    const regex = /^(https?:\/\/)(github\.com)\/[a-zA-Z0-9_-]+$/;
    return regex.test(url);
  };

  // Función para cargar repositorios de GitHub
  const cargarRepositorios = async (url) => {
    const username = url.split("/")[3];
    try {
      const response = await axios.get(
        `https://api.github.com/users/${username}/repos`,
      );
      const reposData = response.data.map((repo) => ({
        id: repo.id,
        name: repo.name,
        url: repo.html_url,
        description: repo.description || "Sin descripción",
      }));
      setRepos(reposData);
    } catch (error) {
      console.error("Error al cargar repositorios:", error);
      alert(
        "No se pudieron cargar los repositorios. Asegúrate de que la URL sea correcta.",
      );
    }
  };

  // Mapear repos a HTML
  const mapToHTML = (bloques) => {
    if (!bloques) return;

    return Object.keys(bloques).map((repo_id) => {
      const bloque = bloques[repo_id];

      return (
        <ListItemButton
          key={repo_id}
          style={listStyle}
          onClick={() => editarDatos(repo_id)}
        >
          <ListItemText
            primary={`Repo: ${bloque.Nombre}`}
            secondary={`URL: ${bloque.Url} - Descripción: ${bloque.Descripcion}`}
          />
          <Button style={deleteButton} onClick={(e) => eliminarRepo(repo_id)}>
            <DeleteForever style={deleteForeverStyle} />
          </Button>
        </ListItemButton>
      );
    });
  };

  useEffect(() => {
    if (!user_data) {
      navigate("/login");
    } else {
      // Crear bloque si no existe
      user_data.bloques.Repositorios = user_data.bloques.Repositorios || {};
      setUserData(user_data);

      // Mapear la lista de repos a HTML
      mapToHTML(user_data.bloques.Repositorios);
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
    setRepoId(true);
    setNombreRepo("");
    setUrlRepo("");
    setDescripcionRepo("");
    setRepos([]); // Resetear la lista de repos
  };

  const editarDatos = (repo_id) => {
    const bloque = user_data.bloques.Repositorios[repo_id];
    if (!bloque) return;

    setRepoId(repo_id);
    setNombreRepo(bloque.Nombre);
    setUrlRepo(bloque.Url);
    setDescripcionRepo(bloque.Descripcion);
  };

  const manejarDatos = (e) => {
    e.preventDefault();

    // Validar URL antes de continuar
    if (!validarUrl(urlRepo)) {
      alert("Por favor, ingresa una URL válida para GitHub.");
      return;
    }

    const datosRepo = {
      Nombre: nombreRepo,
      Url: urlRepo,
      Descripcion: descripcionRepo,
      ID_Categoria_Puesto: ID_Categoria_Puesto,
      ID_Categoria_Curriculum: ID_Categoria_Curriculum,
    };

    if (repoId !== true) {
      manager_bloques.ActualizarBloque(
        user_data,
        setUserData,
        "Repositorios",
        repoId,
        datosRepo,
      );
    } else {
      // Crear nuevo bloque
      const bloque = manager_bloques.InsertarBloque(
        user_data,
        setUserData,
        "Repositorios",
        datosRepo,
      );

      setRepoId(bloque);
    }

    mapToHTML(user_data.bloques.Repositorios);
    manager_bloques.GuardarCambios(user_data);
    reiniciarForm();
  };

  const eliminarRepo = (repo_id) => {
    manager_bloques.BorrarBloque(
      user_data,
      setUserData,
      "Repositorios",
      repo_id,
    );
    delete user_data.bloques.Repositorios[repo_id];
    mapToHTML(user_data.bloques.Repositorios);

    manager_bloques.GuardarCambios(user_data);
    reiniciarForm();
  };

  const handleUrlChange = (e) => {
    setUrlRepo(e.target.value);
    if (validarUrl(e.target.value)) {
      cargarRepositorios(e.target.value);
    } else {
      setRepos([]); // Resetear la lista si la URL no es válida
      setNombreRepo("");
      setDescripcionRepo("");
    }
  };

  return (
    <>
      <div>
        <h1 style={{ color: "white", fontSize: "5rem" }}>Repositorios</h1>
      </div>
      <div style={{ padding: "10px", width: "100%" }}>
        <Grid align="center" container spacing={0} className="wrapper">
          <div>
            <Paper style={paperStylem} sx={paperSX}>
              <Typography component="h3" variant="h3" style={heading}>
                Repositorios
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
                    primary={"Agregar Nuevo Repositorio"}
                    secondary={"Agregar un nuevo repositorio"}
                  />
                </ListItemButton>
                {mapToHTML(user_data.bloques.Repositorios)}
              </List>
            </Paper>
          </div>
          <div style={{ width: "20px" }}></div>
          <div>
            <Grid align="center" className="wrapper">
              <Paper style={paperStylem} sx={paperSX}>
                <Typography component="h3" variant="h3" style={heading}>
                  {repoId === true ? "Añadir" : "Modificar"} Repositorio
                </Typography>
                <form onSubmit={manejarDatos}>
                  {/* Primer elemento: URL del usuario */}
                  <TextField
                    style={row}
                    fullWidth
                    id="urlRepo"
                    type="url"
                    label="URL del usuario"
                    placeholder="https://github.com/miusuario"
                    name="urlRepo"
                    required
                    value={urlRepo}
                    onChange={handleUrlChange}
                  />

                  {/* Opciones cargadas de repositorios */}
                  {repos.length > 0 && (
                    <Select
                      fullWidth
                      label="Selecciona un repositorio"
                      value={selectedRepo}
                      onChange={(e) => {
                        const repo = repos.find(
                          (repo) => repo.id === e.target.value,
                        );
                        if (repo) {
                          setNombreRepo(repo.name);
                          setDescripcionRepo(repo.description);
                        }
                        setSelectedRepo(e.target.value);
                      }}
                      // Permite mostrar el placeholder aunque no haya un valor seleccionado
                      displayEmpty
                    >
                      {/* Menú item como marcador de posición */}
                      <MenuItem value="" disabled>
                        Seleccione un repositorio
                      </MenuItem>

                      {repos.map((repo) => (
                        <MenuItem key={repo.id} value={repo.id}>
                          {repo.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}

                  {/* Nombre del Repositorio */}
                  <TextField
                    style={row}
                    fullWidth
                    id="nombreRepo"
                    type="text"
                    label="Nombre del repositorio"
                    placeholder="Nombre del repositorio"
                    name="nombreRepo"
                    required
                    value={nombreRepo}
                    onChange={(e) => setNombreRepo(e.target.value)}
                  />

                  {/* Descripción del Repositorio */}
                  <TextField
                    style={row}
                    fullWidth
                    id="descripcionRepo"
                    type="text"
                    label="Descripción"
                    placeholder="Descripción del repositorio"
                    name="descripcionRepo"
                    multiline
                    rows={4}
                    value={descripcionRepo}
                    onChange={(e) => setDescripcionRepo(e.target.value)}
                  />

                  <Button style={btnStyle} variant="contained" type="submit">
                    {repoId === true ? "Crear" : "Guardar"}
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

export default Repositorios;
