const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Verifica si la cookie contiene el accessToken
  const token = req.cookies.accessToken;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "No está autenticado" });
  }

  // Verifica el token usando la clave secreta
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: "Token inválido" });
    }

    // Agrega la información del usuario a la solicitud
    req.user = user;
    next();
  });
};

module.exports = authMiddleware;
