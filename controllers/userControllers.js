import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import Jimp from "jimp";

import { saveUser, findUser, updateUser } from "../services/userServices.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";

import HttpError from "../helpers/HttpError.js";
import { compareHash } from "../helpers/compareHash.js";
import { createToken } from "../helpers/jwt.js";

const postersPath = path.resolve("public", "avatars");

export const register = ctrlWrapper(async (req, res) => {
  const { email } = req.body;
  const user = await findUser({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const defaultAvatar = gravatar.url(email, { s: "250" }, true);
  const newUser = await saveUser({ ...req.body, avatarURL: defaultAvatar });
  res.status(201).json({
    user: { email: newUser.email, subscription: newUser.subscription },
  });
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

  res.status(200).json({
    token,
    user: {
      email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
    },
  });
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

export const updateAvatar = ctrlWrapper(async (req, res) => {
  const img = await Jimp.read(req.file.path);
  await img
    .autocrop()
    .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER || Jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(req.file.path);

  const { _id } = req.user;

  const { path: oldPath, filename } = req.file;
  const newPath = path.join(postersPath, filename);
  await fs.rename(oldPath, newPath);

  const avatarURL = path.join("avatars", filename);
  const response = await updateUser({ _id }, { avatarURL });

  res.status(200).json({ avatarURL });
});
