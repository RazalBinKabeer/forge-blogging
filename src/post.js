const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

console.log("slug", slug);

const loadPost = async () => {
  const res = await fetch(`/posts/${slug}.md`);
  if (!res.ok) {
    document.getElementById("post").innerHTML = "<h1>Post not found</h1>";
    return;
  }

  const text = await res.text();
  const lines = text.split("\n");

  const title = lines[0].replace(/^# /, "");
  const author = lines[2].trim();
  const body = lines.slice(3).join("\n");

  document.title = title;

  document.getElementById("post").innerHTML = `
    <h1>${title}</h1>
    <p class="meta">${author}</p>
    <div class="body">${body.replace(/\n/g, "<br>")}</div>    
    `;
};

window.addEventListener("DOMContentLoaded", loadPost);
