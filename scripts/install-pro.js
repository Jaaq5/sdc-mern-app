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
    "Please enter a PORT for server .env (3000-65535): ",
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
        console.log(
          `${RED}Database name is too long. Please enter a name up to 50 characters.${RESET}`,
        );
        validateMongoUri(callback);
      }
    },
  );
};

// Function to validate JWT_SECRET input #####################################
const validateJwtSecret = (callback) => {
  console.log("Example: mySecretKey");
  readLine.question(
    "Please enter a JWT secret (max 50 characters): ",
    (jwtSecret) => {
      if (jwtSecret.length <= 50) {
        callback(jwtSecret);
      } else {
        console.log(`${RED}Please enter a secret up to 50 characters.${RESET}`);
        validateJwtSecret(callback);
      }
    },
  );
};

// Function to validate public IP input ######################################
const validateIp = () => {
  return new Promise((resolve) => {
    console.log("Example: 129.80.112.63");
    readLine.question(
      "Please enter the public IP address for client: ",
      (ip) => {
        const ipRegex = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/;
        if (ipRegex.test(ip)) {
          resolve(ip);
        } else {
          console.log(
            `${RED}Invalid IP address. Please enter a valid public IP address.${RESET}`,
          );
          resolve(validateIp()); // Retry
        }
      },
    );
  });
};

// Install production dependencies ############################################
const installDependencies = (directory) =>
  new Promise((resolve, reject) => {
    exec(`cd ${directory} && npm install --omit=dev`, (error) => {
      if (error) {
        console.log(
          `${RED}Failed to install production dependencies in ${directory}.${RESET}`,
        );
        return reject(error);
      }
      console.log(
        `${GREEN}Production dependencies installed successfully.${RESET}`,
      );
      resolve();
    });
  });

// Check and create .env.production ###########################################
const setupEnvFile = (envFile, exampleEnv, replacements) => {
  // Check if .env.production file exists
  if (!fs.existsSync(envFile)) {
    console.log(`${BLUE}Setting up .env.production file for server...${RESET}`);
    if (fs.existsSync(exampleEnv)) {
      let content = fs.readFileSync(exampleEnv, "utf8");
      replacements.forEach(([search, replacement]) => {
        content = content.replace(search, replacement);
      });
      fs.writeFileSync(envFile, content, "utf8");
      console.log(
        `${GREEN}.env.production setup successfully for server.${RESET}`,
      );
    } else {
      console.log(
        `${RED}The example .env file does not exist: ${exampleEnv}${RESET}`,
      );
      process.exit(1);
    }
  } else {
    console.log(
      `${BLUE}.env.production already exists. Skipping creation.${RESET}`,
    );
  }
};

// Setup server .env file #####################################################
const setupServerEnv = (port, mongoUri, jwtSecret) => {
  const serverDir = path.join(__dirname, "..", "server");
  const envFile = path.join(serverDir, ".env.production");
  const exampleEnv = path.join(serverDir, ".env.example");

  setupEnvFile(envFile, exampleEnv, [
    ["NODE_ENV=CHANGEMYNAME", "NODE_ENV=production"],
    ["PORT=CHANGEMYNAME", `PORT=${port}`],
    [
      "MONGO_URI=CHANGEMYNAME",
      `MONGO_URI=mongodb://localhost:27017/${mongoUri}`,
    ],
    ["JWT_SECRET=CHANGEMYNAME", `JWT_SECRET=${jwtSecret}`],
  ]);
};

// Setup client .env file #####################################################
const setupClientEnv = async (port) => {
  const clientDir = path.join(__dirname, "..", "client");
  const envFile = path.join(clientDir, ".env.production");
  const exampleEnv = path.join(clientDir, ".env.example");

  if (!fs.existsSync(envFile)) {
    console.log(`${BLUE}Setting up .env.production file for client...${RESET}`);
    if (fs.existsSync(exampleEnv)) {
      let content = fs.readFileSync(exampleEnv, "utf8");
      try {
        const publicIp = await validateIp(); // Await IP validation

        // Replace placeholders in the .env.production file
        content = content
          .replace(/NODE_ENV=CHANGEMYNAME/, "NODE_ENV=production")
          .replace(
            /REACT_APP_API_URL=CHANGEMYNAME/,
            `REACT_APP_API_URL=http://${publicIp}:${port}`,
          );

        fs.writeFileSync(envFile, content, "utf8");
        console.log(
          `${GREEN}.env.production setup successfully for client.${RESET}`,
        );
      } catch (error) {
        console.error(
          `${RED}Error setting up .env.production for client: ${error.message}${RESET}`,
        );
        process.exit(1);
      }
    } else {
      console.log(
        `${RED}The example .env file does not exist: ${exampleEnv}${RESET}`,
      );
      process.exit(1);
    }
  } else {
    console.log(
      `${BLUE}.env.production already exists in client. Skipping creation.${RESET}`,
    );
  }
};

// Main script ################################################################
const runSetup = async () => {
  try {
    // Install production dependencies
    console.log(`${BLUE}Installing production dependencies...${RESET}`);
    await installDependencies(".");

    const serverEnvExists = fs.existsSync(
      path.join(__dirname, "..", "server", ".env.production"),
    );
    const clientEnvExists = fs.existsSync(
      path.join(__dirname, "..", "client", ".env.production"),
    );

    if (!serverEnvExists || !clientEnvExists) {
      validatePort(async (port) => {
        validateMongoUri(async (mongoUri) => {
          validateJwtSecret(async (jwtSecret) => {
            // Setup server and install dependencies if necessary
            if (!serverEnvExists) {
              setupServerEnv(port, mongoUri, jwtSecret);
              console.log(`${BLUE}Installing server dependencies...${RESET}`);
              await installDependencies(path.join(__dirname, "..", "server"));
            }

            // Setup client if necessary (no installation)
            if (!clientEnvExists) {
              await setupClientEnv(port); // Await client setup
            }

            console.log("");
            console.log(
              `${GREEN}All production dependencies installed successfully.${RESET}`,
            );
            readLine.close();
          });
        });
      });
    } else {
      // If .env.production files exist, just install dependencies
      console.log(
        `${BLUE}Both .env.production files already exist. Skipping creation.${RESET}`,
      );
      console.log(`${BLUE}Installing server dependencies...${RESET}`);
      await installDependencies(path.join(__dirname, "..", "server"));
      console.log("");
      console.log(
        `${GREEN}All production dependencies installed successfully.${RESET}`,
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
