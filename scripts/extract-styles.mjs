import fs from 'node:fs';
const h = fs.readFileSync('public/artifact-index.html', 'utf8');
const styleBlocks = [...h.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m => m[1]);
const css = styleBlocks.join('\n\n/* ========================= */\n\n');
fs.writeFileSync('public/artifact/styles.css', css);
console.log('styles.css written:', css.length, 'chars,', styleBlocks.length, 'blocks');
