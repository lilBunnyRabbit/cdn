/**
 * @author lilBunnyRabbit
 */

{
  /**
   * Version prefix
   * @type {string}
   */
  const prefix = document.currentScript.getAttribute("prefix") || "";

  /**
   * Version value
   * @type {string}
   */
  const version = document.currentScript.getAttribute("version") || "";

  /**
   * Version position
   * @type {"top-left" | "top-right" | "bottom-right" | "bottom-left"}
   */
  const placementType = document.currentScript.getAttribute("placement");

  // Gets CSS for slected placement
  let placement = (() => {
    const padding = "8px";
    switch (placementType) {
      case "top-left": {
        return `
          top: ${padding};
          left: ${padding};
        `;
      }
      case "bottom-left": {
        return `
          bottom: ${padding};
          left: ${padding};
        `;
      }
      case "bottom-right": {
        return `
          bottom: ${padding};
          right: ${padding};
        `;
      }
      case "top-right":
      default: {
        return `
          top: ${padding};
          right: ${padding};
        `;
      }
    }
  })();

  // Creates version element
  const element = document.createElement("div");
  element.innerText = prefix + version;
  element.style = `
    position: absolute;
    ${placement}
    color: white;
    mix-blend-mode: difference;
    opacity: 0.25;
  `;

  // Appends version element on load
  window.addEventListener("load", () => document.body.prepend(element));

  // Displays version in terminal
  console.log(
    `%c${document.title}%c ${prefix + version}`,
    "font-weight: bold; font-size: 22px;",
    "font-weight: normal; font-size: 16px;"
  );
}
