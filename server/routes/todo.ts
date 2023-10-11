import express from "express";
import { authenticateJwt, SECRET } from "../middleware/";
import { Todo } from "../db";
import { z } from "zod";
const router = express.Router();

const todosInput = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

router.post("/todos", authenticateJwt, async (req, res) => {
  try {
    const parsedInput = todosInput.safeParse(req.body);
    if (!parsedInput.success) {
      return res.status(411).json({
        error: parsedInput.error,
      });
    }

    const { title, description } = parsedInput.data;
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
    const parsedInput = todosInput.safeParse(req.body);
    if (!parsedInput.success) {
      return res.status(411).json({
        error: parsedInput.error,
      });
    }

    const { todoId } = req.params;
    const updatedTodo = parsedInput.data;
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
