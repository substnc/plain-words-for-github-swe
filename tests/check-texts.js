// Kollar att varje förklaring och nytta är max två meningar och saknar tankstreck,
// och att nyttan finns och börjar med "När".
require("../extension/explanations.js");
let bad = 0;
for (const e of globalThis.GFD_EXPLANATIONS) {
  const sentences = e.text.split(/(?<=[.!?])\s+(?=[A-ZÅÄÖ@])/).filter(Boolean);
  const problems = [];
  if (sentences.length > 2) problems.push(`${sentences.length} meningar`);
  if (/[—–]/.test(e.text)) problems.push("tankstreck");
  if (e.text.length > 200) problems.push(`${e.text.length} tecken`);
  if (!e.use) problems.push("nytta saknas");
  else {
    const useSentences = e.use.split(/(?<=[.!?])\s+(?=[A-ZÅÄÖ@])/).filter(Boolean);
    if (useSentences.length > 2) problems.push(`nyttan har ${useSentences.length} meningar`);
    if (/[—–]/.test(e.use)) problems.push("tankstreck i nyttan");
    if (e.use.length > 150) problems.push(`nyttan har ${e.use.length} tecken`);
    if (!/^När /.test(e.use)) problems.push("nyttan börjar inte med När");
  }
  if (problems.length) {
    bad++;
    console.log(`${e.key}: ${problems.join(", ")}\n  ${e.text}\n  ${e.use || ""}`);
  }
}
console.log(`${globalThis.GFD_EXPLANATIONS.length} förklaringar, ${bad} med problem`);
process.exit(bad ? 1 : 0);
