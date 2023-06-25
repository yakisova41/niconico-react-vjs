import { build } from "esbuild";
import { join } from "path";
import { dtsPlugin } from "esbuild-plugin-d.ts";
build({
  entryPoints: [join("niconico-react-vjs", "index.tsx")],
  bundle: true,
  outdir: "dist",
  platform: "browser",
  plugins: [dtsPlugin()],
});
