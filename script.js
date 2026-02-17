// theme switcher
const themes = ["system", "dark", "light"];
let themeIndex = 0;

const root = document.documentElement;
const toggle = document.getElementById("themeToggle");

const saved = localStorage.getItem("theme");
if (saved && themes.includes(saved)) {
  root.dataset.theme = saved;
  themeIndex = themes.indexOf(saved);
} else {
  root.dataset.theme = "system";
}

toggle.onclick = () => {
  themeIndex = (themeIndex + 1) % themes.length;
  const theme = themes[themeIndex];
  root.dataset.theme = theme;
  localStorage.setItem("theme", theme);
};


// projects loader
fetch("projects.json")
  .then(r => {
    if (!r.ok) {
      throw new Error(`HTTP ${r.status}`);
    }
    return r.json();
  })
  .then(projects => {
    const grid = document.getElementById("projects-grid");
    grid.innerHTML = ""; // safety

    projects.forEach(p => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        ${p.screenshot ? `<img src="${p.screenshot}" alt="${p.name} screenshot">` : ""}
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="meta">${p.tags.join(" · ")}</div>
        <a class="link" href="${p.github}">View on GitHub →</a>
      `;
      grid.appendChild(card);
    });
  })
  .catch(err => {
    console.error("Failed to load projects:", err);
  });


// footer year
document.getElementById("year").textContent = new Date().getFullYear();


