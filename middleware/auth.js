const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    res.status(401).send({ message: "Plz login " });
  }
  try {
    const decode = jwt.verify(token, 'shhhh');
    console.log(decode);
    req.user = decode;
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: " Invalid token " });
  }

  return next();
};

module.exports = auth;
