const postController = require("../controllers/post");

const express = require("express");
var router = express.Router();

router.route("/").get(postController.getFeedPosts); //

router
  .route("/:id/posts/:pid")
  .delete(postController.deletePost);

router.route("/:id/posts/:pid/likes").patch(postController.updateLikes);

router
  .route("/:id/posts/:pid/comments")
  .get(postController.getPostsComments)
  .post(postController.addComment)

module.exports = router;
