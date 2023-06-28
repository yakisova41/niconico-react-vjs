import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import copy from "rollup-plugin-copy";

export default [
  {
    input: "niconico-react-vjs/index.tsx",
    output: [
      {
        file: "dist/index.js",
        format: "esm",
        sourcemap: false,
      },
    ],
    plugins: [
      commonjs({
        include: ["node_modules/**"],
      }),
      typescript({
        tsconfig: "./tsconfig.json",
        exclude: ["**/__tests__/**"],
      }),
      copy({
        targets: [{ src: "niconico-react-vjs/style.css", dest: "dist" }],
      }),
    ],
    external: ["react", "react-dom"],
  },
  {
    input: "niconico-react-vjs/index.tsx",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
  },
];
