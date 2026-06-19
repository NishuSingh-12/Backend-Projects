import { useEffect, useState } from "react";

function App() {
  const [directoryItems, setDirectoryItems] = useState([]);
  const [progress, setProgress] = useState(0);
  const [newFileName, setNewFileName] = useState("");
  async function getDirectoryItems() {
    const response = await fetch("http://192.168.2.102/");
    const data = await response.json();
    setDirectoryItems(data);
  }
  useEffect(() => {
    getDirectoryItems();
  }, []);
  function uploadFile(e) {
    const file = e.target.files[0];

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://192.168.2.102/", true);
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
    console.log(filename);
    const response = await fetch("http://192.168.2.102/delete", {
      method: "DELETE",
      body: filename,
    });
    const data = await response.text();
    console.log(data);
    getDirectoryItems();
  }
  async function renameFile(oldFilename) {
    console.log({ oldFilename, newFileName });
    setNewFileName(oldFilename);
  }
  async function saveFileName(oldFilename) {
    setNewFileName(oldFilename);
    const response = await fetch("http://192.168.2.102/", {
      method: "PATCH",
      body: JSON.stringify({ oldFilename, newFileName }),
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
          <a href={`http://192.168.2.102/${item}?action=open`}>Open</a>

          <a href={`http://192.168.2.102/${item}?action=download`}>Download</a>
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
