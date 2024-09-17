// Import modules #############################################################
const fs = require("fs");
const readline = require("readline");
const { exec } = require("child_process");
const path = require("path");

// Define colors for output ###################################################
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const BLUE = "\x1b[34m";
const RESET = "\x1b[0m";

// Create readline interface for user input ##################################
const readLine = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to validate PORT input ###########################################
const validatePort = (callback) => {
  console.log("Example: 4000");
  readLine.question(
    "Enter a PORT for server .env file (3000-65535): ",
    (port) => {
      const portNum = parseInt(port);
      if (!isNaN(portNum) && portNum >= 3000 && portNum <= 65535) {
        callback(portNum);
      } else {
        console.log(
          `${RED}Invalid PORT. Please enter a number between 3000 and 65535.${RESET}`,
        );
        validatePort(callback);
      }
    },
  );
};

// Function to validate MONGO_URI input ######################################
const validateMongoUri = (callback) => {
  console.log("Example: sdc_db");
  readLine.question(
    "Please enter a database name (max 50 characters): ",
    (uri) => {
      if (uri.length <= 50) {
        callback(uri);
      } else {
        console.log(`${RED}Please enter a name up to 50 characters.${RESET}`);
        validateMongoUri(callback);
      }
    },
  );
};

// Install dependencies ######################################################
const installDependencies = (directory) =>
  new Promise((resolve, reject) => {
    exec(`cd ${directory} && npm install`, (error) => {
      if (error) {
        console.log(
          `${RED}Failed to install dev dependencies in ${directory}.${RESET}`,
        );
        return reject(error);
      }
      console.log(`${GREEN}Dev dependencies installed successfully.${RESET}`);
      resolve();
    });
  });

// Check and create .env.development ##########################################
const setupEnvFile = (envFile, exampleEnv, replacements) => {
  // Check if .env.development file exists
  if (!fs.existsSync(envFile)) {
    console.log(`${BLUE}Setting up .env.development file...${RESET}`);
    if (fs.existsSync(exampleEnv)) {
      let content = fs.readFileSync(exampleEnv, "utf8");
      replacements.forEach(([search, replacement]) => {
        content = content.replace(search, replacement);
      });
      fs.writeFileSync(envFile, content, "utf8");
      console.log(`${GREEN}.env.development setup successfully.${RESET}`);
    } else {
      console.log(
        `${RED}The example .env file does not exist: ${exampleEnv}${RESET}`,
      );
      process.exit(1);
    }
  } else {
    console.log(
      `${BLUE}.env.development already exists. Skipping creation.${RESET}`,
    );
  }
};

// Setup server .env file #####################################################
const setupServerEnv = (port, mongoUri) => {
  const serverDir = path.join(__dirname, "..", "server");
  const envFile = path.join(serverDir, ".env.development");
  const exampleEnv = path.join(serverDir, ".env.example");

  setupEnvFile(envFile, exampleEnv, [
    ["NODE_ENV=CHANGEMYNAME", "NODE_ENV=development"],
    ["PORT=CHANGEMYNAME", `PORT=${port}`],
    [
      "MONGO_URI=CHANGEMYNAME",
      `MONGO_URI=mongodb://localhost:27017/${mongoUri}`,
    ],
  ]);
};

// Setup client .env file #####################################################
const setupClientEnv = (port) => {
  const clientDir = path.join(__dirname, "..", "client");
  const envFile = path.join(clientDir, ".env.development");
  const exampleEnv = path.join(clientDir, ".env.example");

  setupEnvFile(envFile, exampleEnv, [
    ["NODE_ENV=CHANGEMYNAME", "NODE_ENV=development"],
    [
      "REACT_APP_API_URL=CHANGEMYNAME",
      `REACT_APP_API_URL=http://localhost:${port}`,
    ],
  ]);
};

// Main script ################################################################
const runSetup = async () => {
  try {
    // Install development dependencies
    console.log(`${BLUE}Installing development dependencies...${RESET}`);
    await installDependencies(".");

    const serverEnvExists = fs.existsSync(
      path.join(__dirname, "..", "server", ".env.development"),
    );
    const clientEnvExists = fs.existsSync(
      path.join(__dirname, "..", "client", ".env.development"),
    );

    if (!serverEnvExists || !clientEnvExists) {
      validatePort(async (port) => {
        validateMongoUri(async (mongoUri) => {
          // Setup server and install dependencies if necessary
          if (!serverEnvExists) {
            setupServerEnv(port, mongoUri);
            console.log(`${BLUE}Installing server dependencies...${RESET}`);
            await installDependencies(path.join(__dirname, "..", "server"));
          }

          // Setup client and install dependencies if necessary
          if (!clientEnvExists) {
            setupClientEnv(port);
            console.log(`${BLUE}Installing client dependencies...${RESET}`);
            await installDependencies(path.join(__dirname, "..", "client"));
          }
          console.log("");
          console.log(
            `${GREEN}All development dependencies installed successfully.${RESET}`,
          );
          readLine.close();
        });
      });
    } else {
      // If .env.development files exist, just install dependencies
      console.log(
        `${BLUE}Both .env.development files already exist. Skipping creation.${RESET}`,
      );
      console.log(`${BLUE}Installing server dependencies...${RESET}`);
      await installDependencies(path.join(__dirname, "..", "server"));
      console.log(`${BLUE}Installing client dependencies...${RESET}`);
      await installDependencies(path.join(__dirname, "..", "client"));
      console.log("");
      console.log(
        `${GREEN}All development dependencies installed successfully.${RESET}`,
      );
      readLine.close();
    }
  } catch (error) {
    console.error(
      `${RED}An error occurred during setup: ${error.message}${RESET}`,
    );
    process.exit(1);
  }
};

runSetup();
