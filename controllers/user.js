const tokenChecker = require("../tokenChecker.js").tokenChecker;
const userService = require("../services/user.js");

async function createUser(req, res) {
  try {
    const { formData } = req.body;
    const { username, nickname, password, compressedPic } = formData;

    const newUser = await userService.createUser(
      nickname,
      password,
      compressedPic,
      username
    );
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(409).json({ message: "Internal Server Error" });
  }
}

async function getUserDetails(req, res) {
  try {
    const nickname = req.params.id;
    const userDetails = await userService.getUserDetails(nickname);

    if (!userDetails) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(userDetails);
  } catch (error) {
    console.error("Error getting user details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getFriendPosts(req, res) {
  try {
    const friendNickname = req.params.id;
    if (!tokenChecker(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const currentUserNickname = await tokenChecker(req);
    const areFriends = await userService.areFriends(
      currentUserNickname,
      friendNickname
    );

    if (areFriends) {
      const friendPosts = await userService.getFriendPosts(friendNickname);
      res.json(friendPosts);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error("Error fetching friend posts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function createPost(req, res) {
  try {
    const nickname = req.params.id;

    if (!tokenChecker(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { formData } = req.body;
    const { content, compressedPic } = formData;

    const newPost = await userService.createPost(nickname, {
      content,
      compressedPic,
    });
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function askToBeFriend(req, res) {
  try {
    const requestedUser = await req.params.id;
    const currentUser = await tokenChecker(req);

    await userService.askToBeFriend(currentUser, requestedUser);

    res.status(200).json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function cancelRequest(req, res) {
  try {
    const requestedUser = await req.params.id;
    const currentUser = await tokenChecker(req);

    await userService.cancelRequest(currentUser, requestedUser);

    res.status(200).json({ message: "Friend request canceled successfully" });
  } catch (error) {
    console.error("Error cancling friend request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function denyRequest(req, res) {
  try {
    const requesterUser = await req.params.id;
    const currentUser = await tokenChecker(req);

    await userService.denyRequest(currentUser, requesterUser);

    res.status(200).json({ message: "Friend request denied successfully" });
  } catch (error) {
    console.error("Error denying friend request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function acceptFriendship(req, res) {
  try {
    const currentUser = await tokenChecker(req);
    const senderUser = req.params.fid;
    const receiverUser = req.params.id;

    if (currentUser === receiverUser) {
      await userService.acceptFriendship(senderUser, receiverUser);
      res.status(200).json({ message: "Friendship accepted successfully" });
    } else {
      res.status(403).json({
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

module.exports = {
  createUser,
  getUserDetails,
  getFriendPosts,
  createPost,
  askToBeFriend,
  acceptFriendship,
  cancelRequest,
  denyRequest,
};
