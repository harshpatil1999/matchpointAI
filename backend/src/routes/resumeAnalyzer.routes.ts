import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  analyzeResume,
  matchJob,
} from "../controllers/resumeAnalyzer.controllers.js";

const router = express.Router();

router.post("/analyze", isAuthenticated, analyzeResume);
router.post("/jobMatcher", isAuthenticated, matchJob);

export default router;
