require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000; // Render khud PORT deta hai

app.use(cors());
app.use(express.json());

// ---- Demo data (memory mai; restart par reset) ----
let todos = [
  { id: 1, title: "Learn React", done: false },
  { id: 2, title: "Deploy on Render", done: false },
];
let nextId = 3;

// ---- API routes ----
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.get("/api/todos", (req, res) => res.json(todos));

app.post("/api/todos", (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ error: "title is required" });
  const todo = { id: nextId++, title: title.trim(), done: false };
  todos.push(todo);
  res.status(201).json(todo);
});

app.put("/api/todos/:id", (req, res) => {
  const todo = todos.find((t) => t.id === Number(req.params.id));
  if (!todo) return res.status(404).json({ error: "Not found" });
  if (req.body.title !== undefined) todo.title = req.body.title;
  if (req.body.done !== undefined) todo.done = req.body.done;
  res.json(todo);
});

app.delete("/api/todos/:id", (req, res) => {
  const before = todos.length;
  todos = todos.filter((t) => t.id !== Number(req.params.id));
  if (todos.length === before) return res.status(404).json({ error: "Not found" });
  res.status(204).end();
});

// ---- React build serve karna (production) ----
const distPath = path.join(__dirname, "..", "frontend", "dist");
app.use(express.static(distPath));
app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
