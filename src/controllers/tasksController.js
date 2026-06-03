const Task = require("../models/taskModel");

const getAllTasks = async (req, res) => {
  try {
    const {
      search,
      status,
      priority,
      page = 1,
      pageSize = 10,
      sort = "asc",
      sortBy = "createdAt",
    } = req.query;

    const query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (status === "completed") {
      query.completed = true;
    }
    if (status === "pending") {
      query.completed = false;
    }

    if (priority) {
      query.priority = priority;
    }

    const tasks = await Task.find(query)
      .sort({ [sortBy]: sort === "asc" ? 1 : -1 })
      .skip((page - 1) * pageSize)
      .limit(Number(pageSize));

    const totalRecord = await Task.countDocuments(query);

    res.json({
      tasks,
      totalRecord,
      page,
      pageSize,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      completed: req.body.completed,
      priority: req.body.priority,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTaskById = async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json({ task, message: "Task deleted" });
};

const updateTaskById = async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json({ task, message: "Task updated" });
};

const getTaskById = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json({ task, message: "Task found" });
};

module.exports = {
  getAllTasks,
  createTask,
  deleteTaskById,
  updateTaskById,
  getTaskById,
};
