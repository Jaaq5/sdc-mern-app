import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Grid,
  Link,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { apiUrl } from "../consts";

//style
import { paperStyles, heading, row, btnStyle, label } from "../style";

function Login({ setIsLoggedIn, user_data, setUserData, setLocal }) {
  const [email, setEmail] = useState("");
  const [contrasena, setPassword] = useState("");
  const navigate = useNavigate();

  const manejarLocal = () => {
    setLocal(true);
    setIsLoggedIn(true);
    const local = localStorage.getItem("sdc_local");
    const data = local
      ? JSON.parse(local)
      : {
          bloques: {},
          curriculums: [],
          usuario_id: "1",
          token: "1",
          name: "Local",
          email: "local@sdc.com",
        };
    setUserData(data);
    localStorage.setItem("sdc_local", JSON.stringify(data));
    navigate("/curriculo-menu");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post(apiUrl + "/api/users/log-in-usuario", { email, contrasena })
      .then((result) => {
        if (result.data.usuario_id) {
          const usuario_id = result.data.usuario_id;
          const token = result.data.token;
          axios
            .get(
              apiUrl + "/api/users/obtener-usuario/" + usuario_id + "&" + token,
              {
                params: {
                  //usuario_id: usuario_id,
                  //token: token
                },
              },
            )
            .then((response) => {
              if (response.data.data) {
                setIsLoggedIn(true);
                response.data.data.usuario_id = usuario_id;
                response.data.data.token = token;
				localStorage.setItem("sdc_session", usuario_id+";"+token);
                Object.keys(response.data.data.curriculums).map(
                  (curriculum_id) => {
                    response.data.data.curriculums[curriculum_id].Documento =
                      JSON.parse(
                        response.data.data.curriculums[curriculum_id].Documento,
                      );
                  },
                );
                setUserData(response.data.data);
                navigate("/curriculo-menu"); //, { state: { usuario_id: usuario_id, user_data: response.data.data } });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Grid align="center" className="wrapper" sx={{ marginTop: "150px" }}>
        <Paper
          style={paperStyles}
          sx={{
            width: {
              xs: "80vw",
              sm: "50vw",
              md: "40vw",
              lg: "30vw",
              xl: "20vw",
            },
            height: { lg: "50vh" },
          }}
        >
          <Typography component="h1" variant="h5" style={heading}>
            Login
          </Typography>
          <form onSubmit={handleLogin}>
            <span style={row}>
              <TextField
                sx={{ label: { fontWeight: "700", fontSize: "1.3rem" } }}
                style={label}
                label="Email"
                fullWidth
                variant="outlined"
                type="email"
                autoComplete="email"
                placeholder="Ingresar email"
                name="email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </span>
            <span style={row}>
              <TextField
                sx={{ label: { fontWeight: "700", fontSize: "1.3rem" } }}
                label="Password"
                fullWidth
                variant="outlined"
                type="password"
                autoComplete="current-password"
                placeholder="Ingresar contraseña"
                name="contrasena"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </span>
            <Button style={btnStyle} variant="contained" type="submit">
              Login
            </Button>
          </form>
          <p>
            No tienes una cuenta? <Link href="/signup">Sign Up</Link>
          </p>
          <p>
            Olvidaste tu contraseña?{" "}
            <Link href="/cambiarcontrasena">Cambiar</Link>
          </p>
          <p style={{ display: "none" }}>
            O utilizalo localmente{" "}
            <Link onClick={(e) => manejarLocal()}>Local</Link>
          </p>
        </Paper>
      </Grid>
    </div>
  );
}

export default Login;
