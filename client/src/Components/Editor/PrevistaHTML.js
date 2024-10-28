const ElementoTextoEstructuradoHTML = ({
  user_data,
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
        {obtenerTextoEstructura(
          user_data,
          nombreSeccion,
          seccion,
          id,
          estructura,
          index,
        )}
      </p>
    </>
  );
};

const ElementoDivEstructuradoHTML = ({
  user_data,
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
        {obtenerTextoEstructura(
          user_data,
          nombreSeccion,
          seccion,
          id,
          estructura,
          index,
        )}
      </p>
    </>
  );
};

const ElementoImgEstructuradoHTML = ({
  user_data,
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
        src={`data:image/png;base64,${user_data.userImage}`}
      />
    </>
  );
};

const ElementoEstructuradoHTML = ({
  user_data,
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
          user_data={user_data}
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
          user_data={user_data}
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
          user_data={user_data}
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
      return (
        <div style={estructura.style}>
          {Object.entries(estructura.Estructura).map(([index, estr]) => (
            <ElementoEstructuradoHTML
              user_data={user_data}
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
      if (!documento.datos.tempIds) {
        return <></>;
      }
      documento.datos.tempIds[nombreSeccion]?.forEach((bloque_id, index) => {
        list.push(
          <div style={estructura.plantillaStyle}>
            {Object.keys(estructura.Plantilla).map((index) => {
              return (
                <ElementoEstructuradoHTML
                  user_data={user_data}
                  documento={documento}
                  nombreSeccion={nombreSeccion}
                  seccion={seccion}
                  estructura={estructura.Plantilla[index]}
                  id={bloque_id}
                  index={index}
                  obtenerTextoEstructura={obtenerTextoEstructura}
                />
              );
            })}
          </div>,
        );
      });
      return (
        <div style={estructura.style} key={nombreSeccion + estructura.Tipo}>
          {list}
        </div>
      );
  }
  return <></>;
};

const SeccionHTMLEstructurada = ({
  user_data,
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
                user_data={user_data}
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
  user_data,
  documento,
  estructura,
  obtenerTextoEstructura,
}) => {
  if (!estructura) return <></>;
  if (documento.diseno.Secciones[estructura]) {
    return (
      <SeccionHTMLEstructurada
        user_data={user_data}
        seccion={estructura}
        documento={documento}
        id={documento.datos.Secciones[estructura]}
        obtenerTextoEstructura={obtenerTextoEstructura}
      />
    );
  } else if (documento.diseno.Secciones.Orden[estructura]) {
    return (
      <SeccionHTMLEstructurada
        user_data={user_data}
        seccion={documento.diseno.Secciones.Orden[estructura]}
        documento={documento}
        obtenerTextoEstructura={obtenerTextoEstructura}
      />
    );
  } else if (typeof estructura === "object") {
    return (
      <div style={estructura.style}>
        {estructura.Estructura ? (
          Object.keys(estructura.Estructura).map((index) => {
            if (typeof estructura.Estructura[index] === "string")
              return (
                <SeccionHTMLEstructurada
                  user_data={user_data}
                  seccion={estructura.Estructura[index]}
                  id={documento.datos.Secciones[estructura.Estructura[index]]}
                  documento={documento}
                  obtenerTextoEstructura={obtenerTextoEstructura}
                />
              );
            else if (typeof estructura.Estructura[index] === "number")
              return (
                <SeccionHTMLEstructurada
                  user_data={user_data}
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
                  user_data={user_data}
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

const PaginaHTMLEstructurada = ({
  user_data,
  documento,
  obtenerTextoEstructura,
}) => {
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
              user_data={user_data}
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
  user_data,
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
    } else if (
      id &&
      user_data.bloques[nombreSeccion][id] &&
      user_data.bloques[nombreSeccion][id][campo]
    ) {
      //Bloques de datos
      if (nombreSeccion === "Idiomas" && campo === "Id")
        texto += "Idioma"; //getNameById(user_data.bloques[nombreSeccion][id][campo])
      else texto += user_data.bloques[nombreSeccion][id][campo];
    } else {
      //Texto generico
      texto += campo;
    }
  });
  return texto;
};

const PrevistaHTML = ({ user_data, documento }) => {
  if (!documento) return <></>;
  else {
    const docuStyle = {};
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
          user_data={user_data}
          documento={documento}
          obtenerTextoEstructura={obtenerTextoEstructura}
        />
      </div>
    );
  }
};

export default PrevistaHTML;
