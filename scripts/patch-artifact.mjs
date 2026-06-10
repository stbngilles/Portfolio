import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'public', 'artifact-index.html');
let html = fs.readFileSync(src, 'utf8');

if (html.includes('action="https://formspree.io/f/xdaawkyd"')) {
  console.log('already patched, skip');
  process.exit(0);
}

html = html.replace(
  '<form class="contact__card reveal" data-d="1" onsubmit="return false">',
  '<form class="contact__card reveal" data-d="1" action="https://formspree.io/f/xdaawkyd" method="POST">'
);

const fieldPatches = [
  ['<input type="text" placeholder="Marie">', '<input type="text" name="prenom" placeholder="Marie" required>'],
  ['<input type="text" placeholder="Lambert">', '<input type="text" name="nom" placeholder="Lambert" required>'],
  ['<input type="email" placeholder="marie@cabinet.be">', '<input type="email" name="email" placeholder="marie@cabinet.be" required>'],
  ['<input type="text" placeholder="Site vitrine + réservation">', '<input type="text" name="projet" placeholder="Site vitrine + réservation">'],
  ['<textarea rows="4" placeholder="Je suis kiné à Embourg et mon site actuel ne me ressemble plus…"></textarea>',
   '<textarea name="message" rows="4" placeholder="Je suis kiné à Embourg et mon site actuel ne me ressemble plus…" required></textarea>'],
];
for (const [from, to] of fieldPatches) {
  if (!html.includes(from)) console.warn('MISS:', from.slice(0, 60));
  html = html.replace(from, to);
}

html = html.replace(
  '<form class="contact__card reveal" data-d="1" action="https://formspree.io/f/xdaawkyd" method="POST">\n        <div class="field__row">',
  '<form class="contact__card reveal" data-d="1" action="https://formspree.io/f/xdaawkyd" method="POST">\n        <input type="hidden" name="_subject" value="Nouvelle demande Pixelbrute">\n        <div class="field__row">'
);

fs.writeFileSync(src, html);
console.log('patched form -> Formspree');
