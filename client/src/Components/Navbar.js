import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Logout from "./Logout";

import useScrollTrigger from "@mui/material/useScrollTrigger";
import Slide from "@mui/material/Slide";

export const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const button = {
    margin: "5px",
    marginRight: "10px",
    fontSize: "0.8rem",
    fontWeight: "700",
    padding: "0.1rem 0.4rem",
    width: "110px",
    minWidth: "100px",
    height: "50px",
    backgroundColor: "#05c9",
  };
  const burger_button = {
    margin: "5px",
    marginRight: "10px",
    fontSize: "0.9rem",
    fontWeight: "700",
    padding: "0.1rem 0.4rem",
    width: "50px",
    height: "50px",
    backgroundColor: "#c0c9",
  };
  const color_gray = { color: "#ccf" };
  const [path, setPath] = useState("/");
  const pathToDisplay = {
    "/experiencialaboral": "Experiencias Laborales",
    "/educacionformal": "Títulos",
    "/educaciontecnica": "Certificaciones y Otros",
    "/informacionPersonal": "Sobre Mi",
    "/proyectos": "Proyectos",
    "/publicaciones": "Publicaciones",
    "/habilidades": "Habilidades y Herramientas",
    "/referencias": "Referencias",
	"/curriculo-menu": "Currículos",
	"/editor-curriculo": "Currículos",
    "/login": "",
    "/home": "",
  };
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setPath(window.location.pathname);
  });

  //@mui AppBar API https://mui.com/material-ui/react-app-bar/
  function HideOnScroll(props) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
      target: window ? window() : undefined,
    });

    return (
      <Slide appear={false} direction="down" in={!trigger || expanded}>
        {children ?? <div />}
      </Slide>
    );
  }

  return (
    <HideOnScroll>
      <AppBar sx={{ bgcolor: "#333" }}>
        <Toolbar>
          <Typography
            variant="h4"
            component="div"
            sx={{ flexGrow: 1, display: "block" }}
          >
            SDC {isLoggedIn ? "- Principal " : " "}{" "}
            {isLoggedIn && path !== "/home" ? " - " + pathToDisplay[path] : ""}
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
              {!(path === "/home") ? (
                <Button
                  variant="contained"
                  style={button}
                  color="success"
                  component={Link}
                  to="/home"
                  onClick={(e) => setPath("/home")}
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
        {isLoggedIn ? (
          expanded ? (
            <Toolbar style={{ display: "inline-block", paddingLeft: "0px" }}>
              <Button
                variant="contained"
                style={burger_button}
                color="success"
                onClick={(e) => setExpanded(!expanded)}
              >
                X
              </Button>
			  
			  <Button
                variant="contained"
                style={button}
                color="success"
                component={Link}
                to="/curriculo-menu"
                onClick={(e) => setPath("/curriculo-menu")}
              >
				Currículos
              </Button>

              <Button
                variant="contained"
                style={button}
                color="success"
                component={Link}
                to="/informacionPersonal"
                onClick={(e) => setPath("/informacionPersonal")}
              >
                Informacion Personal
              </Button>

              <Button
                variant="contained"
                style={button}
                color="success"
                component={Link}
                to="/educacionformal"
                onClick={(e) => setPath("/educacionformal")}
              >
                Educacion Formal
              </Button>

              <Button
                variant="contained"
                style={button}
                color="success"
                component={Link}
                to="/educaciontecnica"
                onClick={(e) => setPath("/educaciontecnica")}
              >
                Educacion Técnica
              </Button>

              <Button
                variant="contained"
                style={button}
                color="success"
                component={Link}
                to="/habilidades"
                onClick={(e) => setPath("/habilidades")}
              >
                Habilidades y Herramientas
              </Button>

              <Button
                variant="contained"
                style={button}
                color="success"
                component={Link}
                to="/experiencialaboral"
                onClick={(e) => setPath("/experiencialaboral")}
              >
                Experiencia Laboral
              </Button>

              <Button
                variant="contained"
                style={button}
                color="success"
                component={Link}
                to="/proyectos"
                onClick={(e) => setPath("/proyectos")}
              >
                Proyectos
              </Button>

              <Button
                variant="contained"
                style={button}
                color="success"
                component={Link}
                to="/habilidades"
                onClick={(e) => setPath("/habilidades")}
              >
                Habilidades y Herramientas
              </Button>

              <Button
                variant="contained"
                style={button}
                color="success"
                component={Link}
                to="/sobremi"
                onClick={(e) => setPath("/sobremi")}
              >
                Sobre Mi
              </Button>

              <Button
                variant="contained"
                style={button}
                color="success"
                component={Link}
                to="/publicaciones"
                onClick={(e) => setPath("/publicaciones")}
              >
                Publicaciones
              </Button>

              <Button
                variant="contained"
                style={button}
                color="success"
                component={Link}
                to="/lenguajes"
                onClick={(e) => setPath("/lenguajes")}
              >
                Lenguajes
              </Button>

              <Button
                variant="contained"
                style={button}
                color="success"
                component={Link}
                to="/referencias"
                onClick={(e) => setPath("/referencias")}
              >
                Referencias
              </Button>
            </Toolbar>
          ) : (
            <>
              <Button
                variant="contained"
                style={burger_button}
                color="success"
                onClick={(e) => setExpanded(!expanded)}
              >
                |||
              </Button>
            </>
          )
        ) : (
          <></>
        )}
      </AppBar>
    </HideOnScroll>
  );
};
