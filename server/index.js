// Environment variables ######################################################
// Doc: https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs

// IMPORTS ####################################################################
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoute");

// Create an instance of an express application
const app = express();

// Assign the port to listen to environment variable or default to available
const port = process.env.PORT ?? 0;

// Middleware #################################################################
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes #####################################################################
app.use("/api/users", userRoutes);

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
