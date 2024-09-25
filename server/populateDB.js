const Categorias_Curriculum = require("./models/Categorias_Curriculum_Model");

const populateData = async () => {
    const defaultData = [
      { name: 'Simple'},
      { name: 'Academico'},
      { name: 'Laboral'},
    ];
  
    try {
      for (const item of defaultData) {
        await Categorias_Curriculum.updateOne(
          { Nombre: item.name }, 
          { $set: item }, 
          { upsert: true }
        );
      }
      console.log('Collection populated with default values');
    } catch (err) {
      console.log('Error populating collection:', err);
    }
  };
  module.exports = populateData;