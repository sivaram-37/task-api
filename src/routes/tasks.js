const express = require("express");
const router = express.Router();

const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTaskById,
  deleteTaskById,
} = require("../controllers/tasksController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getAllTasks);
router.get("/:id", authMiddleware, getTaskById);
router.post("/", authMiddleware, createTask);
router.put("/:id", authMiddleware, updateTaskById);
router.delete("/:id", authMiddleware, deleteTaskById);

module.exports = router;
