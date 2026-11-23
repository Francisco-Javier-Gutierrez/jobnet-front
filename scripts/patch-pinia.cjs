const fs = require("fs");
const path = require("path");

const piniaDirs = [
  path.resolve(__dirname, "../node_modules/pinia/dist"),
  path.resolve(__dirname, "../.output/server/node_modules/pinia/dist"),
  path.resolve(__dirname, "../.output/server/chunks/build"),
];

let totalPatched = 0;

for (const dir of piniaDirs) {
  if (!fs.existsSync(dir)) continue;

  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (
      !file.endsWith(".js") &&
      !file.endsWith(".cjs") &&
      !file.endsWith(".mjs")
    ) {
      continue;
    }

    const fullPath = path.join(dir, file);
    let content = fs.readFileSync(fullPath, "utf8");

    if (content.includes("!obj.hasOwnProperty(skipHydrateSymbol)")) {
      content = content.replaceAll(
        "!obj.hasOwnProperty(skipHydrateSymbol)",
        "!Object.prototype.hasOwnProperty.call(obj, skipHydrateSymbol)",
      );
      fs.writeFileSync(fullPath, content, "utf8");
      console.log(`[patch-pinia] Successfully patched: ${fullPath}`);
      totalPatched++;
    }
  }
}

console.log(`[patch-pinia] Total files patched: ${totalPatched}`);
