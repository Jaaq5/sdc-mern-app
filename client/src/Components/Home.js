import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { apiUrl, Axios_Url } from "../consts";
import axios from "axios";
import { Button } from "@mui/material";

function Home({ user_data, setUserData }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [usuario_id, setUser] = useState(location.state?.usuario_id);
  const [loading, setLoading] = useState(!usuario_id);
  //const [user_data, setData] = useState();

  useEffect(() => {
    if (!user_data) {
      axios
        .post(apiUrl + "/api/users/log-in-usuario")
        .then((response) => {
          if (response.data.user) {
            setUser(response.data.user);
          } else {
            navigate("/login");
          }
        })
        .catch(() => navigate("/login"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [usuario_id, user_data, navigate]);

  const handleNavigateToInformacionPersonal = () => {
    navigate("/informacionPersonal");
  };

  if (loading) {
    return (
      <center>
        <h1>Loading...</h1>
      </center>
    );
  }

  return (
    <center>
      <h1 style={{ color: "white", fontSize: "5rem" }}>
        Welcome Home {user_data && user_data.name} !!!
      </h1>
      <Button
        variant="contained"
        style={{
          marginTop: "2rem",
          fontSize: "1.2rem",
          backgroundColor: "green",
        }}
        onClick={handleNavigateToInformacionPersonal}
      >
        Ir a Información Personal
      </Button>
    </center>
  );
}

export default Home;
