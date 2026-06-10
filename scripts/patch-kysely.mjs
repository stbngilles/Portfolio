// Re-exporte les constantes manquantes du migrator au niveau racine de kysely.
// better-auth/kysely-adapter@1.6.14 importe DEFAULT_MIGRATION_TABLE et
// DEFAULT_MIGRATION_LOCK_TABLE depuis "kysely", or kysely 0.29.2 ne les ré-exporte
// plus depuis son index. Sans ce patch, le build Turbopack échoue.
import fs from "node:fs";
import path from "node:path";

const indexPath = path.resolve("node_modules/kysely/dist/index.js");
const typesPath = path.resolve("node_modules/kysely/dist/index.d.ts");
const MARKER = "// pixelbrute-patch:migrator-reexport";

function patch(file, line) {
  if (!fs.existsSync(file)) {
    console.warn("[patch-kysely] introuvable, skip :", file);
    return;
  }
  const src = fs.readFileSync(file, "utf8");
  if (src.includes(MARKER)) {
    console.log("[patch-kysely] déjà patché :", path.basename(file));
    return;
  }
  fs.writeFileSync(file, `${src}\n${MARKER}\n${line}\n`);
  console.log("[patch-kysely] patché :", path.basename(file));
}

patch(
  indexPath,
  `export { DEFAULT_MIGRATION_TABLE, DEFAULT_MIGRATION_LOCK_TABLE } from './migration/migrator.js';`,
);
patch(
  typesPath,
  `export { DEFAULT_MIGRATION_TABLE, DEFAULT_MIGRATION_LOCK_TABLE } from './migration/migrator.js';`,
);
