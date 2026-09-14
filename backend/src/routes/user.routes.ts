import express from "express";
import { loginUser, fetchProfile } from "../controllers/user.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.get("/me", isAuthenticated, fetchProfile);

export default router;
