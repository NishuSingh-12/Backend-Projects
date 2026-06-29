import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function DirectoryView() {
  const [directoryItems, setDirectoryItems] = useState([]);
  const [progress, setProgress] = useState(0);
  const [newFileName, setNewFileName] = useState("");
  const BASE_URL = "http://192.168.2.102:4000";
  const { "*": dirPath } = useParams();

  async function getDirectoryItems() {
    const response = await fetch(`${BASE_URL}/directory/${dirPath}`);
    const data = await response.json();
    setDirectoryItems(data);
  }

  useEffect(() => {
    getDirectoryItems();
  }, [dirPath]);

  function uploadFile(e) {
    const file = e.target.files[0];

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${BASE_URL}/files/${dirPath}/${file.name}`, true);
    xhr.addEventListener("load", () => {
      console.log(xhr.response);
      getDirectoryItems();
    });

    xhr.upload.addEventListener("progress", (e) => {
      const totalProgress = (e.loaded / e.total) * 100;
      setProgress(totalProgress.toFixed(2));
    });
    xhr.send(file);
  }

  async function handleDelete(filename) {
    const response = await fetch(`${BASE_URL}/files/${dirPath}/${filename}`, {
      method: "DELETE",
    });
    const data = await response.text();
    console.log(data);
    getDirectoryItems();
  }

  async function renameFile(oldFilename) {
    setNewFileName(oldFilename);
  }

  async function saveFileName(oldFilename) {
    setNewFileName(oldFilename);
    const response = await fetch(
      `${BASE_URL}/files/${dirPath}/${oldFilename}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newFileName: `${dirPath}/${newFileName}` }),
      },
    );
    const data = await response.text();
    console.log(data);
    setNewFileName("");
    getDirectoryItems();
  }

  return (
    <>
      <h1>My Files</h1>
      <input type="file" onChange={uploadFile} />
      <input
        type="text"
        onChange={(e) => setNewFileName(e.target.value)}
        value={newFileName}
      />
      <p>Progress:{progress}%</p>
      {directoryItems.map(({ name, isDirectory }, i) => (
        <div key={i}>
          {name}
          {isDirectory && <Link to={`./${name}`}>Open</Link>}

          {!isDirectory && (
            <a href={`${BASE_URL}/files/${dirPath}/${name}?action=open`}>
              Open
            </a>
          )}
          {""}

          {!isDirectory && (
            <a href={`${BASE_URL}/files/${dirPath}/${name}?action=download`}>
              Download
            </a>
          )}
          <button
            onClick={() => {
              renameFile(name);
            }}
          >
            Rename
          </button>
          <button
            onClick={() => {
              saveFileName(name);
            }}
          >
            Save
          </button>
          <button
            onClick={() => {
              handleDelete(name);
            }}
          >
            Delete
          </button>
          <br />
        </div>
      ))}
    </>
  );
}

export default DirectoryView;
