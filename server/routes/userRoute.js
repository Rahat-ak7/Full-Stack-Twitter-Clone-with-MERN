import express, { Router } from "express";
import {
  Login,
  Logout,
  Register,
  bookmarks,
  follow,
  getMyProfile,
  getOtherUsers,
  unFollow,
} from "../Controllers/userController.js";
import isAuthenticated from "../config/auth.js";
const router = express.Router();

// ENDPONTS
router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/logout").get(Logout);
router.route("/bookmark/:id").put(isAuthenticated, bookmarks);
router.route("/profile/:id").get(isAuthenticated, getMyProfile);
router.route("/otherusers/:id").get(isAuthenticated, getOtherUsers);
router.route("/follow/:id").post(isAuthenticated, follow);
router.route("/unfollow/:id").post(isAuthenticated,unFollow);
export default router;
