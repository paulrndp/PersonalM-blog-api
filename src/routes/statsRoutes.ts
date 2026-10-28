import { Router } from "express";
import { getOverviewStats } from "../controllers/statsController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/overview", requireAuth, getOverviewStats);

export default router;
