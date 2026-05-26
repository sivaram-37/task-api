const { getData, saveData } = require("../utils/fileHandler");

const getAllTasks = (req, res) => {
  const data = getData();

  const searchTerm = req.query.search;
  const page = req.query.page;
  const page_size = req.query.page_size;
  const sortOrder = req.query.sort || "asc";
  const sortBy = req.query.sortBy || "createdOn";

  if (searchTerm) {
    data.tasks = data.tasks.filter((task) =>
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  if (page && page_size) {
    const startIndex = (page - 1) * page_size;
    const endIndex = startIndex + parseInt(page_size);
    data.tasks = data.tasks.slice(startIndex, endIndex);
  }

  if (sortBy && sortOrder) {
    const priorityOrder = { low: 0, medium: 1, high: 2 };
    data.tasks = data.tasks.sort((a, b) => {
      if (sortBy === "priority") {
        const aPriority = priorityOrder[a[sortBy]] ?? 0;
        const bPriority = priorityOrder[b[sortBy]] ?? 0;
        if (sortOrder === "asc") {
          return aPriority - bPriority;
        } else {
          return bPriority - aPriority;
        }
      } else {
        if (sortOrder === "asc") {
          return a[sortBy] > b[sortBy] ? 1 : -1;
        } else {
          return a[sortBy] < b[sortBy] ? 1 : -1;
        }
      }
    });
  }

  res.json({ tasks: data.tasks, page, page_size, total_record: data.tasks.length });
};

const createTask = (req, res) => {
  const data = getData();

  if (!req.body.title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const newTask = {
    id: Date.now(),
    title: req.body.title,
    completed: req.body.completed || false,
    priority: req.body.priority || "low",
    createdOn: new Date().toISOString(),
  };

  data.tasks.push(newTask);

  saveData(data);

  res.json(newTask);
};

const deleteTaskById = (req, res) => {
  const data = getData();

  data.tasks = data.tasks.filter((task) => task.id != req.params.id);

  if (data.tasks.length === 0) {
    return res.status(404).json({ message: "Task not found" });
  }

  saveData(data);

  res.json({
    message: "Deleted",
  });
};

const updateTaskById = (req, res) => {
  const data = getData();

  const task = data.tasks.find((t) => t.id == req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (req.body.priority !== undefined) {
    const allowedPriorities = ["low", "medium", "high"];
    if (!allowedPriorities.includes(req.body.priority)) {
      return res.status(400).json({ message: "Priority must be low, medium, or high" });
    }
    task.priority = req.body.priority;
  }

  if (req.body.title !== undefined) {
    if (typeof req.body.title !== "string") {
      return res.status(400).json({ message: "Title must be a string" });
    }
    if (req.body.title.trim() === "") {
      return res.status(400).json({ message: "Title cannot be empty" });
    }
    task.title = req.body.title;
  }

  if (req.body.completed !== undefined) {
    if (typeof req.body.completed !== "boolean") {
      return res.status(400).json({ message: "Completed must be a boolean" });
    }
    task.completed = req.body.completed;
  }

  saveData(data);

  res.json(task);
};

const getTaskById = (req, res) => {
  const data = getData();

  const task = data.tasks.find((t) => t.id == req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(task);
};

module.exports = {
  getAllTasks,
  createTask,
  deleteTaskById,
  updateTaskById,
  getTaskById,
};
