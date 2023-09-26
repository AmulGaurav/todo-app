import express from "express";
const app = express();
import mongoose from "mongoose";
const port = 3000;
import authRoutes from "./routes/auth";
import todoRoutes from "./routes/todo";
import cors from "cors";

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/todo", todoRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

mongoose.connect(
  "mongodb+srv://amulgaurav907:Bkm3vxaN80ucI0p3@cluster0.f2yryxv.mongodb.net/todos-db",
  { dbName: "todos-db" }
);
