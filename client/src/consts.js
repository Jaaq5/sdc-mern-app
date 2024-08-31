const Axios_Url = "http://localhost:27017";

export { Axios_Url };

// Using environment variables for API URL or default
const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:27017";

export { apiUrl };
