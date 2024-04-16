import User from "../models/userSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// --------------------------------------------------------
// REGISTER
export const Register = async (req, res) => {
  try {
    // GET INFORMATION FROM FRONTEND SIDE
    const { name, username, email, password } = req.body;

    // CONDITION FOR ALL FIELD ARE REQUIRE
    if (!name || !username || !email || !password) {
      return res.status(401).json({
        message: "All fields are required.",
        success: false,
      });
    }

    // IF USER ALREADY EXISTS
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: "User already Exists.",
        success: false,
      });
    }

    // HASH THE PASSWORD WITH GIVEN SALT
    const hashedPassword = await bcryptjs.hash(password, 16);

    // NOW CREATE USERACCOUNT
    await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User Created Successfully...",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//--------------------------------------------------------
// Login
export const Login = async (req, res) => {
  try {
    // BASIC VALIDATION
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "All fields are required.",
        success: false,
      });
    }

    // CHECK USER EXIST OR NOT
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    // PASSWORD MATCH OR NOT
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    // IF MATCH
    const tokenData = {
      userId: user._id,
    };

    //ASSIGN SECRET KEY TO USER AND STORE INTO COOKIES
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });
    return res
      .status(201)
      .cookie("token", token, { expiresIn: "1d", httpOnly: true })
      .json({
        message: `welcome back ${user.name}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

// --------------------------------------------------------
// LOGOUT
export const Logout = (req, res) => {
  try {
    //REMOVE TOKEN FROM COOKIE
    return res.cookie("token", "", { expiresIn: new Date(Date.now()) }).json({
      message: "User Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// --------------------------------------------------------
//BOOKMARK TWEET
export const bookmarks = async (req, res) => {
  try {
    const loggedInUser = req.body.id;
    const tweetId = req.params.id;
    const user = await User.findById(loggedInUser);

    if (user.bookmarks.includes(tweetId)) {
      //REMOVE
      await User.findByIdAndUpdate(loggedInUser, {
        $pull: { bookmarks: tweetId },
      });
      return res.status(200).json({
        message: "Removed from Bookmark.",
        success: true,
      });
    } else {
      //SAVE
      await User.findByIdAndUpdate(loggedInUser, {
        $push: { bookmarks: tweetId },
      });
      return res.status(200).json({
        message: "Save to Bookmark.",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// --------------------------------------------------------
//GET USER PROFLE:
export const getMyProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select("-password"); //without all other will be display
    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
  }
};

// --------------------------------------------------------
//GET USER PROFLE:
export const getOtherUsers = async (req, res) => {
  try {
    //get value of login user
    const { id } = req.params;

    //All user expect logined in user
    const otherUsers = await User.find({ _id: { $ne: id } }).select(
      "-password"
    );
    if (!otherUsers) {
      return res.status(401).json({
        message: "Currently do not have any Users",
      });
    }
    return res.status(200).json({
      otherUsers,
    });
  } catch (error) {
    console.log(error);
  }
};

// --------------------------------------------------------
//FOLLOW:
export const follow = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const userId = req.params.id;
    const loggedInUser = await User.findById(loggedInUserId); //Khan USER
    const user = await User.findById(userId); // others or ali user
    if (!user.followers.includes(loggedInUserId)) {
      await user.updateOne({ $push: { followers: loggedInUserId } }); //following
      await loggedInUser.updateOne({ $push: { following: userId } }); //Followers
    } else {
      return res.status(400).json({
        message: `User already like to ${user.name}`,
      });
    }
    return res.status(200).json({
      message: `${loggedInUser.name} just follow to ${user.name}`,
    });
  } catch (error) { 
    console.log(error);
  }
};

// --------------------------------------------------------
//FOLLOW:
export const unFollow = async (req, res) => {
  try {
    //get value of login user
    const loggedInUserId = req.body.id;
    // follow user
    const userId = req.params.id;
    const loggedInUser = await User.findById(loggedInUserId); //Khan USER
    const user = await User.findById(userId); // others or Jadoon user
    if (loggedInUser.following.includes(userId)) {
      await user.updateOne({ $pull: { followers: loggedInUserId } }); //following
      await loggedInUser.updateOne({ $pull: { following: userId } }); //Followers
    } else {
      return res.status(400).json({
        message: `User has not followed yet `,
      });
    }
    return res.status(200).json({
      message: `${loggedInUser.name}  unfollow to ${user.name}`,
    });
  } catch (error) {
    console.log(error);
  }
};
