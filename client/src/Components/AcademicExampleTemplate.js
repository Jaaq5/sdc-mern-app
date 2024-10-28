import React from "react";
import { Paper, Typography } from "@mui/material";
import curriculumData from "./curriculotemplate";

import { paperStyle } from "../style";

const AcademicExampleTemplate = () => {
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
          Ejemplo de Currículum Académico:
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
          {/* Sección Prioritaria: Experiencia de Enseñanza */}
          <strong>Experiencia de Enseñanza:</strong>
          <ul>
            {Secciones.Experiencia_Laboral.IDs.length > 0 ? (
              Secciones.Experiencia_Laboral.IDs.map((id, index) => (
                <li key={index}>Experiencia ID: {id}</li>
              ))
            ) : (
              <li>No hay información disponible.</li>
            )}
          </ul>
          <br />
          {/* Sección Prioritaria: Publicaciones */}
          <strong>Publicaciones:</strong>
          <ul>
            {Secciones.Publicaciones.IDs.length > 0 ? (
              Secciones.Publicaciones.IDs.map((id, index) => (
                <li key={index}>Publicación ID: {id}</li>
              ))
            ) : (
              <li>No hay información disponible.</li>
            )}
          </ul>
          <br />
          {/* Sección Prioritaria: Educación */}
          <strong>Educación Formal:</strong>
          <ul>
            {Secciones.Educacion_Formal.IDs.length > 0 ? (
              Secciones.Educacion_Formal.IDs.map((id, index) => (
                <li key={index}>Título ID: {id}</li>
              ))
            ) : (
              <li>No hay información disponible.</li>
            )}
          </ul>
          <br />
          {/* Otras secciones opcionales */}
          <strong>Educación Informal:</strong>
          <ul>
            {Secciones.Educacion_Informal.IDs.length > 0 ? (
              Secciones.Educacion_Informal.IDs.map((id, index) => (
                <li key={index}>Certificado ID: {id}</li>
              ))
            ) : (
              <li>No hay información disponible.</li>
            )}
          </ul>
          <br />
          <strong>Habilidades:</strong>
          <ul>
            {Secciones.Habilidades.IDs.length > 0 ? (
              Secciones.Habilidades.IDs.map((id, index) => (
                <li key={index}>Habilidad ID: {id}</li>
              ))
            ) : (
              <li>No hay información disponible.</li>
            )}
          </ul>
          <br />
          <strong>Idiomas:</strong>
          <ul>
            {Secciones.Idiomas.IDs.length > 0 ? (
              Secciones.Idiomas.IDs.map((id, index) => (
                <li key={index}>Idioma ID: {id}</li>
              ))
            ) : (
              <li>No hay información disponible.</li>
            )}
          </ul>
          <br />
          <strong>Proyectos:</strong>
          <ul>
            {Secciones.Proyectos.IDs.length > 0 ? (
              Secciones.Proyectos.IDs.map((id, index) => (
                <li key={index}>Proyecto ID: {id}</li>
              ))
            ) : (
              <li>No hay información disponible.</li>
            )}
          </ul>
          <br />
          <strong>Conferencias:</strong>
          <ul>
            {Secciones.Conferencias.IDs.length > 0 ? (
              Secciones.Conferencias.IDs.map((id, index) => (
                <li key={index}>Conferencia ID: {id}</li>
              ))
            ) : (
              <li>No hay información disponible.</li>
            )}
          </ul>
          <br />
          <strong>Premios:</strong>
          <ul>
            {Secciones.Premios.IDs.length > 0 ? (
              Secciones.Premios.IDs.map((id, index) => (
                <li key={index}>Premio ID: {id}</li>
              ))
            ) : (
              <li>No hay información disponible.</li>
            )}
          </ul>
          <br />
          <strong>Referencias:</strong>
          <ul>
            {Secciones.Referencias.IDs.length > 0 ? (
              Secciones.Referencias.IDs.map((id, index) => (
                <li key={index}>Referencia ID: {id}</li>
              ))
            ) : (
              <li>No hay información disponible.</li>
            )}
          </ul>
        </div>
      </Paper>
    </div>
  );
};

export default AcademicExampleTemplate;
