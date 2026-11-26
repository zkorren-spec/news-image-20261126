import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const src = join(dirname(fileURLToPath(import.meta.url)), "entry.png");
mkdirSync(outDir, { recursive: true });
if (!existsSync(src)) {
  throw new Error("entry.png missing next to main.ts");
}
const srcBytes = statSync(src).size;
if (srcBytes === 0) {
  throw new Error("entry.png is empty");
}
const dst = join(outDir, "entry.png");
copyFileSync(src, dst);
const dstBytes = statSync(dst).size;
if (dstBytes !== srcBytes) {
  throw new Error("copy size mismatch");
}
console.log("entry: wrote " + dstBytes + " bytes to " + dst);
const head = readFileSync(dst).subarray(0, 4);
const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
if (!head.equals(pngMagic)) {
  throw new Error("output is not a PNG");
}
