import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
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
import { PostAdd, DeleteForever } from "@mui/icons-material";
//Telefono
import { PhoneNumberUtil } from "google-libphonenumber";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

//style
import {
  paperStylexb, 
  paperSX, 
  heading, row, 
  btnStyle, 
  listStyle, 
  listButtonStyle, 
  deleteButton, 
  dense
} from "../style";

// Para cargar los datos de usuario, ponerlos como parámetros aquí
// También agregarlos en "App.js" (se pueden agregar otras variables ahí)
function Referencias({
  user_data,
  setUserData,
  manager_bloques,
  category_manager,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!user_data?.usuario_id);
  const [referencias, setReferencias] = useState([]);
  const [cats_curr, setCatCurr] = useState([]);
  const [cats_puesto, setCatsPuesto] = useState([]);

  // Form
  const [referencia_id, setReferenciaId] = useState(true);
  const [nombre, setNombre] = useState("");
  const [puesto, setPuesto] = useState("");
  const [organizacion, setOrganizacion] = useState("");
  const [direccion, setDireccion] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");

  const phoneUtil = PhoneNumberUtil.getInstance();
  const telefonoValido = (telefono) => {
    if (telefono.length < 7) return false;
    if (
      telefono[0] === "+" &&
      telefono[1] === "5" &&
      telefono[2] === "0" &&
      telefono[3] === "6"
    )
      if (telefono.length === 12) return true;
      else return false;

    try {
      return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(telefono));
    } catch (error) {
      return false;
    }
    //return true
  };
  const Tvalido = telefonoValido(telefono);

  // Datos adicionales que no están en el formulario
  const [categoria_curriculum, setCurriculum] = useState("");
  const [categoria_puesto, setCatPuesto] = useState("");

  // Cargar el bloque de referencias y manejar los datos existentes
  const mapToHTML = (bloques) => {
    if (!bloques) return;

    setReferencias(
      Object.keys(bloques).map((referencia_id, index) => {
        const referencia = bloques[referencia_id];
        return (
          <ListItemButton
            key={referencia_id}
            style={listStyle}
            onClick={(e) => editarDatos(referencia_id)}
          >
            <ListItemText
              primary={`Nombre: ${referencia.Nombre} - ${referencia.Puesto} en ${referencia.Organizacion}`}
              secondary={`Contacto: ${referencia.Direccion}, ${referencia.Email}, ${referencia.Telefono}`}
            />
            <Button
              style={deleteButton}
              onClick={(e) => eliminarPublicacion(referencia_id, index)}
            >
              <DeleteForever />
            </Button>
          </ListItemButton>
        );
      }),
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

  // Al cargar el componente
  useEffect(() => {
    if (!user_data) {
      navigate("/login");
    } else {
      // Crear bloque si no existe
      user_data.bloques.Referencias = user_data.bloques.Referencias
        ? user_data.bloques.Referencias
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

      // Mapear la lista de referencias a HTML
      mapToHTML(user_data.bloques.Referencias);
      setLoading(false);
    }
  }, [user_data, setUserData, category_manager, navigate]);

  if (loading) {
    return (
      <center>
        <h1>Loading...</h1>
      </center>
    );
  }

  const reiniciarForm = () => {
    setReferenciaId(true);
    setNombre("");
    setPuesto("");
    setOrganizacion("");
    setDireccion("");
    setEmail("");
    setTelefono("");
    setCatPuesto("");
    setCurriculum("");
  };

  const editarDatos = (referencia_id) => {
    const referencia = user_data.bloques.Referencias[referencia_id];
    if (!referencia) return;

    setReferenciaId(referencia_id);
    setNombre(referencia.Nombre);
    setOrganizacion(referencia.Organizacion);
    setDireccion(referencia.Direccion);
    setPuesto(referencia.Puesto);
    setEmail(referencia.Email);
    setTelefono(referencia.Telefono);
    setCatPuesto(referencia.ID_Categoria_Puesto);
    setCurriculum(referencia.ID_Categoria_Curriculum);
  };

  const manejarDatos = (e) => {
    e.preventDefault();

    const datosReferencia = {
      Nombre: nombre,
      Organizacion: organizacion,
      Puesto: puesto,
      Direccion: direccion,
      Email: email,
      Telefono: telefono,
      ID_Categoria_Puesto: categoria_puesto,
      ID_Categoria_Curriculum: categoria_curriculum,
    };

    if (referencia_id !== true) {
      manager_bloques.ActualizarBloque(
        user_data,
        setUserData,
        "Referencias",
        referencia_id,
        datosReferencia,
      );
    } else {
      // Crear nueva referencia
      const nuevaReferencia = manager_bloques.InsertarBloque(
        user_data,
        setUserData,
        "Referencias",
        datosReferencia,
      );

      setReferenciaId(nuevaReferencia);
    }

    // Mapear los datos actualizados a la lista
    mapToHTML(user_data.bloques.Referencias);

    manager_bloques.GuardarCambios(user_data);
    reiniciarForm();
  };

  const eliminarPublicacion = (referencia_id, index) => {
    manager_bloques.BorrarBloque(
      user_data,
      setUserData,
      "Referencias",
      referencia_id,
    );
    delete user_data.bloques.Referencias[referencia_id];
    mapToHTML(user_data.bloques.Referencias);

    manager_bloques.GuardarCambios(user_data);
    reiniciarForm();
  };

  return (
    <>
      <div>
        <h1 style={{ color: "white", fontSize: "5rem" }}>Referencias</h1>
      </div>
      <div style={{ padding: "10px", width: "100%" }}>
        <Grid align="center" container spacing={0} className="wrapper">
          <div>
            <Paper style={paperStylexb} sx={paperSX}>
              <Typography component="h3" variant="h3" style={heading}>
                Referencias
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
                    primary={"Agregar Nueva Referencia"}
                    secondary={"Agregar nueva referencia"}
                  />
                </ListItemButton>
                {referencias}
              </List>
            </Paper>
          </div>
          <div style={{ width: "20px" }}></div>
          <div>
            <Grid align="center" className="wrapper">
              <Paper style={paperStylexb} sx={paperSX}>
                <Typography component="h3" variant="h3" style={heading}>
                  {referencia_id === true ? "Añadir" : "Modificar"} Referencia
                </Typography>
                <form onSubmit={manejarDatos}>
                  <TextField
                    style={row}
                    fullWidth
                    id="nombre"
                    type="text"
                    label="Nombre"
                    placeholder="Nombre de la persona"
                    name="nombre"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                  <TextField
                    style={row}
                    fullWidth
                    id="puesto"
                    type="text"
                    label="Puesto"
                    placeholder="Puesto de la persona"
                    name="puesto"
                    required
                    value={puesto}
                    onChange={(e) => setPuesto(e.target.value)}
                  />
                  <PhoneInput
                    style={row}
                    fullWidth
                    id="telefono"
                    placeholder="Teléfono del contacto"
                    name="telefono"
                    required
                    rows={4}
                    defaultCountry="cr"
                    value={telefono}
                    onChange={(phone) => setTelefono(phone)}
                  />
                  <TextField
                    style={(row, { display: "none" })}
                    fullWidth
                    id="telefono_hidden"
                    type="text"
                    required
                    value={Tvalido ? telefono : ""}
                    rows={4}
                  />
                  {!Tvalido && (
                    <div style={{ color: "red" }}>Número no es válido</div>
                  )}
                  <TextField
                    style={row}
                    fullWidth
                    id="organizacion"
                    type="text"
                    label="Organización"
                    placeholder="Nombre de la organización del contacto"
                    name="organizacion"
                    required
                    value={organizacion}
                    onChange={(e) => setOrganizacion(e.target.value)}
                  />
                  <TextField
                    style={row}
                    fullWidth
                    id="direccion"
                    type="text"
                    label="Direccion"
                    placeholder="Direccion"
                    name="direccion"
                    required
                    rows={4}
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                  />
                  <TextField
                    style={row}
                    fullWidth
                    id="email"
                    type="text"
                    label="Email"
                    placeholder="Email del contacto"
                    name="email"
                    required
                    rows={4}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    {referencia_id === true ? "Crear" : "Guardar"}
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

export default Referencias;
