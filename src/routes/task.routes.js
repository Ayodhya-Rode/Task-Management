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

/**
 * @route PUT /api/tasks/update-task/:id
 * @desc Update a task
 * @access Private
 */
router.put("/update-task/:id", verifyToken, taskController.updateTask);

/**
 * @route DELETE /api/tasks/delete-task/:id
 * @desc Delete a task
 * @access Private
 */
router.delete("/delete-task/:id", verifyToken, taskController.deleteTask);
 
/**
 * @route GET /api/tasks/get-task/:id
 * @desc Get a single task by ID
 * @access Private
 */
router.get("/get-task/:id", verifyToken, taskController.getTaskById);

/**
 * @route GET /api/tasks/dashboard
 * @desc Get dashboard data for the authenticated user
 * @access Private
 */
router.get("/dashboard", verifyToken, taskController.getDashboard);

export default router;