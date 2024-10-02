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
import {
  paperStyle, 
  heading, row, 
  btnStyle, 
  label
} from "../style";

function Login({ setIsLoggedIn, user_data, setUserData }) {
  const [email, setEmail] = useState("");
  const [contrasena, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post(apiUrl + "/api/users/log-in-usuario", { email, contrasena })
      .then((result) => {
        if (result.data.usuario_id) {
          const usuario_id = result.data.usuario_id;
          axios
            .get(apiUrl + "/api/users/obtener-usuario/" + usuario_id)
            .then((response) => {
              if (response.data.data) {
                setIsLoggedIn(true);
                response.data.data.usuario_id = usuario_id;
                Object.keys(response.data.data.curriculums).map(
                  (curriculum_id) => {
                    response.data.data.curriculums[curriculum_id].Documento =
                      JSON.parse(
                        response.data.data.curriculums[curriculum_id].Documento,
                      );
                  },
                );
                setUserData(response.data.data);
                navigate("/home"); //, { state: { usuario_id: usuario_id, user_data: response.data.data } });
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
          style={paperStyle}
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
                placeholder="Enter Email"
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
                placeholder="Enter Password"
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
            Don't have an account? <Link href="/signup">SignUp</Link>
          </p>
        </Paper>
      </Grid>
    </div>
  );
}

export default Login;
