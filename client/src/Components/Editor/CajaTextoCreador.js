import { useState } from "react";
import WarningIcon from "@mui/icons-material/Warning";
import { Button } from "@mui/material";
import PostAddIcon from "@mui/icons-material/PostAdd";

import plantilla_caja from "./CajaTexto_Plantilla";

function manejarCreacionCaja(documento, setDocumento) {
  documento.diseno.numCajas = documento.diseno.numCajas
    ? documento.diseno.numCajas
    : 0;
  documento.diseno.numCajas += 1;
  const seccionName = plantilla_caja.Nombre.replace(
    "<num>",
    "" + documento.diseno.numCajas,
  );
  const caja = JSON.parse(JSON.stringify(plantilla_caja.Estructura));
  caja.style = caja.style || {};
  caja.style.zIndex = documento.diseno.Paginas[0].Estructura.length * 10;
  documento.diseno.Secciones[seccionName] = caja;
  documento.diseno.Paginas[0].Estructura.push(seccionName);
  setDocumento(JSON.parse(JSON.stringify(documento))); //Forzar renderizado
}

function CajaTextoCreador({
  documento,
  setDocumento,
  opciones,
  style,
  iconStyle,
  id,
}) {
  return (
    <Button
      id={id}
      style={style}
      onClick={(e) => manejarCreacionCaja(documento, setDocumento)}
      title={"Nueva caja de texto"}
    >
      <PostAddIcon style={iconStyle} />
    </Button>
  );
}

export default CajaTextoCreador;
