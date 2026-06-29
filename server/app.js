import express from "express";
import { createWriteStream } from "fs";
import { readdir, rename, rm, stat } from "fs/promises";
import cors from "cors";

const app = express();
app.use(express.json());

// Enabling CORS
app.use(cors());

// Read
app.get("/directory{/*path}", async (req, res) => {
  const { path: segments = [] } = req.params;
  const dirname = segments.join("/");
  console.log(dirname);
  const fullDirPath = `./storage/${dirname ? dirname : ""}`;
  const filesList = await readdir(fullDirPath);
  const resdata = [];
  for (const item of filesList) {
    const stats = await stat(`${fullDirPath}/${item}`);
    resdata.push({ name: item, isDirectory: stats.isDirectory() });
  }
  res.json(resdata);
});

//Create
app.post("/files/*path", (req, res) => {
  const { path: segments } = req.params;
  const filePath = segments.join("/");
  const writeStream = createWriteStream(`./storage/${filePath}`);
  req.pipe(writeStream);
  req.on("end", () => {
    res.json({ message: "File Uploaded" });
  });
});

// Serving File
app.get("/files/*path", (req, res) => {
  const { path: segments } = req.params;
  const filePath = segments.join("/");
  if (req.query.action === "download") {
    res.set("Content-Disposition", "attachment");
  }
  res.sendFile(`${import.meta.dirname}/storage/${filePath}`);
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
