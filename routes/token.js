const express = require("express");
const router = express.Router();
const tokenController = require("../controllers/token.js");

router.post("/", tokenController.processLogin); //

module.exports = router;
