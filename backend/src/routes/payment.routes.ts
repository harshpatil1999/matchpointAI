import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { checkOut } from "../controllers/payment.controllers.js";

const router = express.Router();

router.post("/checkout", isAuthenticated, checkOut);

export default router;
