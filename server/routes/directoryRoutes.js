import express from "express";
import { mkdir, readdir, stat } from "fs/promises";
import path from "path";
import { error } from "console";

const router = express.Router();
console.log(router);

// Read
router.get("{/*path}", async (req, res) => {
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

router.post("{/*path}", async (req, res) => {
  const { path: segments = [] } = req.params;
  let dirname = segments.join("/");
  dirname = path.join("/", dirname);

  try {
    await mkdir(`./storage/${dirname}`);
    res.json({ message: "Folder Created!" });
  } catch (err) {
    res.json({ err: err.message });
  }
});

export default router;
