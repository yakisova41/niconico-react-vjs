import { build } from "esbuild";
import { join } from "path";
build({
  entryPoints: [join("niconico-react-vjs", "index.tsx")],
  bundle: true,
  outdir: "dist",
  platform: "browser",
});
