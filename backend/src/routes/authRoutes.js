import express from "express";
import { loginWithOTP, loginWithEmail, getProfile, registerUser ,updateProfile } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimit.js";
const router = express.Router();

// Login with OTP
router.post("/login-otp",authLimiter, loginWithOTP);
router.post("/register",authLimiter, registerUser);

// Login with Email
router.post("/login-email",authLimiter, loginWithEmail);
router.put("/update-profile", authMiddleware, updateProfile);

// Get profile (protected)
router.get("/profile", authMiddleware, getProfile);

export default router;
