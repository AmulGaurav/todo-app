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
    const userId = req.headers.userId;
    const newTodo = new Todo({ title, description, done: false, userId });
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

router.put("/todos/:todoId", authenticateJwt, async (req, res) => {
  try {
    const { todoId } = req.params;
    const updatedTodo: TodoInput = req.body;
    await Todo.findByIdAndUpdate(todoId, updatedTodo);
    res.json({ message: "Todo updated successfully." });
  } catch {
    res.status(404).json("Todo does not exist");
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

router.delete("/todos/:todoId", authenticateJwt, async (req, res) => {
  try {
    const { todoId } = req.params;
    await Todo.findByIdAndDelete(todoId);
    res.json({ message: "Todo deleted successfully." });
  } catch {
    res.status(404).json("Todo does not exist");
  }
});

export default router;
