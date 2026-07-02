import express from "express";
import { createWriteStream } from "fs";
import { rename, rm } from "fs/promises";
import path from "path";
import { error } from "console";

const router = express.Router();

//Create
router.post("/*path", (req, res) => {
  const { path: segments } = req.params;
  let filePath = segments.join("/");
  filePath = path.join("/", filePath);

  const writeStream = createWriteStream(`./storage/${filePath}`);
  req.pipe(writeStream);
  req.on("end", () => {
    res.json({ message: "File Uploaded" });
  });
});

// Serving File
router.get("/*path", (req, res) => {
  const { path: segments } = req.params;
  let filePath = segments.join("/");
  filePath = path.join("/", filePath);
  if (req.query.action === "download") {
    res.set("Content-Disposition", "attachment");
  }

  res.sendFile(`${process.cwd()}/storage/${filePath}`, (err) => {
    if (err) {
      res.json({ error: "File not found!" });
    }
  });
});

// Delete File
router.delete("/*path", async (req, res) => {
  const { path: segments } = req.params;
  const filePath = segments.join("/");

  try {
    await rm(`./storage/${filePath}`, { recursive: true });
    res.json({ message: "File Deleted Successfully." });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// Rename File
router.patch("/*path", async (req, res) => {
  const { path: segments } = req.params;
  const filePath = segments.join("/");
  await rename(`./storage/${filePath}`, `./storage/${req.body.newFileName}`);
  res.json({ message: "Renamed" });
});

export default router;
