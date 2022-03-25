/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/core/StateElement.js
/**
 * Class representing state for unique key.
 * The purpose of this class is to control a specific State element.
 * @class
 */
class StateElement {
  /**
   * StateElement configuration.
   * @typedef {Object} StateElementConfig
   * @property {boolean} [useLocalStorage] - Enable/disable using local storage for storing and retrieving data.
   * @property {boolean} [useEvents] - Enable/disable "change" event for the element.
   * @property {function(StorageValue): StorageValue} [onBeforeSet] - Callback before the value is set.
   */

  /**
   * StateElement options for creation.
   * @typedef {Object} StateElementOptions
   * @property {StorageValue} defaultValue - Default value used when reseting and when no value is stored in local storage.
   * @property {StateElementConfig} [config] - StateElement configuration.
   */

  /**
   * State that the StateElement belongs to.
   * @private
   * @type {State}
   */
  #state = null;

  /**
   * StateElement's unique key.
   * @private
   * @type {string}
   */
  #key = "";

  /**
   * StateElement's default value.
   * @private
   * @type {StorageValue}
   */
  #defaultValue = undefined;

  /**
   * StateElement's default value type.
   * @private
   * @type {StorageValueType}
   */
  #type = "";

  /**
   * StateElement's configuration.
   * @private
   * @type {Object}
   */
  #config = {
    useLocalStorage: false,
    useEvents: false,
    onBeforeSet: null,
  };

  /**
   * Create new StateElement.
   * @constructor
   * @param {State} state - State that the StateElement belongs to.
   * @param {string} key - Selected key.
   * @param {StateElementOptions} opts - StateElement options.
   */
  constructor(state, key, opts) {
    this.#state = state;
    this.#key = key;
    this.#defaultValue = opts.defaultValue;
    this.#type = typeof opts.defaultValue;

    if (opts.config) {
      this.#config = { ...this.#config, ...opts.config };
    }

    if (this.#state.config.useLogs) {
      console.log("StateElement", {
        key: this.#key,
        defaultValue: this.#defaultValue,
        type: this.#type,
        config: this.#config,
      });
    }
  }

  /**
   * @returns {State}
   */
  get state() {
    return this.#state;
  }

  /**
   * @returns {string}
   */
  get key() {
    return this.#key;
  }

  /**
   * @returns {StorageValue}
   */
  get defaultValue() {
    return this.#defaultValue;
  }

  /**
   * @returns {StorageValueType}
   */
  get type() {
    return this.#type;
  }

  /**
   * @returns {StateElementConfig}
   */
  get config() {
    return this.#config;
  }

  /**
   * Get value for defined key from state.
   * @returns {StorageValue}
   */
  get() {
    return this.#state.get(this.#key);
  }

  /**
   * Set value for defined key to state.
   * @param {StorageValue} value - Value to be stored.
   */
  set(value) {
    if (typeof value !== this.#type) {
      throw new Error(`Expected value type "${this.#type}" but got "${typeof value}"`);
    }

    if (this.#config.onBeforeSet) {
      value = this.#config.onBeforeSet(value);
    }

    this.#state.set(this.#key, value, this.#config);
  }

  /**
   * Reset value to default value.
   */
  reset() {
    this.set(this.#defaultValue);
  }

  /**
   * Assign event listener for this StateElement.
   * @param {function(StorageValue): StateElement} listener - Event callback.
   * @returns {StateElement}
   */
  addListener(listener) {
    this.#state.addEventListener(this.#key, ({ detail }) => listener(detail));
    return this;
  }
}

;// CONCATENATED MODULE: ./src/core/State.js


/**
 * Class representing main control unit for state management.
 * @extends EventTarget
 */
class State extends EventTarget {
  /**
   * State configuration.
   * @typedef {Object} StateConfig
   * @property {boolean} [useChangeEvent] - Dispatch "change" event when any element is updated.
   * @property {boolean} [useLogs] - Enable/disable logging.
   */

  /**
   * Type of stored values.
   * @typedef {(bigint | boolean | symbol | number | object | string)} StorageValue
   */

  /**
   * String type of StorageValue.
   * @typedef {("bigint" | "boolean" | "symbol" | "number" | "object" | "string")} StorageValueType
   */

  /**
   * State storage.
   * @private
   * @type {Map<string, StorageValue>}
   */
  #storage = new Map();

  /**
   * Initialized StateElement's.
   * @private
   * @type {Map<string, StateElement>}
   */
  #elements = new Map();

  /**
   * State configuration.
   * @private
   * @type {StateConfig}
   */
  #config = {
    useChangeEvent: false,
    useLogs: false,
  };

  /**
   * Create new State.
   * @constructor
   * @param {StateConfig} [config] - State configuration.
   * @param {Object.<string, StateElementOptions>} [initElements] - "List" of StateElement's to initialize.
   */
  constructor(config, initElements) {
    super();

    if (config) {
      this.#config = { ...this.#config, ...config };
    }

    if (this.#config.useLogs) {
      console.log("State", {
        config: this.#config,
      });
    }

    if (initElements) {
      Object.keys(initElements).forEach((key) => {
        const initElement = initElements[key];
        this.init(key, initElement);
      });
    }
  }

  /**
   * @returns {Map<string, StorageValue>}
   */
  get storage() {
    return this.#storage;
  }

  /**
   * @returns {Map<string, StateElement>}
   */
  get elements() {
    return this.#elements;
  }

  /**
   * @returns {StateConfig}
   */
  get config() {
    return this.#config;
  }

  /**
   * Set value for selected key.
   * @param {string} key - Selected key.
   * @param {StorageValue} value - Value to be stored.
   * @param {StateElementConfig} config - StateElement configuration.
   */
  set(key, value, config) {
    this.#storage.set(key, value);

    if (config.useLocalStorage) {
      localStorage.setItem(key, this.#valueToString(value));
    }

    if (config.useEvents) {
      this.dispatchEvent(new CustomEvent(key, { detail: value }));

      if (this.#config.useChangeEvent) {
        this.dispatchEvent(new CustomEvent("change", { detail: { key, value } }));
      }
    }
  }

  /**
   * Get stored value for selected key.
   * @param {string} key - Selected key.
   * @returns {StorageValue}
   */
  get(key) {
    return this.#storage.get(key);
  }

  /**
   * Convert value to string.
   * @private
   * @param {StorageValue} value
   * @returns {string}
   * @throws {Error}
   */
  #valueToString(value) {
    switch (typeof value) {
      case "bigint":
      case "boolean":
      case "symbol":
      case "number":
        return value.toString();
      case "object":
        return JSON.stringify(value);
      case "string":
        return value;
      case "undefined":
      case "function":
      default:
        throw new Error(`Value type "${typeof value}" is not supported`);
    }
  }

  /**
   * Convert string to value.
   * @private
   * @param {string} value
   * @param {StorageValueType} type - value type.
   * @returns {StorageValue}
   * @throws {Error}
   */
  #valueFromString(value, type) {
    switch (type) {
      case "bigint":
        return BigInt(value);
      case "boolean":
        return Boolean(value);
      case "symbol":
        return Symbol(value);
      case "number":
        return Number.parseFloat(value);
      case "object":
        return JSON.parse(value);
      case "string":
        return value;
      case "undefined":
      case "function":
      default:
        throw new Error(`Value type "${typeof value}" is not supported`);
    }
  }

  /**
   * Initialize new StateElement.
   * @param {string} key - Unique key.
   * @param {StateElementOptions} opts - StateElement options.
   * @returns {StateElement}
   * @throws {Error}
   */
  init(key, opts) {
    if (this.#elements.get(key)) {
      throw new Error("Element already initialized");
    }

    const type = typeof opts.defaultValue;
    if (type === "function" || type === "undefined") {
      throw new Error(`Value type "${type}" is not supported`);
    }

    let value = opts.defaultValue;
    if (opts.config?.useLocalStorage) {
      const localValue = localStorage.getItem(key);
      if (localValue !== null) {
        value = this.#valueFromString(localValue, type);
      }
    }

    this.set(key, value, { ...opts.config, useEvents: false });

    const element = new StateElement(this, key, opts);
    this.#elements.set(key, element);

    return element;
  }

  /**
   * Attach to initialized StateElement.
   * @param {string} key - Selected key.
   * @returns {StateElement}
   * @throws {Error}
   */
  attach(key) {
    const element = this.#elements.get(key);
    if (!element) {
      throw new Error("Element not initialized");
    }

    return element;
  }
}

;// CONCATENATED MODULE: ./src/core/StateComponent.js
/**
 * Class representing StateComponent for selected StateElement's.
 * The purpose of this class is to be extended and override its "$onStateChange" method to listen to events.
 * @class
 */
class StateComponent {
  /**
   * State that the component belongs to.
   * @private
   * @type {State}
   */
  #state = null;

  /**
   * Object of attached StateElement's.
   * @type {Object.<string, StateElement>}
   */
  states = {};

  /**
   * Create new StateComponent.
   * @constructor
   * @param {State} state - State that the StateComponent belongs to.
   * @param {string[] | boolean} [elements]
   *   - If list of StateElement keys: those StateElement's will be attached.
   *     If "true": all initialized StateElement's will be attached.
   *     If "falsy": no StateElement will be attached but if a listenere is present it will listen to all initialized StateElement's.
   */
  constructor(state, elements) {
    this.#state = state;

    const prototype = Object.getPrototypeOf(this);
    const overrides = {
      $onStateChange: prototype.hasOwnProperty("$onStateChange"),
    };

    let events = [];
    if (elements === true) {
      for (const element of this.#state.elements.values()) {
        const key = element.key;
        events.push(key);
        this.states[key] = element;
        if (overrides.$onStateChange) {
          this.states[key].addListener((value) => this.$onStateChange(key, value));
        }
      }
    } else if (elements) {
      events = elements;
      elements.forEach((key) => {
        this.states[key] = this.#state.attach(key);
        if (overrides.$onStateChange) {
          this.states[key].addListener((value) => this.$onStateChange(key, value));
        }
      });
    } else if (overrides.$onStateChange) {
      events.push("change");
      this.#state.addEventListener("change", ({ detail }) => this.$onStateChange(detail.key, detail.value));
    }

    Object.freeze(this.states);

    if (this.#state.config.useLogs) {
      console.log("StateComponent", {
        class: this.constructor.name,
        stateElements: Object.keys(this.states),
        overrides,
        events,
      });
    }
  }

  /**
   * Triggers when any of the attached StateElement's is changed.
   * If no StateElement is attached it will emit when any initialized StateElement is changed.
   * @param {string} key
   * @param {StorageValue} value
   * @abstract
   */
  $onStateChange(key, value) {
    console.log(this.constructor.name, "$onStateChange", { key, value });
  }

  /**
   * Reset all attached StateElement's to their default value.
   */
  $resetAll() {
    Object.keys(this.states).forEach((key) => this.states[key].reset());
  }
}

;// CONCATENATED MODULE: ./src/lilState.js
/**
 * @author lilBunnyRabbit
 */





/**
 * @typedef {Object} lilState
 * @property {State} State
 * @property {StateElement} StateElement
 * @property {StateComponent} StateComponent
 */

/**
 * Assigns objects to window.
 * @type {lilState}
 */
window.lilState = {
  State: State,
  StateElement: StateElement,
  StateComponent: StateComponent,
};

/******/ })()
;