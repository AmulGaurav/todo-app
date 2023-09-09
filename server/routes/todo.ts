import express from "express";
import { authenticateJwt, SECRET } from "../middleware/index";
import { Todo } from "../db";
const router = express.Router();

interface TodoInput {
  _id: string;
  title: string;
  description: string;
  done: boolean;
}

router.post("/todos", authenticateJwt, async (req, res) => {
  try {
    const { title, description }: TodoInput = req.body;
    const done = false;
    const userId = req.headers.userId;
    const newTodo = new Todo({ title, description, done, userId });
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch {
    res.status(500).json({ error: "Failed to create a new todo" });
  }
});

router.get("/todos", authenticateJwt, async (req, res) => {
  try {
    const userId = req.headers.userId;
    const todos = await Todo.find({ userId });
    res.json(todos);
  } catch {
    res.status(500).json({ error: "Failed to retrieve todos" });
  }
});

router.patch("/todos/:todoId/done", authenticateJwt, async (req, res) => {
  try {
    const { todoId } = req.params;
    const userId = req.headers.userId;

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: todoId, userId },
      { done: true },
      { new: true }
    );

    if (updatedTodo) {
      res.json(updatedTodo);
    } else {
      res.status(500).json({ error: "Failed to update todo" });
    }
  } catch {
    res.status(500).json({ error: "Failed to update todo" });
  }
});

export default router;
