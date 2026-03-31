const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/kursova_db")
  .then(() => console.log("MongoDB підключено"))
  .catch((err) => console.error("Помилка підключення до MongoDB:", err));

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    default: "Загальне",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  deadline: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Task = mongoose.model("Task", taskSchema);

app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Помилка отримання задач" });
  }
});

app.post("/api/tasks", async (req, res) => {
  try {
    const newTask = new Task({
      title: req.body.title,
      completed: req.body.completed ?? false,
      category: req.body.category || "Загальне",
      priority: req.body.priority || "medium",
      deadline: req.body.deadline || null,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: "Помилка створення задачі" });
  }
});

app.put("/api/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        completed: req.body.completed,
        category: req.body.category,
        priority: req.body.priority,
        deadline: req.body.deadline || null,
      },
      { new: true },
    );

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Помилка оновлення задачі" });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Задачу видалено" });
  } catch (error) {
    res.status(500).json({ message: "Помилка видалення задачі" });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущено: http://localhost:${PORT}`);
});
