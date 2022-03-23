// Element builder
const Element = {
  Title: (title) => {
    const element = document.createElement("div");
    element.className = "title";
    element.innerText = title;
    return element;
  },
  Section: (name) => {
    const element = document.createElement("div");
    element.className = "section";
    element.innerText = name;
    return element;
  },
  SubSection: (name) => {
    const element = document.createElement("div");
    element.className = "sub-section";
    element.innerText = name;
    return element;
  },
  Container: (type, tab) => {
    const element = document.createElement("div");
    element.className = `container ${type || ""} ${tab ? "tab" : ""}`;
    return element;
  },
  DocTitle: (name, type, keywords) => {
    const title = document.createElement("div");
    title.className = "doc-title";
    title.innerHTML = `
    <div class="doc-row between">
      <div class="doc-row">${name}${keywordsToHtml(keywords)}</div>
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
};

const elements = {
  docs: {
    class: [],
    object: [],
    type: [],
  },
};

const Icon = {
  Chevron: `
  <svg class="icon-chevron" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>`,
  Code: `
  <svg class="icon-code" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>`,
};

/* ############################################ DOCS ############################################ */
const textToValidHtml = (t) => {
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
};

const isTypeLink = (typeLink) => {
  if (typeof typeLink !== "object") return false;
  if (!typeLink.hasOwnProperty("id") || typeof typeLink.id !== "string") return false;
  if (!typeLink.hasOwnProperty("name") || typeof typeLink.name !== "string") return false;
  return true;
};

const typeLinkToHtml = (typeLink) => {
  if (!isTypeLink(typeLink)) return "";
  return `<a class="doc-type-link" href="#${typeLink.id}">${textToValidHtml(typeLink.name)}</a>`;
};

const textToHtml = (text) => {
  if (Array.isArray(text)) {
    return text.map(textToHtml).join("");
  } else {
    if (isTypeLink(text)) return typeLinkToHtml(text);
    return textToValidHtml(text);
  }
};

const descriptionToHtml = (description) => {
  const genDescription = (desc) => `<div class="c-description">&#8226; ${textToHtml(desc)}</div>`;

  if (Array.isArray(description)) {
    if (description.length === 0) return "";
    return `<div class="doc-list">${description.map(genDescription).join("")}</div>`;
  } else {
    if (!description) return "";
    return genDescription(description);
  }
};

const typeToHtml = (type) => {
  if (!type) return "";
  return `<span class="c-type">${textToHtml(type)}</span>`;
};

const keywordsToHtml = (keywords) => {
  const genKeyword = (keyword) => `<div class="doc-keyword">${textToHtml(keyword)}</div>`;

  if (Array.isArray(keywords)) {
    if (keywords.length === 0) return "";
    return keywords.map(genKeyword).join("");
  } else {
    if (!keywords) return "";
    return genKeyword(keywords);
  }
};

const propertiesToHtml = (properties) => {
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
};

const argumentsToHtml = (args) => {
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
};

const methodsToHtml = (methods) => {
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
};

const constructorToHtml = (name, constructor) => {
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
};

const extendsToHtml = (data) => {
  if (!data) return "";
  return `<div class="c-keyword">extends <span class="c-type">${textToHtml(data)}</span></div>`;
};

var docs = {
  class: docsClass,
  object: docsObject,
  type: docsType,
  define: {
    class: (name) => ({ name, id: `class-${name.toLowerCase()}` }),
    object: (name) => ({ name, id: `object-${name.toLowerCase()}` }),
    type: (name) => ({ name, id: `type-${name.toLowerCase()}` }),
    test: (name) => ({ name, id: `test-${name.toLowerCase()}` }),
  },
};

function docsClass(name, config = {}) {
  let def = name;
  if (typeof name === "string") {
    def = docs.define.class(name);
  } else {
    name = def.name;
  }

  const element = document.createElement("div");
  element.className = "doc-container class";
  element.id = def.id;

  const title = Element.DocTitle(name, "class", config.global ? "global" : "");

  const body = document.createElement("div");
  body.className = "doc-body";
  body.innerHTML =
    extendsToHtml(config.extends) +
    descriptionToHtml(config.description) +
    constructorToHtml(name, config.new) +
    propertiesToHtml(config.properties) +
    methodsToHtml(config.methods);

  element.appendChild(title);
  element.appendChild(body);

  if (!config.global) element.classList.add("hidden");
  title.onclick = () => element.classList.toggle("hidden");

  elements.docs.class.push({ name, element });
  return def;
}

function docsObject(name, config = {}) {
  let def = name;
  if (typeof name === "string") {
    def = docs.define.object(name);
  } else {
    name = def.name;
  }

  const element = document.createElement("div");
  element.className = "doc-container object";
  element.id = def.id;

  const title = Element.DocTitle(name, "object", config.global ? "global" : "");

  const body = document.createElement("div");
  body.className = "doc-body";
  body.innerHTML =
    descriptionToHtml(config.description) + propertiesToHtml(config.properties) + methodsToHtml(config.methods);

  element.appendChild(title);
  element.appendChild(body);

  if (!config.global) element.classList.add("hidden");
  title.onclick = () => element.classList.toggle("hidden");

  elements.docs.object.push({ name, element });
  return def;
}

function docsType(name, config = {}) {
  let def = name;
  if (typeof name === "string") {
    def = docs.define.type(name);
  } else {
    name = def.name;
  }

  const element = document.createElement("div");
  element.className = "doc-container type";
  element.id = def.id;

  const title = Element.DocTitle(name, "type", config.global ? "global" : "");

  const body = document.createElement("div");
  body.className = "doc-body";
  body.innerHTML = descriptionToHtml(config.description) + typeToHtml(config.type);

  element.appendChild(title);
  element.appendChild(body);

  if (!config.global) element.classList.add("hidden");
  title.onclick = () => element.classList.toggle("hidden");

  elements.docs.type.push({ name, element });
  return def;
}

/* ############################################ TESTS ############################################ */
class TestError extends Error {
  constructor(name, message) {
    super(message);
    this.name = `❌ TEST "${name}"`;
    this.message = message;
  }
}

const formatCode = (code) => {
  const functionName = "example";
  const arr = code.split("\n");

  const spaces = (() => {
    const lastElement = arr[arr.length - 1];
    for (let i = 0; i < lastElement.length; i++) {
      if (lastElement[i] !== " ") return i;
    }
    return 0;
  })();

  return arr
    .map((element, i) => {
      if (i === 0) {
        if (element.includes("function")) {
          const regex = new RegExp("function\\s*\\(");
          if (regex.test(element)) return element.replace(regex, `function ${functionName}(`);
          return element;
        }
        return `const ${functionName} = ` + element;
      } else if (element.length < spaces) {
        return element;
      }
      return element.substring(spaces, element.length);
    })
    .join("\n");
};

const generateAssert = (name) => ({
  defined: function (actual, variableName) {
    if (actual === undefined) {
      throw new TestError(name, `${variableName || "Value"} is not defined`);
    }
  },
  equal: function (actual, expected) {
    if (actual !== expected) {
      throw new TestError(name, `Expected "${expected}" but got "${actual}"`);
    }
  },
  truthy: function (actual) {
    if (!!actual !== true) {
      throw new TestError(name, `Expected "${actual}" to be truthy`);
    }
  },
  falsy: function (actual) {
    if (!actual !== false) {
      throw new TestError(name, `Expected "${actual}" to be falsy`);
    }
  },
  contains: function (actual, key) {
    if (Array.isArray(actual)) {
      if (!actual.includes(key)) {
        throw new TestError(name, `Expected array to contain "${key}"`);
      }
    } else {
      if (!actual.hasOwnProperty(key)) {
        throw new TestError(name, `Expected object to contain key "${key}"`);
      }
    }
  },
  timeout: function (message, callback, time = 500) {
    setTimeout(() => callback(new TestError(name, message)), time);
  },
});

const containerTests = Element.Container("tests");

async function test(name, callback) {
  let def = name;
  if (typeof name === "string") {
    def = docs.define.test(name);
  } else {
    name = def.name;
  }

  const assert = generateAssert(name);

  let testFailed = false;
  try {
    await Promise.resolve(callback(assert));
    console.log(`✔️ TEST "${name}"`);
  } catch (error) {
    testFailed = error.message;
    console.log(error);
  }

  const element = document.createElement("div");
  element.className = `doc-container test ${testFailed ? "error" : ""}`;
  element.id = def.id;

  const title = Element.DocTitle(name, "test");

  const body = document.createElement("div");
  body.className = "doc-body";
  body.innerHTML = `
  ${testFailed ? `<div>${testFailed}</div>` : ""}
  <div class="test-code"><pre><code class="language-javascript">${formatCode(callback.toString())}</code></pre></div>
  `;

  element.appendChild(title);
  element.appendChild(body);

  element.classList.add("hidden");
  title.onclick = () => element.classList.toggle("hidden");

  containerTests.appendChild(element);
  return def;
}

window.addEventListener("load", () => {
  document.body.appendChild(Element.Title(document.title));
  document.body.appendChild(Element.Section("Install"));
  const inst = document.createElement("div");
  inst.innerHTML = `
  <pre><code class="language-html">${textToHtml(
    '<script src="https://lilbunnyrabbit.github.io/cdn/libs/state/0.0.0-alpha/state.js">'
  )}</code></pre>
  `;

  document.body.appendChild(inst);

  document.body.appendChild(Element.Section("Docs"));
  if (elements.docs.class.length > 0) {
    document.body.appendChild(Element.SubSection("Classes"));
    const docsClassElement = Element.Container("docs-class");
    elements.docs.class
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(({ element }) => docsClassElement.appendChild(element));
    document.body.appendChild(docsClassElement);
  }
  if (elements.docs.object.length > 0) {
    document.body.appendChild(Element.SubSection("Objects"));
    const docsObjectElement = Element.Container("docs-object");
    elements.docs.object
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(({ element }) => docsObjectElement.appendChild(element));
    document.body.appendChild(docsObjectElement);
  }
  if (elements.docs.type.length > 0) {
    document.body.appendChild(Element.SubSection("Types"));
    const docsTypeElement = Element.Container("docs-type");
    elements.docs.type
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(({ element }) => docsTypeElement.appendChild(element));
    document.body.appendChild(docsTypeElement);
  }

  document.body.appendChild(Element.Section("Tests"));
  document.body.appendChild(containerTests);

  if (window.hljs) {
    hljs.highlightAll();
  }
});
