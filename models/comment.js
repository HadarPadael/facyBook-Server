const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Comment = new Schema({
  nickname: {
    type: String,
    ref: "User", // Name of the referenced model
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
  },
  commentID: {
    type: String,
    required: true,
    uniqe: true,
  },
  postID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("Comment", Comment);
