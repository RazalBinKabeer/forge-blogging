const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".md": "text/plain",
  ".json": "application/json",
};

const getPosts = () => {
  const postDir = path.join(__dirname, "posts");
  const files = fs.readdirSync(postDir);

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(postDir, file), "utf-8");
    const lines = raw.split("\n");

    return {
      title: lines[0].replace(/^# /, ""),
      author: lines[2].trim(),
      summary: lines[3] || "",
      slug: file.replace(".md", ""),
    };
  });
};

const server = http.createServer((req, res) => {
  const { url, method } = req;

  // Handle API Route
  if (url === "/api/posts" && method === "GET") {
    const posts = getPosts();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(posts));
    return;
  }

  let filePath = "." + req.url;

  if (filePath === "./") filePath = "./index.html";

  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 - Not Found");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
