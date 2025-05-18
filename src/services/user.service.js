import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserRepository from "../repositories/user.repository.js";
import { AppError } from "../utils/error.handler.js";

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }
  async register(userData) {
    const existingUser = await this.userRepository.findByUsername(
      userData.username
    );
    if (existingUser) {
      throw new AppError("Username already exists", 409);
    }

    const user = await this.userRepository.create(userData);

    const userObj = user.get({ plain: true });
    delete userObj.password;

    return userObj;
  }

  async login(username, password) {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new AppError("Invalid username or password", 401);
    }

    const isPasswordValid = this.checkPassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid username or password", 401);
    }

    const tokenPayload = {
      id: user.id,
      username: user.username,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    return {
      user: {
        id: user.id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        age: user.age,
      },
      token,
      expiresAt,
    };
  }

  async getUserByUsername(username) {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUserById(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  async verifyToken(token) {
    try {
      // Verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);

      // Get user
      const user = await this.userRepository.findById(decoded.id);
      if (!user) {
        throw new AppError("User not found", 404);
      }

      console.log(user);

      return {
        id: user.id,
        username: user.username,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error, 404);
      //   throw new AppError("Invalid or expired token", 401);
    }
  }

  checkPassword(userInputPlainPassword, encryptedPassword) {
    try {
      return bcrypt.compareSync(userInputPlainPassword, encryptedPassword);
    } catch (error) {
      console.log("Something went wrong in password comparison");
      throw new AppError("Something went wrong in password comparison", 500);
    }
  }
}

export default UserService;
