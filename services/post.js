const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");
const tokenChecker = require("../tokenChecker").tokenChecker;

const getFeedPosts = async (req) => {
  // Step 1: Extract current user's information from the token.
  // tokenChecker(req) also checks token validity.
  const currentName = await tokenChecker(req);

  const currentUser = await User.findOne({ nickname: currentName });

  const { friends } = currentUser; 

  // Find posts from friends
  const friendPosts = await Post.find({ nickname: { $in: friends } })
    .sort({ date: 1 })
    .limit(20);

  // Find posts from non-friends
  const nonFriendPosts = await Post.find({ nickname: { $nin: friends } })
    .sort({ date: 1 })
    .limit(5);

  // Merge friend and non-friend posts
  const feedPosts = [...friendPosts, ...nonFriendPosts];

  // Sort the merged posts by date in acending order
  feedPosts.sort((a, b) => a.time - b.time);

  return feedPosts;
};

const getPostsComments = async (postId) => {
  try {
    const comments = await Comment.find({ postId: postId });
    const postsComments = [...comments];

    return postsComments;
  } catch (error) {
    // Handle any errors that occur
    console.error("Error getting comments from schema:", error);
    throw new Error("Error getting comments");
  }
};

const addComment = async ({ content, pic, postId, userName }) => {
  try {
    // Create the new comment
    const newComment = new Comment({
      userName: userName,
      content: content,
      pic: pic,
      postId: postId,
    });

    newComment.cid = newComment._id.toString();

    await Post.updateOne(
      { postId: postId },
      { $addToSet: { comments: newComment.cid } }
    );

    // Save the new post to the database
    await newComment.save();
    return newComment;
  } catch (error) {
    // Handle any errors that occur during post creation
    console.error("Error creating comment:", error);
    throw error;
  }
};

const createPost = async (req) => {
  if (tokenChecker(req)) {
    // TODO: check next line:
    const post = new Post({
      text: req.body.text,
      publisher: req.body.publisher,
    });
    if (req.body.date) {
      post.date = req.body.date;
    }
    if (req.body.picture) {
      post.picture = req.body.picture;
    }
    return await post.save();
  } else {
    // Token is invalid
    return { error: "Invalid token" };
  }
};

const getPosts = async () => {
  return await Post.find({});
};

const getPostById = async (postId) => {
  return await Post.findById(postId);
};

async function updateLikes(postId, { likes }) {
  try {
    const post = await getPostById(postId);
    if (!post) return null;

    // Update the relevant members if provided
    if (likes !== undefined) {
      post.likes = likes;
    }

    await post.save();
    return post;
  } catch (error) {
    // Handle any errors that occur during post update
    console.error("Error updating post:", error);
    throw new Error("Error updating post");
  }
}

async function deletePost(postId) {
  try {
    // Find the post by its ID and delete it
    const comments = await Comment.find({ postId: postId });

    // Iterate through the comments and delete each one
    for (const comment of comments) {
      await Comment.findByIdAndDelete(comment.cid);
    }
    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletePost) {
      throw new NotFoundError("post not found");
    }
    return deletedPost;
  } catch (error) {
    // Handle any errors that occur during post deletion
    console.error("Error deleting post:", error);
    throw error;
  }
}

module.exports = {
  getFeedPosts,
  createPost,
  getPosts,
  getPostById,
  getPostsComments,
  addComment,
  updateLikes,
  deletePost,
};
