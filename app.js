import { readdir, open, readFile } from "node:fs/promises";
import http from "node:http";
import mime from "mime-types";

console.log(mime.contentType("hello.txt"));
console.log(mime.contentType("test.mp4"));
console.log(mime.contentType("abc.pdf"));
console.log(mime.contentType("river.webp"));

const server = http.createServer(async (req, res) => {
  if (req.url === "/favicon.ico") return res.end("No favicon");
  if (req.url === "/") {
    serveDirectory(req, res);
  } else {
    try {
      const [url, queryString] = req.url.split("?");
      const queryParam = {};
      queryString.split("&").forEach((pair) => {
        const [key, value] = pair.split("=");
        queryParam[key] = value;
      });
      console.log(queryParam);
      const fileHandle = await open(`./storage${decodeURIComponent(url)}`);

      const stats = await fileHandle.stat();

      if (stats.isDirectory()) {
        serveDirectory(req, res);
      } else {
        const readStream = fileHandle.createReadStream();
        res.setHeader("Content-Type", mime.contentType(url.slice(1)));
        res.setHeader("Content-Length", stats.size);
        if (queryParam.action === "download") {
          res.setHeader(
            "Content-Disposition",
            `attachment; filename="${url.slice(1)}"`,
          );
        }
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
    dynamicHtml += `${item} <a href = ".${req.url === "/" ? "" : req.url}/${item}?action=open">Open</a>
     <a href = ".${req.url === "/" ? "" : req.url}/${item}?action=download">Download</a><br>`;
  });
  const htmlBoilerPlate = await readFile("./boilerplate.html", "utf-8");
  res.end(htmlBoilerPlate.replace("${dynamicHtml}", dynamicHtml));
}

server.listen(80, "0.0.0.0", () => {
  console.log("Server started");
});
