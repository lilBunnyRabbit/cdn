const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/docs.js",
  output: {
    filename: "docs.js",
    path: path.resolve(__dirname, "dist"),
  },
  optimization: {
    minimize: false,
  },
};
