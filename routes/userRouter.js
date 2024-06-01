import express from "express";

import {
  register,
  login,
  getCurrent,
  logout,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,
} from "../controllers/userControllers.js";

import isEmptyBody from "../middlewares/isEmptyBody.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";
import validateBody from "../decorators/validateBody.js";

import {
  authSignUpSchema,
  authSignInSchema,
  authEmailSchema,
} from "../schemas/authSchemas.js";

const userRouter = express.Router();

userRouter.post(
  "/register",
  isEmptyBody,
  validateBody(authSignUpSchema),
  register
);

userRouter.get("/verify/:verificationToken", verifyEmail);

userRouter.post(
  "/verify",
  isEmptyBody,
  validateBody(authEmailSchema),
  resendVerifyEmail
);

userRouter.post("/login", isEmptyBody, validateBody(authSignInSchema), login);

userRouter.get("/current", authenticate, getCurrent);

userRouter.post("/logout", authenticate, logout);

userRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  updateAvatar
);

export default userRouter;
