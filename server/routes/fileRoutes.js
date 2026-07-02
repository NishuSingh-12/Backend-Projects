import express from "express";
import { createWriteStream } from "fs";
import { rename, rm, writeFile } from "fs/promises";
import path from "path";
import filesData from "../filesDB.json" with { type: "json" };

const router = express.Router();

//Create
router.post("/:filename", (req, res) => {
  const { filename } = req.params;
  const id = crypto.randomUUID();
  const extension = path.extname(filename);
  const fullFileName = `${id}${extension}`;
  const writeStream = createWriteStream(`./storage/${fullFileName}`);
  req.pipe(writeStream);
  req.on("end", async () => {
    filesData.push({
      id,
      extension,
      name: filename,
    });
    console.log(filesData);
    await writeFile("./filesDB.json", JSON.stringify(filesData));
    res.json({ message: "File Uploaded" });
  });
});

// Serving File
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const fileData = filesData.find((file) => file.id === id);
  console.log(fileData);
  if (req.query.action === "download") {
    res.set("Content-Disposition", "attachment");
  }

  res.sendFile(`${process.cwd()}/storage/${id}${fileData.extension}`, (err) => {
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
