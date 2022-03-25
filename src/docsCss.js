const theme = {
  bg: "#18181b",
  "bg-2": "#2D2D33",
  text: "#F0F0FC",
  title: "#D8D8E3",
  c: {
    description: "#D8D8E3",
    info: "#D8D8E3",
    keyword: "#8566D9",
    constructor: "#D9AF66",
    method: "#D9AF66",
    type: "#66B8D9",
    link: "#668ED9",
    variable: "#D766D9",
    argument: "#D99866",
  },
  e: {
    class: "#5E5099",
    object: "#506D99",
    type: "#509999",
    test: "#749950",
    error: "#995050",
  },
};

const highlightjsCss = `pre code.hljs{display:block;overflow-x:auto;padding:1em}/*!
Theme: GitHub Dark
Description: Dark theme as seen on github.com
Author: github.com
Maintainer: @Hirse
Updated: 2021-05-15

Outdated base version: https://github.com/primer/github-syntax-dark
Current colors taken from GitHub's CSS
*/.hljs{color:#c9d1d9;}.hljs-doctag,.hljs-keyword,.hljs-meta .hljs-keyword,.hljs-template-tag,.hljs-template-variable,.hljs-type,.hljs-variable.language_{color:#ff7b72}.hljs-title,.hljs-title.class_,.hljs-title.class_.inherited__,.hljs-title.function_{color:#d2a8ff}.hljs-attr,.hljs-attribute,.hljs-literal,.hljs-meta,.hljs-number,.hljs-operator,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-id,.hljs-variable{color:#79c0ff}.hljs-meta .hljs-string,.hljs-regexp,.hljs-string{color:#a5d6ff}.hljs-built_in,.hljs-symbol{color:#ffa657}.hljs-code,.hljs-comment,.hljs-formula{color:#8b949e}.hljs-name,.hljs-quote,.hljs-selector-pseudo,.hljs-selector-tag{color:#7ee787}.hljs-subst{color:#c9d1d9}.hljs-section{color:#1f6feb;font-weight:700}.hljs-bullet{color:#f2cc60}.hljs-emphasis{color:#c9d1d9;font-style:italic}.hljs-strong{color:#c9d1d9;font-weight:700}.hljs-addition{color:#aff5b4;background-color:#033a16}.hljs-deletion{color:#ffdcd7;background-color:#67060c}`;

const cssVariables = [];
let dynamicCss = "";

Object.keys(theme).forEach((type) => {
  const value = theme[type];
  if (typeof value === "object") {
    if (type === "e") {
      Object.keys(value).forEach((key) => {
        cssVariables.push(
          [`${type}-${key}`, value[key]],
          [`${type}-${key}-bg`, value[key] + "66"],
          [`${type}-${key}-bg-2`, value[key] + "33"]
        );

        dynamicCss += `
          .docs-element.${key} {
            border-color: var(--${type}-${key});
          }
          
          .docs-element.${key} > .docs-element-title {
            background: var(--${type}-${key}-bg);
            stroke: var(--${type}-${key});
          }

          .docs-element.${key} > .docs-element-title > .docs-element-title-type {
            color: var(--${type}-${key});
          }
          
          .docs-element.${key} > .docs-element-body {
            background: var(--${type}-${key}-bg-2);
          }
      
          .docs-element.${key} * .docs-table-container {
            border-color: var(--${type}-${key});
          }
      
          .docs-element.${key} * .docs-table {
            border-color: var(--${type}-${key});
          }
      
          .docs-element.${key} * .docs-table * tr:first-child {
            background: var(--${type}-${key}-bg);
          }
        `;
      });
    } else if (type === "c") {
      Object.keys(value).forEach((key) => {
        cssVariables.push([`${type}-${key}`, value[key]]);
        dynamicCss += `.c-${key} { color: var(--${type}-${key}); }`;
      });
    } else {
      Object.keys(value).forEach((key) => {
        cssVariables.push([`${type}-${key}`, value[key]]);
      });
    }
  } else {
    cssVariables.push([type, value]);
  }
});

const css = `
:root {
  ${cssVariables.map(([key, value]) => `--${key}: ${value};`).join("")}
}

/* Default */
html {
  font-family: Consolas;
  background: var(--bg);
  color: var(--text);
}

body {
  position: relative;
  box-sizing: border-box;
  margin: 0px;
}

a:hover {
  filter: brightness(90%);
}

a:active {
  filter: brightness(80%);
}

/* General */
.root {
  padding: 24px 32px 32px 32px;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  position: relative;
  box-sizing: border-box;
  max-width: 1024px;
  position: relative;
  animation-name: fadeIn;
  animation-duration: 250ms;
}

.root > * {
  width: 100%;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Classes */
.title {
  font-size: 24px;
  text-align: center;
  position: relative;
  background: var(--bg-2);
  display: flex;
  padding: 0px 32px;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  color: var(--title);
  height: 62px;
}

.title > *:first-child,
.title > *:last-child {
  width: 10%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.title > *:last-child {
  justify-content: flex-end;
}

.title-button {
  stroke: var(--title);
  cursor: pointer;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.title-button.no-stroke {
  stroke: none !important;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  box-sizing: border-box;
}

.section-title {
  font-size: 24px;
  font-weight: bold;
  margin-top: 8px;
  border-bottom: 1px solid var(--title);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--title);
}

.sub-section-title {
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid var(--title);
  padding-bottom: 1px;
  color: var(--title);
}

/* Docs */
.docs-column {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.docs-column.tab {
  padding: 0px 16px;
}

.docs-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.docs-row.no-gap {
  gap: 0px;
}

.docs-row.between {
  justify-content: space-between;
}

.docs-list {
  display: flex;
  flex-direction: column;
  line-height: 20px;
}

.docs-element {
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid white;
  box-sizing: border-box;
}

.docs-element-title {
  width: 100%;
  background: black;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border-color: inherit;
}

.docs-element-title-name {
  padding: 8px;
  flex: 1;
  border-right: 1px solid;
  border-color: inherit;
  display: flex;
  align-items: center;
  justify-content: space-between;
  stroke: inherit;
}

.docs-element-title-name > div:first-child {
  display: flex;
  gap: 8px;
  align-items: center;
}

.docs-element-title-name > .chevron {
  display: flex;
  align-items: center;
  stroke: inherit;
}

.docs-element.hidden > .docs-element-title > .docs-element-title-name > .chevron {
  transform: rotate(90deg);
}

.docs-element-title-type {
  padding: 8px;
  font-size: 14px;
  width: 75px;
  text-align: center;
  box-sizing: border-box;
}

.docs-element-body {
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  border-top: 1px solid;
  border-color: inherit;
  background: black;
}

.docs-element.hidden > .docs-element-body {
  display: none;
}

.docs-element-body > * {
  border-bottom: 1px solid;
  border-color: inherit;
  padding: 8px;
}

.docs-element-body > *:last-child {
  border-bottom: none;
}

.docs-keyword {
  background: var(--c-keyword);
  text-transform: uppercase;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: bold;
  border-radius: 4px;
  width: -moz-fit-content;
  width: fit-content;
  color: var(--text);
}

.docs-table-container {
  overflow-x: auto;
  margin-bottom: 8px;
}

.docs-table {
  border-collapse: collapse;
  width: 100%;
}

.docs-table * th {
  text-align: left;
  padding: 4px 8px;
}

.docs-table * td {
  text-align: left;
  vertical-align: top;
  padding: 4px 8px;
  border-right: 1px solid;
  border-color: inherit;
}

.docs-table * tr {
  border-bottom: 1px solid;
  border-left: 1px solid;
  border-right: 1px solid;
  border-color: inherit;
}

.docs-table * tr:first-child {
  border-top: 1px solid;
  background: black;
  border-color: inherit;
}

/* Misc */
pre {
  margin: 0px;
}

.test-code {
  font-size: 14px;
  line-height: normal;
}

.info-code {
  padding: 8px;
  background: var(--bg-2);
  font-size: 14px;
  line-height: normal;
}

#tests-info {
  font-size: 16px;
  font-weight: normal;
}

${dynamicCss}
${highlightjsCss}
`;

export function injectCss() {
  const style = document.createElement("style");
  style.innerHTML = css;
  document.head.appendChild(style);
}
