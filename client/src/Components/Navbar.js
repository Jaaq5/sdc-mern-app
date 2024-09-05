import React from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Logout from "./Logout";

export const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const button = {
    marginRight: "20px",
    fontSize: "1.2rem",
    fontWeight: "700",
    padding: "0.3rem 1.4rem",
  };
  const color_gray = { color: "#ccf" };

  return (
    <AppBar sx={{ bgcolor: "#333" }}>
      <Toolbar>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          SDC{" "}
          {process.env.NODE_ENV === "development" ? (
            <>
              {" "}
              - <span style={color_gray}> [{process.env.NODE_ENV}]</span>{" "}
            </>
          ) : (
            <> </>
          )}
        </Typography>
        {!isLoggedIn ? (
          <>
            <Button
              variant="contained"
              style={button}
              color="error"
              component={Link}
              to="/login"
            >
              Login
            </Button>

            <Button
              variant="contained"
              style={button}
              color="success"
              component={Link}
              to="/signup"
            >
              Signup
            </Button>
          </>
        ) : (
          //User Ribbon
          <>
            {!(window.location.pathname === "/educacionformal") ? (
              <Button
                variant="contained"
                style={button}
                color="success"
                component={Link}
                to="/educacionformal"
              >
                Educacion Formal
              </Button>
            ) : (
              <> </>
            )}
            {!(window.location.pathname === "/educaciontecnica") ? (
              <Button
                variant="contained"
                style={button}
                color="success"
                component={Link}
                to="/educaciontecnica"
              >
                Educacion Técnica
              </Button>
            ) : (
              <> </>
            )}
            {!(window.location.pathname === "/experiencialaboral") ? (
              <Button
                variant="contained"
                style={button}
                color="success"
                component={Link}
                to="/experiencialaboral"
              >
                Experiencia Laboral
              </Button>
            ) : (
              <> </>
            )}
            {!(window.location.pathname === "/sobremi") ? (
              <Button
                variant="contained"
                style={button}
                color="success"
                component={Link}
                to="/sobremi"
              >
                Sobre Mi
              </Button>
            ) : (
              <> </>
            )}
            {!(window.location.pathname === "/home") ? (
              <Button
                variant="contained"
                style={button}
                color="success"
                component={Link}
                to="/home"
              >
                Principal
              </Button>
            ) : (
              <> </>
            )}
            <Logout setIsLoggedIn={setIsLoggedIn} />
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};
