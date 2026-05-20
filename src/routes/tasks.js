const express = require("express");
const router = express.Router();

const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTaskById,
  deleteTaskById,
} = require("../controllers/tasksController");

router.get("/", getAllTasks);

router.get("/:id", getTaskById);

router.post("/", createTask);

router.put("/:id", updateTaskById);

router.delete("/:id", deleteTaskById);

module.exports = router;
