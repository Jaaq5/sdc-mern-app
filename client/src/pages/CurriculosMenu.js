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
import AcademicExampleTemplate from "../Components/AcademicExampleTemplate";

import {
  paperStyle, 
  heading,
  listButtonStyle, 
  deleteButton, 
  dense
} from "../style";

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

  const [lista_categorias_curriculum, setListaCatCurrs] = useState([]);
  const [lista_categorias_puesto, setListaPuestoCurrs] = useState([]);

  const [tituloPlantilla, setTituloPlantilla] = useState("Plantilla Simple");
  const [plantillaTexto, setPlantillaTexto] = useState(
    "Una plantilla que no tiene elementos ni estructura especial.",
  );

  //Form
  const [curriculo_id, setCurriculoId] = useState(true);

  const [plantilla_id, setPlantilla] = useState([]);
  const [categoria_curriculum, setCurriculum] = useState("");
  const [categoria_puesto, setCatPuesto] = useState("");
  const [documento, setDocumento] = useState(null);

  //specific styles
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
  
  const mapToHTML = (curriculos, callback, id_callback, nuevo) => {
    if (!curriculos) return;

    callback(
      Object.keys(curriculos).map((plan_id, index) => (
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "solid 1px #999a",
            margin: "5px 5px",
          }}
          key={plan_id}
        >
          <div style={{ paddingTop: "2px" }}>
            <span
              style={{
                backgroundColor: "#4139d4",
                borderRadius: "10px",
                fontWeight: "900",
                padding: "5px",
                color: "white",
                marginRight: "5px",
              }}
            >
              {category_manager.IdANombreCurriculo(
                curriculos[plan_id].ID_Categoria_Curriculum,
              )}
            </span>
            <span
              style={{
                backgroundColor: "#d47a39",
                borderRadius: "10px",
                fontWeight: "900",
                padding: "5px",
                color: "white",
                marginRight: "5px",
              }}
            >
              {category_manager.IdANombrePuesto(
                curriculos[plan_id].ID_Categoria_Puesto,
              )}
            </span>

            {!nuevo ? (
              <Button
                style={deleteButton}
                onClick={(e) =>
                  eliminarCurriculo(curriculos[plan_id]._id, index)
                }
              >
                <DeleteForever />
              </Button>
            ) : (
              <></>
            )}
          </div>
          <ListItemButton
            key={plan_id}
            style={listStyle}
            onClick={(e) => {
              id_callback(curriculos[plan_id]._id);
              manejarDatos(plan_id, nuevo);
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
          </ListItemButton>
        </div>
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
          setListaCatCurrs(response);
        })
        .catch((e) => {});

      category_manager
        .ObtenerCategoriasPuesto()
        .then((response) => {
          mapDBListToHTML(setCatsPuesto, response);
          setListaPuestoCurrs(response);
        })
        .catch((e) => {});

      //Mapear lista de curriculos a HTML

      mapToHTML(user_data.curriculums, setCurriculos, setCurriculoId, false);

      //Mapear plantillas a HTML

      //Mapear plantillas a HTML
      curriculum_manager
        .ObtenerPlantillas(null)
        .then((response) => {
          mapToHTML(response, setPlantillas, setPlantilla, true);
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

  // Update the handleCurriculumChange function
  const handleCurriculumChange = (value) => {
    setCurriculum(value);
    // Check the value and set the appropriate template text and title
    const selectedCurriculum = lista_categorias_curriculum.find(
      (cat) => cat._id === value,
    );

    if (selectedCurriculum) {
      switch (selectedCurriculum.Nombre) {
        case "Harvard":
          setPlantillaTexto("Una plantilla que utiliza el formato Harvard.");
          setTituloPlantilla("Plantilla Harvard");
          break;
        case "Academico":
          setPlantillaTexto("Una plantilla diseñada para entornos académicos.");
          setTituloPlantilla("Plantilla Académica");
          break;
        case "Laboral":
          setPlantillaTexto("Una plantilla que enfatiza experiencia laboral.");
          setTituloPlantilla("Plantilla Laboral");
          break;
        case "Simple":
        default:
          setPlantillaTexto(
            "Una plantilla que no tiene elementos ni estructura especial.",
          );
          setTituloPlantilla("Plantilla Simple");
          break;
      }
      console.log("Titulo Plantilla:", tituloPlantilla);
      console.log("Plantilla Texto:", plantillaTexto);
    }
  };

  const reiniciarForm = () => {
    setCurriculoId(true);
    setDocumento("");
    setCurriculum("");
    setCatPuesto("");
  };

  const editarCurriculo = (curriculo_id) => {
    if (!user_data.curriculums[curriculo_id]) return;
    user_data.editando_curriculo = curriculo_id;
    setUserData(user_data);
    navigate("/editor-curriculo");
  };

  const manejarDatos = (curriculo_id, nuevo) => {
    if (Object.keys(user_data.bloques.Informacion_Personal).length == 0) {
      //TODO
      //Mostrar mensaje de error, no de enviar al editor
	  return;
    }

    if (!nuevo) {
      editarCurriculo(curriculo_id);
    } else {
      //Crear Curriculo
      const plantilla_id = curriculo_id;
      const plantilla = curriculum_manager.CopiarPlantilla(plantilla_id);
      curriculum_manager
        .CrearCurriculo(user_data, setUserData, plantilla)
        .then((response) => {})
        .catch((e) => {
          console.log(e);
        });

      user_data.curriculums.push(plantilla);
      setUserData(user_data);
      editarCurriculo(user_data.curriculums.length - 1);
    }
  };

  //TODO
  //Preguntar si esta seguro
  const eliminarCurriculo = (plan_id, index) => {
    const bloque = user_data.curriculums[index];
    if (!bloque) return;

    delete user_data.curriculums[index];
    setUserData(user_data);

    mapToHTML(user_data.curriculums, setCurriculos, setCurriculoId, false);

    curriculum_manager.EliminarCurriculo(
      user_data,
      setUserData,
      index,
      plan_id,
    );
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

          {/* Plantillas */}
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
                    onChange={(e) => handleCurriculumChange(e.target.value)} // Use the updated function
                  >
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
                <ListItemButton
                  key={true}
                  style={listStyle}
                  onClick={(e) => {
                    setPlantilla("simple");
                    setCurriculoId(true);
                    manejarDatos("simple", true);
                  }}
                >
                  <PostAdd />
                  <div style={{ width: "20px" }}></div>
                  <ListItemText
                    primary={tituloPlantilla}
                    secondary={plantillaTexto}
                  />
                </ListItemButton>

                <div style={{ display: "flex", alignItems: "flex-start" }}>
                  {" "}
                  {/*
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
                  {categoria_curriculum === "harvard" && (
                    <div style={{ marginLeft: "20px" }}>
                      {" "}
                      <HarvardExampleTemplate />
                    </div>
                  )}
                  {categoria_curriculum === "academic" && (
                    <div style={{ marginLeft: "20px" }}>
                      {" "}
                      <AcademicExampleTemplate />
                    </div>
                  )}
                    */}
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
