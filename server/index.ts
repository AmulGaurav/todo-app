import express from "express";
const app = express();
import mongoose from "mongoose";
const port = 3000;
import cors from "cors";

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

mongoose.connect(
  "mongodb+srv://amulgaurav907:Bkm3vxaN80ucI0p3@cluster0.f2yryxv.mongodb.net/todos-db",
  { dbName: "todos-db" }
);
