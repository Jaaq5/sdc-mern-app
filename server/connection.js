import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGO_URI || "";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

try {
  // Connect the client to the server
  await client.connect();
  // Send a ping to confirm a successful connection
  await client.db("sdc_database").command({ ping: 1 });
  console.log(
    "Pinged your deployment. You successfully connected to MongoDB!\n This is /server/connection.js, for db initialization",
  );
} catch (err) {
  console.error(err);
}

let db = client.db("sdc_database");

export default db;

//db.Usuarios.insert({Nombre:"Prueba_1", Email:"prueba@prueba.com", Contrasena:"1234", Bloque_ID:"", Curriculums_IDs:[]});
