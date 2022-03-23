import { keywordsToHtml } from "./docHtml.js";

export const Element = {
  Title: (title) => {
    const element = document.createElement("div");
    element.className = "title";
    element.innerText = title;
    return element;
  },
  Section: (name, actionId) => {
    const element = document.createElement("div");
    element.className = "section";
    if (actionId) {
      element.innerHTML = `<div>${name}</div><div id="${actionId}"></div>`;
    } else {
      element.innerText = name;
    }
    return element;
  },
  SubSection: (name, actionId) => {
    const element = document.createElement("div");
    element.className = "sub-section";
    if (actionId) {
      element.innerHTML = `<div>${name}</div><div id="${actionId}"></div>`;
    } else {
      element.innerText = name;
    }
    return element;
  },
  Container: (type, title, isHidden) => {
    const element = document.createElement("div");
    element.className = `container ${type || ""} ${isHidden ? "hidden" : ""}`;
    if (type) {
      element.id = `container-${type}`;
    }
    if (title) {
      element.appendChild(title);
    }

    return element;
  },
  DocTitle: (name, type, keyword) => {
    const title = document.createElement("div");
    title.className = "doc-title";
    title.innerHTML = `
    <div class="doc-row between">
      <div class="doc-row">${name}${keyword ? keywordsToHtml(keyword) : ""}</div>
      ${Icon.Chevron}
    </div>
    <div>${type}</div>
    `;
    return title;
  },
  TestTitle: (name) => {
    const title = document.createElement("div");
    title.className = "doc-title";
    title.innerHTML = `
    <div class="doc-row between">
      <div class="doc-row">${name}</div>
      ${Icon.Chevron}
    </div>
    <div>test</div>
    `;
    return title;
  },
  DocElement: (name, { type, displayType, id, keyword, isHidden, children }) => {
    const element = document.createElement("div");
    element.className = `doc-container ${type}`;
    if (id) element.id = id;

    const title = Element.DocTitle(name, displayType || type, keyword);

    const body = document.createElement("div");
    body.className = "doc-body";
    body.innerHTML = children;

    element.appendChild(title);
    element.appendChild(body);

    if (isHidden) element.classList.add("hidden");
    title.onclick = () => element.classList.toggle("hidden");

    return element;
  },
};

export const Icon = {
  Chevron: `
  <div class="doc-icon">
    <svg class="icon-chevron" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  </div>`,
};
