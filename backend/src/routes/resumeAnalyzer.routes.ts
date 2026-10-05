import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  analyzeResume,
  matchJob,
  generateInterviewQuestions,
} from "../controllers/resumeAnalyzer.controllers.js";

const router = express.Router();

router.post("/analyze", isAuthenticated, analyzeResume);
router.post("/jobMatcher", isAuthenticated, matchJob);
router.post("/interviewPrep", isAuthenticated, generateInterviewQuestions);

export default router;
