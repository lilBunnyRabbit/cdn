import { isTypeLink } from "./docUtils.js";

export function textToValidHtml(t) {
  return t
    .split("")
    .map((char) => {
      switch (char) {
        case ">":
          return "&gt;";
        case "<":
          return "&lt;";
        default:
          return char;
      }
    })
    .join("");
}

export function typeLinkToHtml(typeLink) {
  if (!isTypeLink(typeLink)) return "";
  return `<a class="doc-type-link" href="#${typeLink.id}">${textToValidHtml(typeLink.name)}</a>`;
}

export function textToHtml(text) {
  if (Array.isArray(text)) {
    return text.map(textToHtml).join("");
  } else {
    if (isTypeLink(text)) return typeLinkToHtml(text);
    return textToValidHtml(text);
  }
}

export function descriptionToHtml(description) {
  const genDescription = (desc) => `<div class="c-description">&#8226; ${textToHtml(desc)}</div>`;

  if (Array.isArray(description)) {
    if (description.length === 0) return "";
    return `<div class="doc-list">${description.map(genDescription).join("")}</div>`;
  } else {
    if (!description) return "";
    return genDescription(description);
  }
}

export function typeToHtml(type) {
  if (!type) return "";
  return `<span class="c-type">${textToHtml(type)}</span>`;
}

export function keywordsToHtml(keywords) {
  const genKeyword = (keyword) => `<div class="doc-keyword">${textToHtml(keyword)}</div>`;

  if (Array.isArray(keywords)) {
    if (keywords.length === 0) return "";
    return keywords.map(genKeyword).join("");
  } else {
    if (!keywords) return "";
    return genKeyword(keywords);
  }
}

export function propertiesToHtml(properties) {
  if (!properties || Object.keys(properties).length === 0) return "";
  return Object.keys(properties)
    .map((key) => {
      const property = properties[key];
      return `
      <div class="doc-column">
        <div class="doc-row">
          <div class="c-variable">.${key}${property.optional ? "?" : ""}:</div>
          ${typeToHtml(property.type)}
          ${keywordsToHtml(property.keyword)}
        </div>
        <div class="doc-column tab">
          ${descriptionToHtml(property.description)}
        </div>
      </div>
      `;
    })
    .join("");
}

export function argumentsToHtml(args) {
  let list = "";
  let table = "";
  if (!args || args.length === 0) return { list, table };

  list = `<div class="c-argument">${textToHtml(
    args.map((arg) => (arg.optional ? `[${arg.name}]` : arg.name)).join(", ")
  )}</div>`;

  const genArgument = (name, arg) => {
    const argString = `
      <tr>
        <td class="c-argument">${arg.optional ? `[${name}]` : name}</td>
        <td>${typeToHtml(arg.type)}</td>
        <td>${descriptionToHtml(arg.description)}</td>
      </tr>
    `;

    if (arg.properties) {
      return (
        argString +
        Object.keys(arg.properties)
          .map((key) => {
            const propertyName = key.startsWith("[") && key.endsWith("]") ? `${name}${key}` : `${name}.${key}`;
            return genArgument(propertyName, arg.properties[key]);
          })
          .join("")
      );
    }

    return argString;
  };

  table = `
  <div class="doc-table-container">
    <table class="doc-table">
      <tr>
        <th style="width: 20%">Argument</th>
        <th style="width: 30%">Type</th>
        <th style="width: 50%">Description</th>
      </tr>
      ${args.map((arg) => genArgument(arg.name, arg)).join("")}
    </table>
  </div>
  `;

  return { list, table };
}

export function methodsToHtml(methods) {
  if (!methods || Object.keys(methods).length === 0) return "";

  return Object.keys(methods)
    .map((key) => {
      const method = methods[key];
      const args = argumentsToHtml(method.arguments);
      return `
      <div class="doc-column">
        <div class="doc-row">
          <div class="doc-row no-gap c-method">.${key}(${args.list})${method.optional ? "?" : ""}:</div>
          ${typeToHtml(method.returns)}
          ${keywordsToHtml(method.keyword)}
        </div>
        <div class="doc-column tab">
          ${descriptionToHtml(method.description)}
          ${args.table}
        </div>
      </div>
      `;
    })
    .join("");
}

export function constructorToHtml(name, constructor) {
  if (!constructor || Object.keys(constructor).length === 0) return "";

  const args = argumentsToHtml(constructor.arguments);
  return `
  <div class="doc-column">
    <div class="doc-row">
      <div class="doc-row no-gap c-constructor"><div class="c-keyword">new&nbsp;</div>${name}(${args.list}):</div>
      ${typeToHtml(constructor.returns || name)}
      ${keywordsToHtml(constructor.keyword)}
    </div>
    <div class="doc-column tab">
    ${descriptionToHtml(constructor.description)}
    ${args.table}
    </div>
  </div>
  `;
}

export function extendsToHtml(data) {
  if (!data) return "";
  return `<div class="c-keyword">extends <span class="c-type">${textToHtml(data)}</span></div>`;
}

export function codeToHtml(code, lang = "javascript") {
  return `<pre><code class="language-${lang}">${code}</code></pre>`;
}

export function infoToHtml(info) {
  const genInfo = (info) => {
    if (typeof info === "string" || Array.isArray(info)) {
      return `<div class="c-info">${textToHtml(info)}</div>`;
    } else if (typeof info === "object") {
      if (info.type === "code") {
        return `<div class="info-code">${codeToHtml(textToValidHtml(info.data), info.lang)}</div>`;
      }

      return "";
    }
  };

  if (Array.isArray(info)) {
    if (info.length === 0) return "";
    return `<div class="info-list">${info.map(genInfo).join("")}</div>`;
  } else {
    if (!info) return "";
    return genInfo(info);
  }
}
