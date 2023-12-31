import jwt from "jsonwebtoken";
import express from "express";
import { authenticateJwt, SECRET } from "../middleware/";
import { User } from "../db/";
import { string, z } from "zod";
const router = express.Router();

const inputSignupProps = z.object({
  username: z.string().min(4).max(20),
  password: z.string().min(4).max(20),
});

router.post("/signup", async (req, res) => {
  const parsedInput = inputSignupProps.safeParse(req.body);
  if (!parsedInput.success) {
    return res.status(411).json({
      error: parsedInput.error,
    });
  }

  const { username, password } = parsedInput.data;
  const user = await User.findOne({ username });
  if (user) {
    res.status(403).json({ message: "User already exists" });
  } else {
    const newUser = new User({ username, password });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, SECRET, { expiresIn: "1h" });
    res.json({ message: "User created successfully", token });
  }
});

router.post("/login", async (req, res) => {
  const parsedInput = inputSignupProps.safeParse(req.body);
  if (!parsedInput.success) {
    return res.status(411).json({
      error: parsedInput.error,
    });
  }

  const { username, password } = parsedInput.data;
  const user = await User.findOne({ username, password });
  if (user) {
    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1h" });
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "Invalid username or password" });
  }
});

router.get("/me", authenticateJwt, async (req, res) => {
  const user = await User.findOne({ _id: req.headers.userId });
  if (user) {
    res.json({ username: user.username });
  } else {
    res.status(403).json({ message: "User does not exists" });
  }
});

router.patch("/username", authenticateJwt, async (req, res) => {
  try {
    const userId = req.headers.userId;
    const newUsername: string = req.body.username;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username: newUsername },
      { new: true }
    );
    res.json(updatedUser);
  } catch {
    res.status(403).json({ message: "User does not exists" });
  }
});

export default router;
