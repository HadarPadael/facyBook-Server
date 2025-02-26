
const User = require("../models/user.js");
const Post = require("../models/post.js");
const { get } = require("mongoose");

async function areFriends(nickname1, nickname2) {
  const user1 = await User.findOne({ nickname: nickname1 });
  const user2 = await User.findOne({ nickname: nickname2 });

  if (!user1 || !user2) {
    return false; // One of the users doesn't exist
  }

  // return true (friends) / false (not friends)
  return user1.friends.includes(nickname2) && user2.friends.includes(nickname1);
}

async function getNewId() {
  try {
    // Fetch all users IDs
    const users = await User.find({}, { userId: 1 });

    // If there are no users yet, assign the first ID as 1
    if (users.length === 0) {
      return 1;
    }

    // Else: find the maximum ID and assign a new ID by incrementing the maximum ID by 1
    const maxId = Math.max(...users.map((user) => parseInt(user.userId, 10)));
    return maxId + 1;
  } catch (error) {
    console.error("Error fetching users or calculating new ID:", error);
    throw new Error("Error generating new ID");
  }
}

async function createUser(nickname, password, compressedPic, username) {
  try {
    // Check if there exists a user with the given username
    const userExists = await User.findOne({ username });
    if (userExists) {
      throw new Error("Username already exists");
    }

    // Else: generate new user ID
    const userId = await getNewId();

    // Create a new user object
    const newUser = new User({
      username,
      nickname,
      password,
      profilePic: compressedPic,
      friends: [],
      friendRequests: [],
      userId,
    });

    // Save the new user to the database and return it
    const savedUser = await newUser.save();
    return savedUser;
  } catch (error) {
    throw error;
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

async function getFriendPosts(currentUserUsername, friendUsername) {
  try {
    // Find the friend user
    const friend = await User.findOne({ username: friendUsername });

    // If friend not found, return an empty array
    if (!friend) {
      return [];
    }

    // Check if currentUser is in friend's friend list
    if (!friend.friends.includes(currentUserUsername)) {
      return []; // currentUser is not a friend of friendUsername
    }

    // Get friend's posts sorted by date
    const friendPosts = await Post.find({ publisher: friendUsername }).sort({
      date: -1,
    });

    return friendPosts;
  } catch (error) {
    // Handle any errors that occur during fetching friend posts
    console.error("Error fetching friend posts:", error);
    throw new Error("Error fetching friend posts");
  }
}

async function getNewId() {
  try {
    // Fetch all post IDs
    const posts = await Post.find({}, { postID: 1 });

    // If there are no posts yet, assign the first ID as 1
    if (posts.length === 0) {
      return 1;
    }

    // Else: find the maximum ID and assign a new ID by incrementing the maximum ID by 1
    const maxId = Math.max(...posts.map((post) => parseInt(post.postID, 10)));
    return maxId + 1;
  } catch (error) {
    console.error("Error fetching posts or calculating new ID:", error);
    throw new Error("Error generating new ID");
  }
}

async function createPost(nickname, { content, compressedPic }) {
  try {
    const user = await User.findOne({ nickname: nickname });

    // Ensure that the user exists
    if (!user) {
      throw new Error(`User with username '${nickname}' not found`);
    }
    const postID = await getNewId();
    // Create the new post
    const newPost = new Post({
      nickname,
      content,
      postPic: compressedPic,
      profilePic: user.profilePic,
      time: new Date(),
      postID,
    });

    await newPost.save();
    return newPost;
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Error creating post");
  }
}

async function getFriends(username) {
  try {
    // Find the user by username and select the friends field
    const user = await User.findOne({ username }).select("friends");

    // If user is not found or user has no friends, return an empty array
    if (!user || !user.friends) {
      return [];
    }

    // Return the friends list
    return user.friends;
  } catch (error) {
    // Handle any errors that occur during friend retrieval
    console.error("Error getting friends:", error);
    throw new Error("Error getting friends");
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

async function acceptFriendship(senderUser, receiverUser) {
  try {
    // Find the user document corresponding to the receiverUser
    const receiver = await User.findOne({ nickname: receiverUser });
    const sender = await User.findOne({ nickname: senderUser });

    if (!receiver) {
      throw new Error("Receiver user not found");
    }

    //update both sides friends lists
    await User.updateOne(
      { nickname: senderUser },
      { $addToSet: { friends: receiver } }
    );

    await User.updateOne(
      { nickname: receiverUser },
      { $pull: { friendRequests: sender } }
    );
  } catch (error) {
    console.error("Error accepting friendship:", error);
    throw new Error("Error accepting friendship");
  }
}

async function deleteFriend(currentUser, friendToRemove) {
  try {
    // Update the current user's friend list to remove the friend to remove
    await User.updateOne(
      { username: currentUser },
      { $pull: { friends: friendToRemove } }
    );
  } catch (error) {
    // Handle any errors that occur during friend removal
    console.error("Error removing friend:", error);
    throw new Error("Error removing friend");
  }
}

module.exports = {
  createUser,
  checkUserExistence,
  getNewId,
  getUserDetails,
  areFriends,
  getFriendPosts,
  createPost,
  getFriends,
  askToBeFriend,
  acceptFriendship,
  deleteFriend,
  cancelRequest,
};
