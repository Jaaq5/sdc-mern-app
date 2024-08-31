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

import { apiUrl, Axios_Url } from "../consts";

function Login({ setIsLoggedIn, user_data, setUserData }) {
  const [email, setEmail] = useState("");
  const [contrasena, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    console.log(apiUrl);
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
                setUserData(response.data.data);
                navigate("/home"); //, { state: { usuario_id: usuario_id, user_data: response.data.data } });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          window.alert(result.data.error);
          console.log(result.data.error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const paperStyle = {
    padding: "2rem",
    margin: "100px auto",
    borderRadius: "1rem",
    boxShadow: "10px 10px 10px",
  };
  const heading = { fontSize: "2.5rem", fontWeight: "600" };
  const row = { display: "flex", marginTop: "2rem" };
  const btnStyle = {
    marginTop: "2rem",
    fontSize: "1.2rem",
    fontWeight: "700",
    backgroundColor: "blue",
    borderRadius: "0.5rem",
  };
  const label = { fontWeight: "700" };

  return (
    <div>
      <Grid align="center" className="wrapper">
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
