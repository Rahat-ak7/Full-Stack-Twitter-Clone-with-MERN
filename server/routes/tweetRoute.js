import express, { Router } from "express";
import {
  createTweet,
  deleteTweet,
  getAllTweets,
  getFollowingTweets,
  likeorDisLike,
} from "../Controllers/tweetController.js";
import isAuthenticated from "../config/auth.js";
const router = express.Router();

// ENDPONTS
//ONLY LOGIN USER CAN CRETE TWEET
router.route("/create").post(isAuthenticated, createTweet);
router.route("/delete/:id").delete(isAuthenticated, deleteTweet);
router.route("/like/:id").put(isAuthenticated, likeorDisLike);
router.route("/alltweets/:id").get(isAuthenticated, getAllTweets);
router.route("/followingtweets/:id").get(isAuthenticated, getFollowingTweets);

export default router;
