import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { apiUrl } from "../consts";
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

  if (loading) {
    return (
      <center>
        <h1>Loading...</h1>
      </center>
    );
  }
}

export default Home;
