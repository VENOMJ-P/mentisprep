import UserService from "../services/user.service.js";
import { successResponse } from "../utils/response.handler.js";

class UserController {
  constructor() {
    this.userService = new UserService();
  }
  register = async (req, res) => {
    const user = await this.userService.register(req.body);
    return successResponse(res, 201, "User registered successfully", user);
  };

  login = async (req, res) => {
    const { username, password } = req.body;
    const loginData = await this.userService.login(username, password);

    // Set token in HTTP-only cookie
    res.cookie("auth_token", loginData.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: "strict",
    });

    return successResponse(res, 200, "Login successful", loginData);
  };

  logout = async (req, res) => {
    const token = req.token;
    res.clearCookie("auth_token");

    return successResponse(res, 200, "Logout successful");
  };

  getUserByUsername = async (req, res) => {
    const { username } = req.params;
    const user = await this.userService.getUserByUsername(username);
    return successResponse(res, 200, "User retrieved successfully", user);
  };

  getCurrentUser = async (req, res) => {
    const user = await this.userService.getUserById(req.user.id);
    return successResponse(
      res,
      200,
      "Current user retrieved successfully",
      user
    );
  };
}

export default UserController;
