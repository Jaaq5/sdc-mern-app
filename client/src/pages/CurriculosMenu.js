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

  const [lista_categorias_curriculum, setListaCatCurrs] = useState([]);
  const [lista_categorias_puesto, setListaPuestoCurrs] = useState([]);

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
//user_data.bloques.Informacion_Personal[curriculos[plan_id].Documento.datos.Informacion_Personal]?.Telefono
  const mapToHTML = (curriculos, callback, id_callback, nuevo) => {
    if (!curriculos) return;
    callback(
      Object.keys(curriculos).map((plan_id, index) => (
        <ListItemButton
          key={plan_id}
          style={listStyle}
          onClick={(e) => {id_callback(curriculos[plan_id]._id); manejarDatos(plan_id, nuevo);}}
        >
          <ListItemText
            primary={
              "Hello"
            }
            secondary={
              ""
            }
          />
		  {!nuevo? (
			  
			  <Button
				style={deleteButton}
				onClick={(e) => eliminarCurriculo(curriculos[plan_id]._id, index)}
			  >
				<DeleteForever />
			  </Button>
			  ) 
			  : 
			  (<></>)
		  }
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

  const editarCurriculo = (curriculo_id) => {
    if(!user_data.curriculums[curriculo_id])
      return;
    user_data.editando_curriculo = curriculo_id;
    setUserData(user_data);
    navigate("/editor-curriculo");
  };
  
  const manejarDatos = (curriculo_id, nuevo) => {
    
    if(Object.keys(user_data.bloques.Informacion_Personal).length == 0){
      //TODO
      //Mostrar mensaje de error, no de enviar al editor
    }
	
    if (!nuevo) {
	    editarCurriculo(curriculo_id);
    } else {
      //Crear Curriculo
      const plantilla_id = curriculo_id;
      const plantilla = curriculum_manager.CopiarPlantilla(plantilla_id, lista_categorias_curriculum, lista_categorias_puesto);
        curriculum_manager.CrearCurriculo(
          user_data,
          setUserData,
          plantilla
          ).then((response) => {
        }).catch((e) => {
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
	
    curriculum_manager.EliminarCurriculo(
      user_data,
      setUserData,
	    index,
      plan_id,
    );
	
    mapToHTML(user_data.curriculums, setCurriculos, setCurriculoId, false);
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

                <ListItemButton
                  key={true}
                  style={listStyle}
                  onClick={(e) => {setPlantilla("simple"); setCurriculoId(true); manejarDatos("simple", true);}}
                >
                  <PostAdd />
                  <div style={{ width: "20px" }}></div>
                  <ListItemText
                    primary={"Plantilla Simple"}
                    secondary={"Una plantilla que no tiene elementos ni estructura especial."}
                  />
                </ListItemButton>

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