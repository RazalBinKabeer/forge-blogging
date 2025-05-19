const loadPosts = async () => {
  const container = document.getElementById("posts");

  const res = await fetch(`/api/posts`);
  const posts = await res.json();

  posts.forEach(({ title, author, summary }) => {
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
  });
};

window.addEventListener("DOMContentLoaded", loadPosts);
