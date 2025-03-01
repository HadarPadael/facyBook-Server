const postService = require("../services/post.js");
const tokenChecker = require("../tokenChecker.js").tokenChecker;

const getFeedPosts = async (req, res) => {
  try {
    const posts = await postService.getFeedPosts(req);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPostsComments = async (req, res) => {
  try {
    // Extract post ID from request parameters
    const postId = req.params.pid;

    // Retrieve the post by ID
    const post = await postService.getPostById(postId);

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ errors: ["Post not found"] });
    }

    // Update the post
    const comments = await postService.getPostsComments(postId);

    // Respond with the updated post
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error getting comments:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const addComment = async (req, res) => {
  try {
    // Extract post data from request body
    const { content, pic, postId, userName } = req.body;

    // Create the post
    const newComment = await postService.addComment({
      content,
      pic,
      postId,
      userName,
    });

    // Respond with the newly created post object
    res.status(201).json(newComment);
  } catch (error) {
    // Handle any errors that occur during post creation
    console.error("Error creating comment:", error);
    res.status(error.code).json({ message: error.message });
  }
};

const updateLikes = async (req, res) => {
  try {
    const postID = req.params.pid;
    const post = await postService.getPostById(postID);

    if (!post) {
      return res.status(404).json({ errors: ["Post not found"] });
    }

    const { likes } = req.body;
    const updatedPost = await postService.updateLikes(post, { likes });
    res.status(200).json(updatedPost);
    
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deletePost = async (req, res) => {
  try {
    const nickname = req.params.id;
    const postID = req.params.pid;
    const currentUser = await tokenChecker(req);
    console.log(`nickname: ${nickname}, currentUser: ${currentUser} postID: ${postID}`);

    // Check if the current user is the publisher of the post
    if (currentUser !== nickname) {
      return res.status(403).json({
        errors: ["Unauthorized: You are not the publisher of this post"],
      });
    }

    const deletedPost = await postService.deletePost(postID);
    console.log("post deleted successfully!");
    res.status(200).json(deletedPost);
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(error.code).json({ message: error.message });
  }
};

module.exports = {
  getFeedPosts,
  deletePost,
  getPostsComments,
  addComment,
  updateLikes,
};
