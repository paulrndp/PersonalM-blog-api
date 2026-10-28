import { Router } from "express";
import { trackPostView, trackChapterView } from "../controllers/visitorController.js";

const router = Router();

router.post("/post/:postId", trackPostView);
router.post("/chapter/:chapterId", trackChapterView);

export default router;
