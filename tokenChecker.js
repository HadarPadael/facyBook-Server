const tokenService = require("./services/token.js");

const tokenChecker = async (req) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return { error: "Missing or invalid token" };
  }

  const token = await req.headers.authorization.split(" ")[1];
  const affirmedToken = tokenService.verifyToken(token);

  // affirmedToken = nickname
  return affirmedToken;
};

module.exports = { tokenChecker };
