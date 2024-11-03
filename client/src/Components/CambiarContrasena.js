import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { apiUrl } from "../consts";
import axios from "axios";
import {
  Grid,
  Link,
  Button,
  FormControl,
  Select,
  InputLabel,
  Paper,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import PasswordStrengthBar from "react-password-strength-bar";
import HelpIcon from "@mui/icons-material/Help";
import InputAdornment from "@mui/material/InputAdornment";

//style
import { paperStyles, heading, row, btnStyle, listButtonStyle } from "../style";

function CambiarContrasena({ category_manager }) {
  const [email, setEmail] = useState("");
  const [contrasena, setPassword] = useState("");
  const [valido, setValidez] = useState(false);

  const [warn, setWarn] = useState("");
  const [completitud, setComp] = useState({});
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const navigate = useNavigate();

  const [changeWarn, setChangeWarn] = useState("");

  const validarP = (puntaje, c) => {
    setValidez(puntaje >= 3);
    setWarn(puntaje >= 3 ? "" : c.warning + "\nSuggestions: " + c.suggestions);
    actualizarValidez("pass", puntaje >= 3);
  };

  const actualizarValidez = (c, val) => {
    completitud[c] = val;
    let comp = true;
    Object.keys(completitud).forEach(
      (k) => (comp = comp && (completitud[k] || k === "valido")),
    );
    completitud.valido = comp;
  };

  const obtenerPregunta = (email) => {
    axios
      .post(apiUrl + "/api/users/obtener-pregunta", { email })
      .then((result) => {
        if (result.status === 200) {
          setPregunta(result.data.pregunta);
        }
      })
      .catch((err) => {
        //window.alert(err.response.data.error);
        console.log(err);
      });
  };

  const handlePassChange = (e) => {
    e.preventDefault();
    if (completitud.valido) {
      axios
        .post(apiUrl + "/api/users/cambiar", { email, contrasena, respuesta })
        .then((result) => {
          if (result.status === 200) {
            navigate("/login");
          } else {
            setChangeWarn(result.data.error);
          }
        })
        .catch((err) => {
          //window.alert(err.response.data.error);
          console.log(err);
        });
    }
  };

  useEffect(() => {}, []);

  return (
    <div>
      <Grid align="center" className="wrapper" sx={{ marginTop: "150px" }}>
        <Paper
          style={paperStyles}
          sx={{
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
          }}
        >
          <Typography component="h1" variant="h5" style={heading}>
            {" "}
            Cambiar Contraseña{" "}
          </Typography>
          <form onSubmit={handlePassChange}>
            <TextField
              style={row}
              sx={{ label: { fontWeight: "700", fontSize: "1.3rem" } }}
              fullWidth
              label="Email"
              variant="outlined"
              type="email"
              autoComplete="email"
              placeholder="Escribir email"
              name="email"
              required
              onChange={(e) => {
                e.target.setCustomValidity("");
                setEmail(e.target.value);
                actualizarValidez(
                  "email",
                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value),
                );
              }}
              onInvalid={(e) =>
                e.target.setCustomValidity(
                  "Necesita escribir un correo electrónico válido",
                )
              }
            />
            <Button
              id={"crear_cuenta_boton"}
              style={btnStyle}
              variant="contained"
              type="button"
              onClick={(e) => {
                obtenerPregunta(email);
              }}
            >
              Buscar
            </Button>
            {pregunta ? (
              <>
                <br />
                <br />
                <Typography
                  component="h3"
                  variant="h5"
                  style={{ fontWeight: "700", fontSize: "1.3rem" }}
                >
                  {pregunta}
                </Typography>
                <TextField
                  style={row}
                  sx={{ label: { fontWeight: "700", fontSize: "1.3rem" } }}
                  fullWidth
                  label="Respuesta"
                  variant="outlined"
                  type="text"
                  autoComplete="none"
                  placeholder="Respuesta"
                  name="respuesta"
                  required
                  value={respuesta}
                  onChange={(e) => setRespuesta(e.target.value)}
                />
                <TextField
                  style={row}
                  sx={{ label: { fontWeight: "700", fontSize: "1.3rem" } }}
                  fullWidth
                  label="Contraseña Nueva"
                  variant="outlined"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Ingresar contraseña"
                  name="contrasena"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          {contrasena.length >= 6 && !valido ? (
                            <Button type="button" title={warn + ""}>
                              <HelpIcon />
                            </Button>
                          ) : (
                            <></>
                          )}
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <PasswordStrengthBar
                  password={contrasena}
                  barColors={[
                    "#EB1010",
                    "#EB7413",
                    "#EBBF13",
                    "#98EB13",
                    "#13EB62",
                  ]}
                  minLength={6}
                  scoreWords={[
                    "Muy Débil",
                    "Débil",
                    "Decente",
                    "Buena",
                    "Fuerte",
                  ]}
                  shortScoreWord={"Muy Corta"}
                  onChangeScore={(p, c) => validarP(p, c)}
                />
                <p style={{ color: "#FA4141", fontSize: "1rem" }}>
                  {changeWarn}
                </p>
                <Button
                  id={"crear_cuenta_boton"}
                  style={btnStyle}
                  variant="contained"
                  type="submit"
                >
                  Crear
                </Button>
              </>
            ) : (
              <></>
            )}
          </form>
          <p>
            Por si te acordaste <Link href="/login">Login</Link>
          </p>
        </Paper>
      </Grid>
    </div>
  );
}
export default CambiarContrasena;
