import express from "express";

import {
  register,
  login,
  getCurrent,
  logout,
} from "../controllers/authControllers.js";

import isEmptyBody from "../middlewares/isEmptyBody.js";
import authenticate from "../middlewares/authenticate.js";
import validateBody from "../decorators/validateBody.js";

import { authSignUpSchema, authSignInSchema } from "../schemas/authSchemas.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  isEmptyBody,
  validateBody(authSignUpSchema),
  register
);

authRouter.post("/login", isEmptyBody, validateBody(authSignInSchema), login);

authRouter.get("/current", authenticate, getCurrent);

authRouter.post("/logout", authenticate, logout);

export default authRouter;
