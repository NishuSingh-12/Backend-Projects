import express from "express";
import { readdir, rename, rm } from "fs/promises";

const app = express();
app.use(express.json());

// Enabling CORS
app.use((req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*",
  });

  next();
});

// Serving File
app.get("/:filename", (req, res) => {
  const { filename } = req.params;
  if (req.query.action === "download") {
    res.set("Content-Disposition", "attachment");
  }
  res.sendFile(`${import.meta.dirname}/storage/${filename}`);
});

// Delete File
app.delete("/:filename", async (req, res) => {
  const { filename } = req.params;
  const filePath = `./storage/${filename}`;
  try {
    await rm(filePath);
    res.json({ message: "File Deleted Successfully." });
  } catch (err) {
    res.status(404).json({ message: "File not found!" });
  }
});

// Rename File
app.patch("/:filename", async (req, res) => {
  const { filename } = req.params;
  await rename(`./storage/${filename}`, `./storage/${req.body.newFileName}`);
  res.json({ message: "Renamed" });
});

// Serving Dir Content
app.get("/", async (req, res) => {
  const filesList = await readdir("./storage");
  res.json(filesList);
});

app.listen(4000, () => {
  console.log("Server started");
});
