import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

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
import HarvardExampleTemplate from "../Components/HarvardExampleTemplate";

//Para cargar los datos de usuario, ponerlos como parametros aqui
//Tambien agregarlos en "App.js" (se pueden agregar otras variables ahi)
function CurriculosMenu({
  user_data,
  setUserData,
  manager_bloques,
  curriculum_manager,
  category_manager,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!user_data?.usuario_id);

  const [curriculos, setCurriculos] = useState([]);
  const [cats_curr, setCatCurr] = useState([]);
  const [cats_puesto, setCatsPuesto] = useState([]);
  const [plantillas, setPlantillas] = useState([]);
  const [tituloPlantilla, setTituloPlantilla] = useState("Plantilla Simple");
  const [plantillaTexto, setPlantillaTexto] = useState(
    "Una plantilla que no tiene elementos ni estructura especial.",
  );

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
      sm: "80vw", // 600
      md: "80vw", // 900
      lg: "80vw", // 1200
      xl: "80vw", // 1536
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
    margin: "5px",
    height: "420px",
    minWidth: "300px",
    maxWidth: "300px",
    overflow: "hidden",
    backgroundColor: "#fff",
    display: "block",
    verticalAlign: "top",
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
  const [curriculo_id, setCurriculoId] = useState(true);

  const [plantilla_id, setPlantilla] = useState([]);
  const [categoria_curriculum, setCurriculum] = useState("");
  const [categoria_puesto, setCatPuesto] = useState("");
  const [documento, setDocumento] = useState(null);

  const mapToHTML = (curriculos, callback, id_callback) => {
    if (!curriculos) return;

    callback(
      Object.keys(curriculos).map((plan_id, index) => (
        <ListItemButton
          key={plan_id}
          style={listStyle}
          onClick={(e) => {
            id_callback(plan_id);
            manejarDatos();
          }}
        >
          <ListItemText
            primary={
              user_data.bloques.Informacion_Personal[
                curriculos[plan_id].Documento.datos.Informacion_Personal
              ]?.Telefono
            }
            secondary={""}
          />
          <Button
            style={deleteButton}
            onClick={(e) => eliminarCurriculo(plan_id, index)}
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
      user_data.curriculums = user_data.curriculums
        ? user_data.curriculums
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

      //Mapear lista de curriculos a HTML
      mapToHTML(user_data.curriculums, setCurriculos, setCurriculoId);

      //Mapear plantillas a HTML
      curriculum_manager
        .ObtenerPlantillas(null)
        .then((response) => {
          mapToHTML(response, setPlantillas, setPlantilla);
        })
        .catch((e) => {});

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
        <h1>Cargando...</h1>
      </center>
    );
  }

  const handleCurriculumChange = (value) => {
    setCurriculum(value);
    if (value === "harvard") {
      setPlantillaTexto("Una plantilla que utiliza el formato Harvard.");
      setTituloPlantilla("Plantilla Harvard");
    } else {
      setPlantillaTexto(
        "Una plantilla que no tiene elementos ni estructura especial.",
      );
      setTituloPlantilla("Plantilla Simple");
    }
  };

  const reiniciarForm = () => {
    setCurriculoId(true);
    setDocumento("");
    setCurriculum("");
    setCatPuesto("");
  };

  const editarCurriculo = (_id) => {
    navigate("/editor-curriculo", {
      user_data: user_data,
      setUserData: setUserData,
      manager_bloques: manager_bloques,
      category_manager: category_manager,
      curriculum_manager: curriculum_manager,
      curriculo_id: _id,
    });
  };

  const manejarDatos = () => {
    //TODO
    //Enviar a la pagina de edicion de curriculo con los datos seleccionados
    var _id = "";
    if (curriculo_id !== true) {
      curriculum_manager
        .ActualizarCurriculo(
          user_data,
          setUserData,
          curriculo_id,
          documento,
          categoria_curriculum,
          categoria_puesto,
        )
        .then((response) => {
          if (response) {
            setCurriculoId(response);
            editarCurriculo(_id);
          }
        })
        .catch((e) => {});
    } else {
      //Crear Bloque
      curriculum_manager
        .CrearCurriculo(
          user_data,
          setUserData,
          plantilla_id,
          categoria_curriculum,
          categoria_puesto,
        )
        .then((response) => {
          if (response) {
            setCurriculoId(response);
            editarCurriculo(_id);
          }
        })
        .catch((e) => {});
    }
    editarCurriculo(_id); //DELETE
  };

  //TODO
  //Preguntar si esta seguro
  const eliminarCurriculo = (plan_id, index) => {
    const bloque = user_data.bloques.Experiencias_Laborales[plan_id];
    if (!bloque) return;

    curriculum_manager.EliminarCurriculo(user_data, setUserData, plan_id);
    delete user_data.curriculums[plan_id];
    mapToHTML(user_data.curriculums, setCurriculos, setCurriculoId);

    reiniciarForm();
  };

  return (
    <>
      <div>
        <h1 style={{ color: "white", fontSize: "5rem" }}>Tus Currículos</h1>
      </div>
      <div style={{ padding: "10px", width: "100%" }}>
        <Grid align="center" className="wrapper">
          <div>
            <Paper style={paperStyle} sx={paperSX}>
              <Typography component="h3" variant="h3" style={heading}>
                Currículos:
              </Typography>
              <List
                dense={dense}
                style={{
                  padding: "5px",
                  maxHeight: "95%",
                  overflow: "auto",
                  backgroundColor: "#ccd5",
                  display: "flex",
                  flexWrap: "wrap",
                  flexDirection: "row",
                }}
              >
                <ListItemButton
                  key={true}
                  style={listStyle}
                  onClick={(e) => {
                    document
                      .getElementById("plantilla-selector")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  <PostAdd />
                  <div style={{ width: "20px" }}></div>
                  <ListItemText
                    primary={"Crear Nuevo"}
                    secondary={"Crear un currículo con plantilla"}
                  />
                </ListItemButton>
                {curriculos}
              </List>
            </Paper>
          </div>
          <div id="plantilla-selector">
            <Paper style={paperStyle} sx={paperSX}>
              <Typography component="h3" variant="h3" style={heading}>
                Plantillas:
              </Typography>
              <form style={{ margin: "10px" }}>
                <FormControl style={{ width: "40%", marginRight: "20px" }}>
                  <InputLabel id="id-curriculum-select-label">
                    Tipo de CV
                  </InputLabel>
                  <Select
                    labelId="id-curriculum-select-label"
                    id="id-curriculum-simple-select"
                    defaultValue={""}
                    value={categoria_curriculum}
                    label="Tipo de CV"
                    onChange={(e) => handleCurriculumChange(e.target.value)} // Usar la función para manejar el cambio
                  >
                    <MenuItem value="harvard">Harvard</MenuItem>
                    {cats_curr}
                  </Select>
                </FormControl>
                <FormControl style={{ width: "40%", marginRight: "20px" }}>
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
              </form>

              {/* Lista de plantillas */}
              <List
                dense={dense}
                style={{
                  padding: "5px",
                  maxHeight: "95%",
                  overflow: "auto",
                  backgroundColor: "#ccd5",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start" }}>
                  {" "}
                  <ListItemButton
                    key={true}
                    style={listStyle}
                    onClick={(e) => {
                      setPlantilla("vacia");
                      setCurriculoId(true);
                      manejarDatos();
                    }}
                  >
                    <PostAdd />
                    <div style={{ width: "20px" }}></div>
                    <ListItemText
                      primary={tituloPlantilla}
                      secondary={plantillaTexto}
                    />
                  </ListItemButton>
                  {/* Ejemplo de Currículum Harvard */}
                  {categoria_curriculum === "harvard" && (
                    <div style={{ marginLeft: "20px" }}>
                      {" "}
                      {/* Añade margen a la izquierda */}
                      <HarvardExampleTemplate />
                    </div>
                  )}
                </div>
                {plantillas}
              </List>
              {/* Fin Lista de plantillas */}
            </Paper>
          </div>
        </Grid>
      </div>
    </>
  );
}

export default CurriculosMenu;
