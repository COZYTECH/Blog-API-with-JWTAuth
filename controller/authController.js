import {
  signInSchema,
  signUpSchema,
  acceptCodeSchema,
  changePasswordSchema,
  forgotPasswordSchema,
} from "../middleware/validator.js";
import doHash from "./../utils/hash.js";
import User from "./../model/userDataModel.js";
import jwt from "jsonwebtoken";
import { doHashValidation, hmacProcess } from "./../utils/hash.js";
import { transporter } from "./../middleware/sendMail.js";

export const signUp = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error, value } = signUpSchema.validate({ email, password });
    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(401)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await doHash(password, 10);

    const newUser = await User({
      email,
      password: hashedPassword,
    });
    const result = await newUser.save();
    result.password = undefined;
    res
      .status(201)
      .json({ success: true, message: "user created successfully", result });
  } catch (error) {
    console.log(error);
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error, value } = signInSchema.validate({ email, password });
    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }
    const existingUser = await User.findOne({ email }).select("+password");
    if (!existingUser) {
      return res
        .status(401)
        .json({ success: false, message: "User does not exist" });
    }
    const result = await doHashValidation(password, existingUser.password);
    if (!result) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
        verified: existingUser.verified,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: "8h" }
    );
    res
      .cookie("Authorization", "Bearer" + token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      })
      .json({ success: true, message: "Login successful", token });
  } catch (error) {
    console.log(error);
  }
};

export const signOut = (req, res) => {
  res
    .clearCookie("Authorization")
    .json({ success: true, message: "Signout successful" });
};

export const generateVerificationToken = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(401)
        .json({ success: false, message: "User does not exist" });
    }
    if (existingUser.verified) {
      return res
        .status(401)
        .json({ success: false, message: "User already verified" });
    }
    const codeValue = Math.floor(Math.random() * 1000000).toString();

    let info = await transporter.sendMail({
      from: process.env.NODE_CODE_SENDING_EMAIL,
      to: existingUser.email,
      subject: "Verification Code From Cozy",
      html: "<h1>" + codeValue + "</h2>",
    });
    if (info.accepted[0] === existingUser.email) {
      const hashedCodeValue = hmacProcess(
        codeValue,
        process.env.HMAC_VERIFICATION_CODE_SECRET
      );
      existingUser.verificationToken = hashedCodeValue;
      existingUser.verificationTokenValidation = Date.now();
      await existingUser.save();
      return res.status(200).json({
        success: true,
        message: "Verification code sent to email",
      });
    }
    res.status(500).json({ success: false, message: "Error sending email" });
  } catch (error) {
    console.log(error);
  }
};

export const verificationTokenValidity = async (req, res) => {
  const { email, providedCode } = req.body;
  try {
    const { error, value } = acceptCodeSchema.validate({ email, providedCode });
    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }
    const codeValue = providedCode.toString();
    const existingUser = await User.findOne({ email }).select(
      "+verificationToken + verificationTokenValidation "
    );

    if (existingUser.verified) {
      return res
        .status(401)
        .json({ success: false, message: "User already verified" });
    }
    if (
      !existingUser.verificationToken ||
      !existingUser.verificationTokenValidation
    ) {
      return res.status(401).json({
        success: false,
        message: "Please generate a new verification code",
      });
    }
    if (Date.now() - existingUser.verificationTokenValidation > 5 * 60 * 1000) {
      return res.status(401).json({
        success: false,
        message: "Verification code expired, please generate a new one",
      });
    }
    const hashedCodeValue = hmacProcess(
      codeValue,
      process.env.HMAC_VERIFICATION_CODE_SECRET
    );
    if (hashedCodeValue === existingUser.verificationToken) {
      existingUser.verified = true;
      existingUser.verificationToken = undefined;
      existingUser.verificationTokenValidation = undefined;
      await existingUser.save();
      return res.status(200).json({
        success: true,
        message: "User verified successfully",
      });
    }
    return res
      .status(401)
      .json({ success: false, message: "unexpected error occured" });
  } catch (error) {
    console.log(error);
  }
};

export const changePassword = async (req, res) => {
  const { userId, verified } = req.user;
  const { oldPassword, newPassword } = req.body;
  try {
    const { error, value } = changePasswordSchema.validate({
      oldPassword,
      newPassword,
    });
    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }
    const existingUser = await User.findOne({ _id: userId }).select(
      "+password"
    );
    if (!existingUser) {
      return res
        .status(401)
        .json({ success: false, message: "User does not exist" });
    }
    const result = await doHashValidation(oldPassword, existingUser.password);
    if (!result) {
      return res
        .status(401)
        .json({ success: false, message: "invalid result" });
    }
    const hashedPassword = await doHash(newPassword, 10);
    existingUser.password = hashedPassword;
    await existingUser.save();
    return res
      .status(200)
      .json({ success: true, message: "passsword updated" });
  } catch (error) {
    console.log(error);
  }
};

export const sendForgotPasswordToken = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(401)
        .json({ success: false, message: "User does not exist" });
    }
    // if (existingUser.verified) {
    //   return res
    //     .status(401)
    //     .json({ success: false, message: "User already verified" });
    // }
    const codeValue = Math.floor(Math.random() * 1000000).toString();

    let info = await transporter.sendMail({
      from: process.env.NODE_CODE_SENDING_EMAIL,
      to: existingUser.email,
      subject: "forgot password Code From Cozy",
      html: "<h1>" + codeValue + "</h2>",
    });
    if (info.accepted[0] === existingUser.email) {
      const hashedCodeValue = hmacProcess(
        codeValue,
        process.env.HMAC_VERIFICATION_CODE_SECRET
      );
      existingUser.forgetPasswordToken = hashedCodeValue;
      existingUser.forgetPasswordTokenValidation = Date.now();
      await existingUser.save();
      return res.status(200).json({
        success: true,
        message: "password code sent to email",
      });
    }
    res.status(500).json({ success: false, message: "Error sending email" });
  } catch (error) {
    console.log(error);
  }
};

export const verificationForgetPasswordTokenValidity = async (req, res) => {
  const { email, providedCode, newPassword } = req.body;
  try {
    const { error, value } = forgotPasswordSchema.validate({
      email,
      providedCode,
      newPassword,
    });
    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }
    const codeValue = providedCode.toString();
    const existingUser = await User.findOne({ email }).select(
      "+forgetPasswordToken + forgetPasswordTokenValidation "
    );

    // if (existingUser.verified) {
    //   return res
    //     .status(401)
    //     .json({ success: false, message: "User already verified" });
    // }
    if (
      !existingUser.forgetPasswordToken ||
      !existingUser.forgetPasswordTokenValidation
    ) {
      return res.status(401).json({
        success: false,
        message: "Please generate a new verification code",
      });
    }
    if (
      Date.now() - existingUser.forgetPasswordTokenValidation >
      5 * 60 * 1000
    ) {
      return res.status(401).json({
        success: false,
        message: "Verification code expired, please generate a new one",
      });
    }
    const hashedCodeValue = hmacProcess(
      codeValue,
      process.env.HMAC_VERIFICATION_CODE_SECRET
    );
    if (hashedCodeValue === existingUser.forgetPasswordToken) {
      // existingUser.verified = true;
      existingUser.forgetPasswordToken = undefined;
      existingUser.forgetPasswordTokenValidation = undefined;
      await existingUser.save();
      return res.status(200).json({
        success: true,
        message: "User verified successfully",
      });
    }
    return res
      .status(401)
      .json({ success: false, message: "unexpected error occured" });
  } catch (error) {
    console.log(error);
  }
};
