const jwt = require("jsonwebtoken");

module.exports = async (payload) => {
  const token = await jwt.sign(payload, process.env.jwt_secret_key, {
    expiresIn: "1m"
  });
  return token;
};
