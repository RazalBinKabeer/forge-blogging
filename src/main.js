const postFiles = ["post1.md", "post2.md"];

const loadPosts = async () => {
  const container = document.getElementById("posts");

  for (const file of postFiles) {
    const res = await fetch(`posts/${file}`);
    const text = await res.text();

    const lines = text.split("\n");
    console.log("lines", lines);
    const title = lines[0].replace(/^# /, "");
    const author = lines[2];
    const summary = lines[3] || "";

    const postHTML = `
      <article class="post">
        <h2>${title}</h2>
        <p class="meta">${author}</p>
        <p class="summary">${summary}</p>
        <a href="#" class="read-more">
          Read more →
        </a>
      </article>
    `;

    container.innerHTML += postHTML;
  }
};

window.addEventListener("DOMContentLoaded", loadPosts);
