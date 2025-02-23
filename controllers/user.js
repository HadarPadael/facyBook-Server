const tokenChecker = require("../tokenChecker.js");
const userService = require("../services/user.js");

async function createUser(req, res) {
  try {
    // Extract user data from request body
    const {
      password,
      nickname,
      profilePic,
    } = req.body;

    console.log("Request Body:", req.body);

    const newUser = await userService.createUser(
      nickname,
      password,
      profilePic
    );
    // Respond with the newly created user object
    res.status(200).json(newUser);

  } catch (error) {
    console.error("Error creating user:", error);
    res.status(409).json({ message: "Internal Server Error" });
  }
}

async function getUserDetails(req, res) {
  try {
    const username = req.params.id; 
    const userDetails = await userService.getUserDetails(username);

    if (!userDetails) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(userDetails);

  } catch (error) {
    console.error("Error getting user details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Right now the function changes profilePicture only.
async function updateUser(req, res) {
  try {
    const username = req.params.id; // Retrieve username from req.params.id
    const { profilePicture } = req.body; // Extract profilePicture from request body

    // Check if the user's token is valid
    if (!tokenChecker(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Update user's profile picture
    const updatedUser = await userService.updateUser(username, {
      profilePicture,
    });

    // Respond with the updated user object
    res.json(updatedUser);
  } catch (error) {
    // Handle any errors that occur during user profile picture update
    console.error("Error updating user profile picture:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function deleteUser(req, res) {
  try {
    const username = req.params.id; // Retrieve username from req.params.id

    // Check if the user's token is valid
    if (!tokenChecker(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Delete user
    const deletedUser = await userService.deleteUser(username);

    // If user is not found, respond with 404
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    //TODO: check if returned res is needed.
    // Respond with a success message
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    // Handle any errors that occur during user deletion
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getFriendPosts(req, res) {
  try {
    const friendUsername = req.params.id; // Retrieve friend's username from req.params.id

    // Check if the user's token is valid
    if (!tokenChecker(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get the current user's username
    const currentUserUsername = tokenChecker(req);

    // Check if the current user and the friend are friends
    const areFriends = await userService.areFriends(
      currentUserUsername,
      friendUsername
    );

    // If they are friends, retrieve friend's posts
    if (areFriends) {
      const friendPosts = await userService.getFriendPosts(
        currentUserUsername,
        friendUsername
      );

      // Respond with the friend's posts
      res.json(friendPosts);
    } else {
      res
        .status(403)
        .json({ message: "Forbidden: Not friends with the requested user" });
    }
  } catch (error) {
    // Handle any errors that occur during fetching friend posts
    console.error("Error fetching friend posts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function createPost(req, res) {
  try {
    // Extract user's username from req.params.id
    const username = req.params.id;

    // Check if the user's token is valid
    if (!tokenChecker(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Extract post data from request body
    const { text, picture } = req.body;

    // Create the post
    const newPost = await userService.createPost(username, { text, picture });

    // Respond with the newly created post object
    res.status(201).json(newPost);
  } catch (error) {
    // Handle any errors that occur during post creation
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getFriends(req, res) {
  try {
    // Extract the username from request parameters
    const username = req.params.id;

    // Extract the current user from the token
    const currentUser = tokenChecker(req);

    // Check if the current user is the same as the requested user or is a friend
    if (
      currentUser !== username &&
      !(await userService.areFriends(currentUser, username))
    ) {
      return res
        .status(403)
        .json({
          errors: [
            "Unauthorized: You are not authorized to view this user's friends",
          ],
        });
    }

    // Retrieve the user's friends list
    const friends = await userService.getFriends(username);

    // Respond with the friends list
    res.json({ friends });
  } catch (error) {
    console.error("Error getting friends:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function askToBeFriend(req, res) {
  try {
    // Extract the username from request parameters
    const requestedUser = await req.params.id;

    // Extract the current user from the token
    const currentUser = await tokenChecker(req);

    // Call the service function to send friend request
    await userService.askToBeFriend(currentUser, requestedUser);

    res.status(200).json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function acceptFriendship(req, res) {
  try {
    // Extract the usernames from request parameters
    const currentUser = await tokenChecker(req);
    const senderUser = req.params.fid;
    const receiverUser = req.params.id;

    // Check if the current user is the same as the receiver
    if (currentUser === receiverUser) {
      // Call the service function to accept friendship
      await userService.acceptFriendship(senderUser, receiverUser);
      res.status(200).json({ message: "Friendship accepted successfully" });
    } else {
      res
        .status(403)
        .json({
          errors: [
            "Unauthorized: You are not allowed to accept this friendship request",
          ],
        });
    }
  } catch (error) {
    console.error("Error accepting friendship:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function deleteFriend(req, res) {
  try {
    // Extract the usernames from request parameters
    const currentUser = tokenChecker(req);
    const friendToRemove = req.params.fid;
    const userToDeleteFrom = req.params.id;

    // Check if the current user is the same as the user to delete from
    if (currentUser === userToDeleteFrom) {
      // Call the service function to delete friendship
      await userService.deleteFriend(currentUser, friendToRemove);
      res.status(200).json({ message: "Friend removed successfully" });
    } else {
      res
        .status(403)
        .json({
          errors: [
            "Unauthorized: You are not allowed to remove this friendship",
          ],
        });
    }
  } catch (error) {
    console.error("Error removing friend:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  createUser,
  getUserDetails,
  updateUser,
  deleteUser,
  getFriendPosts,
  createPost,
  getFriends,
  askToBeFriend,
  acceptFriendship,
  deleteFriend,
};
