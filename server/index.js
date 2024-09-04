// Environment variables ######################################################
// Doc: https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs

// IMPORTS ####################################################################
const express = require("express");
const cors = require("cors");
const corsOptions = require("./middleware/corsMiddleware");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const userRoutes = require("./routes/usuario_route");
const catCurrRoutes = require("./routes/categoria_curriculum_route");
const skillRoutes = require("./routes/categoria_habilidad_route");
const jobRoutes = require("./routes/categoria_puesto_route");
const languageRoutes = require("./routes/idioma_route");
const templateRoutes = require("./routes/curriculum_template_route");

// Create an instance of an express application
const app = express();

// Assign the port to listen to environment variable or default to available
const port = process.env.PORT ?? 0;

// Middleware #################################################################
app.use(express.json());

// Enable CORS for all origins
// app.use(cors());

// Enable CORS for specific origins
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));

// Log requests
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes #####################################################################
app.use("/api/users", userRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/cat-curriculums", catCurrRoutes);
app.use("/api/cat-job", jobRoutes);
app.use("/api/cat-skill", skillRoutes);
app.use("/api/cat-language", languageRoutes);

//app.get("/address", (req, res) => {return res.status(200).json({success: true, msg: "Direccion", address: process.env.PORT});});

// Connect to MongoDB #########################################################
const mongoUri = process.env.MONGO_URI;

mongoose
  .connect(mongoUri)
  .then(() => {
    // The server listens on the port #############################################
    app.listen(process.env.PORT, () => {
      console.log("");
      console.log(`Connected to MongoDB and listening on port:${port}`);
      //console.log(`Local: http://localhost:${port}`);
      console.log("");
    });
  })
  .catch((error) => {
    console.log(error);
  });
