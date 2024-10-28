import { useState, useEffect } from "react";
import { Button, List, ListItemText, ListItemButton } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PushPinIcon from "@mui/icons-material/PushPin";
import VisibilityIcon from "@mui/icons-material/Visibility";

//TODO, mejorar campos incluidos
const BloquesListTexto = {
  Informacion_Personal: [
    ["Puesto", " - ", "Sobre_Mi"],
    ["Correo", ", ", "Telefono"],
  ],
  Experiencias_Laborales: [["Organizacion"], ["Puesto"]],
  Educacion_Formal: [["Programa", " en ", "Institucion"], ["Descripcion"]],
  Educacion_Tecnica: [["Programa", " en ", "Institucion"], ["Descripcion"]],
  Idiomas: [["Idioma"], ["Nivel"]],
  Habilidades: [["Nombre"], ["Descripcion"]],
  Proyectos: [["Proyecto"], ["Institucion"]],
  Publicaciones: [["Titulo"], ["Publicadora"]],
  Conferencias: [["Titulo"], ["Lugar"]],
  Premios: [["Nombre"], ["Institucion"], ["Fecha"]],
  Repositorios: [["Nombre"], ["Url"], ["Descripcion"]],
  Referencias: [["Nombre"], ["Email"]],
};

const obtenerTextoListaIDs = (user_data, _id, primary, Editando) => {
  let texto = "";
  BloquesListTexto[Editando.Seccion][primary ? 0 : 1].forEach((campo) => {
    if (user_data.bloques[Editando.Seccion][_id][campo])
      texto += user_data.bloques[Editando.Seccion][_id][campo];
    else texto += campo;
  });
  return texto;
};

const OrdenarBloques = (
  bloques,
  ID_Categoria_Curriculum,
  ID_Categoria_Puesto,
) => {
  let sortedBloques = [];
  if (!bloques) return [];
  //Ordenar por fecha
  if (bloques[Object.keys(bloques)[0]]?.Fecha_Final)
    sortedBloques = Object.entries(bloques).sort(
      ([, a], [, b]) => new Date(b.Fecha_Final) - new Date(a.Fecha_Final),
    );
  else if (bloques[Object.keys(bloques)[0]]?.Fecha_Publicacion)
    sortedBloques = Object.entries(bloques).sort(
      ([, a], [, b]) =>
        new Date(b.Fecha_Publicacion) - new Date(a.Fecha_Publicacion),
    );
  else sortedBloques = Object.entries(bloques).sort();

  //Ordenar por categorias
  sortedBloques = sortedBloques.sort(
    ([, a], [, b]) =>
      (b.ID_Categoria_Curriculum
        ? b.ID_Categoria_Curriculum === ID_Categoria_Curriculum
          ? 1
          : 0
        : 0) -
      (a.ID_Categoria_Curriculum
        ? a.ID_Categoria_Curriculum === ID_Categoria_Curriculum
          ? 1
          : 0
        : 0),
  );
  sortedBloques = sortedBloques.sort(
    ([, a], [, b]) =>
      (b.ID_Categoria_Puesto
        ? b.ID_Categoria_Puesto === ID_Categoria_Puesto
          ? 1
          : 0
        : 0) -
      (a.ID_Categoria_Puesto
        ? a.ID_Categoria_Puesto === ID_Categoria_Puesto
          ? 1
          : 0
        : 0),
  );
  return sortedBloques;
};

const crearBloquesToHTML = (
  user_data,
  TextoEditar,
  setTextoEditar,
  ListaEditar,
  setListaEditar,
  documento,
  setDocumento,
  Editando,
  setEditando,
) => {
  if (!user_data || !user_data.bloques) return <></>;

  const bloques = user_data.bloques[Editando.Seccion];

  const listStyle = {
    borderBottom: "solid 2px rgba(230, 150, 0, 0.2)",
    borderRadius: "0px",
    marginBottom: "5px",
    minHeight: "3rem",
    overflow: "hidden",
    backgroundColor: "#fff0",
    color: "#fff",
    padding: "2px",
  };
  const pinnedListStyle = {
    borderBottom: "solid 2px rgba(230, 150, 0, 0.2)",
    borderRadius: "0px",
    marginBottom: "5px",
    minHeight: "3rem",
    overflow: "hidden",
    backgroundColor: "#afa6",
    color: "#fff",
    padding: "2px",
  };
  const activeListStyle = {
    borderBottom: "solid 2px rgba(230, 150, 0, 0.2)",
    borderRadius: "0px",
    marginBottom: "5px",
    minHeight: "3rem",
    overflow: "hidden",
    backgroundColor: "#ffa3",
    color: "#fff",
    padding: "2px",
  };

  if (!bloques || Object.keys(bloques).length === 0)
    return (
      <ListItemButton
        key={"0"}
        style={listStyle}
        onClick={(e) => {
          setEditando(null);
        }}
      >
        <ListItemText
          primary={"No has agregado ningúna información aquí."}
          secondary={
            <span style={{ color: "#ccc" }}>
              {"Agrega en " + Editando.Seccion + ", y aparecerán aquí"}
            </span>
          }
        />
      </ListItemButton>
    );

  let sortedBloques = OrdenarBloques(
    bloques,
    Editando.ID_Categoria_Curriculum,
    Editando.ID_Categoria_Puesto,
  ); //Object.entries(bloques).sort();

  //TODO Ordenar por categorias
  //if(bloques && bloques[Object.keys(bloques)[0]].FechaFinal)
  //	sortedBloques = Object.entries(bloques).sort(
  //	  ([, a], [, b]) => new Date(b.Fecha_Final) - new Date(a.Fecha_Final),
  //	);

  let pinned = Editando.Arreglo
    ? documento.datos.Secciones[Editando.Seccion][Editando.Campo]
    : [documento.datos.Secciones[Editando.Seccion]];
  let active = Editando.Lista ? Editando.Lista : [];

  setListaEditar(
    sortedBloques.map(([plan_id, bloque], index) => (
      <>
        <ListItemButton
          key={plan_id}
          style={
            pinned.includes(plan_id + "")
              ? pinnedListStyle
              : active.includes(plan_id + "")
                ? activeListStyle
                : listStyle
          }
          onClick={(e) => {
            if (Editando.Campo) {
              if (Editando.Arreglo) {
                if (pinned.includes(plan_id + "")) {
                  documento.datos.Secciones[Editando.Seccion][Editando.Campo] =
                    pinned.filter((id) => id !== plan_id);
                } else if (
                  pinned.length <
                  documento.datos.Secciones[Editando.Seccion].Cantidad
                ) {
                  documento.datos.Secciones[Editando.Seccion][
                    Editando.Campo
                  ].push(plan_id);
                }
              } else {
              }
            } else {
              //Informacion_Personal
              documento.datos.Secciones[Editando.Seccion] = plan_id;
            }
            setDocumento(documento);
            crearBloquesToHTML(
              user_data,
              TextoEditar,
              setTextoEditar,
              ListaEditar,
              setListaEditar,
              documento,
              setDocumento,
              Editando,
              setEditando,
            );
            //setEditando(null);
          }}
        >
          {pinned.includes(plan_id + "") ? (
            <>
              <PushPinIcon
                style={{ position: "absolute", right: "5px", top: "5px" }}
              />
            </>
          ) : active.includes(plan_id + "") ? (
            <>
              <VisibilityIcon
                style={{ position: "absolute", right: "5px", top: "5px" }}
              />
            </>
          ) : (
            <></>
          )}
          <ListItemText
            style={{ maxWidth: "90%" }}
            primary={obtenerTextoListaIDs(user_data, plan_id, true, Editando)}
            secondary={
              <span style={{ color: "#ccc" }}>
                {obtenerTextoListaIDs(user_data, plan_id, false, Editando)}
              </span>
            }
          />
        </ListItemButton>
      </>
    )),
  );
};

const BotonesCantidad = ({
  setTextoEditar,
  documento,
  setDocumento,
  Editando,
}) => {
  let cantidad = documento.datos.Secciones[Editando.Seccion].Cantidad;
  const moveButton = {
    padding: 0,
    margin: 0,
    color: "#fff",
    minWidth: "24px",
    width: "24px",
    height: "24px",
  };
  const moveButtonDown = {
    padding: 0,
    margin: 0,
    color: "#fff",
    minWidth: "24px",
    width: "24px",
    height: "24px",
  };

  return (
    <div style={{ textAlign: "center", display: "inline" }}>
      <span style={{ color: "#fff", fontWeight: "900", fontSize: "1.2em" }}>
        <Button
          style={moveButton}
          onClick={(e) => {
            cantidad -= cantidad > 0 ? 1 : 0;
            documento.datos.Secciones[Editando.Seccion].Cantidad = cantidad;
            setTextoEditar(cantidad);
            setDocumento(documento);
          }}
        >
          <KeyboardArrowLeftIcon />
        </Button>

        {cantidad}

        <Button
          style={moveButtonDown}
          onClick={(e) => {
            cantidad += cantidad < 21 ? 1 : 0;
            documento.datos.Secciones[Editando.Seccion].Cantidad = cantidad;
            setTextoEditar(cantidad);
            setDocumento(documento);
          }}
        >
          <KeyboardArrowRightIcon />
        </Button>
      </span>
    </div>
  );
};
/*const EditorCantidad = ({TextoEditar, setTextoEditar, documento, setDocumento, Editando, setEditando}) => {
return (<div style={{backgroundColor: "#303030", position: "absolute", left: "300px", width: "200px", textAlign: "center"}}>
		<div style={{color: "#fff", fontWeight: "900", fontSize: "1.2em", borderBottom: "solid 2px rgb(200,200,200)", padding: "3px", textAlign: "center"}}>Cuantos campos mostrar</div>
		<BotonesCantidad TextoEditar={TextoEditar} setTextoEditar={setTextoEditar} documento={documento} setDocumento={setDocumento} Editando={Editando} />
	</div>);
};*/

const SelectorID = ({
  user_data,
  ListaEditar,
  setListaEditar,
  documento,
  setDocumento,
  Editando,
  setEditando,
  SeleccionarIDs,
  zoom,
}) => {
  //<BloquesToHTML user_data={user_data} TextoEditar={TextoEditar} setTextoEditar={setTextoEditar} ListaEditar={ListaEditar} setListaEditar={setListaEditar} documento={documento} setDocumento={setDocumento} Editando={Editando} setEditando={setEditando} />

  const [ListaSeleccionableIDs, setListaSeleccionable] = useState([]);
  const [TextoEditar, setTextoEditar] = useState([]);

  if (ListaSeleccionableIDs.length === 0)
    crearBloquesToHTML(
      user_data,
      TextoEditar,
      setTextoEditar,
      ListaSeleccionableIDs,
      setListaSeleccionable,
      documento,
      setDocumento,
      Editando,
      setEditando,
    );

  let item = documento;
  Editando.path.forEach((campo) => (item = item[campo]));

  useEffect(() => {});

  return (
    <div
      id={"Selector_IDs"}
      style={{
        pointerEvents: "auto",
        backgroundColor: "#303030",
        border: "solid 0px #333",
        borderRadius: "0px",
        position: "absolute",
        left: Math.max(Editando.pos[0] * 0 - 300 / zoom, 0) * zoom + "px",
        top: Math.max(Editando.pos[1] * 0, 20) * zoom + "px",
        marginTop: "-10px",
        maxWidth: "300px",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          color: "#fff",
          fontWeight: "900",
          fontSize: "1.2em",
          borderBottom: "solid 2px rgb(200,200,200)",
          padding: "3px",
          textAlign: "center",
        }}
      >
        {item.Editable?.Titulo}
        {Editando.Arreglo ? (
          <div>
            <BotonesCantidad
              setTextoEditar={setTextoEditar}
              documento={documento}
              setDocumento={setDocumento}
              Editando={Editando}
            />
          </div>
        ) : (
          <></>
        )}
        <Button
          onClick={(e) => {
            setEditando(null);
            SeleccionarIDs(
              user_data,
              documento,
              user_data.curriculums[user_data.editando_curriculo]
                .ID_Categoria_Curriculum,
              user_data.curriculums[user_data.editando_curriculo]
                .ID_Categoria_Puesto,
            );
          }}
        >
          <CheckCircleIcon color="success" />{" "}
        </Button>
      </div>
      <List
        style={{
          width: "100%",
          maxHeight: "300px",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {ListaSeleccionableIDs}
      </List>
    </div>
  );
};

export { SelectorID };
