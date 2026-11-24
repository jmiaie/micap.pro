import fs from "fs";
import path from "path";

const outDir = path.join(process.cwd(), "out");

function copyImages(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      copyImages(full);
    } else if (entry.name === "opengraph-image") {
      fs.copyFileSync(full, `${full}.png`);
    }
  }
}

function rewriteRefs(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      rewriteRefs(full);
      continue;
    }
    if (!/\.(html|txt)$/.test(entry.name)) continue;
    const text = fs.readFileSync(full, "utf8");
    const next = text.replaceAll(/\/opengraph-image(?!\.png)/g, "/opengraph-image.png");
    if (next !== text) fs.writeFileSync(full, next);
  }
}

copyImages(path.join(outDir, "insights"));
rewriteRefs(outDir);
