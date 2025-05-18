import UserService from "../services/user.service.js";
import { AppError } from "../utils/error.handler.js";

const userService = new UserService();

const extractToken = (req) => {
  // Check for token in Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    return authHeader.substring(7);
  }

  // Check for token in cookies
  if (req.cookies && req.cookies.auth_token) {
    return req.cookies.auth_token;
  }

  return null;
};

export const authenticate = async (req, res, next) => {
  try {
    // Extract token
    const token = extractToken(req);
    console.log(token);

    if (!token) {
      throw new AppError("Authentication required", 401);
    }

    // Verify token and get user
    const user = await userService.verifyToken(token);

    // Attach user and token to request object
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    next(error);
  }
};
