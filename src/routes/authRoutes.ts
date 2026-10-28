import { Router } from "express";
import multer from "multer";
import { login, getMe, updateProfile, getAvatar } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });
const router = Router();

router.post("/login", login);
router.get("/me", requireAuth, getMe);
router.put("/profile", requireAuth, upload.single("profile"), updateProfile);
router.get("/avatar", getAvatar);

export default router;
