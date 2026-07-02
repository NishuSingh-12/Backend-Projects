import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function DirectoryView() {
  const [directoryItems, setDirectoryItems] = useState([]);
  const [directoriesList, setDirectoriesList] = useState([]);
  const [filesList, setFilesList] = useState([]);
  const [progress, setProgress] = useState(0);
  const [newFileName, setNewFileName] = useState("");
  const [newDirName, setNewDirName] = useState("");
  const BASE_URL = "http://192.168.2.100:4000";
  const { "*": dirPath } = useParams();

  async function getDirectoryItems() {
    const response = await fetch(`${BASE_URL}/directory/${dirPath}`);
    const data = await response.json();
    // setDirectoryItems(data);
    setDirectoriesList(data.directories);
    setFilesList(data.files);
  }

  useEffect(() => {
    getDirectoryItems();
  }, [dirPath]);

  function uploadFile(e) {
    const file = e.target.files[0];

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${BASE_URL}/file/${file.name}`, true);
    // xhr.setRequestHeader("parentdirid",null)
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

  async function handleDelete(fileId) {
    const response = await fetch(`${BASE_URL}/file/${fileId}`, {
      method: "DELETE",
    });
    const data = await response.text();
    console.log(data);
    getDirectoryItems();
  }

  async function renameFile(oldFilename) {
    setNewFileName(oldFilename);
  }

  async function saveFileName(fileId) {
    const response = await fetch(`${BASE_URL}/file/${fileId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newFileName }),
    });
    const data = await response.text();
    console.log(data);
    setNewFileName("");
    getDirectoryItems();
  }

  async function handleCreateDirectory(e) {
    e.preventDefault();
    const url = `${BASE_URL}/directory${dirPath ? "/" + dirPath : ""}/${newDirName}`;
    const response = await fetch(url, {
      method: "POST",
    });
    const data = await response.json();
    console.log(data);
    setNewDirName("");
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
      <form onSubmit={handleCreateDirectory}>
        <input
          type="text"
          onChange={(e) => setNewDirName(e.target.value)}
          value={newDirName}
        />
        <button>Create Folder</button>
      </form>
      {filesList.map(({ name, id }) => (
        <div key={id}>
          {name} {""}
          <a href={`${BASE_URL}/file/${id}`}>Open</a>
          {""}
          <a href={`${BASE_URL}/file/${id}?action=download`}>Download</a>
          <button
            onClick={() => {
              renameFile(name);
            }}
          >
            Rename
          </button>
          <button
            onClick={() => {
              saveFileName(id);
            }}
          >
            Save
          </button>
          <button
            onClick={() => {
              handleDelete(id);
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
