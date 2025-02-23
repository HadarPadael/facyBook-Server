// const postService = require("../services/post");
// const tokenChecker = require("../tokenChecker").tokenChecker;

// const getFeedPosts = async (req, res) => {
//   try {
//     const posts = await postService.getFeedPosts(req);
//     res.json(posts);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // const getUserDetails = async (req, res) => {
// // };

// const createPost = async (req, res) => {
//   res.json(await postService.createPost(req)); //check syntax
// };

// const getPosts = async (_, res) => {
//   res.json(await postService.getPosts());
// };

// const getPost = async (req, res) => {
//   const post = await postService.getPostById(req.params.id);
//   if (!post) {
//     return res.status(404).json({ errors: ["Post not found"] });
//   }
//   res.json(post);
// };

// //handle exception
// const updatePost = async (req, res) => {
//   try {
//     // Extract post ID from request parameters
//     const postId = req.params.pid;

//     // Extract user from token
//     const currentUser = tokenChecker(req);

//     // Retrieve the post by ID
//     const post = await postService.getPostById(postId);

//     // Check if the post exists
//     if (!post) {
//       return res.status(404).json({ errors: ["Post not found"] });
//     }

//     // Check if the current user is the publisher of the post
//     if (post.publisher !== currentUser) {
//       return res
//         .status(403)
//         .json({
//           errors: ["Unauthorized: You are not the publisher of this post"],
//         });
//     }

//     // Extract text and picture from request body
//     const { text, picture } = req.body;

//     // Update the post
//     const updatedPost = await postService.updatePost(postId, { text, picture });

//     // Respond with the updated post
//     res.json(updatedPost);
//   } catch (error) {
//     console.error("Error updating post:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// const deletePost = async (req, res) => {
//   try {
//     // Extract username from request parameters
//     const username = req.params.id;
//     // Extract post ID from request parameters
//     const postId = req.params.pid;

//     // Extract user from token
//     const currentUser = tokenChecker(req);

//     // Check if the current user is the publisher of the post
//     if (currentUser !== username) {
//       return res
//         .status(403)
//         .json({
//           errors: ["Unauthorized: You are not the publisher of this post"],
//         });
//     }

//     // Delete the post
//     const deletedPost = await postService.deletePost(postId);

//     // Check if the post was found and deleted
//     if (!deletedPost) {
//       return res.status(404).json({ errors: ["Post not found"] });
//     }

//     // Respond with the deleted post
//     res.json(deletedPost);
//   } catch (error) {
//     console.error("Error deleting post:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// module.exports = {
//   getFeedPosts,
//   createPost,
//   getPosts,
//   getPost,
//   updatePost,
//   deletePost,
// };
