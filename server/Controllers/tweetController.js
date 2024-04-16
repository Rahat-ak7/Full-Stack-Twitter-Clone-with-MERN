// import {Promise} from "mongoose";
import Tweet from "../models/tweetSchema.js";
import User from "../models/userSchema.js";

// -------------------------------------------------------------
// Create TWEET
export const createTweet = async (req, res) => {
  try {
    const { description, id } = req.body;

    if (!description || !id) {
      return res.status(401).json({
        message: "All Fiels are reqiured",
        success: false,
      });
    }
    const user = await User.findById(id).select("-password");
    await Tweet.create({
      description,
      userId: id,
      //Assign the user value to userDetaila
      userDetails: user,
    });
    return res.status(201).json({
      message: "Tweet created Sucessfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// -------------------------------------------------------------
// DELETE TWEET
export const deleteTweet = async (req, res) => {
  try {
    const { id } = req.params;
    await Tweet.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Tweet Deleted Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// ----------------------------------------------------------------
// LIKE OR DISLIKE TWEET
export const likeorDisLike = async (req, res) => {
  try {
    const loggedInUser = req.body.id;
    const tweetId = req.params.id;
    const tweet = await Tweet.findById(tweetId);
    if (tweet.like.includes(loggedInUser)) {
      //dislike
      await Tweet.findByIdAndUpdate(tweetId, { $pull: { like: loggedInUser } });
      return res.status(200).json({
        message: "User Dislike Your Tweet",
        success: true,
      });
    } else {
      //like
      await Tweet.findByIdAndUpdate(tweetId, { $push: { like: loggedInUser } });
      return res.status(200).json({
        message: "User like Your Tweet",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// ----------------------------------------------------------------
//  GET ALL TWEETS OF LOGIN  USER AND FOLLOWING USER
export const getAllTweets = async (req, res) => {
  //tweet of login user
  try {
    const id = req.params.id;
    console.log(id);
    const loggedInUser = await User.findById(id);
    const loggedInUserTweets = await Tweet.find({ userId: id });
    console.log();
    // following user tweet
    const followingUserTweet = await Promise.all(
      loggedInUser.following?.map((otherUsersId) => {
        return Tweet.find({ userId: otherUsersId });
      })
    );
    return res.status(200).json({
      // all tweets
      tweets: loggedInUserTweets.concat(...followingUserTweet),
    });
  } catch (error) {
    console.log(error);
  }
};

// ----------------------------------------------------------------
//  GET ALL TWEETS OF LOGIN FOLLOWING USER
export const getFollowingTweets = async (req, res) => {
  try {
    const id = req.params.id;
    const loggedInUser = await User.findById(id);

    // following user tweet
    const followingUserTweet = await Promise.all(
      loggedInUser.following?.map((otherUsersId) => {
        return Tweet.find({ userId: otherUsersId });
      })
    );
    return res.status(200).json({
      // all tweets
      tweets: [].concat(...followingUserTweet),
    });
  } catch (error) {
    console.log(error);
  }
};
