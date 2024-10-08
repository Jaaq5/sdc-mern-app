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
const path = require("path");
const populateData = require("./populateDB");

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

// Serve static files and index.html in production
if (process.env.NODE_ENV === "production") {
	
  
  
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    const filePath = path.join(__dirname, "../client/build", "index.html");

    // Check if index.html exists
    res.sendFile(filePath, (err) => {
      if (err) {
        // File not found or other error
        res.status(404).send("Missing index.html from client/build.");
      }
    });
  });
  //Incluir aqui scripts solo para dev
}else if (process.env.NODE_ENV === "development"){
	const templateRoutesDev = require("./routes/curriculum_template_route_dev");
    app.use("/api/templates", templateRoutesDev);
}

// Connect to MongoDB #########################################################
const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", async () => {
  console.log("Connected to MongoDB");

  // Call the population function after connection is open
  try {
    await populateData();
    console.log("Database populated with default values.");
  } catch (err) {
    console.error("Error populating default values:", err);
  }

  // Start the server only after populating the database
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});