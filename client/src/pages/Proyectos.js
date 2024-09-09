import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Input,
  InputLabel,
  Grid,
  Button,
  Paper,
  TextField,
  Typography,
  List,
  ListItemText,
  ListItemButton,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";

import { DeleteForever, PostAdd } from "@mui/icons-material";

//Para cargar los datos de usuario, ponerlos como parametros aqui
//Tambien agregarlos en "App.js" (se pueden agregar otras variables ahi)
function Proyectos({
  user_data,
  setUserData,
  manager_bloques,
  category_manager,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!user_data?.usuario_id);

  const [proyectos, setProyectos] = useState([]);
  const [cats_curr, setCatCurr] = useState([]);
  const [cats_puesto, setCatsPuesto] = useState([]);

  //Style
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
  const fieldTitleStyle = {};
  const listStyle = {
    border: "solid 3px #999999aa",
    borderRadius: "5px",
    marginBottom: "5px",
    height: "5rem",
    overflow: "hidden",
    backgroundColor: "#fff",
  };
  const listButtonStyle = {
    border: "solid 1px #999999aa",
    height: "3rem",
    overflow: "hidden",
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

  //Form
  const [bloque_id, setBloqueId] = useState(true);

  const [fecha_inicio, setFechaInicio] = useState("");
  const [fecha_final, setFechaFinal] = useState("");
  const [nombreProyecto, setProyecto] = useState("");
  const [intitucion, setOrganizacion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria_curriculum, setCurriculum] = useState("");
  const [categoria_puesto, setCatPuesto] = useState("");

  const mapToHTML = (bloques) => {
    if (!bloques) return;

    setProyectos(
      Object.keys(bloques).map((plan_id, index) => (
        <ListItemButton
          key={plan_id}
          style={listStyle}
          onClick={(e) => editarDatos(plan_id)}
        >
          <ListItemText
            primary={
              bloques[plan_id].Proyecto +
              " en " +
              bloques[plan_id].Intitucion +
              ""
            }
            secondary={
              bloques[plan_id].Fecha_Inicio +
              "-" +
              bloques[plan_id].Fecha_Final +
              ": " +
              bloques[plan_id].Descripcion.substring(0, 30)
            }
          />
          <Button
            style={deleteButton}
            onClick={(e) => elminarBloque(plan_id, index)}
          >
            <DeleteForever />
          </Button>
        </ListItemButton>
      )),
    );
  };

  const mapDBListToHTML = (setter, lista) => {
    setter(
      Object.keys(lista).map((l_id) => (
        <MenuItem value={lista[l_id]._id} key={l_id} style={listButtonStyle}>
          {lista[l_id].Nombre}
        </MenuItem>
      )),
    );
  };

  //Al inicio de carga del componente
  useEffect(() => {
    if (!user_data) {
      navigate("/login");
    } else {
      //Crear bloque si no existe
      user_data.bloques.Proyectos = user_data.bloques.Proyectos
        ? user_data.bloques.Proyectos
        : {};
      setUserData(user_data);

      //Categorias
      category_manager
        .ObtenerCategoriasCurriculum()
        .then((response) => {
          mapDBListToHTML(setCatCurr, response);
        })
        .catch((e) => {});

      category_manager
        .ObtenerCategoriasPuesto()
        .then((response) => {
          mapDBListToHTML(setCatsPuesto, response);
        })
        .catch((e) => {});

      //Mapear lista de datos a HTML
      mapToHTML(user_data.bloques.Proyectos);

      setLoading(false);
    }
  }, [
    user_data,
    setUserData,
    category_manager,
    navigate,
    setCatCurr,
    setCatPuesto,
    loading,
  ]); //Espera a que estos existan?

  if (loading) {
    return (
      <center>
        <h1>Loading...</h1>
      </center>
    );
  }

  const reiniciarForm = () => {
    setBloqueId(true);

    setFechaInicio("");
    setFechaFinal("");
    setProyecto("");
    setOrganizacion("");
    setDescripcion("");
    setCurriculum("");
    setCatPuesto("");
  };

  const editarDatos = (plan_id) => {
    const bloque = user_data.bloques.Proyectos[plan_id];
    if (!bloque) return;

    setBloqueId(plan_id);

    setFechaInicio(bloque.Fecha_Inicio);
    setFechaFinal(bloque.Fecha_Final);
    setProyecto(bloque.Proyecto);
    setOrganizacion(bloque.Intitucion);
    setDescripcion(bloque.Descripcion);
    setCurriculum(
      bloque.ID_Categoria_Curriculum ? bloque.ID_Categoria_Curriculum : "",
    );
    setCatPuesto(bloque.ID_Categoria_Puesto ? bloque.ID_Categoria_Puesto : "");
  };

  //To-Do -> Agregar categorias y diferencias entre crear y editar
  const manejarDatos = (e) => {
    e.preventDefault();

    if (bloque_id !== true) {
      manager_bloques.ActualizarBloque(
        user_data,
        setUserData,
        "Proyectos",
        bloque_id,
        {
          Fecha_Inicio: fecha_inicio,
          Fecha_Final: fecha_final,
          Proyecto: nombreProyecto,
          Intitucion: intitucion,
          Descripcion: descripcion,
          ID_Categoria_Curriculum: categoria_curriculum,
          ID_Categoria_Puesto: categoria_puesto,
        },
      );
    } else {
      //Crear Bloque
      const bloque = manager_bloques.InsertarBloque(
        user_data,
        setUserData,
        "Proyectos",
        {
          Fecha_Inicio: fecha_inicio,
          Fecha_Final: fecha_final,
          Proyecto: nombreProyecto,
          Intitucion: intitucion,
          Descripcion: descripcion,
          ID_Categoria_Curriculum: categoria_curriculum,
          ID_Categoria_Puesto: categoria_puesto,
        },
      );

      setBloqueId(bloque);
    }

    //Mapear lista de datos a HTML
    mapToHTML(user_data.bloques.Proyectos);

    manager_bloques.GuardarCambios(user_data);
  };

  const elminarBloque = (plan_id, index) => {
    const bloque = user_data.bloques.Proyectos[plan_id];
    if (!bloque) return;

    manager_bloques.BorrarBloque(user_data, setUserData, "Proyectos", plan_id);
    delete user_data.bloques.Proyectos[plan_id];
    mapToHTML(user_data.bloques.Proyectos);

    manager_bloques.GuardarCambios(user_data);

    reiniciarForm();
  };

  return (
    <>
      <div>
        <h1 style={{ color: "white", fontSize: "5rem" }}>
          Proyectos
        </h1>
      </div>
      <div style={{ padding: "10px", width: "100%" }}>
        <Grid align="center" container spacing={0} className="wrapper">
          <div>
            <Paper style={paperStyle} sx={paperSX}>
              <Typography component="h3" variant="h3" style={heading}>
                Trabajos:
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
                    primary={"Agregar Nuevo"}
                    secondary={"Agregar un nuevo proyecto"}
                  />
                </ListItemButton>
                {proyectos}
              </List>
            </Paper>
          </div>
          <div style={{ width: "20px" }}></div>
          <div>
            <Grid align="center" className="wrapper">
              <Paper style={paperStyle} sx={paperSX}>
                <Typography component="h3" variant="h3" style={heading}>
                  {bloque_id === true ? "Añadir" : "Modificar"} Proyecto
                </Typography>
                <form onSubmit={manejarDatos}>
                  <h4 style={fieldTitleStyle}>
                    Fecha de inicio - Fecha de finalización
                  </h4>
                  <Input
                    style={(row, { width: "30%" })}
                    sx={{ label: { fontWeight: "700", fontSize: "1.3rem" } }}
                    id="fecha_inicio"
                    type="date"
                    label="Fecha de Inicio"
                    variant="outlined"
                    format="LL"
                    name="fecha_inicio"
                    required
                    value={fecha_inicio}
                    onChange={(e) => {
                      setFechaInicio(e.target.value);
                      e.target.setCustomValidity("");
                    }}
                    onInvalid={(e) =>
                      e.target.setCustomValidity(
                        "Seleccionar la fecha de inicio",
                      )
                    }
                  />
                  <span style={{ width: "20px", height: "20px" }}> -> </span>
                  <Input
                    style={(row, { width: "30%" })}
                    sx={{ label: { fontWeight: "700", fontSize: "1.3rem" } }}
                    id="fecha_final"
                    type="date"
                    label="Fecha de Finalización"
                    variant="outlined"
                    format="LL"
                    name="fecha_final"
                    required
                    value={fecha_final}
                    onChange={(e) => {
                      if (e.target.value > fecha_inicio) {
                        setFechaFinal(e.target.value);
                        e.target.setCustomValidity("");
                      } else {
                        e.target.setCustomValidity("X");
                      }
                    }}
                    onInvalid={(e) =>
                      e.target.setCustomValidity(
                        "Escoger una fecha final que sea despés de la de inicio",
                      )
                    }
                  />
                  <TextField
                    style={row}
                    sx={{ label: { fontWeight: "700", fontSize: "1.3rem" } }}
                    fullWidth
                    id="nombreProyecto"
                    type="text"
                    label="Proyecto"
                    placeholder="Nombre del proyecto"
                    name="nombreProyecto"
                    required
                    value={nombreProyecto}
                    onChange={(e) => {
                      setProyecto(e.target.value);
                      e.target.setCustomValidity("");
                    }}
                    onInvalid={(e) =>
                      e.target.setCustomValidity("Llenar el nombre del titulo")
                    }
                  ></TextField>
                  <TextField
                    style={row}
                    sx={{ label: { fontWeight: "700", fontSize: "1.3rem" } }}
                    fullWidth
                    id="intitucion"
                    label="Intitucion"
                    variant="outlined"
                    placeholder="Nombre de la intitución"
                    name="intitucion"
                    required
                    value={intitucion}
                    onChange={(e) => {
                      setOrganizacion(e.target.value);
                      e.target.setCustomValidity("");
                    }}
                    onInvalid={(e) =>
                      e.target.setCustomValidity(
                        "Llenar el nombre de la Institución",
                      )
                    }
                  />
                  <TextField
                    style={row}
                    sx={{ label: { fontWeight: "700", fontSize: "1.3rem" } }}
                    fullWidth
                    id="descripcion"
                    label="Descripcion"
                    variant="outlined"
                    placeholder="Descripción"
                    name="descripcion"
                    required
                    value={descripcion}
                    onChange={(e) => {
                      setDescripcion(e.target.value);
                      e.target.setCustomValidity("");
                    }}
                    onInvalid={(e) =>
                      e.target.setCustomValidity("Llenar la descripción")
                    }
                  />

                  <FormControl style={{ width: "81%", marginTop: "20px" }}>
                    <InputLabel id="id-curriculum-select-label">
                      Tipo de CV
                    </InputLabel>
                    <Select
                      labelId="id-curriculum-select-label"
                      id="id-curriculum-simple-select"
                      defaultValue={""}
                      value={categoria_curriculum}
                      label="Tipo de CV"
                      onChange={(e) => setCurriculum(e.target.value)}
                    >
                      {cats_curr}
                    </Select>
                  </FormControl>
                  <FormControl style={{ width: "80%", marginTop: "20px" }}>
                    <InputLabel id="id-puesto-select-label">Puesto</InputLabel>
                    <Select
                      labelId="id-puesto-select-label"
                      id="id-puesto-simple-select"
                      defaultValue={""}
                      value={categoria_puesto}
                      label="Puesto"
                      onChange={(e) => setCatPuesto(e.target.value)}
                    >
                      {cats_puesto}
                    </Select>
                  </FormControl>
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

export default Proyectos;
