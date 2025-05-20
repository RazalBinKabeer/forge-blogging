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

const allowedDirs = ["public", "posts", "src"];

const server = http.createServer((req, res) => {
  const { method } = req;
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const urlPath = parsedUrl.pathname;

  // API Route
  if (urlPath === "/api/posts" && method === "GET") {
    const posts = getPosts();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(posts));
    return;
  }

  // Serve static files
  let filePath = "." + urlPath;
  if (filePath === "./") filePath = "./index.html";

  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || "application/octet-stream";

  const isAllowed =
    fs.existsSync(filePath) &&
    (fs.statSync(filePath).isFile() ||
      filePath === "./index.html" ||
      filePath === "./post.html" ||
      allowedDirs.some((dir) => filePath.startsWith(`./${dir}/`)));

  if (!isAllowed) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 - Not Found");
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("500 - Server Error");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
