import express from "express";
import { createReadStream, createWriteStream } from "fs";
import { mkdir, readdir, rename, rm, stat } from "fs/promises";
import cors from "cors";
import path from "path";
import { error } from "console";

const app = express();
app.use(express.json());

// Enabling CORS
app.use(cors());

// Read
app.get("/directory{/*path}", async (req, res) => {
  const { path: segments = [] } = req.params;
  let dirname = segments.join("/");
  dirname = path.join("/", dirname);
  const fullDirPath = `./storage/${dirname ? dirname : ""}`;

  try {
    const filesList = await readdir(fullDirPath);
    const resdata = [];
    for (const item of filesList) {
      const stats = await stat(`${fullDirPath}/${item}`);
      resdata.push({ name: item, isDirectory: stats.isDirectory() });
    }
    res.json(resdata);
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.post("/directory{/*path}", async (req, res) => {
  const { path: segments = [] } = req.params;
  const dirname = segments.join("/");
  filePath = path.join("/", dirname);

  try {
    await mkdir(`./storage/${dirname}`);
    res.json({ message: "Folder Created!" });
  } catch (err) {
    res.json({ err: err.message });
  }
});

//Create
app.post("/files/*path", (req, res) => {
  const { path: segments } = req.params;
  const filePath = segments.join("/");
  filePath = path.join("/", filePath);

  const writeStream = createWriteStream(`./storage/${filePath}`);
  req.pipe(writeStream);
  req.on("end", () => {
    res.json({ message: "File Uploaded" });
  });
});

// Serving File
app.get("/files/*path", (req, res) => {
  const { path: segments } = req.params;
  let filePath = segments.join("/");
  filePath = path.join("/", filePath);
  if (req.query.action === "download") {
    res.set("Content-Disposition", "attachment");
  }

  res.sendFile(`${import.meta.dirname}/storage/${filePath}`, (err) => {
    console.log(err);
    if (err) {
      res.json({ error: "File not found!" });
    }
  });
});

// Delete File
app.delete("/files/*path", async (req, res) => {
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
app.patch("/files/*path", async (req, res) => {
  const { path: segments } = req.params;
  const filePath = segments.join("/");
  await rename(`./storage/${filePath}`, `./storage/${req.body.newFileName}`);
  res.json({ message: "Renamed" });
});

app.listen(4000, () => {
  console.log("Server started");
});
