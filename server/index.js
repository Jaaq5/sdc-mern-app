// Import the express module
const express = require("express");

// Create an instance of an express application
const app = express();

// Environment variables ######################################################
// Doc: https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs
const port = process.env.PORT;

// Middleware #################################################################
app.use((req, res, next) => {
   console.log(req.path, req.method);
  next();
});

// Route #####################################################################
app.get("/", (req, res) => {
  res.send("If you see this, server is working 😀👍");
});

// The server listens on the port #############################################
app.listen(process.env.PORT, () => {
  console.log("");
  console.log(`Server listening on port bitch:${port}`);
  console.log(`Local: http://localhost:${port}`);
  console.log("");

});
