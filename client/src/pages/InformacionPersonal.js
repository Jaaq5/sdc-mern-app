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
  Switch,
  FormControlLabel,
} from "@mui/material";
import { theme } from "../theme";

import { PostAdd, DeleteForever } from "@mui/icons-material";
import { apiUrl } from "../consts";
import axios from "axios";

//styles
import {
  paperStyleb, 
  paperSX, 
  heading, row, 
  btnStyle, 
  listStyle, 
  deleteButton, 
  dense
} from "../style";

// Para cargar los datos de usuario, ponerlos como parámetros aquí
// También agregarlos en "App.js" (se pueden agregar otras variables ahí)
function InformacionPersonal({
  user_data,
  setUserData,
  manager_bloques,
  category_manager,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!user_data?.usuario_id);

  const [informacion, setInformacion] = useState([]);

  // Form
  const [bloque_id, setBloqueId] = useState(true);
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [puesto, setPuesto] = useState("");
  const [direccion, setDireccion] = useState("");
  const [mostrarFoto, setMostrarFoto] = useState(false);
  const [mostrarPuesto, setMostrarPuesto] = useState(false);
  const [imagen, setImagen] = useState(null);
  const [nombreArchivo, setNombreArchivo] = useState("Ninguna foto cargada");
  //
  const [id_categoria_puesto, setIdCategoriaPuesto] = useState("");
  const [sobre_mi, setSobreMi] = useState("");

  // Cargar el bloque de información personal y manejar los datos existentes
  const mapToHTML = (bloques) => {
    if (!bloques) return;

    const fotoUsuario = imagen ? (
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={URL.createObjectURL(imagen)} // Usar el objeto de la imagen seleccionada
          alt="Usuario"
          style={{ width: "100px", height: "100px", marginRight: "10px" }}
        />
        <Button style={deleteButton} onClick={eliminarImagen}>
          <DeleteForever />
        </Button>
      </div>
    ) : user_data.userImage ? (
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={`data:image/png;base64,${user_data.userImage}`} // Imagen del usuario
          alt="Usuario"
          style={{ width: "100px", height: "100px", marginRight: "10px" }}
        />
        <Button style={deleteButton} onClick={eliminarImagen}>
          <DeleteForever />
        </Button>
      </div>
    ) : (
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src="/default-user-image.webp" // Ruta de la imagen por defecto
          alt="Usuario por defecto"
          style={{ width: "100px", height: "100px", marginRight: "10px" }}
        />
        <Button style={deleteButton} onClick={eliminarImagen}>
          <DeleteForever />
        </Button>
      </div>
    );

    setInformacion([
      fotoUsuario,
      ...Object.keys(bloques).map((info_id, index) => {
        const bloque = bloques[info_id];
        return (
          <ListItemButton
            key={info_id}
            style={listStyle}
            onClick={(e) => editarDatos(info_id)}
          >
            <ListItemText
              primary={`Tel: ${bloque.Telefono} | ${bloque.Mostrar_Puesto ? `Puesto: ${bloque.Puesto}` : ""}`}
              secondary={`Dirección: ${bloque.Direccion} | Correo: ${bloque.Correo} | Mostrar Foto: ${bloque.Mostrar_Foto ? "Sí" : "No"}`}
            />
            <Button
              style={deleteButton}
              onClick={(e) => eliminarBloque(info_id, index)}
            >
              <DeleteForever />
            </Button>
          </ListItemButton>
        );
      }),
    ]);
  };

  // Al cargar el componente
  useEffect(() => {
    if (!user_data) {
      navigate("/login");
    } else {
      // Crear bloque si no existe
      user_data.bloques.Informacion_Personal = user_data.bloques
        .Informacion_Personal
        ? user_data.bloques.Informacion_Personal
        : {};
      setUserData(user_data);

      // Mapear la lista de información personal a HTML
      mapToHTML(user_data.bloques.Informacion_Personal);
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
    setBloqueId(true);
    setTelefono("");
    setCorreo("");
    setPuesto("");
    setDireccion("");
    setSobreMi("");
    setMostrarFoto(false);
    setMostrarPuesto(false);
    setImagen(null);
    setNombreArchivo("Ninguna foto cargada");
  };

  const editarDatos = (info_id) => {
    const bloque = user_data.bloques.Informacion_Personal[info_id];
    if (!bloque) return;

    setBloqueId(info_id);
    setTelefono(bloque.Telefono);
    setCorreo(bloque.Correo);
    setPuesto(bloque.Puesto);
    setDireccion(bloque.Direccion);
    setSobreMi(bloque.Sobre_Mi);
    setMostrarFoto(bloque.Mostrar_Foto);
    setMostrarPuesto(bloque.Mostrar_Puesto);
    setIdCategoriaPuesto(bloque.ID_Categoria_Puesto);
    setSobreMi(bloque.Sobre_Mi);
  };

  const manejarImagen = async (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      // Limitar a 2 MB
      setImagen(file);
      setNombreArchivo(file.name); // Actualiza el nombre del archivo
    } else {
      alert("El archivo debe ser una imagen y no exceder los 2MB.");
      setNombreArchivo("Ninguna foto cargada"); // Reinicia el nombre si no es válido
    }
  };

  const manejarDatos = async (e) => {
    e.preventDefault();

    const datosBloque = {
      Telefono: telefono,
      Correo: correo,
      Puesto: puesto,
      Direccion: direccion,
      Sobre_Mi: sobre_mi,
      Mostrar_Foto: mostrarFoto,
      Mostrar_Puesto: mostrarPuesto,
      ID_Categoria_Puesto: id_categoria_puesto,
      Sobre_Mi: sobre_mi,
    };

    if (bloque_id !== true) {
      // Actualizar un bloque existente
      manager_bloques.ActualizarBloque(
        user_data,
        setUserData,
        "Informacion_Personal",
        bloque_id,
        datosBloque,
      );
    } else {
      // Crear nuevo bloque
      const bloque = manager_bloques.InsertarBloque(
        user_data,
        setUserData,
        "Informacion_Personal",
        datosBloque,
      );

      setBloqueId(bloque);
    }

    // Subir imagen si se seleccionó una
    if (imagen) {
      const formData = new FormData();
      formData.append("userImage", imagen);
      formData.append("usuario_id", user_data.usuario_id);

      try {
        await axios.post(apiUrl + "/api/users/subir-imagen", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } catch (error) {
        console.error("Error al subir la imagen:", error);
        // Manejar error de carga aquí (opcional)
      }
    }

    // Mapear los datos actualizados a la lista
    mapToHTML(user_data.bloques.Informacion_Personal);
    manager_bloques.GuardarCambios(user_data);
  };

  const eliminarBloque = (info_id, index) => {
    manager_bloques.BorrarBloque(
      user_data,
      setUserData,
      "Informacion_Personal",
      info_id,
    );
    delete user_data.bloques.Informacion_Personal[info_id];
    mapToHTML(user_data.bloques.Informacion_Personal);

    manager_bloques.GuardarCambios(user_data);
    reiniciarForm();
  };

  const eliminarImagen = async () => {
    try {
      await axios.delete(
        `${apiUrl}/api/users/eliminar-imagen/${user_data.usuario_id}`,
      );
      console.log("Imagen eliminada con éxito");

      // Actualiza la imagen en el estado
      setImagen(null);
      setNombreArchivo("Ninguna foto cargada");

      // Actualiza user_data para reflejar la eliminación
      user_data.userImage = null; // O ajusta según cómo gestiones el estado de la imagen
      setUserData({ ...user_data }); // Asegúrate de propagar los cambios

      // Re-renderiza la información después de eliminar la imagen
      mapToHTML(user_data.bloques.Informacion_Personal);
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
      if (error.response) {
        console.error("Error del servidor:", error.response.data);
        alert("No se pudo eliminar la imagen. Intenta nuevamente.");
      } else {
        console.error("Error de red:", error.message);
      }
    }
  };

  return (
    <>
      <div>
        <h1 style={{ color: "white", fontSize: "5rem" }}>
          Información Personal
        </h1>
      </div>
      <div style={{ padding: "10px", width: "100%" }}>
        <Grid align="center" container spacing={0} className="wrapper">
          <div>
            <Paper style={paperStyleb} sx={paperSX}>
              <Typography component="h3" variant="h3" style={heading}>
                Información Personal
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
                  style={( listStyle, { backgroundColor: "#4f96"})}
                  onClick={(e) => reiniciarForm()}
                >
                  <PostAdd />
                  <div style={{ width: "20px" }}></div>
                  <ListItemText
                    primary={"Agregar Nueva Información"}
                    secondary={"Agregar nueva información personal"}
                  />
                </ListItemButton>
                {informacion}
              </List>
            </Paper>
          </div>
          <div style={{ width: "20px" }}></div>
          <div>
            <Grid align="center" className="wrapper">
              <Paper style={paperStyleb} sx={paperSX}>
                <Typography component="h3" variant="h3" style={heading}>
                  {bloque_id === true ? "Añadir" : "Modificar"} Información
                  Personal
                </Typography>
                <form onSubmit={manejarDatos}>
                  <TextField
                    style={row}
                    fullWidth
                    id="telefono"
                    type="tel"
                    label="Teléfono"
                    placeholder="Teléfono"
                    name="telefono"
                    required
                    value={telefono}
                    onChange={(e) => {
                      const regex = /^[0-9\b]+$/;
                      if (e.target.value === "" || regex.test(e.target.value)) {
						e.target.setCustomValidity(
                        "",
                        )
                        setTelefono(e.target.value);
                      }
                    }}
                    onInvalid={(e) =>
                      e.target.setCustomValidity(
                        "Introduce un número de teléfono válido",
                      )
                    }
                  />
                  <TextField
                    style={row}
                    fullWidth
                    id="correo"
                    type="email"
                    label="Correo"
                    placeholder="Correo"
                    name="correo"
                    required
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                  />
                  <TextField
                    style={row}
                    fullWidth
                    id="puesto"
                    type="text"
                    label="Puesto a aplicar"
                    placeholder="Puesto"
                    name="puesto"
                    required
                    value={puesto}
                    onChange={(e) => setPuesto(e.target.value)}
                  />
                  <TextField
                    style={row}
                    fullWidth
                    id="direccion"
                    type="text"
                    label="Dirección"
                    placeholder="Dirección"
                    name="direccion"
                    required
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                  />
                  <TextField
                    style={row}
                    fullWidth
                    id="sobre_mi"
                    type="text"
                    label="Sobre Mí"
                    placeholder="Acerca de mí"
                    name="sobre_mi"
                    required
                    value={sobre_mi}
                    onChange={(e) => setSobreMi(e.target.value)}
                  />
                  <br />
                  <Button
                    variant="contained"
                    component="label"
                    style={{ marginRight: "10px" , backgroundColor: theme.palette.yellow.main}}
                  >
                    Subir Imagen
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={manejarImagen}
                    />
                  </Button>
                  <Typography variant="body1">{nombreArchivo}</Typography>
                  <br />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={mostrarFoto}
                        onChange={(e) => setMostrarFoto(e.target.checked)}
                      />
                    }
                    label="Mostrar Foto"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={mostrarPuesto}
                        onChange={(e) => setMostrarPuesto(e.target.checked)}
                      />
                    }
                    label="Mostrar Puesto"
                  />
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

export default InformacionPersonal;
