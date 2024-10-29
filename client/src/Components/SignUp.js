import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiUrl } from "../consts";
import axios from "axios";
import {
  Grid,
  Link,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import PasswordStrengthBar from 'react-password-strength-bar';
import HelpIcon from '@mui/icons-material/Help';
import InputAdornment from '@mui/material/InputAdornment';

//style
import { paperStyles, heading, row, btnStyle } from "../style";

function SignUp() {
  const [nombre, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setPassword] = useState("");
  const [valido, setValidez] = useState(false);
  const [warn, setWarn] = useState("");
  const [completitud, setComp] = useState({});
  const navigate = useNavigate();
  
  const validarP = (puntaje, c) => {
	  setValidez(puntaje >= 3);
	  setWarn(puntaje >= 3? "" : c.warning+"\nSuggestions: "+c.suggestions);
	  actualizarValidez("pass", puntaje >= 3);
  };
  
  const actualizarValidez = (c, val) => {
	  completitud[c] = val;
	  let comp =  true;
	  Object.keys(completitud).forEach((k) => comp = comp && (completitud[k] || k === 'valido'));
	  completitud.valido = comp;
  };

  const handleSignup = (e) => {
    e.preventDefault();
	if(completitud.valido){
		axios
		  .post(apiUrl + "/api/users/crear-usuario", { nombre, email, contrasena })
		  .then((result) => {
			if (result.status === 201) {
			  navigate("/login");
			}
		  })
		  .catch((err) => {
			//window.alert(err.response.data.error);
			console.log(err);
		  });
	}
  };

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
            Crear Cuenta{" "}
          </Typography>
          <form onSubmit={handleSignup}>
            <TextField
              style={row}
              sx={{ label: { fontWeight: "700", fontSize: "1.3rem" } }}
              fullWidth
              type="text"
              label="Ecribe tu nombre"
              name="nombre"
              autoComplete="username"
              required
              onChange={
				  (e) => {
					  e.target.setCustomValidity("");
					  setName(e.target.value);
					  actualizarValidez("name", e.target.value? true : false);
                    }}
              onInvalid={(e) =>
                      e.target.setCustomValidity("Necesita escribir el nombre")
                    }
            ></TextField>
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
              onChange={
				(e) => {
					e.target.setCustomValidity("");
					setEmail(e.target.value)
					actualizarValidez("email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value));
				}}
			  onInvalid={(e) =>
                      e.target.setCustomValidity("Necesita escribir un correo electrónico válido")
                    }
            />
            <TextField
              style={row}
              sx={{ label: { fontWeight: "700", fontSize: "1.3rem" } }}
              fullWidth
              label="Contraseña"
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
					  {
					  contrasena.length >= 6 && !valido? 
						  (<Button type="button" title={warn+""} ><HelpIcon /></Button>) 
						  : 
						  (<></>)
					  }
					  </InputAdornment>
					),
				  },
				}}
            />
			<PasswordStrengthBar 
				password={contrasena} 
				barColors={['#EB1010', '#EB7413', '#EBBF13', '#98EB13', '#13EB62']} 
				minLength={6} 
				scoreWords={['Muy Débil', 'Débil', 'Decente', 'Buena', 'Fuerte']} 
				shortScoreWord={"Muy Corta"}
				onChangeScore={(p,c) => validarP(p,c)}
			/>
            <Button id={"crear_cuenta_boton"} style={btnStyle} variant="contained" type="submit">
              Crear
            </Button>
          </form>
          <p>
            Ya tienes una cuenta? <Link href="/login">Login</Link>
          </p>
        </Paper>
      </Grid>
    </div>
  );
}
export default SignUp;
