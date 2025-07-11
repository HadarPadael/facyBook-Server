const User = require("../models/user.js");
const Post = require("../models/post.js");

async function areFriends(nickname1, nickname2) {
  const user1 = await User.findOne({ nickname: nickname1 });
  const user2 = await User.findOne({ nickname: nickname2 });

  if (!user1 || !user2) {
    return false;
  }

  // return true (friends) / false (not friends)
  return (
    (user1.friends.includes(nickname2) && user2.friends.includes(nickname1)) ||
    nickname1 === nickname2
  );
}

async function createUser(nickname, password, compressedPic, username) {
  try {
    // Check if there exists a user with the given username
    const userExists = await User.findOne({ username });
    if (userExists) {
      throw new Error("Username already exists");
    }

    // Create a new user object
    const newUser = new User({
      username,
      nickname,
      password,
      profilePic: compressedPic,
      friends: [],
      friendRequests: [],
    });

    // Save the new user to the database and return it
    const savedUser = await newUser.save();
    return savedUser;
  } catch (error) {
    console.log(error);
    throw new Error("Error creating new user. Try again later.");
  }
}

async function checkUserExistence(username) {
  try {
    // Check if user already exists with the given username
    const existingUser = await User.findOne({ username });
    return existingUser;
  } catch (error) {
    throw error;
  }
}

async function getUserDetails(nickname) {
  try {
    const user = await User.findOne({ nickname });

    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    console.error("Error fetching user details from database:", error);
    throw new Error("Error fetching user details");
  }
}

async function getFriendPosts(nickname) {
  try {
    // Get friend's posts, sorted by date
    const friendPosts = await Post.find({ nickname: nickname }).sort({
      date: 1,
    });
    return friendPosts;
  } catch (error) {
    console.error("Error fetching friend posts:", error);
    throw new Error("Error fetching friend posts");
  }
}

async function createPost(nickname, { content, compressedPic }) {
  try {
    const user = await User.findOne({ nickname: nickname });

    // Ensure that the user exists
    if (!user) {
      throw new Error(`User with username '${nickname}' not found`);
    }
    const newPost = new Post({
      nickname,
      content,
      postPic: compressedPic,
      profilePic: user.profilePic,
      time: new Date(),
    });

    await newPost.save();
    return newPost;
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Error creating post");
  }
}

async function askToBeFriend(currentUser, requestedUser) {
  try {
    await User.updateOne(
      { nickname: requestedUser },
      { $addToSet: { friendRequests: currentUser } }
    );
  } catch (error) {
    console.error("Error sending friend request:", error);
    throw new Error("Error sending friend request");
  }
}

async function cancelRequest(currentUser, requestedUser) {
  try {
    await User.updateOne(
      { nickname: requestedUser },
      { $pull: { friendRequests: currentUser } }
    );
  } catch (error) {
    console.error("Error canceling friend request:", error);
    throw new Error("Error cancling friend request");
  }
}

async function denyRequest(currentUser, requesterUser) {
  try {
    await User.updateOne(
      { nickname: currentUser },
      { $pull: { friendRequests: requesterUser } }
    );
  } catch (error) {
    console.error("Error denying friend request:", error);
    throw new Error("Error denying friend request");
  }
}

async function acceptFriendship(senderUser, receiverUser) {
  try {
    //update both sides friends lists, and the recivers requests list
    await User.updateOne(
      { nickname: senderUser },
      { $addToSet: { friends: receiverUser } }
    );

    await User.updateOne(
      { nickname: receiverUser },
      { $addToSet: { friends: senderUser } }
    );

    await User.updateOne(
      { nickname: receiverUser },
      { $pull: { friendRequests: senderUser } }
    );
  } catch (error) {
    console.error("Error accepting friendship:", error);
    throw new Error("Error accepting friendship");
  }
}

module.exports = {
  createUser,
  checkUserExistence,
  getUserDetails,
  areFriends,
  getFriendPosts,
  createPost,
  askToBeFriend,
  acceptFriendship,
  cancelRequest,
  denyRequest,
};
