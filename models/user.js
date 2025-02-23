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

    userId: {
      type: String,
      required: true,
      unique: true,
    },

    // Array of user IDs representing friends
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],

    // Array of user IDs representing friend requests
    friendRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },

  { id: false }
);

module.exports = mongoose.model("User", User);
