// CORS Middleware
// Permited origins from client
const permitedOrigins = [
  "http://localhost:80",
  "http://localhost:8080",
  "http://localhost:3000",
  "http://localhost:4000",
  "http://localhost:27017",
  "http://your-domain.com",
  "http://your-vm-public-ip:port",
  "http://129.80.112.63",
  "http://129.80.112.63:3000",
  "http://129.80.112.63:4000",
  "http://158.101.117.38",
  "http://158.101.117.38:3000",
  "http://158.101.117.38:4000",
  "http://54.167.83.75",
  "http://54.167.83.75:4000",
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
