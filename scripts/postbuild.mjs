import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'public', 'artifact-index.html');
const outDir = path.join(root, 'out');
const deployDir = path.join(root, 'deploy');

if (!fs.existsSync(src)) {
  console.error('missing source:', src);
  process.exit(1);
}
if (!fs.existsSync(outDir)) {
  console.error('out/ not built yet');
  process.exit(1);
}

// 1) overwrite homepage with artifact
fs.copyFileSync(src, path.join(outDir, 'index.html'));
console.log('overwrote out/index.html');

// 1b) overwrite team pages with custom HTML (same design system)
for (const slug of ['esteban', 'amandine']) {
  const teamSrc = path.join(root, 'public', 'artifact', `equipe-${slug}.html`);
  const teamDst = path.join(outDir, 'equipe', slug, 'index.html');
  if (fs.existsSync(teamSrc) && fs.existsSync(path.dirname(teamDst))) {
    fs.copyFileSync(teamSrc, teamDst);
    console.log('overwrote', teamDst);
  }
}

// 2) (re)build deploy/ — only files One.com needs
fs.rmSync(deployDir, { recursive: true, force: true });
fs.mkdirSync(deployDir, { recursive: true });

const SKIP = new Set([
  'artifact-index.html', // dev-only source
  '_not-found',          // Next internal stub, 404.html handles it
  'index.txt',
  '__next.__PAGE__.txt',
  '__next._full.txt',
  '__next._head.txt',
  '__next._index.txt',
  '__next._tree.txt',
]);

function copyRec(srcP, dstP) {
  const st = fs.statSync(srcP);
  if (st.isDirectory()) {
    fs.mkdirSync(dstP, { recursive: true });
    for (const e of fs.readdirSync(srcP)) copyRec(path.join(srcP, e), path.join(dstP, e));
  } else {
    fs.copyFileSync(srcP, dstP);
  }
}

for (const entry of fs.readdirSync(outDir)) {
  if (SKIP.has(entry)) continue;
  copyRec(path.join(outDir, entry), path.join(deployDir, entry));
}

// rough size
let size = 0;
function walk(p) {
  const st = fs.statSync(p);
  if (st.isDirectory()) for (const e of fs.readdirSync(p)) walk(path.join(p, e));
  else size += st.size;
}
walk(deployDir);
console.log(`built deploy/ (${(size / 1024 / 1024).toFixed(1)} MB) — upload its contents to One.com root`);
