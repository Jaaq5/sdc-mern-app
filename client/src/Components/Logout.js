import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { apiUrl } from "../consts";
import axios from "axios";
import { Button } from "@mui/material";

//style
import { logoutbutton } from "../style";

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

  return (
    <Button
      variant="contained"
      color="error"
      style={logoutbutton}
      onClick={(e) => handleLogout(e)}
    >
      Logout
    </Button>
  );
}

export default Logout;
