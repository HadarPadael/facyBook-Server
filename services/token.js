// const token = require("jsonwebtoken");
// const Token = require("../models/token").default;

// // Secret key for token
// const secretKey = "aVerySecretKey";

// // Function to generate token
// const createToken = async (username) => {
//   const createdToken = token.sign(username, secretKey); //TODO check if assigning a variable possible syntaxly
//   return createdToken;
// };

// // Function to verify token
// // Supposed to return the username.
// // TODO: checl it acctually does.
// const verifyToken = (jwt) => {
//   try {
//     const username = token.verify(jwt, secretKey);
//     return username;
//   } catch (error) {
//     return null;
//   }
// };

// // Function to save token to database
// const saveToken = async (tokenData) => {
//   const token = new Token(tokenData);
//   return await token.save();
// };

// module.exports = { createToken, verifyToken, saveToken };
