export function isTypeLink(typeLink) {
  if (typeof typeLink !== "object") return false;
  if (!typeLink.hasOwnProperty("id") || typeof typeLink.id !== "string") return false;
  if (!typeLink.hasOwnProperty("name") || typeof typeLink.name !== "string") return false;
  return true;
}

export class TestError extends Error {
  constructor(name, message) {
    super(message);
    this.name = `❌ TEST "${name}"`;
    this.message = message;
  }
}

export function formatCode(code) {
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
}

export const generateAssert = (name) => ({
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

export async function executeTest(name, callback) {
  try {
    await Promise.resolve(callback(generateAssert(name)));
    return false;
  } catch (error) {
    console.log(error);
    return error.message || "Unknown error";
  }
}
