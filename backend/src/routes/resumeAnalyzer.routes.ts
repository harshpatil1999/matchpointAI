import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  analyzeResume,
  matchJobs,
  generateInterviewQuestions,
  buildResume,
} from "../controllers/resumeAnalyzer.controllers.js";

const router = express.Router();

router.post("/analyze", isAuthenticated, analyzeResume);
router.post("/jobMatcher", isAuthenticated, matchJobs);
router.post("/interviewPrep", isAuthenticated, generateInterviewQuestions);
router.post("/resumeBuilder", isAuthenticated, buildResume);

export default router;
