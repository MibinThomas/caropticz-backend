// src/routes/userRoutes.js

import express from "express";
import authController from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/register", authController.register);
router.post("/register/otp-verify", authController.registerOtpVerify)

router.post("/login", authController.login);

// get me
router.get("/me/:id",authMiddleware,authController.getMe);

// update me
router.put("/update/:id",authMiddleware,  authController.updateMe);

// password reset routes
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-otp", authController.verifyOtp);
router.post("/reset-password",authController.resetPassword);

router.post("/resend-otp",authController.resendOtp)
export default router;
