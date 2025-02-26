const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Token = new Schema({
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // expires after 1 hour
  },
});

module.exports = mongoose.model("Token", Token);
