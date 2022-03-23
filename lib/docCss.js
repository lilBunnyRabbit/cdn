const theme = {
  bg: "#18181b",
  "bg-2": "#2D2D33",
  text: "#f6f6f6",
  c: {
    description: "#d9d9d9",
    info: "#d9d9d9",
    keyword: "#8566D9",
    contructor: "#D9AF66",
    method: "#D9AF66",
    type: "#66B8D9",
    "type-link": "#668ED9",
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

const rootStyle = document.documentElement.style;
Object.keys(theme).forEach((type) => {
  const value = theme[type];
  if (type === "e") {
    Object.keys(value).forEach((key) => {
      rootStyle.setProperty(`--${type}-${key}`, value[key]);
      rootStyle.setProperty(`--${type}-${key}-bg`, value[key] + "7f");
      rootStyle.setProperty(`--${type}-${key}-bg-2`, value[key] + "1c");
    });
  } else if (typeof value === "object") {
    Object.keys(value).forEach((key) => rootStyle.setProperty(`--${type}-${key}`, value[key]));
  } else {
    rootStyle.setProperty(`--${type}`, value);
  }
});

const css =
  `
/* Default */
html {
  font-family: Consolas;
  background: var(--bg);
  color: var(--text);
}

body {
  margin: 32px;
  position: relative;
  box-sizing: border-box;
}

.root {
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  position: relative;
  box-sizing: border-box;
  max-width: 1000px;
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

/* Overrides */
code.hljs {
  padding: 0px !important;
  background: transparent !important;
}

/* Colors */
.c-description {
  color: var(--c-description);
}
.c-keyword {
  color: var(--c-keyword);
}
.c-constructor {
  color: var(--c-contructor);
}
.c-method {
  color: var(--c-method);
}
.c-type {
  color: var(--c-type);
}
.c-type-link {
  color: var(--c-type-link);
}
.c-variable {
  color: var(--c-variable);
}
.c-argument {
  color: var(--c-argument);
}
.c-info {
  color: var(--c-info);
}

/* Classes */
.title {
  font-size: 24px;
  text-align: center;
}

.section {
  font-size: 24px;
  font-weight: bold;
  margin-top: 8px;
  border-bottom: 1px solid var(--text);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sub-section {
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid var(--text);
  padding-bottom: 1px;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  box-sizing: border-box;
}

.container.hidden {
  display: none;
}

/* Classes - Docs */
.doc-column {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.doc-column.tab {
  padding: 0px 16px;
}

.doc-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.doc-row.no-gap {
  gap: 0px;
}

.doc-row.between {
  justify-content: space-between;
}

.doc-list {
  display: flex;
  flex-direction: column;
  line-height: 20px;
}

.doc-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid var(--text);
  box-sizing: border-box;
}

.doc-title {
  width: 100%;
  background: var(--bg);
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.doc-title > *:first-child {
  padding: 8px;
  border-right: 1px solid;
  flex: 1;
}

.doc-title > *:last-child {
  padding: 8px;
  font-size: 14px;
  width: 75px;
  text-align: center;
  box-sizing: border-box;
}

.doc-body {
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  border-top: 1px solid var(--text);
}

.doc-container.hidden > .doc-body {
  display: none;
}

.doc-container.hidden > .doc-title * .icon-chevron {
  transform: rotate(90deg);
}

.doc-body > * {
  border-bottom: 1px solid var(--text);
  padding: 8px;
}

.doc-body > *:last-child {
  border-bottom: none;
}

.doc-keyword {
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

.doc-type-link {
  color: var(--c-type-link);
}

.doc-table-container {
  overflow-x: auto;
  margin-bottom: 8px;
}

.doc-table {
  border-collapse: collapse;
  width: 100%;
}

.doc-table * th {
  text-align: left;
  padding: 4px 8px;
}

.doc-table * td {
  text-align: left;
  vertical-align: top;
  padding: 4px 8px;
  border-right: 1px solid;
}

.doc-table * tr {
  border-bottom: 1px solid var(--text);
  border-left: 1px solid var(--text);
  border-right: 1px solid var(--text);
}

.doc-table * tr:first-child {
  border-top: 1px solid var(--text);
  background: var(--bg);
}

.doc-icon {
  display: flex;
  align-items: center;
}

pre {
  margin: 0px;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
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
` +
  Object.keys(theme.e)
    .map(
      (key) => `
    .doc-container.${key} {
      border-color: var(--e-${key});
    }
    .doc-container.${key} > .doc-title {
      background: var(--e-${key}-bg);
    }
    .doc-container.${key} > .doc-body {
      background: var(--e-${key}-bg-2);
      border-color: var(--e-${key});
    }
    .doc-container.${key} * * {
      border-color: var(--e-${key});
    }
    .doc-container.${key} * .doc-table {
      border-color: var(--e-${key});
    }
    .doc-container.${key} * .doc-table * tr:first-child {
      border-color: var(--e-${key});
      background: var(--e-${key}-bg);
    }
    `
    )
    .join("");

export function addCustomStyle() {
  const style = document.createElement("style");
  style.innerHTML = css;
  document.head.appendChild(style);
}
