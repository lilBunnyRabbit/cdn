import { keywordsToHtml } from "./docsHtml.js";

export const Element = {
  Title: (title, { github, home } = {}) => {
    const element = document.createElement("div");
    element.className = "title";
    element.innerHTML = `
    ${
      github
        ? `
      <a href="${github}" class="title-button no-stroke">
        <svg fill="var(--title)" height="32" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="32" data-view-component="true">
          <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
        </svg>
      </a>
    `
        : "<div></div>"
    }

    <div>${title}</div>

    ${
      home
        ? `
      <a href="${home}" class="title-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="inherit" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </a>
    `
        : "<div></div>"
    }
    `;
    return element;
  },
  Section: (name, type, actionId) => {
    const element = document.createElement("div");
    element.className = `section ${type || ""}`;

    const title = document.createElement("div");
    title.className = "section-title";

    if (actionId) {
      title.innerHTML = `<div>${name}</div><div id="${actionId}"></div>`;
    } else {
      title.innerText = name;
    }

    element.appendChild(title);

    return element;
  },
  SubSection: (name, type, actionId) => {
    const element = document.createElement("div");
    element.className = `section ${type || ""}`;

    const title = document.createElement("div");
    title.className = "sub-section-title";
    title.innerText = name;

    if (actionId) {
      title.innerHTML = `<div>${name}</div><div id="${actionId}"></div>`;
    } else {
      title.innerText = name;
    }

    element.appendChild(title);

    return element;
  },
  DocsElement: (name, { type, displayType, keywords, isHidden, children }) => {
    const element = document.createElement("div");
    element.id = `${type}-${name.toLowerCase()}`;
    element.className = `docs-element ${type}`;

    const title = document.createElement("div");
    title.className = "docs-element-title";
    title.innerHTML = `
    <div class="docs-element-title-name">
      <div class="docs-row">${name}${keywordsToHtml(keywords)}</div>
      <div class="chevron">
        <svg class="icon-chevron" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="inherit" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </div>
    <div class="docs-element-title-type">${displayType || type}</div>
    `;

    const body = document.createElement("div");
    body.className = "docs-element-body";
    body.innerHTML = children;

    element.appendChild(title);
    element.appendChild(body);

    if (isHidden) element.classList.add("hidden");
    title.onclick = () => element.classList.toggle("hidden");

    return element;
  },
};
