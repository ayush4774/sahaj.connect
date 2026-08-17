import express from "express";
import { adminLogin, me } from "../controllers/auth.controller.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/me", protect, me);

export default router;