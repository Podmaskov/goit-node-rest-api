import bcrypt from "bcrypt";

import User from "../models/user.js";

export const findUser = (filter) => User.findOne(filter);

export const saveUser = (data) => {
  const hashedPassword = bcrypt.hashSync(data.password, 10);
  return User.create({ ...data, password: hashedPassword });
};

export const updateUser = (filter, data) => User.findOneAndUpdate(filter, data);
