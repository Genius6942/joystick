import styles from "rollup-plugin-styles";

export default [
  {
    input: "src/index.js",
    output: [
      {
        format: "esm",
        file: "dist/joy.module.js",
      },
    ],
    plugins: [styles()],
  },

  {
    input: "src/index.js",
    output: [
      {
        format: "esm",
        file: "dist/joy.module.js",
      },
    ],
    plugins: [styles()],
  },
  {
    input: "src/index.js",
    output: [
      {
        format: "umd",
        name: "joy",
        file: "dist/joy.js",
        indent: "\t",
      },
      {
        format: "cjs",
        name: "joy",
        file: "dist/joy.cjs",
        indent: "\t",
      },
    ],
    plugins: [styles()],
  },
];
