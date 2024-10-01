const Categorias_Curriculum = require("./models/Categorias_Curriculum_Model");
const Categorias_Habilidad = require("./models/Categorias_Habilidad_Model");
const Categorias_Puesto = require("./models/Categorias_Puesto_Model");
const Idiomas = require("./models/Idiomas_Model");

const populateData = async () => {
  const catCurriculumData = [
    { name: "Simple" },
    { name: "Academico" },
    { name: "Laboral" },
    { name: "Harvard" },
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
};
module.exports = populateData;
