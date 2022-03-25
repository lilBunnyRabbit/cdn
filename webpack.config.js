const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/docs.js",
  output: {
    filename: "projectDocs.js",
    path: path.resolve(__dirname, "dist"),
  },
  optimization: {
    minimize: true,
  },
};
