// Kollar att varje förklaring är max två meningar och saknar tankstreck.
require("../extension/explanations.js");
let bad = 0;
for (const e of globalThis.GFD_EXPLANATIONS) {
  const sentences = e.text.split(/(?<=[.!?])\s+(?=[A-ZÅÄÖ@])/).filter(Boolean);
  const problems = [];
  if (sentences.length > 2) problems.push(`${sentences.length} meningar`);
  if (/[—–]/.test(e.text)) problems.push("tankstreck");
  if (e.text.length > 200) problems.push(`${e.text.length} tecken`);
  if (problems.length) {
    bad++;
    console.log(`${e.key}: ${problems.join(", ")}\n  ${e.text}`);
  }
}
console.log(`${globalThis.GFD_EXPLANATIONS.length} förklaringar, ${bad} med problem`);
process.exit(bad ? 1 : 0);
