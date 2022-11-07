//@ts-check

"use strict";

const path = require("path");

/**@type {import('webpack').Configuration}*/
const config = {
  target: "node",
  entry: "./src/extension.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "extension.js",
    libraryTarget: "commonjs2",
    devtoolModuleFilenameTemplate: "../[resource-path]",
  },
  node: {
    __dirname: false,
  },
  devtool: "source-map",
  externals: {
    vscode: "commonjs vscode",
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "@cmt": path.resolve(__dirname, "src"),
    },
    mainFields: ["main", "module"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              compilerOptions: {
                sourceMap: true,
              },
            },
          },
        ],
      },
      {
        test: /.node$/,
        loader: "node-loader",
      },
    ],
  },
  optimization: {
    minimize: false,
  },
  stats: {
    warnings: false,
  },
};

if (process.env.BUILD_VSCODE_NLS) {
  config.module.rules.unshift({
    loader: "vscode-nls-dev/lib/webpack-loader",
    options: {
      base: __dirname,
    },
  });
}

module.exports = config;
