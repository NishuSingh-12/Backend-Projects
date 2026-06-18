import { readdir, open, readFile } from "node:fs/promises";
import http from "node:http";

const server = http.createServer(async (req, res) => {
  if (req.url === "/favicon.ico") return res.end("No favicon");
  if (req.url === "/") {
    serveDirectory(req, res);
  } else {
    try {
      const fileHandle = await open(`./storage${decodeURIComponent(req.url)}`);

      const stats = await fileHandle.stat();

      if (stats.isDirectory()) {
        serveDirectory(req, res);
      } else {
        const readStream = fileHandle.createReadStream();
        readStream.pipe(res);
      }
    } catch (err) {
      console.log(err.message);
      res.end("Not Found!");
    }
  }
});

async function serveDirectory(req, res) {
  const itemsList = await readdir(`./storage${req.url}`);
  let dynamicHtml = "";
  itemsList.forEach((item) => {
    dynamicHtml += `<a href = ".${req.url === "/" ? "" : req.url}/${item}">${item}</a><br>`;
  });
  const htmlBoilerPlate = await readFile("./boilerplate.html", "utf-8");
  res.end(htmlBoilerPlate.replace("${dynamicHtml}", dynamicHtml));
}

server.listen(80, "0.0.0.0", () => {
  console.log("Server started");
});
