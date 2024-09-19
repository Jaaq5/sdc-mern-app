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
function ExperienciaLaboral({
  user_data,
  setUserData,
  manager_bloques,
  category_manager,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!user_data?.usuario_id);

  const [trabajos, setTrabajos] = useState([]);
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
  const [puesto, setPuesto] = useState("");
  const [organizacion, setOrganizacion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [responsabilidad_1, setResp1] = useState("");
  const [responsabilidad_2, setResp2] = useState("");
  const [responsabilidad_3, setResp3] = useState("");
  const [categoria_curriculum, setCurriculum] = useState("");
  const [categoria_puesto, setCatPuesto] = useState("");

  const mapToHTML = (bloques) => {
    if (!bloques) return;

    const sortedBloques = Object.entries(bloques).sort(
      ([, a], [, b]) => new Date(b.Fecha_Final) - new Date(a.Fecha_Final)
    );

    setTrabajos(
      sortedBloques.map(([plan_id, bloque], index) => (
        <ListItemButton
          key={plan_id}
          style={listStyle}
          onClick={(e) => editarDatos(plan_id)}
        >
          <ListItemText
            primary={
              bloque.Puesto +
              " en " +
              bloque.Organizacion +
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
      user_data.bloques.Experiencias_Laborales = user_data.bloques
        .Experiencias_Laborales
        ? user_data.bloques.Experiencias_Laborales
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
      mapToHTML(user_data.bloques.Experiencias_Laborales);

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
    setPuesto("");
    setOrganizacion("");
    setDescripcion("");
    setResp1("");
    setResp2("");
    setResp3("");
    setCurriculum("");
    setCatPuesto("");
  };

  const editarDatos = (plan_id) => {
    const bloque = user_data.bloques.Experiencias_Laborales[plan_id];
    if (!bloque) return;

    setBloqueId(plan_id);

    setFechaInicio(bloque.Fecha_Inicio);
    setFechaFinal(bloque.Fecha_Final);
    setPuesto(bloque.Puesto);
    setOrganizacion(bloque.Organizacion);
    setDescripcion(bloque.Descripcion);
    setResp1(bloque.Responsabilidad_1 ? bloque.Responsabilidad_1 : "");
    setResp2(bloque.Responsabilidad_2 ? bloque.Responsabilidad_2 : "");
    setResp3(bloque.Responsabilidad_3 ? bloque.Responsabilidad_3 : "");
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
        "Experiencias_Laborales",
        bloque_id,
        {
          Fecha_Inicio: fecha_inicio,
          Fecha_Final: fecha_final,
          Puesto: puesto,
          Organizacion: organizacion,
          Descripcion: descripcion,
          Responsabilidad_1: responsabilidad_1,
          Responsabilidad_2: responsabilidad_2,
          Responsabilidad_3: responsabilidad_3,
          ID_Categoria_Curriculum: categoria_curriculum,
          ID_Categoria_Puesto: categoria_puesto,
        },
      );
    } else {
      //Crear Bloque
      const bloque = manager_bloques.InsertarBloque(
        user_data,
        setUserData,
        "Experiencias_Laborales",
        {
          Fecha_Inicio: fecha_inicio,
          Fecha_Final: fecha_final,
          Puesto: puesto,
          Organizacion: organizacion,
          Descripcion: descripcion,
          Responsabilidad_1: responsabilidad_1,
          Responsabilidad_2: responsabilidad_2,
          Responsabilidad_3: responsabilidad_3,
          ID_Categoria_Curriculum: categoria_curriculum,
          ID_Categoria_Puesto: categoria_puesto,
        },
      );

      setBloqueId(bloque);
    }

    //Mapear lista de datos a HTML
    mapToHTML(user_data.bloques.Experiencias_Laborales);

    manager_bloques.GuardarCambios(user_data);
    reiniciarForm();
  };

  const elminarBloque = (plan_id, index) => {
    const bloque = user_data.bloques.Experiencias_Laborales[plan_id];
    if (!bloque) return;

    manager_bloques.BorrarBloque(
      user_data,
      setUserData,
      "Experiencias_Laborales",
      plan_id,
    );
    delete user_data.bloques.Experiencias_Laborales[plan_id];
    mapToHTML(user_data.bloques.Experiencias_Laborales);

    manager_bloques.GuardarCambios(user_data);

    reiniciarForm();
  };

  return (
    <>
      <div>
        <h1 style={{ color: "white", fontSize: "5rem" }}>
          Experiencias Laborales
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
                    secondary={"Agregar un nuevo trabajo"}
                  />
                </ListItemButton>
                {trabajos}
              </List>
            </Paper>
          </div>
          <div style={{ width: "20px" }}></div>
          <div>
            <Grid align="center" className="wrapper">
              <Paper style={paperStyle} sx={paperSX}>
                <Typography component="h3" variant="h3" style={heading}>
                  {bloque_id === true ? "Añadir" : "Modificar"} Trabajo
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
                    id="puesto"
                    type="text"
                    label="Puesto"
                    placeholder="Nombre del puesto"
                    name="puesto"
                    required
                    value={puesto}
                    onChange={(e) => {
                      setPuesto(e.target.value);
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
                    id="organizacion"
                    label="Organizacion"
                    variant="outlined"
                    placeholder="Nombre de la organizacion"
                    name="organizacion"
                    required
                    value={organizacion}
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

                  <TextField
                    style={row}
                    sx={{ label: { fontWeight: "700", fontSize: "1.3rem" } }}
                    fullWidth
                    id="resp1"
                    label="Responsabilidad #1"
                    variant="outlined"
                    placeholder="Opcional"
                    name="resp1"
                    value={responsabilidad_1}
                    onChange={(e) => {
                      setResp1(e.target.value ? e.target.value : "");
                      e.target.setCustomValidity("");
                    }}
                    onInvalid={(e) =>
                      e.target.setCustomValidity("Llenar la responsabilidad")
                    }
                  />
                  <TextField
                    style={row}
                    sx={{ label: { fontWeight: "700", fontSize: "1.3rem" } }}
                    fullWidth
                    id="resp2"
                    label="Responsabilidad #2"
                    variant="outlined"
                    placeholder="Opcional"
                    name="resp2"
                    value={responsabilidad_2}
                    onChange={(e) => {
                      setResp2(e.target.value ? e.target.value : "");
                      e.target.setCustomValidity("");
                    }}
                    onInvalid={(e) =>
                      e.target.setCustomValidity("Llenar la responsabilidad")
                    }
                  />
                  <TextField
                    style={row}
                    sx={{ label: { fontWeight: "700", fontSize: "1.3rem" } }}
                    fullWidth
                    id="resp3"
                    label="Responsabilidad #3"
                    variant="outlined"
                    placeholder="Opcional"
                    name="resp3"
                    value={responsabilidad_3}
                    onChange={(e) => {
                      setResp3(e.target.value ? e.target.value : "");
                      e.target.setCustomValidity("");
                    }}
                    onInvalid={(e) =>
                      e.target.setCustomValidity("Llenar la responsabilidad")
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

export default ExperienciaLaboral;
