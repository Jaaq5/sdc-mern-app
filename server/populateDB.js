const Categorias_Curriculum = require("./models/Categorias_Curriculum_Model");
const Categorias_Habilidad = require("./models/Categorias_Habilidad_Model");
const Categorias_Puesto = require("./models/Categorias_Puesto_Model");
const Categorias_EstadoP = require("./models/Categorias_EstadoP_Model");
const Categorias_Niveles = require("./models/Categorias_NivelI_Model");
const Idiomas = require("./models/Idiomas_Model");
const Preguntas = require("./models/Preguntas_Model");
const Curriculums_Templates = require("./models/Curriculums_Templates_Model");

//const plantilla_simple = require("./Plantillas/simple.json");
const plantilla_cuadrados = require("./plantillas/cuadrados.json");
//const plantilla_academico = require("./plantillas/plantilla_academico_simple.json");
const plantilla_harvard = require("./plantillas/plantilla_harvard.json");
const plantilla_academica = require("./plantillas/plantilla_academica.json");

const populateData = async () => {
  const catCurriculumData = [
    { name: "Simple" },
    { name: "Academico" },
    { name: "Laboral" },
    { name: "Harvard" },
  ];

  const catNivelesData = [
    { name: "Bajo" },
    { name: "Medio" },
    { name: "Alto" },
  ];

  const catHabilidadesData = [
    { name: "Habilidad Técnica" },
    { name: "Habilidad Blanda" },
  ];

  const catPuestoData = [
    { name: "Software" },
    { name: "Medicina" },
    { name: "Arte" },
    { name: "Historia" },
    { name: "Mecanica" },
    { name: "Electronica" },
    { name: "Electricidad" },
    { name: "Turismo" },
    { name: "Lenguajes" },
    { name: "Manipulacion de alimentos" },
    { name: "Administracion" },
    { name: "Contabilidad" },
    { name: "Servicio al Cliente" },
    { name: "Zoologia" },
    { name: "Arquitectura" },
  ];

  const IdiomasData = [
    { name: "Español" },
    { name: "Inglés" },
    { name: "Francés" },
    { name: "Mandarín" },
    { name: "Portugués" },
    { name: "Alemán" },
    { name: "Italiano" },
    { name: "Ruso" },
    { name: "Japonés" },
    { name: "Coreano" },
    { name: "Tagalog" },
    { name: "Hindi" },
    { name: "Cantonés" },
    { name: "Árabe" },
  ];

  const catEstadoPData = [
    { name: "Finalizado" },
    { name: "En progreso" },
    { name: "Hiatus" },
    { name: "Esperando confirmación" },
  ];

  const preguntasSeguridad = [
    { name: "¿El nombre de tu primer mascota?" },
    { name: "¿Nombre de tu personaje favorito?" },
    { name: "¿Cuál es tu platillo favorito?" },
    { name: "¿Queso favorito?" },
  ];

  const Plantillas = [
    //{ name : plantilla_simple.nombre, documento: plantilla_simple.Documento, categoria_curriculo: plantilla_simple.ID_Categoria_Curriculum, categoria_puesto: plantilla_simple.ID_Categoria_Puesto },
    {
      name: plantilla_cuadrados.Nombre,
      documento: plantilla_cuadrados.Documento,
      categoria_curriculo: plantilla_cuadrados.ID_Categoria_Curriculum,
      categoria_puesto: plantilla_cuadrados.ID_Categoria_Puesto,
    },
    {
      name: plantilla_academica.Nombre,
      documento: plantilla_academica.Documento,
      categoria_curriculo: plantilla_academica.ID_Categoria_Curriculum,
      categoria_puesto: plantilla_academica.ID_Categoria_Puesto,
    },

    {
      name: plantilla_harvard.Nombre,
      documento: plantilla_harvard.Documento,
      categoria_curriculo: plantilla_harvard.ID_Categoria_Curriculum,
      categoria_puesto: plantilla_harvard.ID_Categoria_Puesto,
    },
  ];

  try {
    for (const item of catCurriculumData) {
      await Categorias_Curriculum.updateOne(
        { Nombre: item.name },
        { $set: item },
        { upsert: true },
      );
    }
    console.log("Collection populated with Categorias_Curriculum values");
  } catch (err) {
    console.log("Error populating collection:", err);
  }

  try {
    for (const item of catHabilidadesData) {
      await Categorias_Habilidad.updateOne(
        { Nombre: item.name },
        { $set: item },
        { upsert: true },
      );
    }
    console.log("Collection populated with Categorias_Habilidad values");
  } catch (err) {
    console.log("Error populating collection:", err);
  }

  try {
    for (const item of catPuestoData) {
      await Categorias_Puesto.updateOne(
        { Nombre: item.name },
        { $set: item },
        { upsert: true },
      );
    }
    console.log("Collection populated with Categorias_Puesto values");
  } catch (err) {
    console.log("Error populating collection:", err);
  }

  try {
    for (const item of catEstadoPData) {
      await Categorias_EstadoP.updateOne(
        { Nombre: item.name },
        { $set: item },
        { upsert: true },
      );
    }
    console.log("Collection populated with Categorias_EstadoP values");
  } catch (err) {
    console.log("Error populating collection:", err);
  }

  try {
    for (const item of IdiomasData) {
      await Idiomas.updateOne(
        { Nombre: item.name },
        { $set: item },
        { upsert: true },
      );
    }
    console.log("Collection populated with Idiomas values");
  } catch (err) {
    console.log("Error populating collection:", err);
  }

  try {
    for (const item of catNivelesData) {
      await Categorias_Niveles.updateOne(
        { Nombre: item.name },
        { $set: item },
        { upsert: true },
      );
    }
    console.log("Collection populated with Categorias_Niveles values");
  } catch (err) {
    console.log("Error populating collection:", err);
  }

  try {
    for (const item of preguntasSeguridad) {
      await Preguntas.updateOne(
        { Nombre: item.name },
        { $set: item },
        { upsert: true },
      );
    }
    console.log("Collection populated with Preguntas values");
  } catch (err) {
    console.log("Error populating collection:", err);
  }

  //Plantillas
  try {
    for (const item of Plantillas) {
      await Curriculums_Templates.updateOne(
        {
          Nombre: item.name,
          ID_Categoria_Curriculum: item.categoria_curriculo,
          ID_Categoria_Puesto: item.categoria_puesto,
        },
        { $set: item },
        { upsert: true },
      );
      await Curriculums_Templates.updateOne(
        { Nombre: item.name },
        {
          $set: {
            Documento: JSON.stringify(item.documento),
          },
        },
      );
    }
    console.log("Collection populated with Plantillas values");
  } catch (err) {
    console.log("Error populating collection:", err);
  }
};
module.exports = populateData;
