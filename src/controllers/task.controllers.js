import taskModel from "../models/task.model.js";

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

export async function getTasks(req, res) {
  try{
    const tasks = await taskModel.find({ user: req.user.userId }).sort({ createdAt: -1 });  //newest tasks first
    return res.status(200).json({
      success: true,
      type: "TASKS_FETCHED",
      message: "Tasks fetched successfully",
      tasks: tasks,
    });
  }catch (err) {
    console.error("Get Tasks Error:", err);
    return res.status(500).json({
      error: true,
      type: "INTERNAL_SERVER_ERROR",
      message: "Internal Server Error",
    });
  }
}