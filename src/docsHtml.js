import { highlightCode } from "./docUtils.js";

export function textToValidHtml(text) {
  const linkRegex = new RegExp("<\\w*:\\w*>", "g");
  const links = text.match(linkRegex);

  const stringToValidHtml = (str) => {
    return str
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
  };

  if (links) {
    return text
      .split(linkRegex)
      .map((t, i) => {
        if (links[i]) {
          const [type, name] = links[i].substring(1, links[i].length - 1).split(":");
          return (
            stringToValidHtml(t) + `<a class="c-link" href="#${type.toLowerCase()}-${name.toLowerCase()}">${name}</a>`
          );
        }
        return stringToValidHtml(t);
      })
      .join("");
  }

  return stringToValidHtml(text);
}

export function descriptionToHtml(data) {
  const genDescription = (description) => {
    return `<div class="c-description">&#8226; ${textToValidHtml(description)}</div>`;
  };

  if (Array.isArray(data)) {
    if (data.length === 0) return "";
    return `<div class="docs-list">${data.map(genDescription).join("")}</div>`;
  } else {
    if (!data) return "";
    return genDescription(data);
  }
}

export function typeToHtml(data) {
  if (!data) return "";
  return `<span class="c-type">${textToValidHtml(data)}</span>`;
}

export function keywordsToHtml(keywords) {
  const genKeyword = (keyword) => `<div class="docs-keyword">${textToValidHtml(keyword)}</div>`;

  if (!keywords || keywords.length === 0) return "";
  return keywords.map(genKeyword).join("");
}

export function propertiesToHtml(properties) {
  if (!properties || Object.keys(properties).length === 0) return "";
  return Object.keys(properties)
    .map((key) => {
      const property = properties[key];
      return `
      <div class="docs-column">
        <div class="docs-row">
          <div class="c-variable">.${key}${property.optional ? "?" : ""}:</div>
          ${typeToHtml(property.type)}
          ${keywordsToHtml(property.keywords)}
        </div>
        <div class="docs-column tab">
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

  list = `<div class="docs-row no-gap c-argument">${args
    .map((arg) => textToValidHtml(arg.optional ? `[${arg.name}]` : arg.name))
    .join('<div class="c-method">,&nbsp;</div>')}</div>`;

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
  <div class="docs-table-container">
    <table class="docs-table">
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
      <div class="docs-column">
        <div class="docs-row">
          <div class="docs-row no-gap c-method">.${key}(${args.list})${method.optional ? "?" : ""}:</div>
          ${typeToHtml(method.returns)}
          ${keywordsToHtml(method.keywords)}
        </div>
        <div class="docs-column tab">
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
  <div class="docs-column">
    <div class="docs-row">
      <div class="docs-row no-gap c-constructor"><div class="c-keyword">new&nbsp;</div>${name}(${args.list}):</div>
      ${typeToHtml(constructor.returns || name)}
      ${keywordsToHtml(constructor.keyword)}
    </div>
    <div class="docs-column tab">
    ${descriptionToHtml(constructor.description)}
    ${args.table}
    </div>
  </div>
  `;
}

export function extendsToHtml(data) {
  if (!data) return "";
  return `<div class="c-keyword">extends <span class="c-type">${textToValidHtml(data)}</span></div>`;
}

export function codeToHtml(code, language) {
  return `<pre><code>${highlightCode(code, language)}</code></pre>`;
}
