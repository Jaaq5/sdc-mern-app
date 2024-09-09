// CORS Middleware
// Permited origins from client
const permitedOrigins = [
  "http://localhost:80",
  "http://localhost:8080",
  "http://www.dominio-oracle-vm.com",
  "http://localhost:3000",
  "http://localhost:4000",
  "http://localhost:27017",
];

// Enable CORS for specific origins
const corsOptions = {
  origin: function (origin, callback) {
    if (permitedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 200,
};

// Export the middleware
module.exports = corsOptions;
