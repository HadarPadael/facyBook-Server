const express = require("express");
var router = express.Router();
const userController = require("../controllers/user.js");

router.route("/").post(userController.createUser); //

router.route("/:id").get(userController.getUserDetails); //

router
  .route("/:id/posts")
  .get(userController.getFriendPosts) //*
  .post(userController.createPost); //

router
  .route("/:id/friends")
  .get(userController.getFriends)
  .post(userController.askToBeFriend) //
  .patch(userController.cancelRequest); //
  
router.route("/:id/friends/deny").patch(userController.denyRequest); //

router.route("/:id/friends/:fid").patch(userController.acceptFriendship); //
module.exports = router;
