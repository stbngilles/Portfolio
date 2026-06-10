/**
 * Chiffrement symétrique pour les secrets stockés en base (coffre-fort).
 *
 * AES-256-GCM, clé dérivée par scrypt depuis CREDENTIALS_KEY.
 * En dev, si CREDENTIALS_KEY manque, on bascule sur un mode "clair" préfixé
 * `plain:` — visible en clair en base, mais on garde l'API unifiée.
 *
 * Le format stocké : `enc:v1:<iv_b64>:<tag_b64>:<cipher_b64>`
 * ou `plain:<contenu>` en dev.
 */
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "node:crypto";

const RAW_KEY = process.env.CREDENTIALS_KEY;
const SALT = process.env.CREDENTIALS_SALT ?? "pixelbrute-vault-v1";

let derivedKey: Buffer | null = null;
function getKey(): Buffer | null {
  if (!RAW_KEY) return null;
  if (!derivedKey) {
    derivedKey = scryptSync(RAW_KEY, SALT, 32);
  }
  return derivedKey;
}

export function encryptSecret(plain: string | null | undefined): string | null {
  if (plain == null || plain === "") return null;
  const key = getKey();
  if (!key) return `plain:${plain}`;

  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ct = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `enc:v1:${iv.toString("base64")}:${tag.toString("base64")}:${ct.toString("base64")}`;
}

export function decryptSecret(stored: string | null | undefined): string | null {
  if (stored == null || stored === "") return null;

  if (stored.startsWith("plain:")) return stored.slice("plain:".length);

  if (!stored.startsWith("enc:v1:")) {
    // Valeur héritée non préfixée → on suppose clair (compat legacy).
    return stored;
  }

  const key = getKey();
  if (!key) {
    // Chiffré mais on a perdu la clé : impossible à restituer.
    return "[déchiffrement impossible — clé manquante]";
  }

  const [, , ivB64, tagB64, ctB64] = stored.split(":");
  try {
    const iv = Buffer.from(ivB64, "base64");
    const tag = Buffer.from(tagB64, "base64");
    const ct = Buffer.from(ctB64, "base64");
    const decipher = createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    const pt = Buffer.concat([decipher.update(ct), decipher.final()]);
    return pt.toString("utf8");
  } catch (err) {
    console.error("[crypto:decrypt:throw]", err);
    return "[déchiffrement échoué]";
  }
}

export function maskSecret(s: string | null): string {
  if (!s) return "—";
  if (s.length <= 4) return "•".repeat(s.length);
  return `${s.slice(0, 2)}${"•".repeat(Math.min(8, s.length - 4))}${s.slice(-2)}`;
}
