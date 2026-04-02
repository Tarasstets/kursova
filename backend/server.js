const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

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
  taskType: {
    type: String,
    enum: ["personal", "team"],
    default: "personal",
  },
  team: {
    type: String,
    default: "",
  },
  owner: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  steps: {
    type: [String],
    default: [],
  },
  notes: {
    type: String,
    default: "",
  },
});

const Task = mongoose.model("Task", taskSchema);

app.get("/api/tasks", async (req, res) => {
  try {
    const { username, team } = req.query;

    const tasks = await Task.find({
      $or: [
        { taskType: "personal", owner: username },
        { taskType: "team", team: team },
      ],
    }).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Помилка отримання задач" });
  }
});

app.post("/api/tasks", async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const newTask = new Task({
      title: req.body.title,
      completed: req.body.completed ?? false,
      category: req.body.category || "Загальне",
      priority: req.body.priority || "medium",
      deadline: req.body.deadline || null,
      taskType: req.body.taskType || "personal",
      team: req.body.team || "",
      owner: req.body.owner || "",
      steps: req.body.steps || [],
      notes: req.body.notes || "",
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка створення задачі" });
  }
});

app.put("/api/tasks/:id", async (req, res) => {
  try {
    console.log("UPDATE BODY:", req.body);
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        completed: req.body.completed,
        category: req.body.category,
        priority: req.body.priority,
        deadline: req.body.deadline || null,
        taskType: req.body.taskType || "personal",
        team: req.body.team || "",
        owner: req.body.owner || "",
        steps: req.body.steps || [],
        notes: req.body.notes || "",
      },
      { new: true, runValidators: true },
    );

    console.log("UPDATED TASK:", updatedTask);

    res.json(updatedTask);
  } catch (error) {
    console.error(error);
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
