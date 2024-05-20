import { saveUser, findUser, updateUser } from "../services/authServices.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";

import HttpError from "../helpers/HttpError.js";
import { compareHash } from "../helpers/compareHash.js";
import { createToken } from "../helpers/jwt.js";

export const register = ctrlWrapper(async (req, res) => {
  const { email } = req.body;
  const user = await findUser({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }
  const newUser = await saveUser(req.body);
  res
    .status(201)
    .json({ email: newUser.email, subscription: newUser.subscription });
});

export const login = ctrlWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const isPasswordValid = await compareHash(password, user.password);
  if (!isPasswordValid) {
    throw HttpError(401, "Email or password is wrong");
  }

  const token = createToken({ id: user._id });
  await updateUser({ _id: user._id }, { token });

  res
    .status(200)
    .json({ token, user: { email, subscription: user.subscription } });
});

export const getCurrent = ctrlWrapper(async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
});

export const logout = ctrlWrapper(async (req, res) => {
  const { _id } = req.user;
  await updateUser({ _id }, { token: "" });

  res.status(204).json();
});
