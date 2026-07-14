import taskModel from "../models/task.model.js";
import mongoose from "mongoose";

/**
 * Create a new task
 * @route POST /api/tasks/add-task
 * @access Private
 */
export async function addTask(req, res) {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({
        error: true,
        type: "VALIDATION_ERROR",
        message: "Title is required",
      });
    }

    const newTask = new taskModel({
      title: title.trim(),
      description,
      status,
      priority,
      dueDate,
      user: req.user.userId,
    });

    const savedTask = await newTask.save();

    return res.status(201).json({
      success: true,
      type: "TASK_CREATED",
      message: "Task created successfully",
      task: savedTask,
    });
  } catch (err) {
    console.error("Add Task Error:", err);

    return res.status(500).json({
      error: true,
      type: "INTERNAL_SERVER_ERROR",
      message: "Internal Server Error",
    });
  }
}

/**
 * Get all tasks for the authenticated user
 * @route GET /api/tasks/get-tasks
 * @access Private
 */

export async function getTasks(req, res) {
  try {
    const tasks = await taskModel
      .find({ user: req.user.userId })
      .sort({ createdAt: -1 }); //newest tasks first
    return res.status(200).json({
      success: true,
      type: "TASKS_FETCHED",
      message: "Tasks fetched successfully",
      tasks: tasks,
    });
  } catch (err) {
    console.error("Get Tasks Error:", err);
    return res.status(500).json({
      error: true,
      type: "INTERNAL_SERVER_ERROR",
      message: "Internal Server Error",
    });
  }
}

/**
 * Update a task
 * @route PUT /api/tasks/update-task/:id
 * @access Private
 */

export async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body;

    // Validate input
    if (!mongoose.Types.ObjectId.isValid(id)) {
      // Check if the provided ID is a valid MongoDB ObjectId
      return res.status(400).json({
        error: true,
        type: "VALIDATION_ERROR",
        message: "Invalid task ID",
      });
    }

    // Find the task by ID and ensure it belongs to logged-in user
    const task = await taskModel.findOne({
      _id: id,
      user: req.user.userId,
    });

    console.log("Task found for update:", task);

    if (!task) {
      return res.status(404).json({
        error: true,
        type: "TASK_NOT_FOUND",
        message: "Task not found",
      });
    }

    // Update task fields
    if (title !== undefined) {
      task.title = title.trim();
    }
    if (description !== undefined) {
      task.description = description;
    }
    if (status !== undefined) {
      task.status = status;
    }
    if (priority !== undefined) {
      task.priority = priority;
    }
    if (dueDate !== undefined) {
      task.dueDate = dueDate;
    }

    const updatedTask = await task.save();

    return res.status(200).json({
      success: true,
      type: "TASK_UPDATED",
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (err) {
    console.error("Update Task Error:", err);
    return res.status(500).json({
      error: true,
      type: "INTERNAL_SERVER_ERROR",
      message: "Internal Server Error",
    });
  }
}

/**
 * Delete a task
 * @route DELETE /api/tasks/delete-task/:id
 * @access Private
 */

export async function deleteTask(req, res) {
  try {
    const { id } = req.params;

    // Validate input
    if (!mongoose.Types.ObjectId.isValid(id)) {
      // Check task with this ID exists and belongs to the logged-in user
      return res.status(400).json({
        error: true,
        type: "VALIDATION_ERROR",
        message: "Invalid task ID",
      });
    }

    // Find the task by ID and ensure it belongs to logged-in user
    const task = await taskModel.findOne({
      _id: id,
      user: req.user.userId,
    });

    if (!task) {
      return res.status(404).json({
        error: true,
        type: "TASK_NOT_FOUND",
        message: "Task not found",
      });
    }

    await task.deleteOne();

    return res.status(200).json({
      success: true,
      type: "TASK_DELETED",
      message: "Task deleted successfully",
    });
  } catch (err) {
    console.error("Delete Task Error:", err);
    return res.status(500).json({
      error: true,
      type: "INTERNAL_SERVER_ERROR",
      message: "Internal Server Error",
    });
  }
}

/**
 * Get a single task by ID
 * @route GET /api/tasks/get-task/:id
 * @access Private
 */

export async function getTaskById(req, res) {
  try {
    const { id } = req.params;

    // Validate input
    if (!mongoose.Types.ObjectId.isValid(id)) {
      //check ID is valid MongoDB ObjectId or not
      return res.status(400).json({
        error: true,
        type: "VALIDATION_ERROR",
        message: "Invalid task ID",
      });
    }

    // Find the task by ID and ensure it belongs to logged-in user
    const task = await taskModel.findOne({
      _id: id,
      user: req.user.userId,
    });

    if (!task) {
      return res.status(404).json({
        error: true,
        type: "TASK_NOT_FOUND",
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      type: "TASK_FOUND",
      message: "Task found successfully",
      task: task,
    });
  } catch (err) {
    console.error("Get Task By ID Error:", err);
    return res.status(500).json({
      error: true,
      type: "INTERNAL_SERVER_ERROR",
      message: "Internal Server Error",
    });
  }
}

/**
 * Get dashboard data for the authenticated user
 * @route GET /api/tasks/dashboard
 * @access Private
 */

export async function getDashboard(req, res) {
  try {
    const userId = req.user.userId;

    // Fetch ALL tasks for the user
    const totalTasks = await taskModel.countDocuments({
      user: userId 
    });

    // Fetch all COMPLETED tasks
    const completedTasks = await taskModel.countDocuments({
      user: userId,
      status: "completed",
    });

    // Fetch all PENDING tasks
    const pendingTasks = await taskModel.countDocuments({
      user: userId,
      status: "pending",
    });

    // Fetch all IN-PROGRESS tasks
    const inProgressTasks = await taskModel.countDocuments({
      user: userId,
      status: "in-progress",
    });

    // Count low priority tasks
    const lowPriorityTasks = await taskModel.countDocuments({
      user: userId,
      priority: "low",
    });

    // Count medium priority tasks
    const mediumPriorityTasks = await taskModel.countDocuments({
      user: userId,
      priority: "medium",
    });

    // Count high priority tasks
    const highPriorityTasks = await taskModel.countDocuments({
      user: userId,
      priority: "high",
    });

    return res.status(200).json({
      success: true,
      type: "DASHBOARD_FETCHED",
      message: "Dashboard data fetched successfully",
      dashboard: {
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        lowPriorityTasks,
        mediumPriorityTasks,
        highPriorityTasks,
      }
    })

  } catch (err) {
    console.error("Get Dashboard Error:", err);
    return res.status(500).json({
      error: true,
      type: "INTERNAL_SERVER_ERROR",
      message: "Internal Server Error",
    });
  }
}
