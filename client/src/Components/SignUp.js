import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

import { Axios_Url } from '../consts';
import axios from "axios";
import { Grid, Link, Button, Paper, TextField, Typography } from "@mui/material";


function SignUp(){
    const [nombre, setName] = useState("");
    const [email, setEmail] = useState("");
    const [contrasena, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignup = (e) => {
        e.preventDefault();
        axios.post(Axios_Url+'/api/users/crear-usuario', { nombre, email, contrasena })
            .then(result => {
                if (result.status === 201) {
                    navigate("/login");
                }
            })
            .catch(err => {
				//window.alert(err.response.data.error);
				console.log(err);
            });
    };
    const paperStyle = {padding: "2rem", margin: "100px auto", borderRadius:"1rem", boxShadow: "10px 10px 10px"};
    const heading = {fontSize:"2.5rem", fontWeight:"600"}
    const row = {display:"flex", marginTop:"2rem"}
    const btnStyle={marginTop:"2rem", fontSize:"1.2rem", fontWeight:"700", backgroundColor:"blue", borderRadius:"0.5rem"};
    return (
        <div>
            <Grid align="center" className="wrapper">
                <Paper style={paperStyle} sx={{width: {
                    xs: '80vw',     // 0
                    sm: '50vw',     // 600
                    md: '40vw',     // 900
                    lg: '30vw',     // 1200
                    xl: '20vw',     // 1536 
                },
                height:{
                    lg: '60vh',     // 1200px and up
                }}}>
                    <Typography component="h1" variant="h5" style={heading}> Signup </Typography>
                    <form onSubmit={handleSignup}>
                        <TextField style={row} sx={{label: { fontWeight: '700', fontSize:"1.3rem" }}} fullWidth type="text" label="Enter Name" name="nombre" autoComplete="username" required onChange={(e)=>setName(e.target.value)}></TextField>
                        <TextField style={row} sx={{label: { fontWeight: '700', fontSize:"1.3rem" }}} fullWidth label="Email" variant="outlined" type="email" autoComplete="email" placeholder="Enter Email" name="email" required onChange={(e)=>setEmail(e.target.value)}/>                    
                        <TextField style={row} sx={{label: { fontWeight: '700', fontSize:"1.3rem" }}} fullWidth label="Password" variant="outlined" type="password" autoComplete="new-password" placeholder="Enter Password" name="contrasena" required onChange={(e)=>setPassword(e.target.value)} />
                        <Button style={btnStyle} variant="contained" type="submit">SignUp</Button>
                    </form>
                    <p>Already have an account?<Link href="/login"> Login</Link></p>
                </Paper>
            </Grid>
        </div>
    )
}
export default SignUp;
