import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { apiUrl } from "../consts";
import axios from "axios";
import { Button } from "@mui/material";

function Logout({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [usuario_id, setUser] = useState(location.state?.usuario_id);

  const handleLogout = (e) => {
    axios
      .post(apiUrl + "/api/users/log-out-usuario", {})
      .then((response) => {
        if (response.status === 200) {
          if (usuario_id) setUser("");
          setIsLoggedIn(false);
          navigate("/login");
        }
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };
  const button = {
    marginRight: "20px",
    fontSize: "1.2rem",
    fontWeight: "700",
    padding: "0.3rem 1.4rem",
  };
  return (
    <Button
      variant="contained"
      color="error"
      style={button}
      onClick={(e) => handleLogout(e)}
    >
      Logout
    </Button>
  );
}

export default Logout;
