import express from "express";
import * as taskController from "../controllers/task.controllers.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @route POST /api/tasks/add-task
 * @desc Create a new task
 * @access Private
 */
router.post("/add-task", verifyToken, taskController.addTask);

/**
 * @route GET /api/tasks/get-tasks
 * @desc Get all tasks for the authenticated user
 * @access Private
 */
router.get("/get-tasks", verifyToken, taskController.getTasks);

export default router;