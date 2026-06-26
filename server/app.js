import express from "express";
import { readdir } from "fs/promises";

const app = express();

// Enabling CORS
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  next();
});

// Serving File
app.use((req, res, next) => {
  if (req.query.action === "download") {
    res.set("Content-Disposition", "attachment");
  }
  express.static("public")(req, res, next);
});

// Serving Dir Content
app.get("/", async (req, res) => {
  const filesList = await readdir("./storage");
  res.json(filesList);
});

app.listen(4000, () => {
  console.log("Server started");
});
