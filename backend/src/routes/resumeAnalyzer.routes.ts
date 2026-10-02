import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { analyzeResume } from "../controllers/resumeAnalyzer.controllers.js";

const router = express.Router();

router.post("/analyze", isAuthenticated, analyzeResume);

export default router;
