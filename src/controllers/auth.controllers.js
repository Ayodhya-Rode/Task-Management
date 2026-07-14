import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

export async function registerUser(req, res) {
  try {
    const { fullName, email, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    if (!fullName || !normalizedEmail || !password) {
      return res.status(400).json({
        error: true,
        type: "VALIDATION ERROR",
        message: "All fields are Required",
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: true,
        type: "VALIDATION_ERROR",
        message: "Password must contain at least 8 charactersacter.",
      });
    }

    const existingUser = await userModel.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        error: true,
        type: "CONFLICT_ERROR",
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      type: "USER_REGISTERED",
      message: "User registered successfully",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.log("Login Error", err);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
      type: "INTERNAL_SERVER_ERROR",
    });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: true,
        type: "VALIDATION_ERROR",
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await userModel.findOne({ email: normalizedEmail });

    if (!existingUser) {
      return res.status(401).json({
        error: true,
        type: "LOGIN_ERROR",
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        error: true,
        type: "LOGIN_ERROR",
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ userId: existingUser._id }, config.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      type: "LOGIN_SUCCESS",
      message: "User logged in successfully",
      user: {
        id: existingUser._id,
        fullName: existingUser.fullName,
        email: existingUser.email,
      },
    });
  } catch (err) {
    console.log("Login Error", err);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
      type: "INTERNAL_SERVER_ERROR",
    });
  }
}

export async function logoutUser(req, res) {
  try {
    console.log("Logging out user:", req.user); // Log the user information for debugging
    res.clearCookie("token", {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.status(200).json({
      success: true,
      type: "LOGOUT_SUCCESS",
      message: "User logged out successfully",
    });
  } catch (err) {
    console.log("Logout Error", err);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
      type: "INTERNAL_SERVER_ERROR",
    });
  }
}
