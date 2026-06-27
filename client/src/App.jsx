import { useEffect, useState } from "react";

function App() {
  const [directoryItems, setDirectoryItems] = useState([]);
  const [progress, setProgress] = useState(0);
  const [newFileName, setNewFileName] = useState("");
  const URL = "http://192.168.2.102:4000/";

  async function getDirectoryItems() {
    const response = await fetch(URL);
    const data = await response.json();
    setDirectoryItems(data);
  }

  useEffect(() => {
    getDirectoryItems();
  }, []);

  function uploadFile(e) {
    const file = e.target.files[0];

    const xhr = new XMLHttpRequest();
    xhr.open("POST", URL, true);
    xhr.setRequestHeader("filename", file.name);
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
    const response = await fetch(`${URL}${filename}`, {
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
    const response = await fetch(`${URL}${oldFilename}`, {
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
      {directoryItems.map((item, i) => (
        <div key={i}>
          {item}
          <a href={`${URL}${item}?action=open`}>Open</a>

          <a href={`${URL}${item}?action=download`}>Download</a>
          <button
            onClick={() => {
              renameFile(item);
            }}
          >
            Rename
          </button>
          <button
            onClick={() => {
              saveFileName(item);
            }}
          >
            Save
          </button>
          <button
            onClick={() => {
              handleDelete(item);
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

export default App;
