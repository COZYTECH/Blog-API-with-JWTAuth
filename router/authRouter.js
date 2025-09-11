import express from "express";
import {
  signUp,
  signIn,
  signOut,
  generateVerificationToken,
  verificationTokenValidity,
  changePassword,
  sendForgotPasswordToken,
  verificationForgetPasswordTokenValidity,
} from "./../controller/authController.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);
router.patch("/generate-verification-token", generateVerificationToken);
router.patch("/verify-code", verificationTokenValidity);
router.patch("/change-password", changePassword);
router.patch("/send-forgot-token", sendForgotPasswordToken);
router.patch("/verify-forgot-token", verificationForgetPasswordTokenValidity);
export default router;
