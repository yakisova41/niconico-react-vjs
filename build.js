import { build } from "esbuild";
import { join } from "path";

build({
  bundle: true,
  entryPoints: [join("niconico-react-vjs", "index.tsx")],
  outfile: join("dist", "index.js"),
  platform: "node",
  external: ["esbuild"],
  logLevel: "info",
});

build({
  bundle: true,
  entryPoints: [join("niconico-react-vjs", "index.tsx")],
  outfile: join("dist", "index.min.js"),
  platform: "node",
  external: ["esbuild"],
  minify: true,
  logLevel: "info",
});
