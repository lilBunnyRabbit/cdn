# State `alpha-0.0.0`

## Install
```html
<script src="https://lilbunnyrabbit.github.io/cdn/libs/state/alpha-0.0.0/state.js">
```
```html
<script src="https://lilbunnyrabbit.github.io/cdn/libs/state/alpha-0.0.0/state.min.js">
```

## Example
```js
// Create new State
const state = new State(
  // State configuration
  { useEmitOnInit: false, useChangeEvent: true, useLogs: true },
  // StateElement's
  {
    "example": {
      defaultValue: 123,
      config: {
        useLocalStorage: true,
        useEvents: true,
        onBeforeSet: (value) => value * 2
      }
    }
  }
);

// Attach to the "example" StateElement
const exampleElement = state.attach("example").addListener((value) => console.log("Example value updated:", value));
exampleElement.set(456);

// Initialize new StateElement
const usersElement = state.init("users", [], { useEvents: true });

// Create StateComponent with "example" StateElement
new class extends StateComponent {
  constructor() {
    super(state, ["example"]);

    console.log(Object.keys(this.states)); // => ["example"]
  }

  // Emits on "example"
  $onStateChange(key, value) {
    console.log("$onStateChange", { key, value });

    if (value > 1000) {
      this.$resetAll();
    }
  }
}

// Create StateComponent with all StateElement's
new class extends StateComponent {
  constructor() {
    super(state, true);

    console.log(Object.keys(this.states)); // => ["example", "users"]
  }

  // Emits on "example" and "users"
  $onStateChange(key, value) {
    switch(key) {
      case "users":
        console.log("Users updated", value);
        this.states.example.set(value.length);
        break;
      case "example":
        console.log("Example updated", value);
        console.log("Current users", this.states.users.get());
        break;
      default:
        break;
    }
  }
}

// Create StateComponent without StateElement's but listens to all StateElement's
new class extends StateComponent {
  constructor() {
    super(state);

    console.log(Object.keys(this.states)); // => []
  }

  // Emits on "example" and "users"
  $onStateChange(key, value) {
    switch(key) {
      case "users":
        console.log("Users updated", value);
        break;
      case "example":
        console.log("Example updated", value);
        break;
      default:
        break;
    }
  }
}
```