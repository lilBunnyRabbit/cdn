import { Element } from "./docsElements.js";
import { injectCss } from "./docsCss.js";
import {
  codeToHtml,
  constructorToHtml,
  descriptionToHtml,
  extendsToHtml,
  methodsToHtml,
  propertiesToHtml,
  textToValidHtml,
  typeToHtml,
} from "./docsHtml.js";
import { executeTest, sortedObjectMap, formatCode } from "./docUtils.js";

class ProjectDocs {
  #root = null;

  #tests = [];

  constructor() {
    injectCss();

    this.#root = document.createElement("div");
    this.#root.className = "root";

    document.body.appendChild(this.#root);
  }

  async injectLibs() {
    const libs = [
      "//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.0/highlight.min.js",
      {
        src: "https://www.googletagmanager.com/gtag/js?id=G-XPJ8VF9PGN",
        async: true,
        callback: () => {
          window.dataLayer = window.dataLayer || [];
          function gtag() {
            dataLayer.push(arguments);
          }
          gtag("js", new Date());
          gtag("config", "G-XPJ8VF9PGN");
        },
      },
    ];

    const loadScript = async (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");

        script.onload = () => resolve();
        script.onerror = (error) => reject(error);

        if (typeof src === "object") {
          const { callback, ...props } = src;
          Object.assign(script, props || {});
          script.onload = () => {
            callback();
            resolve();
          };
        } else {
          script.src = src;
        }

        document.head.appendChild(script);
      });
    };

    return Promise.all(libs.map(loadScript));
  }

  set info(info) {
    const infoSection = Element.Section("Information");
    this.#root.appendChild(infoSection);

    const parseInfo = ({ type, text, ...data }) => {
      switch (type) {
        case "code":
          return `<div class="info-code">${codeToHtml(text, data.language)}</div>`;
        default:
          return "";
      }
    };

    info.forEach((data) => {
      const element = document.createElement("div");
      switch (typeof data) {
        case "string":
          element.innerHTML = `<div class="c-description">${textToValidHtml(data)}</div>`;
          break;
        case "object":
          element.innerHTML = parseInfo(data);
          break;
        default:
          break;
      }

      infoSection.appendChild(element);
    });
  }

  set title(title) {
    let github, home;
    if (typeof title === "object") {
      if (title.links) {
        github = title.links.github;
        home = title.links.home;
      }
      title = title.title;
    }

    document.body.prepend(Element.Title(title, { github, home }));
  }

  set docs(data) {
    const apiSection = Element.Section("Api");
    this.#root.appendChild(apiSection);

    if (data.class) {
      const classSection = Element.SubSection("Classes", "class");
      apiSection.appendChild(classSection);
      sortedObjectMap(data.class, (key, value) => classSection.appendChild(this.parseDocClass(key, value)));
    }

    if (data.object) {
      const objectSection = Element.SubSection("Objects", "object");
      apiSection.appendChild(objectSection);
      sortedObjectMap(data.object, (key, value) => objectSection.appendChild(this.parseDocObject(key, value)));
    }

    if (data.type) {
      const typeSection = Element.SubSection("Types", "type");
      apiSection.appendChild(typeSection);
      sortedObjectMap(data.type, (key, value) => typeSection.appendChild(this.parseDocType(key, value)));
    }
  }

  parseDocType(name, data) {
    const element = Element.DocsElement(name, {
      type: "type",
      isHidden: !data.isOpen,
      keywords: data.keywords,
      children: descriptionToHtml(data.description) + typeToHtml(data.type),
    });

    return element;
  }

  parseDocObject(name, data) {
    const element = Element.DocsElement(name, {
      type: "object",
      isHidden: !data.isOpen,
      keywords: data.keywords,
      children: descriptionToHtml(data.description) + propertiesToHtml(data.properties) + methodsToHtml(data.methods),
    });

    return element;
  }

  parseDocClass(name, data) {
    const element = Element.DocsElement(name, {
      type: "class",
      isHidden: !data.isOpen,
      keywords: data.keywords,
      children:
        extendsToHtml(data.extends) +
        descriptionToHtml(data.description) +
        constructorToHtml(name, data.constructor) +
        propertiesToHtml(data.properties) +
        methodsToHtml(data.methods),
    });

    return element;
  }

  async genTests(callback) {
    const testsSection = Element.Section("Tests", "test", "tests-info");
    this.#root.appendChild(testsSection);

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

          const element = Element.DocsElement(`${i + 1}. ${name}`, {
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
    testElements.forEach((element) => testsSection.appendChild(element));
  }
}

window.ProjectDocs = new ProjectDocs();
