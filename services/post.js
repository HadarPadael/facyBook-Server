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
    .sort({ time: -1 })
    .limit(20);

  // Find posts from non-friends
  const nonFriendPosts = await Post.find({ nickname: { $nin: friends } })
    .sort({ time: -1 })
    .limit(5);

  // Merge friend and non-friend posts
  const feedPosts = [...friendPosts, ...nonFriendPosts];

  // Sort the merged posts by date in acending order
  feedPosts.sort((a, b) => b.time - a.time);
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

const getPostById = async (postID) => {
  return await Post.findOne({postID});
};

async function updateLikes(post, { likes }) {
  try {
    if (likes !== undefined) {
      post.likes = likes;
      console.log("here");
    }
    await post.save();
    return post;
  } catch (error) {
    console.error("Error updating post:", error);
    throw new Error("Error updating post");
  }
}

async function deletePost(postID) {
  try {
    // Iterate through the comments and delete each one
    const comments = await Comment.find({ postID });
    for (const comment of comments) {
      await Comment.findOneAndDelete({ commentID: comment.commentID });
    }
    //delete the post itself
    const deletedPost = await Post.findOneAndDelete({ postID });

    if (!deletePost) {
      throw new NotFoundError("post not found");
    }
    return deletedPost;
  } catch (error) {
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
