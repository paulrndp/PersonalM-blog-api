import { Router } from "express";
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Public routes
router.get("/", getPosts);
router.get("/:id", getPostById);

// Protected admin routes
router.post("/", requireAuth, createPost);
router.put("/:id", requireAuth, updatePost);
router.delete("/:id", requireAuth, deletePost);

export default router;
