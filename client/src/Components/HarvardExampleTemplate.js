import React from "react";
import { Paper, Typography } from "@mui/material";
import curriculumData from "./curriculotemplate";

const paperStyle = {
  padding: "2rem",
  margin: "10px auto",
  borderRadius: "1rem",
  boxShadow: "10px 10px 10px",
  minHeight: "800px",
};

const HarvardExampleTemplate = () => {
  const {
    Documento: {
      datos: { Informacion_Personal, Secciones },
    },
  } = curriculumData;

  return (
    <div style={{ width: "80%", paddingLeft: "20px" }}>
      <Paper
        style={{
          ...paperStyle,
          minHeight: "430px",
          width: "100%",
          flexShrink: 0,
        }}
      >
        <Typography
          component="h4"
          variant="h4"
          style={{ fontWeight: "600", marginBottom: "1rem" }}
        >
          Ejemplo de Currículum Harvard:
        </Typography>

        <div style={{ padding: "10px", fontSize: "0.9rem", lineHeight: "1.5" }}>
          <strong>Información Personal:</strong>
          <br />
          <strong>{Informacion_Personal.Nombre || "Nombre Apellido"}</strong>
          <br />
          {Informacion_Personal.Direccion ||
            "Dirección • Ciudad, Estado, Código Postal"}
          <br />
          {Informacion_Personal.Email || "email@example.com"} •{" "}
          {Informacion_Personal.Telefono || "(123) 456-7890"}
          <br />
          <br />
          {Object.entries(Secciones).map(([key, value]) => {
            if (value.Mostrar) {
              return (
                <div key={key}>
                  <strong>{value.Titulo}</strong>
                  <br />
                  <ul>
                    {value.IDs && value.IDs.length > 0 ? (
                      value.IDs.map((id) => <li key={id}>ID: {id}</li>)
                    ) : (
                      <li>No hay información disponible.</li>
                    )}
                  </ul>
                  <br />
                </div>
              );
            }
            return null;
          })}
          {/* Mostrar detalles adicionales de cada sección (Ejemplo) */}
          <strong>Experiencia Laboral:</strong>
          <ul>
            {Secciones.Experiencia_Laboral.IDs.map((id, index) => (
              <li key={index}>Experiencia ID: {id}</li>
            ))}
          </ul>
          <strong>Educación Formal:</strong>
          <ul>
            {Secciones.Educacion_Formal.IDs.map((id, index) => (
              <li key={index}>Título ID: {id}</li>
            ))}
          </ul>
          <strong>Educación Informal:</strong>
          <ul>
            {Secciones.Educacion_Informal.IDs.map((id, index) => (
              <li key={index}>Certificado ID: {id}</li>
            ))}
          </ul>
          <strong>Habilidades:</strong>
          <ul>
            {Secciones.Habilidades.IDs.map((id, index) => (
              <li key={index}>Habilidad ID: {id}</li>
            ))}
          </ul>
          <strong>Idiomas:</strong>
          <ul>
            {Secciones.Idiomas.IDs.map((id, index) => (
              <li key={index}>Idioma ID: {id}</li>
            ))}
          </ul>
          <strong>Proyectos:</strong>
          <ul>
            {Secciones.Proyectos.IDs.map((id, index) => (
              <li key={index}>Proyecto ID: {id}</li>
            ))}
          </ul>
          <strong>Publicaciones:</strong>
          <ul>
            {Secciones.Publicaciones.IDs.map((id, index) => (
              <li key={index}>Publicación ID: {id}</li>
            ))}
          </ul>
          <strong>Referencias:</strong>
          <ul>
            {Secciones.Referencias.IDs.map((id, index) => (
              <li key={index}>Referencia ID: {id}</li>
            ))}
          </ul>
        </div>
      </Paper>
    </div>
  );
};

export default HarvardExampleTemplate;
