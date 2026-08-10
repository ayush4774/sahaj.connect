import express from "express";

import protect from "../middleware/auth.js";

import {
  createPost,
  getPosts,
  getPost,
  deletePost,
  likePost,
  commentPost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", getPosts);

router.get("/:id", getPost);

router.post("/", protect, createPost);

router.delete("/:id", protect, deletePost);

router.put("/like/:id", protect, likePost);

router.post("/comment/:id", protect, commentPost);

export default router;