const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/tasks");
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
