import React, { useEffect, useState, useCallback } from "react";
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

  //Icons
  ListItemIcon,
} from "@mui/material";

import { AddCard, DeleteForever, PostAdd } from "@mui/icons-material";

//Para cargar los datos de usuario, ponerlos como parametros aqui
//Tambien agregarlos en "App.js" (se pueden agregar otras variables ahi)
function EducacionFormal({
  user_data,
  setUserData,
  manager_bloques,
  category_manager,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!user_data?.usuario_id);

  const [educaciones, setEducaciones] = useState([]);
  const [cats_curr, setCatCurr] = useState([]);
  const [cats_puesto, setCatPuesto] = useState([]);

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
  const fieldTitleStyle = { float: "left" };
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
  const [programa, setPrograma] = useState("");
  const [institucion, setInstitucion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria_curriculum, setCurriculum] = useState("");
  const [categoria_puesto, setPuesto] = useState("");

  const mapToHTML = (bloques) => {
    if (!bloques) return;

    const sortedBloques = Object.entries(bloques).sort(
      ([, a], [, b]) => new Date(b.Fecha_Final) - new Date(a.Fecha_Final)
    );

    setEducaciones(
      sortedBloques.map(([plan_id, bloque], index) => (
        <ListItemButton
          key={plan_id}
          style={listStyle}
          onClick={(e) => editarDatos(plan_id)}
        >
          <ListItemText
            primary={
              bloque.Programa +
              " en " +
              bloque.Institucion +
              ""
            }
            secondary={
              bloque.Fecha_Inicio +
              "-" +
              bloque.Fecha_Final +
              ": " +
              bloque.Descripcion.substring(0, 30)
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
      user_data.bloques.Educacion_Formal = user_data.bloques.Educacion_Formal
        ? user_data.bloques.Educacion_Formal
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
          mapDBListToHTML(setCatPuesto, response);
        })
        .catch((e) => {});

      //Mapear lista de datos a HTML
      mapToHTML(user_data.bloques.Educacion_Formal);

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
    setPrograma("");
    setInstitucion("");
    setDescripcion("");
    setCurriculum("");
    setPuesto("");
  };

  const editarDatos = (plan_id) => {
    const bloque = user_data.bloques.Educacion_Formal[plan_id];
    if (!bloque) return;

    setBloqueId(plan_id);

    setFechaInicio(bloque.Fecha_Inicio);
    setFechaFinal(bloque.Fecha_Final);
    setPrograma(bloque.Programa);
    setInstitucion(bloque.Institucion);
    setDescripcion(bloque.Descripcion);
    setCurriculum(
      bloque.ID_Categoria_Curriculum ? bloque.ID_Categoria_Curriculum : "",
    );
    setPuesto(bloque.ID_Categoria_Puesto ? bloque.ID_Categoria_Puesto : "");
  };

  //To-Do -> Agregar categorias y diferencias entre crear y editar
  const manejarDatos = (e) => {
    e.preventDefault();

    if (bloque_id !== true) {
      manager_bloques.ActualizarBloque(
        user_data,
        setUserData,
        "Educacion_Formal",
        bloque_id,
        {
          Fecha_Inicio: fecha_inicio,
          Fecha_Final: fecha_final,
          Programa: programa,
          Institucion: institucion,
          Descripcion: descripcion,
          ID_Categoria_Curriculum: categoria_curriculum,
          ID_Categoria_Puesto: categoria_puesto,
        },
      );
    } else {
      //Crear Bloque Educacion Formal
      const bloque = manager_bloques.InsertarBloque(
        user_data,
        setUserData,
        "Educacion_Formal",
        {
          Fecha_Inicio: fecha_inicio,
          Fecha_Final: fecha_final,
          Programa: programa,
          Institucion: institucion,
          Descripcion: descripcion,
          ID_Categoria_Curriculum: categoria_curriculum,
          ID_Categoria_Puesto: categoria_puesto,
        },
      );

      setBloqueId(bloque);
    }

    //Mapear lista de datos a HTML
    mapToHTML(user_data.bloques.Educacion_Formal);

    manager_bloques.GuardarCambios(user_data);
    reiniciarForm();
  };

  const elminarBloque = (plan_id, index) => {
    const bloque = user_data.bloques.Educacion_Formal[plan_id];
    if (!bloque) return;

    manager_bloques.BorrarBloque(
      user_data,
      setUserData,
      "Educacion_Formal",
      plan_id,
    );
    delete user_data.bloques.Educacion_Formal[plan_id];
    mapToHTML(user_data.bloques.Educacion_Formal);

    manager_bloques.GuardarCambios(user_data);

    reiniciarForm();
  };

  return (
    <>
      <div>
        <h1 style={{ color: "white", fontSize: "5rem" }}>Educación Formal</h1>
      </div>
      <div style={{ padding: "10px", width: "100%" }}>
        <Grid align="center" container spacing={0} className="wrapper">
          <div>
            <Paper style={paperStyle} sx={paperSX}>
              <Typography component="h3" variant="h3" style={heading}>
                Tus títulos
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
                    secondary={"Agregar un nuevo título"}
                  />
                </ListItemButton>
                {educaciones}
              </List>
            </Paper>
          </div>
          <div style={{ width: "20px" }}></div>
          <div>
            <Grid align="center" className="wrapper">
              <Paper style={paperStyle} sx={paperSX}>
                <Typography component="h3" variant="h3" style={heading}>
                  {bloque_id === true ? "Añadir" : "Modificar"} Título
                </Typography>
                <form onSubmit={manejarDatos}>
                  <h4 style={fieldTitleStyle}>Fecha de inicio:</h4>
                  <Input
                    style={row}
                    sx={{ label: { fontWeight: "700", fontSize: "1.3rem" } }}
                    fullWidth
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
                  <h4 style={fieldTitleStyle}>Fecha de finalización:</h4>
                  <Input
                    style={row}
                    sx={{ label: { fontWeight: "700", fontSize: "1.3rem" } }}
                    fullWidth
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
                    id="programa"
                    type="text"
                    label="Programa"
                    placeholder="Titulo"
                    name="programa"
                    required
                    value={programa}
                    onChange={(e) => {
                      setPrograma(e.target.value);
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
                    id="institucion"
                    label="Institucion"
                    variant="outlined"
                    placeholder="Institucion"
                    name="institucion"
                    required
                    value={institucion}
                    onChange={(e) => {
                      setInstitucion(e.target.value);
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
                      onChange={(e) => setPuesto(e.target.value)}
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

export default EducacionFormal;
