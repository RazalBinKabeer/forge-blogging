const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

if (!slug) {
  document.getElementById("content").textContent = "❌ No slug provided.";
  throw new Error("Slug not found in URL");
}

fetch(`/posts/${slug}.md`)
  .then((res) => {
    if (!res.ok) throw new Error("Post not found");
    return res.text();
  })
  .then((md) => {
    const lines = md.split("\n");
    const title = lines[0].replace(/^# /, "");
    const author = lines[2];
    const body = lines.slice(3).join("\n");

    document.getElementById("title").textContent = title;
    document.getElementById("author").textContent = `By ${author}`;
    document.getElementById("content").textContent = body;
  })
  .catch((err) => {
    document.getElementById("content").textContent = "❌ Could not load post.";
    console.error(err);
  });
