import joi from "joi";

export const signUpSchema = joi.object({
  email: joi.string().min(5).max(60).required(),

  password: joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

export const signInSchema = joi.object({
  email: joi.string().min(5).max(60).required(),

  password: joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

export const acceptCodeSchema = joi.object({
  email: joi.string().min(5).max(60).required(),

  providedCode: joi.string().length(6).required(),
});
export const changePasswordSchema = joi.object({
  oldPassword: joi.string().min(5).max(60).required(),

  newPassword: joi.string().length(6).required(),
});
export const forgotPasswordSchema = joi.object({
  email: joi.string().min(5).max(60).required(),

  providedCode: joi.string().length(6).required(),
  newPassword: joi.string().length(6).required(),
});
