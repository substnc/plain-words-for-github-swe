// Visar resultatet av ett svep: unika rader, omatchade först.
const file = process.argv[2];
const R = require(require("path").resolve(file));
const skip = new Set(["file-row", "folder-row", "topics", "sign-in", "sign-up"]);
for (const [p, rows] of Object.entries(R)) {
  console.log("#####", p);
  const seen = new Set();
  const sorted = [...rows].sort((a, b) => (a.key ? 1 : 0) - (b.key ? 1 : 0));
  for (const i of sorted) {
    if (skip.has(i.key)) continue;
    const sig = (i.key || "-") + i.text.replace(/\d/g, "") + i.label.replace(/\d/g, "");
    if (seen.has(sig)) continue;
    seen.add(sig);
    console.log((i.key || "-").padEnd(20), i.tag.padEnd(7), JSON.stringify(i.text).slice(0, 38).padEnd(40), JSON.stringify(i.label).slice(0, 36).padEnd(38), i.href.slice(0, 50));
  }
}
