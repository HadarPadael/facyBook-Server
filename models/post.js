const mongoose = require("mongoose");
const User = require("./user");
const Comment = require("./comment");

const Schema = mongoose.Schema;

const Post = new Schema({
  nickname: {
    type: String,
    ref: "User", 
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: String,
    required: true,
  },
  postPic: {
    type: String,
  },
  profilePic: {
    type: String,
  },
  postID: {
    type: String,
    required: true,
    uniqe: true,  
  },

  likes: [{ type: String, ref: "User" }],
  comments: [{ type: String, ref: "Comment" }],
});

module.exports = mongoose.model("Post", Post);
