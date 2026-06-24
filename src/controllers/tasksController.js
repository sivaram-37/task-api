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

    const pageNum = Number(page);
    const pageSizeNum = Number(pageSize);

    const query = {
      user: req.user.userId,
    };

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
      .skip((pageNum - 1) * pageSizeNum)
      .limit(pageSizeNum);

    const totalRecord = await Task.countDocuments(query);

    res.json({
      tasks,
      totalRecord,
      totalPages: Math.ceil(totalRecord / pageSizeNum),
      page: pageNum,
      pageSize: pageSizeNum,
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
      user: req.user.userId,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTaskById = async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user.userId,
  });

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json({ task, message: "Task deleted" });
};

const updateTaskById = async (req, res) => {
  const allowedUpdates = {
    title: req.body.title,
    completed: req.body.completed,
    priority: req.body.priority,
  };

  const task = await Task.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user.userId,
    },
    allowedUpdates,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json({ task, message: "Task updated" });
};

const getTaskById = async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user.userId,
  });

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
