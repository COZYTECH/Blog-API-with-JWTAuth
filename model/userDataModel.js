import mongoose from "mongoose";
import Joi from "joi";
export const userDataSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      min: 5,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      select: false,
    },
    verificationTokenValidation: {
      type: Number,
      select: false,
    },
    forgetPasswordToken: {
      type: String,
      select: false,
    },
    forgetPasswordTokenValidation: {
      type: Number,
      select: false,
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userDataSchema);
export default User;
