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

const labelByTheme = {
  system: "Theme: System",
  dark: "Theme: Dark",
  light: "Theme: Light"
};

function setThemeButtonLabel(theme) {
  toggle.textContent = labelByTheme[theme] || "Theme";
}

setThemeButtonLabel(root.dataset.theme);

toggle.onclick = () => {
  themeIndex = (themeIndex + 1) % themes.length;
  const theme = themes[themeIndex];
  root.dataset.theme = theme;
  localStorage.setItem("theme", theme);
  setThemeButtonLabel(theme);
};

function renderProjects(projects) {
  const grid = document.getElementById("projects-grid");
  if (!grid) {
    return;
  }

  grid.innerHTML = "";

  projects.forEach(project => {
    const card = document.createElement("article");
    card.className = "card";
    const hasScreenshot = typeof project.screenshot === "string" && project.screenshot.trim() !== "";
    const tags = Array.isArray(project.tags) ? project.tags.join(" · ") : "";

    card.innerHTML = `
      ${hasScreenshot ? `<img src="${project.screenshot}" alt="${project.name} screenshot">` : ""}
      <h3>${project.name}</h3>
      <p>${project.description}</p>
      <div class="meta">${tags}</div>
      <a class="project-link" href="${project.github}" target="_blank" rel="noopener noreferrer">View on GitHub →</a>
    `;

    grid.appendChild(card);
  });
}

function showProjectStatus(message) {
  const grid = document.getElementById("projects-grid");
  if (!grid) {
    return;
  }

  grid.innerHTML = `
    <article class="card">
      <h3>Projects status</h3>
      <p>${message}</p>
    </article>
  `;
}

function loadProjects() {
  showProjectStatus("Loading projects...");

  fetch("./projects.json", { cache: "no-store" })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    })
    .then(projects => {
      if (!Array.isArray(projects) || projects.length === 0) {
        showProjectStatus("No projects found yet.");
        return;
      }

      renderProjects(projects);
    })
    .catch(error => {
      const isLocalFile = window.location.protocol === "file:";
      const message = isLocalFile
        ? "Projects couldn't load from a local file. Open this with a local web server or GitHub Pages."
        : "Projects couldn't load right now. Please try again in a moment.";

      console.error("Failed to load projects:", error);
      showProjectStatus(message);
    });
}

loadProjects();


// footer year
document.getElementById("year").textContent = new Date().getFullYear();


