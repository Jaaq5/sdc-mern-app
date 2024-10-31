// IMPORTS ####################################################################
// Librerías externas
import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Slide from "@mui/material/Slide";
import { Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

// Estilos y componentes locales
import { theme } from "../theme";
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
  const [expanded, setExpanded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  // Mapeo de rutas a sus etiquetas en el menú de navegación
  const pathToDisplay = {
    "/experiencialaboral": "Experiencias Laborales",
    "/educacionformal": "Títulos",
    "/educaciontecnica": "Certificaciones y Otros",
    "/informacionPersonal": "Sobre Mi",
    "/proyectos": "Proyectos",
    "/publicaciones": "Publicaciones",
    "/habilidades": "Habilidades y Herramientas",
    "/premios": "Premios y Reconocimientos",
    "/repositorios": "Repositorios",
    "/conferencias": "Conferencias",
    "/lenguajes": "Lenguajes",
    "/referencias": "Referencias",
    "/curriculo-menu": "Currículos",
    "/editor-curriculo": "Currículos",
    "/login": "",
    "/home": "",
  };

  // Actualizar la ruta en función de la URL actual
  useEffect(() => {
    setPath(window.location.pathname);
  }, [location]);

  /**
   * Componente que oculta la barra de navegación en el desplazamiento
   * @param {Object} props - Props del componente.
   * @returns {JSX.Element} El componente de navegación.
   */
  function HideOnScroll(props) {
    const { children, window } = props;
    const trigger = useScrollTrigger({
      target: window ? window() : undefined,
    });

    return (
      <Slide appear={false} direction="down" in={!trigger || expanded}>
        {children ?? <div />}
      </Slide>
    );
  }

  // Función para abrir y cerrar el drawer
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  /**
   * Renderiza un botón de navegación
   * @param {string} to - Ruta a la que apunta el botón.
   * @param {string} label - Etiqueta que se mostrará en el botón.
   * @returns {JSX.Element} El botón de navegación.
   */
  const renderNavButton = (to, label) => (
    <Button
      variant="contained"
      style={location.pathname === to ? disabledNavButton : navbutton}
      color="success"
      component={Link}
      to={to}
      onClick={() => setPath(to)}
    >
      {label}
    </Button>
  );

  // Definición de los botones de navegación
  const navButtons = [
    { path: "/curriculo-menu", label: "Currículos" },
    { path: "/informacionPersonal", label: "Información Personal" },
    { path: "/educacionformal", label: "Educación Formal" },
    { path: "/educaciontecnica", label: "Educación Técnica" },
    { path: "/experiencialaboral", label: "Experiencia Laboral" },
    { path: "/proyectos", label: "Proyectos" },
    { path: "/habilidades", label: "Habilidades" },
    { path: "/publicaciones", label: "Publicaciones" },
    { path: "/lenguajes", label: "Lenguajes" },
    { path: "/conferencias", label: "Conferencias" },
    { path: "/premios", label: "Premios" },
    { path: "/repositorios", label: "Repositorios" },
    { path: "/referencias", label: "Referencias" },
  ];
  
  const handleLogout = () => {
	setIsLoggedIn(false); 
	localStorage.removeItem("sdc_session");  
  };

  // RETORNO ##################################################################
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
                  onClick={() => handleLogout()}
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
                    onClick={() => setDrawerOpen(false)}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    style={navbutton}
                    color="success"
                    component={Link}
                    to="/signup"
                    onClick={() => setDrawerOpen(false)}
                  >
                    Signup
                  </Button>
                </>
              ) : (
                <>
                  {/* Botón de logout */}
                  <Button
                    variant="contained"
                    style={navbutton}
                    color="warning"
                    onClick={() => handleLogout()}
                  >
                    Logout
                  </Button>
                  <br />

                  {/* Botones de navegación en modo móvil */}
                  {navButtons.map(({ path, label }) => (
                    <Button
                      key={path}
                      variant="contained"
                      style={
                        location.pathname === path
                          ? disabledNavButton
                          : navbutton
                      }
                      color="success"
                      component={Link}
                      to={path}
                      onClick={() => {
                        setPath(path);
                        setDrawerOpen(false);
                      }}
                    >
                      {label}
                    </Button>
                  ))}
                </>
              )}
            </div>
          </div>
        </Drawer>
      </AppBar>
    </HideOnScroll>
  );
};
