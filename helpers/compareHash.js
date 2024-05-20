import bcrypt from "bcrypt";

export const compareHash = (password, hashedPassword) =>
  bcrypt.compare(password, hashedPassword);
