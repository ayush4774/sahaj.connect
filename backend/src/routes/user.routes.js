import express from "express";

import protect from "../middleware/auth.js";

import {
  getProfile,
  updateProfile,
  followUser,
  unfollowUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/me", protect, getProfile);

router.put("/me", protect, updateProfile);

router.put("/follow/:id", protect, followUser);

router.put("/unfollow/:id", protect, unfollowUser);

export default router;