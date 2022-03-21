const style = document.createElement("style");
style.innerHTML = `
html {
  font-family: Consolas;
  background: #18181b;
  color: white;
}

body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin: 32px;
  position: relative;
  box-sizing: border-box;
}

body > * {
  width: 100%;
  max-width: 1000px;
}

.title {
  font-size: 24px;
  text-align: center;
}

.section {
  font-size: 24px;
  font-weight: bold;
  margin-top: 16px;
  border-bottom: 1px solid white;
}

.tests-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  position: relative;
  box-sizing: border-box;
}

.test {
  border: 2px solid #98d713;
  background: rgba(152, 215, 19, 0.5);
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  user-select: none;
  box-sizing: border-box;
  width: 100%;
}

.test.error {
  border-color: #d71313;
  background: rgba(215, 19, 19, 0.5);
}

.test-code {
  display: none;
  background: #18181b;
  padding: 0px 16px;
  border: inherit;
  margin-top: 8px;
}

.test.open > .test-code {
  display: block;
}
`;
document.head.appendChild(style);

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
  TestsContainer: () => {
    const element = document.createElement("div");
    element.className = "tests-container";
    return element;
  },
  Test: (name, failed, code) => {
    const element = document.createElement("div");
    element.className = `test${failed ? " error" : ""}`;
    element.innerHTML = `<div><strong>${name}</strong></div>${
      failed ? `<div>${failed}</div>` : ""
    }<div class="test-code"><pre><code>${code}</code></pre></div>`;
    element.onclick = () => element.classList.toggle("open");
    return element;
  },
};

// Elements
const testsContainer = Element.TestsContainer();

// Tests
class TestError extends Error {
  constructor(name, message) {
    super(message);
    this.name = `❌ TEST "${name}"`;
    this.message = message;
  }
}

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

async function test(name, callback) {
  const assert = generateAssert(name);

  let testFailed = false;
  try {
    await Promise.resolve(callback(assert));
    console.log(`✔️ TEST "${name}"`);
  } catch (error) {
    testFailed = error.message;
    console.log(error);
  }

  testsContainer.appendChild(Element.Test(name, testFailed, callback.toString()));
}

window.addEventListener("load", () => {
  document.body.appendChild(Element.Title(document.title));
  document.body.appendChild(Element.Section("Docs"));
  document.body.appendChild(Element.Section("Tests"));
  document.body.appendChild(testsContainer);
});
