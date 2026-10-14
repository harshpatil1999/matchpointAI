import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { checkOut, verifyPayment } from "../controllers/payment.controllers.js";

const router = express.Router();

router.post("/checkout", isAuthenticated, checkOut);
router.post("/verify", isAuthenticated, verifyPayment);

export default router;
