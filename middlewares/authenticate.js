import HttpError from "../helpers/HttpError.js";
import { verifyToken } from "../helpers/jwt.js";
import { findUser } from "../services/authServices.js";

const aunthenticate = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(HttpError(401, "Authorization header is required"));
  }
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    return next(HttpError(401, "Token is required"));
  }

  try {
    const { id } = verifyToken(token);
    const user = await findUser({ _id: id });
    if (!user) {
      return next(HttpError(401, "User not found"));
    }

    if (!user.token) {
      return next(HttpError(401, "User logged out"));
    }
    req.user = user;
    next();
  } catch (error) {
    return next(HttpError(401, "Invalid token"));
  }
};

export default aunthenticate;
