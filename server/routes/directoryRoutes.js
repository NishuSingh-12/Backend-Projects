import express from "express";
import { mkdir, readdir, stat } from "fs/promises";
import path from "path";
import directoriesData from "../directoriesDB.json" with { type: "json" };
import filesData from "../filesDB.json" with { type: "json" };

const router = express.Router();

// Read
router.get("{/:id}", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    const directoryData = directoriesData[0];
    const files = directoryData.files.map((fileId) =>
      filesData.find((file) => file.id === fileId),
    );
    res.json({ ...directoryData, files });
  } else {
    const directoryData = directoriesData.find(
      (directory) => directory.id === id,
    );
    res.json(directoryData);
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
