const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const getData = () => {
  const data = fs.readFileSync("./db.json");

  return JSON.parse(data);
};

const saveData = (data) => {
  fs.writeFileSync("./db.json", JSON.stringify(data, null, 2));
};

app.get("/tasks", (req, res) => {
  const data = getData();

  res.json(data.tasks);
});

app.post("/tasks", (req, res) => {
  const data = getData();

  const newTask = {
    id: Date.now(),
    title: req.body.title,
    completed: false,
  };

  data.tasks.push(newTask);

  saveData(data);

  res.json(newTask);
});

app.delete("/tasks/:id", (req, res) => {
  const data = getData();

  data.tasks = data.tasks.filter((task) => task.id != req.params.id);

  saveData(data);

  res.json({
    message: "Deleted",
  });
});

app.put("/tasks/:id", (req, res) => {
  const data = getData();

  const task = data.tasks.find((t) => t.id == req.params.id);

  task.completed = !task.completed;

  saveData(data);

  res.json(task);
});

app.get("/", (req, res) => {
  res.send("API Running");
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
