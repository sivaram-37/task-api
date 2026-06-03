require("dotenv").config();

const express = require("express");
const cors = require("cors");

const taskRoutes = require("./routes/tasks");
const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/tasks", taskRoutes);

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("API Running");
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
