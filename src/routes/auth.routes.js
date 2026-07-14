import express from "express";
import * as authController from "../controllers/auth.controllers.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post("/register", authController.registerUser);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
router.post("/login", authController.loginUser);

/**
 * @route POST /api/auth/logout
 * @desc Logout a user
 * @access Public
 */
router.post("/logout", verifyToken, authController.logoutUser);

export default router;

