require("dotenv").config();

const express = require("express");
const cors = require("cors");

const taskRoutes = require("./routes/tasks");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
