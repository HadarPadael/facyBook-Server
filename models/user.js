const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const User = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    profilePic: {
      type: String, //path
      required: true,
    },

    nickname: {
      type: String,
      required: true,
      unique: true,
    },

    friends: [{ type: String, ref: "User" }],
    
    friendRequests: [{ type: String, ref: "User" }],
  },

  { id: false }
);

module.exports = mongoose.model("User", User);
