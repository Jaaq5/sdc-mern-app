import { celdasAPx } from "./EditorTamano";

//Retorna el estilo
const tamanoYPosicion = (estructura) => {
  try {
    estructura.style = JSON.parse(
      JSON.stringify(estructura.style ? estructura.style : {}),
    );
  } catch (e) {
    estructura = JSON.parse(JSON.stringify(estructura ? estructura : {}));
    estructura.style = JSON.parse(
      JSON.stringify(estructura.style ? estructura.style : {}),
    );
  }
  if (estructura.Celdas) {
    const t = celdasAPx(estructura.Celdas);
    estructura.style.width = t.width + "px";
    estructura.style.height = t.height + "px";
  }
  if (estructura.Pos) {
    const t = celdasAPx(estructura.Pos);
    estructura.style.left = t.width + "px";
    estructura.style.top = t.height + "px";
    estructura.style.position = "absolute";
  }
  return estructura.style;
};

const ElementoTextoEstructuradoHTML = ({
  documento,
  nombreSeccion,
  seccion,
  estructura,
  id,
  index,
  obtenerTextoEstructura,
}) => {
  return (
    <>
      <p
        id={"HTML_Texto_" + nombreSeccion + "_" + index}
        style={estructura.style}
        key={nombreSeccion + id + index}
      >
        {obtenerTextoEstructura(nombreSeccion, seccion, id, estructura, index)}
      </p>
    </>
  );
};

const ElementoDivEstructuradoHTML = ({
  documento,
  nombreSeccion,
  seccion,
  estructura,
  id,
  index,
  obtenerTextoEstructura,
}) => {
  return (
    <>
      <p
        id={"HTML_Texto_" + nombreSeccion + "_" + index}
        style={estructura.style}
        key={nombreSeccion + id + index}
      >
        {obtenerTextoEstructura(nombreSeccion, seccion, id, estructura, index)}
      </p>
    </>
  );
};

const ElementoImgEstructuradoHTML = ({
  documento,
  nombreSeccion,
  seccion,
  estructura,
  id,
  index,
}) => {
  return (
    <>
      <img
        id={"Imagen_" + nombreSeccion + "_" + index}
        style={estructura.style}
        key={nombreSeccion + id + index}
        src={"/default-user-image.webp"}
      />
    </>
  );
};

const ElementoEstructuradoHTML = ({
  documento,
  nombreSeccion,
  seccion,
  estructura,
  id,
  index,
  obtenerTextoEstructura,
}) => {
  //console.log("Texto: "+nombreSeccion+", "+id+", "+index+", "+estructura.Tipo)
  if (!estructura) return <></>;

  switch (estructura.Tipo) {
    case "Texto":
      return (
        <ElementoTextoEstructuradoHTML
          documento={documento}
          nombreSeccion={nombreSeccion}
          seccion={seccion}
          estructura={estructura}
          id={id}
          index={index}
          obtenerTextoEstructura={obtenerTextoEstructura}
        />
      );
    case "Div":
      return (
        <ElementoDivEstructuradoHTML
          documento={documento}
          nombreSeccion={nombreSeccion}
          seccion={seccion}
          estructura={estructura}
          id={id}
          index={index}
          obtenerTextoEstructura={obtenerTextoEstructura}
        />
      );
    case "Imagen":
      return (
        <ElementoImgEstructuradoHTML
          documento={documento}
          nombreSeccion={nombreSeccion}
          seccion={seccion}
          estructura={estructura}
          id={id}
          index={index}
          obtenerTextoEstructura={obtenerTextoEstructura}
        />
      );
    case "Estructura":
      const style = tamanoYPosicion(estructura);
      estructura.style = style;
      return (
        <div style={style}>
          {Object.entries(estructura.Estructura).map(([index, estr]) => (
            <ElementoEstructuradoHTML
              documento={documento}
              nombreSeccion={nombreSeccion}
              seccion={seccion}
              estructura={estr}
              id={id}
              index={index}
              obtenerTextoEstructura={obtenerTextoEstructura}
            />
          ))}
        </div>
      );
    case "IDs":
      let list = [];
      for (
        let i = 0;
        i < documento.datos.Secciones[nombreSeccion].Cantidad;
        i += 1
      ) {
        list.push(
          <div style={estructura.plantillaStyle}>
            {Object.keys(estructura.Plantilla).map((index) => {
              return (
                <ElementoEstructuradoHTML
                  documento={documento}
                  nombreSeccion={nombreSeccion}
                  seccion={seccion}
                  estructura={estructura.Plantilla[index]}
                  index={index}
                  obtenerTextoEstructura={obtenerTextoEstructura}
                />
              );
            })}
          </div>,
        );
      }
      return (
        <div style={estructura.style} key={nombreSeccion + estructura.Tipo}>
          {list}
        </div>
      );
  }
  return <></>;
};

const SeccionHTMLEstructurada = ({
  seccion,
  documento,
  id,
  obtenerTextoEstructura,
}) => {
  if (
    !documento.diseno.Secciones[seccion] ||
    !documento.diseno.Secciones[seccion].Mostrar
  )
    return <></>;

  if (Object.isFrozen(documento.diseno.Secciones[seccion].style)) {
    //Ocurre la primera vez que se renderiza
    documento.diseno.Secciones[seccion].style = documento.diseno.Secciones[
      seccion
    ].style
      ? documento.diseno.Secciones[seccion].style
      : {};
    documento.diseno.Secciones[seccion].style = JSON.parse(
      JSON.stringify(documento.diseno.Secciones[seccion].style),
    );
    documento.diseno.Secciones[seccion].style.position = documento.diseno
      .Secciones[seccion].style.position
      ? documento.diseno.Secciones[seccion].style.position
      : "relative";
  }
  documento.diseno.Secciones[seccion].style = tamanoYPosicion(
    documento.diseno.Secciones[seccion],
  );
  documento.diseno.Secciones[seccion].style.overflow = documento.diseno
    .Secciones[seccion].style.overflow
    ? documento.diseno.Secciones[seccion].style.overflow
    : "hidden";

  return (
    <div
      id={"Seccion_" + seccion}
      style={documento.diseno.Secciones[seccion].style}
      key={seccion}
    >
      {Object.entries(documento.diseno.Secciones[seccion].Estructura).map(
        ([index, estructura]) => {
          return (
            <>
              <ElementoEstructuradoHTML
                documento={documento}
                nombreSeccion={seccion}
                seccion={documento.diseno.Secciones[seccion]}
                estructura={
                  documento.diseno.Secciones[seccion].Estructura[index]
                }
                id={id}
                index={index}
                obtenerTextoEstructura={obtenerTextoEstructura}
              />
            </>
          );
        },
      )}
    </div>
  );
};

const SubPaginaEstructuraHTML = ({
  documento,
  estructura,
  obtenerTextoEstructura,
}) => {
  if (documento.diseno.Secciones[estructura]) {
    return (
      <SeccionHTMLEstructurada
        seccion={estructura}
        documento={documento}
        id={documento.datos.Secciones[estructura]}
        obtenerTextoEstructura={obtenerTextoEstructura}
      />
    );
  } else if (documento.diseno.Secciones.Orden[estructura]) {
    return (
      <SeccionHTMLEstructurada
        seccion={documento.diseno.Secciones.Orden[estructura]}
        documento={documento}
        obtenerTextoEstructura={obtenerTextoEstructura}
      />
    );
  } else if (typeof estructura === "object") {
    estructura.style = tamanoYPosicion(estructura);
    return (
      <div style={estructura.style}>
        {estructura.Estructura ? (
          Object.keys(estructura.Estructura).map((index) => {
            if (typeof estructura.Estructura[index] === "string")
              return (
                <SeccionHTMLEstructurada
                  seccion={estructura.Estructura[index]}
                  id={documento.datos.Secciones[estructura.Estructura[index]]}
                  documento={documento}
                  obtenerTextoEstructura={obtenerTextoEstructura}
                />
              );
            else if (typeof estructura.Estructura[index] === "number")
              return (
                <SeccionHTMLEstructurada
                  seccion={
                    documento.diseno.Secciones.Orden[
                      estructura.Estructura[index]
                    ]
                  }
                  documento={documento}
                  obtenerTextoEstructura={obtenerTextoEstructura}
                />
              );
            else {
              return (
                <SubPaginaEstructuraHTML
                  documento={documento}
                  estructura={estructura.Estructura[index]}
                  obtenerTextoEstructura={obtenerTextoEstructura}
                />
              );
            }
          })
        ) : (
          <></>
        )}
      </div>
    );
  }
  return <></>;
};

const PaginaHTMLEstructurada = ({ documento, obtenerTextoEstructura }) => {
  if (
    !documento ||
    !documento.diseno.Paginas ||
    !documento.diseno.Paginas[0].Estructura
  ) {
    return (
      <div>
        <div>
          <p>Formato No Soportado</p>
        </div>
      </div>
    );
  }

  return (
    <div style={documento.diseno.Paginas[0].style} id={"pagina_" + 1}>
      <div style={{ position: "absolute" }}>
        {documento.diseno.Paginas[0].Elementos ? (
          Object.entries(documento.diseno.Paginas[0].Elementos).forEach(
            ([key, val]) => {
              if (documento.diseno.Elementos[val]) {
              }
            },
          )
        ) : (
          <></>
        )}
      </div>
      {Object.entries(documento.diseno.Paginas[0].Estructura).map(
        ([key, val]) => {
          return (
            <SubPaginaEstructuraHTML
              documento={documento}
              estructura={val}
              obtenerTextoEstructura={obtenerTextoEstructura}
            />
          );
        },
      )}
    </div>
  );
};

const obtenerTextoEstructura = (
  nombreSeccion,
  seccion,
  id,
  estructura,
  index,
) => {
  let texto = "";
  estructura.Texto.forEach((campo) => {
    if (seccion[campo] || seccion[campo] === "") {
      //Titulo y otros de plantilla
      texto +=
        seccion[campo] === ""
          ? estructura.Editable.Placeholder
          : seccion[campo];
    } else {
      //Texto generico
      texto += campo;
    }
  });
  return texto;
};

const PrevistaPlantillaHTML = ({ documento }) => {
  if (!documento) return <></>;
  else {
    const docuStyle = {};
    //documento.diseno.Secciones.Informacion_Personal.TituloSeccion = "Nombre";
    documento.diseno.style = documento.diseno.style
      ? documento.diseno.style
      : {};
    Object.entries(documento.diseno.style).forEach(([key, value]) => {
      docuStyle[key] = value;
    });
    docuStyle.zoom = "0.5";

    let numeroDePaginas = 1;
    return (
      <div id="documento_HTML" style={docuStyle}>
        <PaginaHTMLEstructurada
          documento={documento}
          obtenerTextoEstructura={obtenerTextoEstructura}
        />
      </div>
    );
  }
};

export default PrevistaPlantillaHTML;
