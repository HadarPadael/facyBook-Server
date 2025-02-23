const express = require('express');
var router = express.Router();
const userController = require("../controllers/user.js");

router.route("/").post(userController.createUser);

// router
//   .route("/:id")
//   .get(userController.getUserDetails) // for login
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);

// router
//   .route("/:id/posts")
//   .get(userController.getFriendPosts)
//   .post(userController.createPost);

// router
//   .route("/:id/friends")
//   .get(userController.getFriends)
//   .post(userController.askToBeFriend);

// router
//   .route("/:id/friends/:fid")
//   .patch(userController.acceptFriendship)
//   .delete(userController.deleteFriend);

module.exports = router;
