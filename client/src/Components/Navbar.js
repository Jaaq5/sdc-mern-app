import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Logout from "./Logout";
import { theme } from "../theme";
import { useLocation, Link } from 'react-router-dom';

import useScrollTrigger from "@mui/material/useScrollTrigger";
import Slide from "@mui/material/Slide";
import { navbutton, burger_button, disabledNavButton } from "../style";
const logo = "/sdc-logo.png";

// COMPONENTE #################################################################
/**
 * Componente Navbar
 * @param {Object} props - Props para el componente Navbar.
 * @param {boolean} props.isLoggedIn - Indica si el usuario está logueado.
 * @param {Function} props.setIsLoggedIn - Función para establecer el estado de login.
 * @returns {JSX.Element} El componente Navbar.
 */
export const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  
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
  const location = useLocation();

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
      <AppBar sx={{ bgcolor: theme.palette.lightred.main }}>
        <Toolbar>
          {/* Imagen del logo */}
          <div
            style={{
              backgroundColor: "pink",
              borderRadius: "50%",
              padding: "5px",
              display: "inline-block",
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{
                height: "40px",
                width: "auto",
                display: "block",
              }}
            />
          </div>
          {/* Texto de la barra de navegación */}
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

          {/* Icono del menú para modo móvil */}
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
            // Mostrar solo en modo móvil
            sx={{ display: { xs: "block", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {/* MODO ESCRITORIO ################################################# */}

          {/* Si no está logueado, mostrar botones de Login y Signup */}
          {!isLoggedIn && (
            <>
              <Button
                variant="contained"
                style={navbutton}
                color="error"
                component={Link}
                to="/login"
                // Mostrar solo en modo escritorio
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                Login
              </Button>

              <Button
                variant="contained"
                style={navbutton}
                color="success"
                component={Link}
                to="/signup"
                // Mostrar solo en modo escritorio
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                Signup
              </Button>
            </>
          )}
        </Toolbar>

        {/* Barra navegación en modo escritorio cuando está logueado */}
        {isLoggedIn && (
          <Toolbar
            style={{
              justifyContent: "space-between",
              paddingLeft: "0px",
            }}
            // Mostrar solo en modo escritorio
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                variant="contained"
                style={burger_button}
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "X" : "|||"}
              </Button>

              {expanded && (
                <Button
                  variant="contained"
                  style={navbutton}
                  color="warning"
                  onClick={() => setIsLoggedIn(false)}
                >
                  Logout
                </Button>
              )}
            </div>

            {/* Botones de navegación en modo escritorio */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "left",
                width: "100%",
              }}
            >
              {navButtons.map(({ path, label }) =>
                renderNavButton(path, label),
              )}
            </div>
          </Toolbar>
        )}

        {/* MODO MÓVIL ######################################################## */}

        {/* Drawer para navegación en modo móvil */}
        <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle}>
          <div
            role="presentation"
            onClick={handleDrawerToggle}
            onKeyDown={handleDrawerToggle}
          >
            <IconButton onClick={handleDrawerToggle}>
              <CloseIcon />
            </IconButton>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "20px",
              }}
            >
              {/* Si no está logueado, mostrar botones de Login y Signup */}
              {!isLoggedIn ? (
                <>
                  <Button
                    variant="contained"
                    style={navbutton}
                    color="error"
                    component={Link}
                    to="/login"
                  >
                    Login
                  </Button>

                  <Button
                    variant="contained"
                    style={navbutton}
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
                  
                </>
              )}
            </Toolbar>
            {isLoggedIn ? (
              <>
                <Toolbar style={{ display: "flex", justifyContent: "space-between", paddingLeft: "0px" }}>
                  {/* Left-side container for the Burger button and Logout button */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {/* Burger button */}
                    <Button
                      variant="contained"
                      style={burger_button}
                      onClick={(e) => setExpanded(!expanded)}
                    >
                      {expanded ? "X" : "|||"}
                    </Button>

                    {/* Logout button or invisible placeholder */}
                    {expanded ? (
                      <Button
                        variant="contained"
                        style={navbutton}
                        color="warning"
                        onClick={(e) => setIsLoggedIn(false)}
                      >
                        Logout
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        style={{ ...navbutton, visibility: "hidden" }}
                      >
                        Logout
                      </Button>
                    )}
                  </div>

                  {/* Right-side container for navigation buttons, aligned to the right */}
                  <div style={{ marginLeft: "auto", display: "flex" }}>
                    <Button
                      variant="contained"
                      style={location.pathname === "/curriculo-menu" ? disabledNavButton : navbutton}
                      color="success"
                      component={Link}
                      to="/curriculo-menu"
                      onClick={(e) => setPath("/curriculo-menu")}
                    >
                      Currículos
                    </Button>

                    <Button
                      variant="contained"
                      style={location.pathname === "/informacionPersonal" ? disabledNavButton : navbutton}
                      color="success"
                      component={Link}
                      to="/informacionPersonal"
                      onClick={(e) => setPath("/informacionPersonal")}
                    >
                      Informacion Personal
                    </Button>

                    <Button
                      variant="contained"
                      style={location.pathname === "/educacionformal" ? disabledNavButton : navbutton}
                      color="success"
                      component={Link}
                      to="/educacionformal"
                      onClick={(e) => setPath("/educacionformal")}
                    >
                      Educacion Formal
                    </Button>

                    <Button
                      variant="contained"
                      style={location.pathname === "/educaciontecnica" ? disabledNavButton : navbutton}
                      color="success"
                      component={Link}
                      to="/educaciontecnica"
                      onClick={(e) => setPath("/educaciontecnica")}
                    >
                      Educacion Técnica
                    </Button>

                    <Button
                      variant="contained"
                      style={location.pathname === "/experiencialaboral" ? disabledNavButton : navbutton}
                      color="success"
                      component={Link}
                      to="/experiencialaboral"
                      onClick={(e) => setPath("/experiencialaboral")}
                    >
                      Experiencia Laboral
                    </Button>

                    <Button
                      variant="contained"
                      style={location.pathname === "/proyectos" ? disabledNavButton : navbutton}
                      color="success"
                      component={Link}
                      to="/proyectos"
                      onClick={(e) => setPath("/proyectos")}
                    >
                      Proyectos
                    </Button>

                    <Button
                      variant="contained"
                      style={location.pathname === "/habilidades" ? disabledNavButton : navbutton}
                      color="success"
                      component={Link}
                      to="/habilidades"
                      onClick={(e) => setPath("/habilidades")}
                    >
                      Habilidades
                    </Button>

                    <Button
                      variant="contained"
                      style={location.pathname === "/publicaciones" ? disabledNavButton : navbutton}
                      color="success"
                      component={Link}
                      to="/publicaciones"
                      onClick={(e) => setPath("/publicaciones")}
                    >
                      Publicaciones
                    </Button>

                    <Button
                      variant="contained"
                      style={location.pathname === "/lenguajes" ? disabledNavButton : navbutton}
                      color="success"
                      component={Link}
                      to="/lenguajes"
                      onClick={(e) => setPath("/lenguajes")}
                    >
                      Lenguajes
                    </Button>

                    <Button
                      variant="contained"
                      style={location.pathname === "/conferencias" ? disabledNavButton : navbutton}
                      color="success"
                      component={Link}
                      to="/conferencias"
                      onClick={(e) => setPath("/conferencias")}
                    >
                      Conferencias
                    </Button>

                    <Button
                      variant="contained"
                      style={location.pathname === "/referencias" ? disabledNavButton : navbutton}
                      color="success"
                      component={Link}
                      to="/referencias"
                      onClick={(e) => setPath("/referencias")}
                    >
                      Referencias
                    </Button>
                  </div>
                </Toolbar>
              </>
            ) : (
              <></>
            )}
      </AppBar>
    </HideOnScroll>
  );
};
