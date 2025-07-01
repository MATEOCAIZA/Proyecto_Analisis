const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).send("Token requerido");

  jwt.verify(token, "secreto", (err, user) => {
    if (err) return res.status(403).send("Token inválido");
    req.user = user;
    next();
  });
};