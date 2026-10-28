import { Router } from "express";
import multer from "multer";
import {
  getStories,
  getStoryById,
  getChapterById,
  getStoryCover,
  createStory,
  updateStory,
  deleteStory,
  createChapter,
  updateChapter,
  deleteChapter,
} from "../controllers/storyController.js";
import { requireAuth } from "../middleware/auth.js";

const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });
const router = Router();

// Public routes
router.get("/", getStories);
router.get("/:id", getStoryById);
router.get("/:id/cover", getStoryCover);
router.get("/chapters/:id", getChapterById);

// Protected admin routes
router.post("/", requireAuth, upload.single("cover"), createStory);
router.put("/:id", requireAuth, upload.single("cover"), updateStory);
router.delete("/:id", requireAuth, deleteStory);

router.post("/:storyId/chapters", requireAuth, createChapter);
router.put("/chapters/:id", requireAuth, updateChapter);
router.delete("/chapters/:id", requireAuth, deleteChapter);

export default router;
