import {
  descriptionToHtml,
  typeToHtml,
  propertiesToHtml,
  methodsToHtml,
  constructorToHtml,
  extendsToHtml,
  codeToHtml,
  infoToHtml,
} from "./docsHtml.js";
import { Element } from "./docsElements.js";
import { executeTest, formatCode } from "./docsUtils.js";
import { addCustomStyle } from "./docsCss.js";

class ProjectDocs {
  #elements = {
    info: Element.Container("info", Element.Section("Information"), true),
    docs: Element.Container("docs", Element.Section("Docs"), true),
    tests: Element.Container("tests", Element.Section("Tests", "tests-info"), true),
  };

  #docs = {
    class: [],
    object: [],
    type: [],
    test: [],
  };

  #tests = [];

  #rendered = {
    docs: false,
    tests: false,
    description: false,
  };

  define = {
    class: (name) => ({ name, id: `class-${name.toLowerCase()}` }),
    object: (name) => ({ name, id: `object-${name.toLowerCase()}` }),
    type: (name) => ({ name, id: `type-${name.toLowerCase()}` }),
  };

  constructor() {
    addCustomStyle();

    const root = document.createElement("div");
    root.className = "root";

    root.appendChild(Element.Title(document.title));

    root.appendChild(this.#elements.info);
    root.appendChild(this.#elements.docs);
    root.appendChild(this.#elements.tests);

    document.body.appendChild(root);
  }

  async genInfo(callback) {
    if (this.#rendered.description) {
      throw new Error("Description already rendered.");
    } else {
      this.#rendered.description = true;
    }

    await Promise.resolve(
      callback((data) => {
        const element = document.createElement("div");
        element.innerHTML = infoToHtml(data);
        this.#elements.info.appendChild(element);
      })
    );

    this.#elements.info.classList.remove("hidden");
    this.updateCodeHighlights();
  }

  async genDocs(callback) {
    if (this.#rendered.docs) {
      throw new Error("Docs already rendered.");
    } else {
      this.#rendered.docs = true;
    }

    await Promise.resolve(
      callback({
        define: this.define,
        class: this.resolveDocsClass.bind(this),
        object: this.resolveDocsObject.bind(this),
        type: this.resolveDocsType.bind(this),
      })
    );

    [
      { key: "class", title: "Classes" },
      { key: "object", title: "Objects" },
      { key: "type", title: "Types" },
    ].forEach(({ key, title }) => {
      if (this.#docs[key].length > 0) {
        const docsClassElement = Element.Container(`docs-${key}`, Element.SubSection(title));
        this.#docs[key]
          .sort((a, b) => a.name.localeCompare(b.name))
          .forEach(({ element }) => docsClassElement.appendChild(element));
        this.#elements.docs.appendChild(docsClassElement);
      }
    });

    this.#elements.docs.classList.remove("hidden");
  }

  resolveDocsClass(name, config = {}) {
    let def = name;
    if (typeof name === "string") def = this.define.class(name);
    else name = def.name;

    const element = Element.DocElement(name, {
      type: "class",
      id: def.id,
      keyword: config.global ? "global" : "",
      isHidden: !config.global,
      children:
        extendsToHtml(config.extends) +
        descriptionToHtml(config.description) +
        constructorToHtml(name, config.new) +
        propertiesToHtml(config.properties) +
        methodsToHtml(config.methods),
    });

    this.#docs.class.push({ name, element });
    return def;
  }

  resolveDocsObject(name, config = {}) {
    let def = name;
    if (typeof name === "string") def = this.define.object(name);
    else name = def.name;

    const element = Element.DocElement(name, {
      type: "object",
      id: def.id,
      keyword: config.global ? "global" : "",
      isHidden: !config.global,
      children:
        descriptionToHtml(config.description) + propertiesToHtml(config.properties) + methodsToHtml(config.methods),
    });

    this.#docs.object.push({ name, element });
    return def;
  }

  resolveDocsType(name, config = {}) {
    let def = name;
    if (typeof name === "string") def = this.define.type(name);
    else name = def.name;

    const element = Element.DocElement(name, {
      type: "type",
      id: def.id,
      keyword: config.global ? "global" : "",
      isHidden: !config.global,
      children: descriptionToHtml(config.description) + typeToHtml(config.type),
    });

    this.#docs.type.push({ name, element });
    return def;
  }

  async genTests(callback) {
    if (this.#rendered.tests) {
      throw new Error("Tests already rendered.");
    } else {
      this.#rendered.tests = true;
    }

    await Promise.resolve(callback((name, cb) => this.#tests.push({ name, callback: cb })));

    const testsInfo = document.getElementById("tests-info");

    const counter = {
      failed: 0,
      passed: 0,
    };

    const testElements = await Promise.all(
      this.#tests.map(async ({ name, callback: cb }, i) => {
        return new Promise(async (resolve) => {
          const testFailed = await executeTest(name, cb);

          if (testFailed) counter.failed++;
          else counter.passed++;

          const element = Element.DocElement(`${i + 1}. ${name}`, {
            type: testFailed ? "error" : "test",
            displayType: "test",
            isHidden: true,
            children: `
            ${testFailed ? `<div>${testFailed}</div>` : ""}
            <div class="test-code">${codeToHtml(formatCode(cb.toString()))}</div>
            `,
          });

          resolve(element);
        });
      })
    );

    testsInfo.innerText = `Passed: ${counter.passed} - Failed: ${counter.failed}`;
    testElements.forEach((element) => this.#elements.tests.appendChild(element));

    this.#elements.tests.classList.remove("hidden");
    this.updateCodeHighlights();
  }

  updateCodeHighlights() {
    if (window.hljs) {
      hljs.highlightAll();
    }
  }
}

window.ProjectDocs = new ProjectDocs();
