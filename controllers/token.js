const tokenService = require("../services/token.js");
const userService = require("../services/user.js");

// Controller function to generate a token (after a successfull log-in):
const processLogin = async (req, res) => {
  // Authenticate user with username and password
  const userExist = await userService.checkUserExistence(req.body.username);
  if (userExist) {
    // Create token
    const token = await tokenService.createToken(userExist.nickname);
    // Save token to database
    // TODO: check if next line needed:
    await tokenService.saveToken({ token });
    // Return the token
    res.status(200).json({ token, userExist });
  } else {
    res.status(404).send("Invalid credentials");
  }
};

// Middleware function to verify token
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = tokenService.verifyToken(token);
  if (decodedToken) {
    // Token is valid
    req.user = decodedToken;
    next();
  } else {
    res.status(401).send("Invalid token");
  }
};

module.exports = { processLogin, verifyToken };
