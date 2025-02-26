const token = require("jsonwebtoken");
const Token = require("../models/token.js");

const secretKey = "aVerySecretKey";

const createToken = async (nickname) => {
  const createdToken = token.sign(nickname, secretKey); 
  return createdToken;
};

const verifyToken = (jwt) => {
  try {
    const nickname = token.verify(jwt, secretKey);
    return nickname;
  } catch (error) {
    return null;
  }
};

const saveToken = async (tokenData) => {
  const token = new Token(tokenData);
  return await token.save();
};

module.exports = { createToken, verifyToken, saveToken };
